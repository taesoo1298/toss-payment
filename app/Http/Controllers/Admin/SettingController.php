<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->groupBy('group');

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings->map(function ($groupSettings) {
                return $groupSettings->map(function ($setting) {
                    return [
                        'id' => $setting->id,
                        'key' => $setting->key,
                        'value' => Setting::castValue($setting->value, $setting->type),
                        'type' => $setting->type,
                        'label' => $setting->label,
                        'description' => $setting->description,
                    ];
                });
            }),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|exists:settings,key',
            'settings.*.value' => 'nullable',
        ]);

        foreach ($request->input('settings') as $settingData) {
            $setting = Setting::where('key', $settingData['key'])->first();

            if ($setting) {
                $value = $settingData['value'];

                // Convert boolean to string
                if ($setting->type === 'boolean') {
                    $value = $value ? 'true' : 'false';
                }

                // Convert array to JSON
                if (is_array($value)) {
                    $value = json_encode($value);
                }

                $setting->update(['value' => $value]);
            }
        }

        // Clear all settings cache
        Setting::clearCache();

        return redirect()->back()->with('success', '설정이 저장되었습니다.');
    }
}
