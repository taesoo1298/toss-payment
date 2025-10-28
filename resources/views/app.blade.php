<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preload" href="{{ asset('fonts/inter/inter-latin-400-normal.woff2') }}" as="font" type="font/woff2" crossorigin />
        <link rel="preload" href="{{ asset('fonts/inter/inter-latin-500-normal.woff2') }}" as="font" type="font/woff2" crossorigin />
        <link rel="preload" href="{{ asset('fonts/instrument-sans/instrument-sans-latin-400-normal.woff2') }}" as="font" type="font/woff2" crossorigin />

        <!-- Scripts -->
        <script src="https://js.tosspayments.com/v2/standard"></script>
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
