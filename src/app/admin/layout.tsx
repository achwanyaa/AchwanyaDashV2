import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.id !== process.env.NEXT_PUBLIC_ADMIN_USER_ID) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 bg-[#F8F7F5]">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
