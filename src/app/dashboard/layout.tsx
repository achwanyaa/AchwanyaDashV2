import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/dashboard/sidebar'
import PlanBanner from '@/components/dashboard/plan-banner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen flex">
      <Sidebar profile={profile} />
      <div className="flex-1 bg-[#F8F7F5]">
        <PlanBanner profile={profile} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
