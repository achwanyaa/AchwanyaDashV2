'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cleanPhone } from '@/lib/utils'

interface LeadCaptureProps {
  tourId: string
  tourTitle: string
}

export default function LeadCapture({ tourId, tourTitle }: LeadCaptureProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    
    // Get owner info to open WhatsApp
    const { data: tour } = await supabase
      .from('tours')
      .select('owner_id, profiles!inner(whatsapp_number)')
      .eq('id', tourId)
      .single()

    try {
      // Submit lead
      await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tourId,
          ownerId: tour?.owner_id,
          name,
          phone,
        }),
      })

      // Open WhatsApp to owner
      if (tour?.profiles?.whatsapp_number) {
        const message = `Hi, I viewed the 3D tour for ${tourTitle} and I'm interested. My name is ${name}, number: ${phone}.`
        const waUrl = `https://wa.me/${cleanPhone(tour.profiles.whatsapp_number)}?text=${encodeURIComponent(message)}`
        window.open(waUrl, '_blank')
      }

      setSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(false)
        setName('')
        setPhone('')
      }, 3000)
    } catch (error) {
      console.error('Error submitting lead:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Bottom Strip */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-[#111111] text-white p-4 cursor-pointer md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <div className="text-center text-sm">
          💬 Interested in this property? Leave your details
        </div>
      </div>

      {/* Desktop Floating Button */}
      <div className="hidden md:block fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#D97706] hover:bg-[#B45309] text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-colors"
        >
          💬 Get Info
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center p-4 z-50">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-md p-6">
            {success ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">Sent!</h3>
                <p className="text-[#6B7280] text-sm">The agent will contact you shortly.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-[#1A1A1A]">Get More Information</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-[#6B7280] hover:text-[#1A1A1A]"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input"
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <input
                      type="tel"
                      placeholder="0712 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input"
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-[#6B7280] mt-1">Kenyan phone number</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !name || !phone}
                    className="btn-primary w-full"
                  >
                    {loading ? 'Sending...' : 'Send via WhatsApp'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
