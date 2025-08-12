import { useState } from 'react'
import { LoginForm, RegisterForm } from './index'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

/**
 * Demo component to showcase the authentication forms
 * This can be used for testing and development
 */
export function AuthDemo() {
    const [mode, setMode] = useState<'login' | 'register'>('login')

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">
                            Authentication Demo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex space-x-2 mb-4">
                            <Button
                                variant={
                                    mode === 'login' ? 'default' : 'outline'
                                }
                                onClick={() => setMode('login')}
                                className="flex-1"
                            >
                                Login
                            </Button>
                            <Button
                                variant={
                                    mode === 'register' ? 'default' : 'outline'
                                }
                                onClick={() => setMode('register')}
                                className="flex-1"
                            >
                                Register
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {mode === 'login' ? (
                    <LoginForm
                        onSuccess={() => console.log('Login successful!')}
                    />
                ) : (
                    <RegisterForm
                        onSuccess={() =>
                            console.log('Registration successful!')
                        }
                    />
                )}
            </div>
        </div>
    )
}
