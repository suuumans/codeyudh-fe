import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/problems')({
    component: () => <div className="p-2">Problems page coming soon!</div>,
})
