<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Toss Payments Configuration
    |--------------------------------------------------------------------------
    */

    'client_key' => env('TOSS_CLIENT_KEY'),

    'secret_key' => env('TOSS_SECRET_KEY'),

    'api_url' => env('TOSS_API_URL', 'https://api.tosspayments.com'),

    'api_version' => env('TOSS_API_VERSION', 'v1'),

    'success_url' => env('TOSS_SUCCESS_URL'),

    'fail_url' => env('TOSS_FAIL_URL'),

    'webhook_secret' => env('TOSS_WEBHOOK_SECRET'),

    /*
    |--------------------------------------------------------------------------
    | Request Timeout
    |--------------------------------------------------------------------------
    */

    'timeout' => env('TOSS_TIMEOUT', 30),

    /*
    |--------------------------------------------------------------------------
    | Auto Execution
    |--------------------------------------------------------------------------
    | If true, payment will be automatically approved after user authentication
    */

    'auto_execute' => env('TOSS_AUTO_EXECUTE', true),

    /*
    |--------------------------------------------------------------------------
    | Webhook Settings
    |--------------------------------------------------------------------------
    */

    'webhook' => [
        'enabled' => env('TOSS_WEBHOOK_ENABLED', true),
        'verify_signature' => env('TOSS_WEBHOOK_VERIFY_SIGNATURE', true),
    ],
];
