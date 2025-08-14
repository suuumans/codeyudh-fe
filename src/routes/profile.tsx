import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileForm, SubmissionHistory, StreakCalendar } from '@/components/profile'
import { useUserStore, useUserSubmissions, useUpdateProfile } from '@/hooks/useUserStore'
import { useSubmissionStore } from '@/hooks/useSubmissionStore'
import { 
  ProfileFormSkeleton, 
  SubmissionHistorySkeleton, 
  StreakCalendarSkeleton 
} from '@/components/ui/loading-skeletons'
import { ResponsiveContainer, ResponsiveStack } from '@/components/ui/responsive-container'
import type { User } from '@/types'

function ProfilePage() {
  const { user } = useAuth()
  const { statistics } = useUserStore()
  const { submissions } = useSubmissionStore()
  
  // Use TanStack Query to fetch data
  const { data: userSubmissions, isLoading: submissionsLoading } = useUserSubmissions()
  const updateProfileMutation = useUpdateProfile()
  
  const currentSubmissions = Array.isArray(userSubmissions) ? userSubmissions : userSubmissions?.data || submissions
  
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
    <ResponsiveContainer size="xl" padding="md">
      <ResponsiveStack direction="vertical" gap="lg">
        <div className="mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and view your coding progress
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10">
            <TabsTrigger value="profile" className="text-sm">Profile</TabsTrigger>
            <TabsTrigger value="submissions" className="text-sm">Submissions</TabsTrigger>
            <TabsTrigger value="activity" className="text-sm">Activity & Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {updateProfileMutation.isPending ? (
              <ProfileFormSkeleton />
            ) : (
              <ProfileForm 
                user={user} 
                onSave={handleProfileSave}
                loading={updateProfileMutation.isPending}
              />
            )}
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            {submissionsLoading ? (
              <SubmissionHistorySkeleton />
            ) : (
              <SubmissionHistory 
                submissions={currentSubmissions}
                loading={submissionsLoading}
              />
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            {!statistics ? (
              <StreakCalendarSkeleton />
            ) : (
              <StreakCalendar 
                statistics={statistics}
              />
            )}
          </TabsContent>
        </Tabs>
      </ResponsiveStack>
    </ResponsiveContainer>
  )
}

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})