interface PlanBannerProps {
  profile: any
}

export default function PlanBanner({ profile }: PlanBannerProps) {
  const isExpired = profile?.plan_expires_at && new Date(profile.plan_expires_at) < new Date()

  if (!isExpired) return null

  return (
    <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-sm text-red-700">
      Your plan expired on {new Date(profile.plan_expires_at).toLocaleDateString()}. 
      <a
        href={`https://wa.me/254712345678?text=Hi+Edward,+my+plan+expired,+I+need+to+renew`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold hover:underline ml-1"
      >
        Contact Edward to renew →
      </a>
    </div>
  )
}
