import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    // No base path needed for Vercel (serves from root)
    // Use base: '/nearbuy/' only for GitHub Pages
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
                name: 'E-DuZe',
                short_name: 'E-DuZe',
                description: 'Scan barcodes and find products in nearby stores in South Africa',
                theme_color: '#0066CC',
                display: 'standalone',
                background_color: '#0066CC',
                icons: [
                    {
                        src: '/logo.png',
                        sizes: 'any',
                        type: 'image/png'
                    },
                    {
                        src: '/logo.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/logo.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ]
});
