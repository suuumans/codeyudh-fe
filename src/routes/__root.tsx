import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthProvider } from '@/contexts/AuthContext'
import { RootLayout } from '@/components/layout'
import { ThemeProvider } from '@/components/theme'

export const Route = createRootRoute({
    component: () => (
        <ThemeProvider defaultTheme="system" storageKey="codeyudh-ui-theme">
            <AuthProvider>
                <RootLayout>
                    <Outlet />
                    <TanStackRouterDevtools />
                </RootLayout>
            </AuthProvider>
        </ThemeProvider>
    ),
})
