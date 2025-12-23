"use client"

import { DashboardAlert } from "@/service/dashboard.service"
import { AlertCircle, AlertTriangle, Bell, CheckCircle, ChevronRight, Info } from "lucide-react"
import { Button } from "@/component/ui/Button"
import Link from "next/link"

interface DashboardAlertsProps {
    alerts: DashboardAlert[]
}

export function DashboardAlerts({ alerts }: DashboardAlertsProps) {
    if (alerts.length === 0) return null

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />
            case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />
            case 'info': return <Info className="w-5 h-5 text-blue-500" />
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
            default: return <Bell className="w-5 h-5" />
        }
    }

    const getAlertBg = (type: string) => {
        switch (type) {
            case 'error': return 'bg-red-500/10 border-red-500/20'
            case 'warning': return 'bg-amber-500/10 border-amber-500/20'
            case 'info': return 'bg-blue-500/10 border-blue-500/20'
            case 'success': return 'bg-green-500/10 border-green-500/20'
            default: return 'bg-muted'
        }
    }

    return (
        <div className="space-y-3">
            {alerts.map((alert) => (
                <div
                    key={alert.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border ${getAlertBg(alert.type)}`}
                >
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">{alert.message}</p>
                    </div>
                    {alert.action_url && (
                        <Link href={alert.action_url}>
                            <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                {alert.action_label || "View"}
                                <ChevronRight className="w-3 h-3" />
                            </Button>
                        </Link>
                    )}
                </div>
            ))}
        </div>
    )
}
