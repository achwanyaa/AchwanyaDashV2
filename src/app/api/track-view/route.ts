import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { tourId, ownerId, sessionId } = await request.json()

    if (!tourId || !ownerId || !sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if this session already viewed this tour (deduplication)
    const { data: existingView } = await supabase
      .from('tour_views')
      .select('id')
      .eq('tour_id', tourId)
      .eq('session_id', sessionId)
      .single()

    if (existingView) {
      return NextResponse.json({ success: true, message: 'Session already tracked' })
    }

    // Insert the view
    await supabase.from('tour_views').insert({
      tour_id: tourId,
      owner_id: ownerId,
      session_id: sessionId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking view:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
