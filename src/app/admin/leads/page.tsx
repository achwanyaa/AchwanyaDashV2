import { createClient } from '@/lib/supabase/server'
import { relativeTime, cleanPhone } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminLeadsPage() {
  const supabase = await createClient()
  
  const { data: leads } = await supabase
    .from('leads')
    .select('*, tours!inner(title, address), profiles!inner(full_name, whatsapp_number)')
    .order('created_at', { ascending: false })
    .limit(200)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-2">All Leads</h1>
        <p className="text-[#6B7280]">View and manage all leads across all tours</p>
      </div>

      {leads && leads.length > 0 ? (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F8F7F5] border-b border-[#E5E3DF]">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Lead name</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Phone</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Property</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Agent</th>
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
                    <div className="text-sm text-[#6B7280]">{lead.phone}</div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="text-sm font-medium text-[#1A1A1A]">{lead.tours.title}</div>
                      <div className="text-xs text-[#6B7280]">{lead.tours.address}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="text-sm font-medium text-[#1A1A1A]">{lead.profiles.full_name}</div>
                      <div className="text-xs text-[#6B7280]">{lead.profiles.whatsapp_number}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-[#6B7280]">{relativeTime(lead.created_at)}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <a
                        href={`https://wa.me/${cleanPhone(lead.phone)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost text-xs"
                      >
                        WA to lead →
                      </a>
                      <a
                        href={`https://wa.me/${cleanPhone(lead.profiles.whatsapp_number)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost text-xs"
                      >
                        WA to agent →
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
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">No leads yet</h3>
          <p className="text-[#6B7280]">
            When clients get leads from their tours, they'll appear here.
          </p>
        </div>
      )}
    </div>
  )
}
