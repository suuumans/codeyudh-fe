import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tanstackRouter({ autoCodeSplitting: true }),
        viteReact(),
        tailwindcss(),
        // Sentry plugin for source maps and releases (only in production)
        ...(process.env.NODE_ENV === 'production' && process.env.SENTRY_AUTH_TOKEN ? [
            sentryVitePlugin({
                org: process.env.SENTRY_ORG,
                project: process.env.SENTRY_PROJECT,
                authToken: process.env.SENTRY_AUTH_TOKEN,
                sourcemaps: {
                    assets: './dist/**',
                    ignore: ['node_modules/**'],
                },
                release: {
                    name: process.env.VITE_APP_VERSION || '1.0.0',
                },
            })
        ] : []),
    ],
    resolve: {
        alias: {
            '@': new URL('./src', import.meta.url).pathname,
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Vendor chunks
                    'react-vendor': ['react', 'react-dom'],
                    'router-vendor': ['@tanstack/react-router'],
                    'query-vendor': ['@tanstack/react-query'],
                    'ui-vendor': [
                        '@radix-ui/react-accordion',
                        '@radix-ui/react-avatar',
                        '@radix-ui/react-checkbox',
                        '@radix-ui/react-collapsible',
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-dropdown-menu',
                        '@radix-ui/react-label',
                        '@radix-ui/react-popover',
                        '@radix-ui/react-progress',
                        '@radix-ui/react-select',
                        '@radix-ui/react-separator',
                        '@radix-ui/react-slot',
                        '@radix-ui/react-tabs'
                    ],
                    // Heavy components
                    'monaco-editor': ['@monaco-editor/react', 'monaco-editor'],
                    'charts': ['recharts'],
                    // Feature chunks
                    'auth': ['axios'],
                },
                chunkFileNames: (chunkInfo) => {
                    const facadeModuleId = chunkInfo.facadeModuleId
                    if (facadeModuleId) {
                        if (facadeModuleId.includes('routes/')) {
                            return 'assets/routes/[name]-[hash].js'
                        }
                        if (facadeModuleId.includes('components/')) {
                            return 'assets/components/[name]-[hash].js'
                        }
                    }
                    return 'assets/[name]-[hash].js'
                }
            }
        },
        // Optimize chunk size
        chunkSizeWarningLimit: 1000,
        // Enable source maps for production debugging
        sourcemap: true,
    },
    // Performance optimizations
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            '@tanstack/react-router',
            '@tanstack/react-query',
            'axios',
            'lucide-react',
            'clsx',
            'tailwind-merge'
        ],
        exclude: [
            '@monaco-editor/react',
            'monaco-editor',
            'monaco-vim',
            'monaco-emacs'
        ]
    }
})
