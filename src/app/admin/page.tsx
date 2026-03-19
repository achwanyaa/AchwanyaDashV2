import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminBookingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, property_name, address, preferred_date, property_type, status, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-[#1A1A1A] mb-6">All Bookings</h1>
      {!bookings || bookings.length === 0 ? (
        <div className="bg-white border border-[#E5E3DF] rounded-xl p-12 text-center">
          <p className="text-[#6B7280] text-sm">No bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white border border-[#E5E3DF] rounded-xl p-4">
              <p className="font-medium text-[#1A1A1A]">{b.property_name}</p>
              <p className="text-xs text-[#6B7280]">{b.address}</p>
              <p className="text-xs text-[#6B7280] mt-1">{b.preferred_date} · {b.property_type ?? '—'}</p>
              <span className="inline-flex text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 mt-2">
                {b.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
