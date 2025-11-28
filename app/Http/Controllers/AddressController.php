<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AddressController extends Controller
{
    /**
     * Display a listing of addresses
     */
    public function index(Request $request)
    {
        $addresses = Address::where('user_id', $request->user()->id)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($address) {
                return [
                    'id' => (string) $address->id,
                    'name' => $address->name,
                    'recipient' => $address->recipient,
                    'phone' => $address->phone,
                    'postalCode' => $address->postal_code,
                    'address' => $address->address,
                    'addressDetail' => $address->address_detail,
                    'isDefault' => $address->is_default,
                    'type' => $address->type,
                ];
            });

        // For Inertia page
        if ($request->wantsJson()) {
            return response()->json($addresses);
        }

        return Inertia::render('MyPage/Addresses', [
            'addresses' => $addresses,
        ]);
    }

    /**
     * Store a newly created address
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'recipient' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'postal_code' => 'required|string|max:10',
            'address' => 'required|string',
            'address_detail' => 'nullable|string|max:255',
            'type' => 'required|in:home,office,etc',
            'is_default' => 'sometimes|boolean',
        ]);

        $validated['user_id'] = $request->user()->id;

        // If this is the first address or marked as default, set it as default
        if ($validated['is_default'] ?? false) {
            // Unset other default addresses
            Address::where('user_id', $request->user()->id)
                ->update(['is_default' => false]);
        } else {
            // If this is the first address, make it default
            $hasAddresses = Address::where('user_id', $request->user()->id)->exists();
            $validated['is_default'] = !$hasAddresses;
        }

        $address = Address::create($validated);

        return response()->json([
            'message' => '배송지가 추가되었습니다.',
            'address' => [
                'id' => (string) $address->id,
                'name' => $address->name,
                'recipient' => $address->recipient,
                'phone' => $address->phone,
                'postalCode' => $address->postal_code,
                'address' => $address->address,
                'addressDetail' => $address->address_detail,
                'isDefault' => $address->is_default,
                'type' => $address->type,
            ],
        ], 201);
    }

    /**
     * Display the specified address
     */
    public function show(Request $request, Address $address)
    {
        // Verify ownership
        if ($address->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        return response()->json([
            'id' => (string) $address->id,
            'name' => $address->name,
            'recipient' => $address->recipient,
            'phone' => $address->phone,
            'postalCode' => $address->postal_code,
            'address' => $address->address,
            'addressDetail' => $address->address_detail,
            'isDefault' => $address->is_default,
            'type' => $address->type,
        ]);
    }

    /**
     * Update the specified address
     */
    public function update(Request $request, Address $address)
    {
        // Verify ownership
        if ($address->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'recipient' => 'sometimes|required|string|max:100',
            'phone' => 'sometimes|required|string|max:20',
            'postal_code' => 'sometimes|required|string|max:10',
            'address' => 'sometimes|required|string',
            'address_detail' => 'nullable|string|max:255',
            'type' => 'sometimes|required|in:home,office,etc',
            'is_default' => 'sometimes|boolean',
        ]);

        // If setting as default, unset other defaults
        if (isset($validated['is_default']) && $validated['is_default']) {
            Address::where('user_id', $request->user()->id)
                ->where('id', '!=', $address->id)
                ->update(['is_default' => false]);
        }

        $address->update($validated);

        return response()->json([
            'message' => '배송지가 수정되었습니다.',
            'address' => [
                'id' => (string) $address->id,
                'name' => $address->name,
                'recipient' => $address->recipient,
                'phone' => $address->phone,
                'postalCode' => $address->postal_code,
                'address' => $address->address,
                'addressDetail' => $address->address_detail,
                'isDefault' => $address->is_default,
                'type' => $address->type,
            ],
        ]);
    }

    /**
     * Remove the specified address
     */
    public function destroy(Request $request, Address $address)
    {
        // Verify ownership
        if ($address->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        // Don't allow deleting the default address if there are other addresses
        if ($address->is_default) {
            $otherAddresses = Address::where('user_id', $request->user()->id)
                ->where('id', '!=', $address->id)
                ->exists();

            if ($otherAddresses) {
                return response()->json([
                    'message' => '기본 배송지는 삭제할 수 없습니다. 다른 배송지를 기본으로 설정한 후 삭제해주세요.',
                ], 422);
            }
        }

        $address->delete();

        return response()->json([
            'message' => '배송지가 삭제되었습니다.',
        ]);
    }

    /**
     * Set an address as default
     */
    public function setDefault(Request $request, Address $address)
    {
        // Verify ownership
        if ($address->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $address->setAsDefault();

        return response()->json([
            'message' => '기본 배송지로 설정되었습니다.',
        ]);
    }
}
