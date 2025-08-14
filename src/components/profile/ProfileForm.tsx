import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingButton } from '@/components/ui/loading-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { User } from '@/types'
import { Camera, Save, X } from 'lucide-react'
import { useProfileForm } from '@/hooks/useProfileStore'

interface ProfileFormProps {
    user: User
    onSave: (updatedUser: Partial<User>) => Promise<void>
    loading?: boolean
}

export function ProfileForm({ user, onSave, loading = false }: ProfileFormProps) {
    const {
        isEditing,
        formData,
        isSaving,
        setEditing,
        initializeForm,
        updateFormData,
        setSaving,
        resetForm,
    } = useProfileForm()

    // Initialize form when user changes
    useEffect(() => {
        initializeForm(user)
    }, [user, initializeForm])

    const handleSave = async () => {
        setSaving(true)
        try {
            await onSave(formData)
            setEditing(false)
        } catch (error) {
            console.error('Failed to save profile:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        resetForm(user)
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                {!isEditing && (
                    <Button variant="outline" onClick={() => setEditing(true)}>
                        Edit Profile
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={formData.avatar} alt={formData.username} />
                            <AvatarFallback className="text-lg">
                                {getInitials(formData.username)}
                            </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                            <Button
                                size="sm"
                                variant="secondary"
                                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">{user.username}</h3>
                        <p className="text-sm text-muted-foreground">
                            Member since {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => updateFormData({ username: e.target.value })}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateFormData({ email: e.target.value })}
                            disabled={!isEditing}
                        />
                    </div>

                    {isEditing && (
                        <div className="grid gap-2">
                            <Label htmlFor="avatar">Avatar URL</Label>
                            <Input
                                id="avatar"
                                value={formData.avatar}
                                onChange={(e) => updateFormData({ avatar: e.target.value })}
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                {isEditing && (
                    <div className="flex gap-2 pt-4">
                        <LoadingButton
                            onClick={handleSave}
                            loading={isSaving || loading}
                            loadingText="Saving..."
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </LoadingButton>
                        <Button variant="outline" onClick={handleCancel} disabled={isSaving || loading}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}