'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { planLimit } from '@/lib/utils'

export default function AdminPage() {
  const [clients, setClients] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [formData, setFormData] = useState({
    client_id: '',
    title: '',
    address: '',
    industry: '',
    realsee_url: '',
    is_active: true
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadClients()
    loadBookings()
  }, [])

  const loadClients = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setClients(data || [])
  }

  const loadBookings = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('bookings')
      .select('*, profiles!inner(full_name, whatsapp_number)')
      .eq('status', 'requested')
      .order('created_at', { ascending: false })
    setBookings(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const supabase = createClient()
    
    try {
      // Check client's tour limit
      const client = clients.find(c => c.id === formData.client_id)
      if (!client) {
        setError('Please select a client')
        return
      }

      const { data: existingTours } = await supabase
        .from('tours')
        .select('id')
        .eq('owner_id', formData.client_id)
        .eq('is_active', true)

      const limit = planLimit(client.plan_type)
      if (existingTours && existingTours.length >= limit) {
        setError(`Client is at their ${client.plan_type} limit (${limit} tours). Ask them to upgrade.`)
        return
      }

      // Insert tour
      await supabase.from('tours').insert({
        owner_id: formData.client_id,
        title: formData.title,
        address: formData.address,
        industry: formData.industry,
        realsee_url: formData.realsee_url,
        is_active: formData.is_active
      })

      setSuccess(`✅ Tour is live on ${client.full_name}'s dashboard.`)
      
      // Reset form (keep client selected)
      setFormData({
        ...formData,
        title: '',
        address: '',
        industry: '',
        realsee_url: ''
      })
    } catch (err) {
      setError('Error creating tour. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  const confirmBooking = async (booking: any) => {
    const message = `Hi ${booking.profiles.full_name}, confirming your 3D shoot at ${booking.property_name} on ${booking.preferred_date}. We'll be there!`
    const waUrl = `https://wa.me/${booking.profiles.whatsapp_number?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(waUrl, '_blank')
  }

  const markScheduled = async (bookingId: string) => {
    const supabase = createClient()
    await supabase
      .from('bookings')
      .update({ status: 'scheduled' })
      .eq('id', bookingId)
    loadBookings()
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Admin Dashboard</h1>
        <p className="text-[#6B7280]">Manage tours, clients, and bookings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Tour Form */}
        <div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Assign Tour to Client</h2>
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded mb-4 text-sm">
                {success}
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Client
                </label>
                <select
                  name="client_id"
                  value={formData.client_id}
                  onChange={handleChange}
                  className="input"
                  required
                  disabled={loading}
                >
                  <option value="">Select client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.full_name} ({client.plan_type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Tour title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Industry
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="input"
                  required
                  disabled={loading}
                >
                  <option value="">Select industry</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="automotive">Automotive</option>
                  <option value="hotel">Hotel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Realsee URL
                </label>
                <input
                  type="url"
                  name="realsee_url"
                  value={formData.realsee_url}
                  onChange={handleChange}
                  className="input font-mono text-sm"
                  placeholder="https://..."
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="mr-2"
                  disabled={loading}
                />
                <label htmlFor="is_active" className="text-sm text-[#1A1A1A]">
                  Active (visible to client)
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.client_id || !formData.title || !formData.address || !formData.industry || !formData.realsee_url}
                className="btn-primary w-full"
              >
                {loading ? 'Creating...' : '🚀 Publish Tour to Client'}
              </button>
            </form>
          </div>
        </div>

        {/* Booking Requests */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">
              New Shoot Requests
              {bookings.length > 0 && (
                <span className="ml-2 text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full">
                  {bookings.length} pending
                </span>
              )}
            </h2>
          </div>

          <div className="space-y-4">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div key={booking.id} className="card p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-[#1A1A1A]">{booking.property_name}</h3>
                      <p className="text-sm text-[#6B7280]">
                        {booking.profiles.full_name} · {new Date(booking.preferred_date).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {booking.bedrooms ? `${booking.bedrooms}bed` : ''}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {booking.property_type}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => confirmBooking(booking)}
                      className="btn-ghost text-sm"
                    >
                      Confirm via WA
                    </button>
                    <button
                      onClick={() => markScheduled(booking.id)}
                      className="btn-ghost text-sm"
                    >
                      Mark Scheduled
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="card p-8 text-center">
                <div className="text-3xl mb-2">📅</div>
                <h3 className="font-medium text-[#1A1A1A] mb-1">No pending requests</h3>
                <p className="text-sm text-[#6B7280]">All caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
