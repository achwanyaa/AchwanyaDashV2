import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ViewTracker from '@/components/dashboard/view-tracker'
import LeadCapture from '@/components/dashboard/lead-capture'

export default async function TourPage({ params }: { params: Promise<{ tourId: string }> }) {
  const { tourId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: tour } = await supabase
    .from('tours')
    .select('*')
    .eq('id', tourId)
    .single()

  if (!tour || tour.owner_id !== user.id) {
    notFound()
  }

  // Get lead count for header
  const { count: leadCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('tour_id', tourId)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-13 bg-white border-b border-[#E5E3DF] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <a
            href="/dashboard"
            className="text-[#1A1A1A] hover:text-[#6B7280] transition-colors"
          >
            ← Back
          </a>
          <div>
            <h1 className="text-sm font-semibold text-[#1A1A1A]">
              {tour.title} · {tour.address}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <a
            href={`/dashboard/leads?tour=${tourId}`}
            className="text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
          >
            📋 Leads: {leadCount || 0}
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(tour.realsee_url)}
            className="btn-ghost text-sm"
          >
            Copy Link
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 relative">
        <iframe
          src={tour.realsee_url}
          allow="xr-spatial-tracking; fullscreen; gyroscope; accelerometer; magnetometer"
          allowFullScreen
          className="flex-1 w-full h-full border-0"
          title={tour.title}
        />
        
        <ViewTracker tourId={tourId} ownerId={tour.owner_id} />
      </div>

      {/* Lead Capture Tab */}
      <LeadCapture tourId={tourId} tourTitle={tour.title} />
    </div>
  )
}
