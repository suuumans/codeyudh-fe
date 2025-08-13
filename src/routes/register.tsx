import { createFileRoute } from '@tanstack/react-router'

function RegisterPage() {
    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-2">Register</h1>
            <p className="text-muted-foreground">Register page coming soon!</p>
        </div>
    )
}

export const Route = createFileRoute('/register')({
    component: RegisterPage,
})