import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Lora', {
                    weights: [400, 500, 600, 700],
                    styles: ['normal', 'italic'],
                }),
                bunny('Mulish', {
                    weights: [400, 500, 600, 700, 800],
                }),
            ],
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    server: {
        host: '127.0.0.1',
        port: 5173,
        strictPort: true,
        hmr: {
            host: '127.0.0.1',
        },
        watch: {
            ignored: [
                '**/vendor/**',
                '**/storage/**',
                '**/node_modules/**',
                '**/.git/**',
                '**/bootstrap/cache/**',
                '**/public/build/**',
                '**/public/build.bak/**',
                '**/hope-spring-foundation*',
            ],
        },
    },
});
