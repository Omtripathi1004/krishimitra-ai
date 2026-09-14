import React from "react";
import {
  Droplets,
  Gauge,
  Calendar,
  Clock,
  Layers,
  ShieldCheck,
  Info
} from "lucide-react";

export default function SmartIrrigation({ smartIrrigation, farm, weather, t }) {
  const data = smartIrrigation?.irrigation_data;
  const action = smartIrrigation?.today_farm_action;

  if (!data) {
    return (
      <div className="glass-card p-12 text-center text-xs text-[var(--text-muted)]">
        Computing smart irrigation telemetry...
      </div>
    );
  }

  const status = data.status || "Wait";
  let statusBadge = "neon-badge-cyan";
  if (status === "Irrigate Now" || status === "Recommended") {
    statusBadge = "neon-badge-saffron animate-pulse";
  } else if (status === "Moderate") {
    statusBadge = "neon-badge-gold";
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-[var(--border-cyan)]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-[rgba(89,199,177,0.15)] flex items-center justify-center text-[var(--color-rain-glow)] border border-[var(--border-cyan)]">
              <Droplets className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-[var(--text-primary)]">
              {t.irrigation.title}
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{t.irrigation.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-rain-glow)]">
          <ShieldCheck className="h-4 w-4" />
          <span>FAO-56 Evapotranspiration Model</span>
        </div>
      </div>

      {/* Main Advisory Banner */}
      <div className="glass-card-saffron p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(226,168,59,0.2)] pb-5">
          <div>
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--color-harvest)]">
              {t.irrigation.statusCard}
            </span>
            <div className="flex items-center gap-3 mt-1.5">
              <span className={statusBadge}>
                <span className="neon-dot neon-dot-saffron" />
                {status}
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-mono">
                Urgency: <strong className="text-[var(--text-primary)]">{data.urgency}</strong>
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="telemetry-val text-3xl font-mono text-[var(--color-rain-glow)]">
              {data.crop_water_requirement_mm_day} mm/day
            </div>
            <div className="text-xs text-[var(--text-secondary)]">{t.irrigation.etc}</div>
          </div>
        </div>

        {/* Action Recommendation Box */}
        <div className="mt-5 rounded-xl border border-[var(--border-saffron)] bg-[rgba(226,168,59,0.08)] p-4">
          <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-harvest)]">
            <Clock className="h-4 w-4" />
            {t.irrigation.irrigationAction}
          </div>
          <p className="mt-1.5 text-sm font-semibold text-[var(--text-primary)] leading-relaxed">
            {data.action}
          </p>
        </div>

        <div className="mt-3 text-xs text-[var(--text-secondary)] italic">
          Rationale: {data.summary}
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-heading font-bold uppercase">
            <Gauge className="h-4 w-4 text-[var(--color-sky)]" />
            <span>{t.irrigation.et0}</span>
          </div>
          <div className="telemetry-val text-2xl font-mono text-[var(--text-primary)]">
            {data.reference_evapotranspiration} mm/day
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] leading-tight">
            Reference evapotranspiration based on temperature and radiation.
          </p>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-heading font-bold uppercase">
            <Layers className="h-4 w-4 text-[var(--color-harvest)]" />
            <span>{t.irrigation.soilProfile}</span>
          </div>
          <div className="text-sm font-heading font-bold text-[var(--text-primary)]">
            {data.soil_retention_profile}
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] leading-tight">
            Active soil: {farm?.soil_type || "Alluvial Soil"}.
          </p>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-heading font-bold uppercase">
            <Droplets className="h-4 w-4 text-[var(--color-rain-glow)]" />
            <span>{t.irrigation.efficiency}</span>
          </div>
          <div className="telemetry-val text-2xl font-mono text-[var(--color-rain-glow)]">
            {data.system_efficiency}
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] leading-tight">
            {data.system_advice}
          </p>
        </div>

        <div className="glass-card p-5 space-y-2 border-[var(--border-cyan)]">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-rain-glow)] font-heading font-bold uppercase">
            <Info className="h-4 w-4" />
            <span>Sensor Transparency</span>
          </div>
          <div className="text-xs text-[var(--text-secondary)] leading-tight">
            Decision support computed using meteorological feeds and crop coefficients (Kc). No unverified physical sensors simulated.
          </div>
        </div>
      </div>
    </div>
  );
}
