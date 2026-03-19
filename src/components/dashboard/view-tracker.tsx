'use client'

import { useEffect } from 'react'

interface ViewTrackerProps {
  tourId: string
  ownerId: string
}

export default function ViewTracker({ tourId, ownerId }: ViewTrackerProps) {
  useEffect(() => {
    const sessionId = crypto.randomUUID()
    
    fetch('/api/track-view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tourId,
        ownerId,
        sessionId,
      }),
    }).catch(() => {
      // Silently fail - tracking is non-critical
    })
  }, [tourId, ownerId])

  return null
}
