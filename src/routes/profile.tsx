import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileForm, SubmissionHistory, StreakCalendar } from '@/components/profile'
import { useUserStore, useUserSubmissions, useUpdateProfile } from '@/hooks/useUserStore'
import { useSubmissionStore } from '@/hooks/useSubmissionStore'
import type { User } from '@/types'

function ProfilePage() {
  const { user } = useAuth()
  const { statistics } = useUserStore()
  const { submissions } = useSubmissionStore()
  
  // Use TanStack Query to fetch data
  const { data: userSubmissions, isLoading: submissionsLoading } = useUserSubmissions()
  const updateProfileMutation = useUpdateProfile()
  
  const currentSubmissions = userSubmissions || submissions
  
  const handleProfileSave = async (updatedUser: Partial<User>) => {
    await updateProfileMutation.mutateAsync(updatedUser)
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and view your coding progress
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="activity">Activity & Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileForm 
            user={user} 
            onSave={handleProfileSave}
          />
        </TabsContent>

        <TabsContent value="submissions" className="space-y-6">
          <SubmissionHistory 
            submissions={currentSubmissions}
            loading={submissionsLoading}
          />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          {statistics && (
            <StreakCalendar 
              statistics={statistics}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})