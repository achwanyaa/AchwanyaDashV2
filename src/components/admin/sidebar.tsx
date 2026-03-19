'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminSidebar() {
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const navLinks = [
    { href: '/admin', label: 'Overview', icon: '📊' },
    { href: '/admin/clients', label: 'Clients', icon: '👥' },
    { href: '/admin/leads', label: 'All Leads', icon: '📋' },
    { href: '/admin/bookings', label: 'Bookings', icon: '📅' },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-56 bg-[#111111] flex-col">
        <div className="p-5 mt-6">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-bold">A</span>
          </div>
          <div className="mt-2">
            <div className="text-xs font-semibold text-red-400">ADMIN</div>
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
