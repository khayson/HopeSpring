<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(0.985 0.002 247);
            }

            html.dark {
                background-color: oklch(0.18 0.04 258);
            }

            .brand-boot-loader {
                position: fixed;
                inset: 0;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                background: oklch(0.985 0.002 247);
                transition: opacity 0.28s ease, visibility 0.28s ease;
            }

            html.dark .brand-boot-loader {
                background: oklch(0.18 0.04 258);
            }

            .brand-boot-loader.is-hidden {
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
            }

            .brand-loader-ripple {
                border: 2px solid color-mix(in oklab, #5fa93d 55%, transparent);
                animation: brand-ripple 1.6s ease-out infinite;
            }

            .brand-loader-ripple-delay {
                animation-delay: 0.55s;
            }

            .brand-loader-mark {
                animation: brand-mark-pulse 1.6s ease-in-out infinite;
            }

            @keyframes brand-ripple {
                0% {
                    transform: scale(0.72);
                    opacity: 0.7;
                }
                100% {
                    transform: scale(1.35);
                    opacity: 0;
                }
            }

            @keyframes brand-mark-pulse {
                0%,
                100% {
                    transform: translateY(0) scale(1);
                }
                50% {
                    transform: translateY(1px) scale(1.04);
                }
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="manifest" href="/site.webmanifest">
        <meta name="theme-color" content="#0B1F3A">
        <meta name="msapplication-TileColor" content="#0B1F3A">
        <link rel="preload" as="image" href="/images/brand/mark.png">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <div
            id="app-boot-loader"
            class="brand-boot-loader"
            role="status"
            aria-live="polite"
            aria-label="Loading HopeSpring Foundation"
        >
            <div class="brand-loader relative flex size-16 items-center justify-center">
                <span class="brand-loader-ripple absolute inset-0 rounded-full"></span>
                <span class="brand-loader-ripple brand-loader-ripple-delay absolute inset-0 rounded-full"></span>
                <img
                    src="/images/brand/mark.png"
                    alt=""
                    width="48"
                    height="48"
                    class="brand-loader-mark relative z-10 h-12 w-12 object-contain"
                >
            </div>
        </div>
        <x-inertia::app />
        <script>
            (function () {
                var hide = function () {
                    var el = document.getElementById('app-boot-loader');
                    if (!el) {
                        return;
                    }
                    el.classList.add('is-hidden');
                    window.setTimeout(function () {
                        el.remove();
                    }, 320);
                };

                if (document.readyState === 'complete') {
                    hide();
                } else {
                    window.addEventListener('load', hide, { once: true });
                }
            })();
        </script>
    </body>
</html>
