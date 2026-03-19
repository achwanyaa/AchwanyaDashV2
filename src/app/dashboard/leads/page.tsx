import { createClient } from '@/lib/supabase/server'
import { relativeTime, maskPhone, cleanPhone } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function LeadsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: leads } = await supabase
    .from('leads')
    .select('*, tours!inner(title, address)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Leads</h1>
          {leads && leads.length > 0 && (
            <span className="bg-[#D97706] text-white text-xs font-medium px-2 py-1 rounded-full">
              {leads.length}
            </span>
          )}
        </div>
      </div>

      {leads && leads.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F8F7F5] border-b border-[#E5E3DF]">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Name</th>
                    <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Phone</th>
                    <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Property</th>
                    <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-[#6B7280]"></th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead: any) => (
                    <tr key={lead.id} className="border-b border-[#E5E3DF] last:border-b-0">
                      <td className="p-4">
                        <div className="text-sm font-medium text-[#1A1A1A]">{lead.full_name}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-[#6B7280]">{maskPhone(lead.phone)}</div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="text-sm font-medium text-[#1A1A1A]">{lead.tours.title}</div>
                          <div className="text-xs text-[#6B7280]">{lead.tours.address}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-[#6B7280]">{relativeTime(lead.created_at)}</div>
                      </td>
                      <td className="p-4">
                        <a
                          href={`https://wa.me/${cleanPhone(lead.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost text-sm"
                        >
                          WhatsApp
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {leads.map((lead: any) => (
              <div key={lead.id} className="card p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-[#1A1A1A]">{lead.full_name}</h3>
                    <p className="text-sm text-[#6B7280]">{maskPhone(lead.phone)}</p>
                  </div>
                  <span className="text-xs text-[#6B7280]">{relativeTime(lead.created_at)}</span>
                </div>
                
                <div className="mb-3">
                  <div className="text-sm font-medium text-[#1A1A1A]">{lead.tours.title}</div>
                  <div className="text-xs text-[#6B7280]">{lead.tours.address}</div>
                </div>
                
                <a
                  href={`https://wa.me/${cleanPhone(lead.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-sm w-full text-center"
                >
                  WhatsApp
                </a>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">No leads yet.</h3>
          <p className="text-[#6B7280] mb-6">
            Share your tour link to capture interest.
          </p>
        </div>
      )}
    </div>
  )
}
