'use client'

import { useState } from 'react'
import Link from 'next/link'
import { industryLabel, industryColor } from '@/lib/utils'

interface TourCardProps {
  tour: any
}

export default function TourCard({ tour }: TourCardProps) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(tour.realsee_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const views = tour.tour_views?.[0]?.count || 0
  const leads = tour.leads?.[0]?.count || 0

  return (
    <>
      <div className="card p-6">
        <div className="flex justify-between items-start mb-4">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${industryColor(tour.industry)}`}>
            {industryLabel(tour.industry)}
          </span>
          <span className="text-xs font-medium text-[#10B981] flex items-center">
            <span className="w-2 h-2 bg-[#10B981] rounded-full mr-1"></span>
            LIVE
          </span>
        </div>

        <div className="mb-4">
          <h3 className="text-base font-semibold text-[#1A1A1A] mb-1">{tour.title}</h3>
          <p className="text-sm text-[#6B7280]">{tour.address}</p>
        </div>

        <div className="border-t border-[#E5E3DF] pt-4 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-[#6B7280]">👁 {views} views</span>
            <span className="text-[#6B7280]">📋 {leads} leads</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/dashboard/tours/${tour.id}`}
            className="btn-ghost flex-1 text-center"
          >
            View Tour
          </Link>
          
          <button
            onClick={handleCopyLink}
            className={`btn-ghost flex-1 text-center ${
              copied ? 'bg-[#10B981] text-white border-[#10B981]' : ''
            }`}
          >
            {copied ? 'Copied! ✓' : 'Copy Link'}
          </button>
          
          <button
            onClick={() => setShowQR(true)}
            className="btn-ghost px-3"
          >
            QR Code
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">QR Code</h3>
            <div className="flex justify-center mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(tour.realsee_url)}`}
                alt="QR Code"
                className="border border-[#E5E3DF] rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(tour.realsee_url)}`}
                download="qrcode.png"
                className="btn-primary flex-1 text-center"
              >
                Download
              </a>
              <button
                onClick={() => setShowQR(false)}
                className="btn-ghost flex-1 text-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
