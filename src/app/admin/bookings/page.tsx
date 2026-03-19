import { createClient } from '@/lib/supabase/server'
import { relativeTime, cleanPhone } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminBookingsPage() {
  const supabase = await createClient()
  
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, profiles!inner(full_name, whatsapp_number)')
    .order('created_at', { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'text-yellow-700 bg-yellow-100'
      case 'scheduled': return 'text-blue-700 bg-blue-100'
      case 'completed': return 'text-green-700 bg-green-100'
      case 'cancelled': return 'text-red-700 bg-red-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const confirmBooking = (booking: any) => {
    const message = `Hi ${booking.profiles.full_name}, confirming your 3D shoot at ${booking.property_name} on ${new Date(booking.preferred_date).toLocaleDateString()}. We'll be there!`
    const waUrl = `https://wa.me/${cleanPhone(booking.profiles.whatsapp_number)}?text=${encodeURIComponent(message)}`
    window.open(waUrl, '_blank')
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Bookings</h1>
        <p className="text-[#6B7280]">Manage all shoot booking requests</p>
      </div>

      {bookings && bookings.length > 0 ? (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F8F7F5] border-b border-[#E5E3DF]">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Property</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Client</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Date</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Type</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Status</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking: any) => (
                <tr key={booking.id} className="border-b border-[#E5E3DF] last:border-b-0">
                  <td className="p-4">
                    <div>
                      <div className="text-sm font-medium text-[#1A1A1A]">{booking.property_name}</div>
                      <div className="text-xs text-[#6B7280]">{booking.address}</div>
                      {booking.bedrooms && (
                        <div className="text-xs text-[#6B7280]">{booking.bedrooms} bedrooms</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="text-sm font-medium text-[#1A1A1A]">{booking.profiles.full_name}</div>
                      <div className="text-xs text-[#6B7280]">{booking.profiles.whatsapp_number}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-[#6B7280]">
                      {new Date(booking.preferred_date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-[#6B7280]">
                      {relativeTime(booking.created_at)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-[#6B7280] capitalize">{booking.property_type}</div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {booking.status === 'requested' && (
                        <>
                          <button
                            onClick={() => confirmBooking(booking)}
                            className="btn-ghost text-xs"
                          >
                            Confirm via WA
                          </button>
                          <MarkScheduledButton bookingId={booking.id} />
                        </>
                      )}
                      <a
                        href={`https://wa.me/${cleanPhone(booking.profiles.whatsapp_number)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost text-xs"
                      >
                        WA →
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">No bookings yet</h3>
          <p className="text-[#6B7280]">
            When clients request shoots, they'll appear here.
          </p>
        </div>
      )}
    </div>
  )
}

function MarkScheduledButton({ bookingId }: { bookingId: string }) {
  const markScheduled = async () => {
    const supabase = createClient()
    await supabase
      .from('bookings')
      .update({ status: 'scheduled' })
      .eq('id', bookingId)
    window.location.reload()
  }

  return (
    <button
      onClick={markScheduled}
      className="btn-ghost text-xs"
    >
      Mark Scheduled
    </button>
  )
}
