import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const loginSearchSchema = z.object({
    returnTo: z.string().optional(),
})

function LoginPage() {
    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-2">Login</h1>
            <p className="text-muted-foreground">Login page coming soon!</p>
        </div>
    )
}

export const Route = createFileRoute('/login')({
    component: LoginPage,
    validateSearch: loginSearchSchema,
})