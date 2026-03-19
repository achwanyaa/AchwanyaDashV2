export function relativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function maskPhone(phone: string): string {
  if (!phone) return ''
  const clean = phone.replace(/\D/g, '')
  return clean.length >= 4 ? clean.slice(0, 4) + '••••' : phone
}

export function cleanPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '')
  if (clean.startsWith('0') && clean.length === 10) {
    return '254' + clean.slice(1)
  }
  return clean
}

export function planLimit(planType: string): number {
  switch (planType) {
    case 'basic': return 3
    case 'pro': return 6
    case 'premium': return 12
    default: return 3
  }
}

export function industryLabel(industry: string): string {
  switch (industry) {
    case 'real_estate': return 'Real Estate'
    case 'restaurant': return 'Restaurant'
    case 'automotive': return 'Automotive'
    case 'hotel': return 'Hotel'
    default: return industry
  }
}

export function industryColor(industry: string): string {
  switch (industry) {
    case 'real_estate': return 'bg-[#D97706] text-white'
    case 'restaurant': return 'bg-[#EA580C] text-white'
    case 'automotive': return 'bg-[#2563EB] text-white'
    case 'hotel': return 'bg-[#10B981] text-white'
    default: return 'bg-gray-500 text-white'
  }
}
