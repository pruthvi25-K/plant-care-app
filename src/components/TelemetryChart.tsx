import { useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import { useDeviceHistory } from '../hooks/useDeviceHistory'
import { TrendingUp, Clock, Loader2 } from 'lucide-react'

interface TelemetryChartProps {
  deviceId: string
}

export function TelemetryChart({ deviceId }: TelemetryChartProps) {
  const [timeRange, setTimeRange] = useState<'1h' | '24h'>('1h')
  const { data, loading } = useDeviceHistory(deviceId, timeRange)

  return (
    <section aria-labelledby="history-heading" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 id="history-heading" className="text-sm font-bold tracking-tight text-[var(--text-primary)]">
              Telemetry Trends &amp; History
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Soil moisture and ambient temperature trends
            </p>
          </div>
        </div>

        {/* Time Range Toggle */}
        <div className="flex items-center gap-1 rounded-xl bg-[var(--bg-surface-elevated)] p-1 text-xs font-semibold">
          <Clock className="ml-1.5 mr-1 h-3.5 w-3.5 text-[var(--text-muted)]" />
          <button
            type="button"
            onClick={() => setTimeRange('1h')}
            aria-pressed={timeRange === '1h'}
            className={`rounded-lg px-2.5 py-1 transition-colors ${
              timeRange === '1h'
                ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Last 1 Hour
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('24h')}
            aria-pressed={timeRange === '24h'}
            className={`rounded-lg px-2.5 py-1 transition-colors ${
              timeRange === '24h'
                ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Last 24 Hours
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--shadow-card)] sm:p-5">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg-surface)]/70 backdrop-blur-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand-primary)]">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading telemetry trend...</span>
            </div>
          </div>
        )}

        <div className="h-64 w-full sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: 'currentColor' }}
                className="text-[var(--text-muted)]"
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: 'currentColor' }}
                className="text-[var(--text-muted)]"
                tickLine={false}
                unit="%"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[10, 45]}
                tick={{ fontSize: 10, fill: 'currentColor' }}
                className="text-[var(--text-muted)]"
                tickLine={false}
                unit="°C"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  borderRadius: '1rem',
                  fontSize: '12px',
                  boxShadow: 'var(--shadow-card)',
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontWeight: '600' }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="moisture"
                name="Soil Moisture (%)"
                stroke="#0284c7"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="temperature"
                name="Temperature (°C)"
                stroke="#d97706"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
