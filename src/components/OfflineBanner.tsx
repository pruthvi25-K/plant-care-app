import { WifiOff, AlertTriangle, Radio } from 'lucide-react'
import type { OfflineStatus } from '../hooks/useDeviceOfflineStatus'

interface OfflineBannerProps {
  status: OfflineStatus
  deviceId: string
}

export function OfflineBanner({ status, deviceId }: OfflineBannerProps) {
  if (status.statusLabel === 'ONLINE') {
    return (
      <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-600 dark:text-emerald-400">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-semibold">Node {deviceId} Online</span>
        </div>
        <span className="text-[11px] opacity-80">
          Syncing live (telemetry received {status.secondsSince ?? 0}s ago)
        </span>
      </div>
    )
  }

  if (status.statusLabel === 'AWAITING_TELEMETRY') {
    return (
      <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs text-amber-600 dark:text-amber-400">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 animate-pulse text-amber-500" />
          <span className="font-semibold">Awaiting Telemetry Packet</span>
        </div>
        <span className="text-[11px]">
          Last packet: {status.secondsSince}s ago (stale if &gt; 30s)
        </span>
      </div>
    )
  }

  return (
    <div
      role="alert"
      className="rounded-2xl border-2 border-red-500/30 bg-red-500/10 p-4 shadow-md backdrop-blur-sm sm:p-5"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white shadow-sm">
          <WifiOff className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-red-600 dark:text-red-400">
              Hardware Node Offline (&gt; 30s)
            </h3>
            <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-red-600 dark:text-red-300">
              {status.secondsSince !== null ? `Last Seen ${status.secondsSince}s Ago` : 'No Signal'}
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            ESP32 telemetry for <span className="font-semibold text-[var(--text-primary)]">{deviceId}</span> has timed out. 
            Actuator controls ("Water Now" & "Grow light") are locked to prevent flood damage and race conditions.
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-muted)]">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span>Verify ESP32 power supply and 2.4GHz Wi-Fi connection.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
