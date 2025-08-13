import { createFileRoute } from '@tanstack/react-router'

function SettingsPage() {
    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Settings page coming soon!</p>
        </div>
    )
}

export const Route = createFileRoute('/settings')({
    component: SettingsPage,
})