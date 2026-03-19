import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { tourId, ownerId, name, phone } = await request.json()

    if (!tourId || !ownerId || !name || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if this phone already submitted for this tour (deduplication)
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('tour_id', tourId)
      .eq('phone', phone)
      .single()

    if (existingLead) {
      return NextResponse.json({ success: true, message: 'Lead already exists' })
    }

    // Insert the lead
    await supabase.from('leads').insert({
      tour_id: tourId,
      owner_id: ownerId,
      full_name: name,
      phone,
    })

    // Send webhook if configured
    if (process.env.LEAD_WEBHOOK_URL) {
      try {
        await fetch(process.env.LEAD_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tourId,
            ownerId,
            name,
            phone,
            timestamp: new Date().toISOString(),
          }),
        })
      } catch (webhookError) {
        console.error('Webhook error:', webhookError)
        // Continue even if webhook fails
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error submitting lead:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
