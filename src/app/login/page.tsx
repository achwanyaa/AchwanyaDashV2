'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/auth/callback'
      }
    })

    if (error) {
      alert('Error sending sign-in link: ' + error.message)
    } else {
      setSuccess(true)
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8F7F5] flex items-center justify-center p-4">
        <div className="bg-white border border-[#E5E3DF] rounded-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-10 h-10 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">Check your email ✓</h2>
            <p className="text-[#6B7280] text-sm">Sent to {email}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F7F5] flex items-center justify-center p-4">
      <div className="bg-white border border-[#E5E3DF] rounded-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-[#111111] rounded-lg flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h1 className="font-[var(--font-playfair)] text-2xl text-[#1A1A1A] mb-2">Welcome back.</h1>
          <p className="text-[#6B7280] text-sm">Enter your email to receive a sign-in link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="input"
              required
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !email}
            className="btn-primary w-full"
          >
            {loading ? 'Sending...' : 'Send Sign-in Link'}
          </button>
        </form>
      </div>
    </div>
  )
}
