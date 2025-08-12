import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Alert, AlertDescription } from '../ui/alert'
import { Progress } from '../ui/progress'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import type { RegisterData } from '../../types'
import { useAuth } from '../../hooks/useAuth'

// Password strength calculation
function calculatePasswordStrength(password: string): {
    score: number
    feedback: string[]
    color: string
} {
    let score = 0
    const feedback: string[] = []

    if (password.length >= 8) {
        score += 25
    } else {
        feedback.push('At least 8 characters')
    }

    if (/[a-z]/.test(password)) {
        score += 25
    } else {
        feedback.push('Include lowercase letters')
    }

    if (/[A-Z]/.test(password)) {
        score += 25
    } else {
        feedback.push('Include uppercase letters')
    }

    if (/[0-9]/.test(password)) {
        score += 25
    } else {
        feedback.push('Include numbers')
    }

    if (/[^a-zA-Z0-9]/.test(password)) {
        score += 10 // Bonus for special characters
    }

    let color = 'bg-red-500'
    if (score >= 75) color = 'bg-green-500'
    else if (score >= 50) color = 'bg-yellow-500'
    else if (score >= 25) color = 'bg-orange-500'

    return { score: Math.min(score, 100), feedback, color }
}

// Validation schema
const registerSchema = z
    .object({
        username: z
            .string()
            .min(1, 'Username is required')
            .min(3, 'Username must be at least 3 characters')
            .max(20, 'Username must be less than 20 characters')
            .regex(
                /^[a-zA-Z0-9_]+$/,
                'Username can only contain letters, numbers, and underscores',
            ),
        email: z
            .string()
            .min(1, 'Email is required')
            .email('Please enter a valid email address'),
        password: z
            .string()
            .min(1, 'Password is required')
            .min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

type RegisterFormData = z.infer<typeof registerSchema>

interface RegisterFormProps {
    onSuccess?: () => void
    className?: string
}

export function RegisterForm({ onSuccess, className }: RegisterFormProps) {
    const { register, isLoading, error, clearError } = useAuth()

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const password = form.watch('password')
    const passwordStrength = useMemo(() => {
        if (!password) return { score: 0, feedback: [], color: 'bg-gray-300' }
        return calculatePasswordStrength(password)
    }, [password])

    const onSubmit = async (data: RegisterFormData) => {
        try {
            clearError()
            await register(data as RegisterData)
            onSuccess?.()
        } catch (error) {
            // Error is handled by the auth context
            console.error('Registration failed:', error)
        }
    }

    return (
        <Card className={className}>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">
                    Create Account
                </CardTitle>
                <CardDescription>
                    Enter your information to create a new account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your username"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter your password"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />

                                    {password && (
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-muted-foreground">
                                                    Strength:
                                                </span>
                                                <div className="flex-1">
                                                    <Progress
                                                        value={
                                                            passwordStrength.score
                                                        }
                                                        className="h-2"
                                                    />
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {passwordStrength.score < 25
                                                        ? 'Weak'
                                                        : passwordStrength.score <
                                                            50
                                                          ? 'Fair'
                                                          : passwordStrength.score <
                                                              75
                                                            ? 'Good'
                                                            : 'Strong'}
                                                </span>
                                            </div>

                                            {passwordStrength.feedback.length >
                                                0 && (
                                                <div className="text-sm text-muted-foreground">
                                                    <p>Suggestions:</p>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        {passwordStrength.feedback.map(
                                                            (item, index) => (
                                                                <li key={index}>
                                                                    {item}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Confirm your password"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? 'Creating Account...'
                                : 'Create Account'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
