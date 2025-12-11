"use client"

import { AlertCircle, CheckCircle, Clock } from "lucide-react"

interface StatusBannerProps {
  status: "pending" | "verified" | "rejected"
  message?: string
}

export function StatusBanner({ status, message }: StatusBannerProps) {
  const config = {
    pending: {
      icon: Clock,
      bg: "bg-yellow-500/10 border-yellow-500/20",
      text: "text-yellow-500",
      title: "Verification Pending",
    },
    verified: {
      icon: CheckCircle,
      bg: "bg-green-500/10 border-green-500/20",
      text: "text-green-500",
      title: "Verified",
    },
    rejected: {
      icon: AlertCircle,
      bg: "bg-red-500/10 border-red-500/20",
      text: "text-red-500",
      title: "Verification Failed",
    },
  }

  const { icon: Icon, bg, text, title } = config[status]

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${bg}`}>
      <Icon className={`w-5 h-5 ${text} shrink-0 mt-0.5`} />
      <div>
        <p className={`font-medium ${text}`}>{title}</p>
        {message && <p className="text-sm text-muted-foreground mt-1">{message}</p>}
      </div>
    </div>
  )
}
