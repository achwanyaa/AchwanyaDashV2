import { createClient } from '@/lib/supabase/server'
import { planLimit, relativeTime, cleanPhone } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminClientsPage() {
  const supabase = await createClient()
  
  const { data: clients } = await supabase
    .from('profiles')
    .select('*, tours(count)')
    .order('created_at', { ascending: false })

  const getClientStatus = (client: any) => {
    const now = new Date()
    const expiresAt = client.plan_expires_at ? new Date(client.plan_expires_at) : null
    
    if (!expiresAt) return { status: 'Active', color: 'text-green-700 bg-green-100' }
    if (expiresAt < now) return { status: 'Expired', color: 'text-red-700 bg-red-100' }
    if (expiresAt < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)) {
      return { status: 'Expires Soon', color: 'text-yellow-700 bg-yellow-100' }
    }
    return { status: 'Active', color: 'text-green-700 bg-green-100' }
  }

  const getPlanBadge = (planType: string) => {
    switch (planType) {
      case 'basic': return 'bg-gray-100 text-gray-700'
      case 'pro': return 'bg-yellow-100 text-yellow-700'
      case 'premium': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Clients</h1>
        <p className="text-[#6B7280]">Manage all client accounts and tours</p>
      </div>

      {clients && clients.length > 0 ? (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F8F7F5] border-b border-[#E5E3DF]">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Client</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Plan</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Tours</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Expires</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Status</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client: any) => {
                const limit = planLimit(client.plan_type)
                const activeTours = client.tours?.[0]?.count || 0
                const status = getClientStatus(client)
                
                return (
                  <tr key={client.id} className="border-b border-[#E5E3DF] last:border-b-0">
                    <td className="p-4">
                      <div>
                        <div className="text-sm font-medium text-[#1A1A1A]">{client.full_name}</div>
                        <div className="text-xs text-[#6B7280]">{client.whatsapp_number}</div>
                        <div className="text-xs text-[#6B7280]">{relativeTime(client.created_at)}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPlanBadge(client.plan_type)}`}>
                        {client.plan_type?.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className={`text-sm font-medium ${activeTours >= limit ? 'text-red-600' : 'text-[#1A1A1A]'}`}>
                        {activeTours} / {limit}
                      </div>
                      {activeTours >= limit && (
                        <div className="text-xs text-red-600">At limit</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className={`text-sm ${status.color.includes('red') || status.color.includes('yellow') ? 'font-medium' : ''}`}>
                        {client.plan_expires_at 
                          ? new Date(client.plan_expires_at).toLocaleDateString()
                          : 'No expiry'
                        }
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.color}`}>
                        {status.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <a
                          href={`https://wa.me/${cleanPhone(client.whatsapp_number)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost text-xs"
                        >
                          WA →
                        </a>
                        <Link
                          href={`/admin?client=${client.id}`}
                          className="btn-ghost text-xs"
                        >
                          Add Tour →
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">No clients yet</h3>
          <p className="text-[#6B7280] mb-6">
            When clients sign up, they'll appear here.
          </p>
        </div>
      )}
    </div>
  )
}
