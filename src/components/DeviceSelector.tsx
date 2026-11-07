import { Cpu } from 'lucide-react'

interface DeviceSelectorProps {
  currentDeviceId: string
  onSelectDevice: (deviceId: string) => void
  devices?: { id: string; name: string }[]
}

const DEFAULT_DEVICES = [
  { id: 'plant1', name: 'Node 1 — Living Room (Monstera)' },
  { id: 'plant2', name: 'Node 2 — Balcony (Basil & Mint)' },
  { id: 'plant3', name: 'Node 3 — Desk (Succulent)' },
]

export function DeviceSelector({
  currentDeviceId,
  onSelectDevice,
  devices = DEFAULT_DEVICES,
}: DeviceSelectorProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 shadow-sm sm:px-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
          <Cpu className="h-4 w-4" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Active Hardware Node
          </span>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {devices.find((d) => d.id === currentDeviceId)?.name ?? currentDeviceId}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="device-select" className="sr-only">
          Select Hardware Device
        </label>
        <select
          id="device-select"
          value={currentDeviceId}
          onChange={(e) => onSelectDevice(e.target.value)}
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--border-focus)]"
        >
          {devices.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
