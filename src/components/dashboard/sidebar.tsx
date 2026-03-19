'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { planLimit, relativeTime } from '@/lib/utils'

interface SidebarProps {
  profile: any
}

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const isExpired = profile?.plan_expires_at && new Date(profile.plan_expires_at) < new Date()
  const expiresSoon = profile?.plan_expires_at && 
    new Date(profile.plan_expires_at) < new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)

  const navLinks = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/dashboard', label: 'My Tours', icon: '🏠' },
    { href: '/dashboard/leads', label: 'Leads', icon: '📋' },
    { href: '/dashboard/book', label: 'Book a Shoot', icon: '📅' },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-56 bg-[#111111] flex-col">
        <div className="p-5 mt-6">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-bold">A</span>
          </div>
        </div>

        <nav className="flex-1 mt-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-5 py-3 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'text-[#E8E3D9] bg-white/10'
                  : 'text-[#E8E3D9] hover:bg-white/5'
              }`}
            >
              <span className="mr-3">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-5 border-t border-white/10">
          <div className={`text-xs font-semibold mb-1 ${
            isExpired ? 'text-red-400' : expiresSoon ? 'text-yellow-400' : 'text-[#E8E3D9]'
          }`}>
            {profile?.plan_type?.toUpperCase()} PLAN
          </div>
          <div className="text-xs text-[#E8E3D9] mb-3">
            {isExpired 
              ? 'Expired'
              : profile?.plan_expires_at
              ? `Expires ${new Date(profile.plan_expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              : 'No expiry'
            }
          </div>
          
          {(isExpired || expiresSoon) && (
            <a
              href={`https://wa.me/254712345678?text=Hi+Edward,+I+need+to+renew+my+${profile?.plan_type}+plan`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#D97706] hover:text-[#B45309] block mb-3"
            >
              Renew on WhatsApp →
            </a>
          )}

          <button
            onClick={handleSignOut}
            className="w-full text-xs text-[#E8E3D9] hover:text-white py-2 px-3 rounded hover:bg-white/10 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-white/10 z-50">
        <div className="flex justify-around py-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center py-2 px-3 text-xs transition-colors ${
                pathname === link.href
                  ? 'text-[#D97706]'
                  : 'text-[#E8E3D9] hover:text-white'
              }`}
            >
              <span className="text-lg mb-1">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
