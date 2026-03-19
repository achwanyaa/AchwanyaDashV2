import { createClient } from '@/lib/supabase/server'
import { planLimit, industryLabel, industryColor } from '@/lib/utils'
import TourCard from '@/components/dashboard/tour-card'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [toursResult, viewsResult, leadsResult] = await Promise.all([
    supabase
      .from('tours')
      .select('*, tour_views(count), leads(count)')
      .eq('owner_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('tour_views')
      .select('id', { count: 'exact', head: true })
      .eq('owner_id', user.id),
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('owner_id', user.id),
  ])

  const tours = toursResult.data || []
  const totalViews = viewsResult.count || 0
  const totalLeads = leadsResult.count || 0

  // Get user profile for plan info
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan_type, plan_expires_at, full_name')
    .eq('id', user.id)
    .single()

  const planSlots = planLimit(profile?.plan_type || 'basic')
  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  // Get greeting based on time
  const hour = new Date().getHours()
  let greeting = 'Good morning'
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon'
  if (hour >= 17) greeting = 'Good evening'

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-1">
          {greeting}, {firstName}. 👋
        </h1>
        <p className="text-[#6B7280]">Your tours are live.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-6">
          <div className="text-sm text-[#6B7280] mb-1">Active Tours</div>
          <div className="text-2xl font-semibold text-[#D97706] mb-1">{tours.length}</div>
          <div className="text-xs text-[#6B7280]">of {planSlots} slots</div>
        </div>
        
        <div className="card p-6">
          <div className="text-sm text-[#6B7280] mb-1">Total Views</div>
          <div className="text-2xl font-semibold text-[#D97706] mb-1">{totalViews}</div>
          <div className="text-xs text-[#6B7280]">all time</div>
        </div>
        
        <div className="card p-6">
          <div className="text-sm text-[#6B7280] mb-1">Total Leads</div>
          <div className="text-2xl font-semibold text-[#D97706] mb-1">{totalLeads}</div>
          <div className="text-xs text-[#6B7280]">all time</div>
        </div>
      </div>

      {/* Tours Grid */}
      {tours.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tours.map((tour: any) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-4">🏠</div>
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
            No tours assigned yet.
          </h3>
          <p className="text-[#6B7280] mb-6">
            Edward will add your first tour after your shoot.
          </p>
          <a
            href="https://wa.me/254712345678?text=Hi+Edward,+I+need+help+with+my+tours"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Contact Edward →
          </a>
        </div>
      )}
    </div>
  )
}
