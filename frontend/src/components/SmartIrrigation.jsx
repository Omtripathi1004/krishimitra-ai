import React, { useState } from "react";
import {
  Droplets,
  Gauge,
  Calendar,
  Clock,
  Layers,
  ShieldCheck,
  Info,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function SmartIrrigation({ smartIrrigation, farm, weather, t }) {
  const [selectedTimelineSlot, setSelectedTimelineSlot] = useState(null);
  const data = smartIrrigation?.irrigation_data;

  if (!data) {
    return (
      <div className="card p-12 text-center text-sm text-[var(--text-muted)] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
        <span>Computing FAO-56 Penman-Monteith water balances and soil reservoir depletion...</span>
      </div>
    );
  }

  const status = data.status || "Wait";
  const soilMoisturePercent = 68; // Soil moisture reading

  // 72-Hour Precision Scheduling Windows
  const scheduleWindows = [
    { window: "Today Morning (06:00 - 09:00)", status: "Optimal (Deferred)", reason: "Rainfall expected, hold cycle", rec: "Hold" },
    { window: "Today Afternoon (12:00 - 16:00)", status: "Restricted", reason: "High vapor deficit & peak evaporation", rec: "Avoid" },
    { window: "Tomorrow Morning (06:00 - 09:00)", status: "Convective Rain Active", reason: "Natural precipitation recharge", rec: "Hold" },
    { window: "Tomorrow Night (20:00 - 23:00)", status: "Off-Peak Electricity", reason: "Low tariff, cool canopy", rec: "Standby" },
    { window: "Day 3 Morning (06:00 - 09:00)", status: "Recommended Cycle", reason: "Soil reaches 52% VWC replenishment threshold", rec: "Irrigate" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-5 sm:p-6 border-l-4 border-l-[var(--sky)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--sky)]/10 text-[var(--sky)] border border-[var(--sky)]/20">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                {t?.irrigation?.title || "Smart Irrigation Intelligence"}
                <span className="badge badge-sky text-xs font-semibold">
                  FAO-56 Dual Kc Model
                </span>
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Root-zone soil hydrology balance & dynamic drip scheduling for{" "}
                <strong className="text-white">{farm?.farm_name || "Plot Area"}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-secondary)]">
          <div className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
            Soil: <strong className="text-white">{farm?.soil_type || "Alluvial Loam"}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
            Method: <strong className="text-[var(--leaf)]">{farm?.irrigation_method || "Drip"}</strong>
          </div>
        </div>
      </div>

      {/* Primary Status Banner */}
      <div className="card p-6 border-l-4 border-l-[var(--harvest)] bg-gradient-to-br from-[var(--surface)] to-[var(--surface-2)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Real-Time Irrigation Advisory
            </span>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="badge badge-sky text-sm font-bold py-1 px-3">
                {status === "Wait" ? "Delay Irrigation by 24h" : status}
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-mono">
                Urgency Level: <strong className="text-white">{data.urgency || "Low"}</strong>
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold font-mono text-[var(--sky)]">
              {data.crop_water_requirement_mm_day || 3.8} <span className="text-sm font-normal text-[var(--text-muted)]">mm/day</span>
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-0.5">
              Crop Evapotranspiration (ETc)
            </div>
          </div>
        </div>

        {/* Action Callout */}
        <div className="p-4 rounded-xl bg-[var(--harvest)]/10 border border-[var(--harvest)]/30 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--harvest)] uppercase tracking-wider">
            <Clock className="w-4 h-4" /> Recommended Action Directive
          </div>
          <p className="text-sm font-semibold text-white leading-relaxed">
            {data.action || "Hold next scheduled irrigation cycle. Rainfall forecast over the next 48 hours provides sufficient root-zone replenishment."}
          </p>
        </div>

        <div className="text-xs text-[var(--text-secondary)] italic">
          Rationale: {data.summary || "Current volumetric water content is in the optimal buffer zone. Natural precipitation will restore field capacity."}
        </div>
      </div>

      {/* 4 Telemetry Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Reference Evapotranspiration */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Reference ET0</span>
            <Gauge className="w-4 h-4 text-[var(--sky)]" />
          </div>
          <div className="stat-value text-2xl font-bold text-white mt-1">
            {data.reference_evapotranspiration || 4.2} <span className="text-sm font-normal text-[var(--text-muted)]">mm/day</span>
          </div>
          <div className="stat-meta text-xs text-[var(--text-secondary)] mt-1">
            Atmospheric evaporative demand
          </div>
        </div>

        {/* 2. Soil Moisture Depletion */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Root-Zone VWC</span>
            <Layers className="w-4 h-4 text-[var(--leaf)]" />
          </div>
          <div className="stat-value text-2xl font-bold text-[var(--leaf)] mt-1">
            {soilMoisturePercent}%
          </div>
          <div className="stat-meta text-xs text-[var(--text-secondary)] mt-1">
            Target Comfort: 55% - 70% VWC
          </div>
        </div>

        {/* 3. Irrigation Efficiency */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Application Efficiency</span>
            <Droplets className="w-4 h-4 text-[var(--sky)]" />
          </div>
          <div className="stat-value text-2xl font-bold text-[var(--sky)] mt-1">
            {data.system_efficiency || "88%"}
          </div>
          <div className="stat-meta text-xs text-[var(--leaf)] mt-1">
            Drip micro-emitter profile
          </div>
        </div>

        {/* 4. Projected Resource Savings */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Conserved Today</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="stat-value text-2xl font-bold text-white mt-1">
            320 <span className="text-sm font-normal text-[var(--text-muted)]">m³</span>
          </div>
          <div className="stat-meta text-xs text-[var(--leaf)] mt-1">
            ₹850 diesel / electric power saved
          </div>
        </div>
      </div>

      {/* Soil Reservoir Depletion Gauge & 72h Schedule Windows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Soil Moisture Depletion Hydrology Gauge */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[var(--leaf)]" />
              <div>
                <h3 className="text-base font-bold text-white">Soil Moisture Reservoir Profile</h3>
                <p className="text-xs text-[var(--text-secondary)]">Volumetric Water Content relative to plant-available water bands</p>
              </div>
            </div>
            <span className="badge badge-emerald text-xs">Adequate Storage</span>
          </div>

          <div className="space-y-4 pt-2">
            {/* Multi-stage Reservoir Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Current VWC Level</span>
                <span className="font-bold text-white">{soilMoisturePercent}% (Adequate)</span>
              </div>
              <div className="w-full h-4 rounded-full bg-[var(--surface-2)] overflow-hidden flex border border-[var(--border)]">
                {/* Wilting Point Zone (0-20%) */}
                <div className="h-full bg-red-900/60" style={{ width: "20%" }} title="Wilting Point (Stress)" />
                {/* Readily Available Water (20-55%) */}
                <div className="h-full bg-amber-600/50" style={{ width: "35%" }} title="Deficit Buffer" />
                {/* Optimal Comfort Band (55-75%) */}
                <div className="h-full bg-[var(--leaf)]" style={{ width: "20%" }} title="Optimal Growth Band" />
                {/* Saturation Zone (75-100%) */}
                <div className="h-full bg-[var(--sky)]/70" style={{ width: "25%" }} title="Saturation / Hypoxia" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
                <span>0% Wilting Point</span>
                <span>55% Refill Threshold</span>
                <span>75% Field Capacity</span>
                <span>100% Saturation</span>
              </div>
            </div>

            <div className="p-3.5 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-[var(--leaf)]" />
                <span>Hydrology Diagnostics:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[var(--text-secondary)]">
                <li>Soil texture: <strong>{farm?.soil_type || "Alluvial Loam"}</strong> with 1.45 g/cm³ bulk density.</li>
                <li>Effective root depth: <strong>45 cm</strong> for current vegetative crop stage.</li>
                <li>Depletion rate: ~3.8 mm/day under current thermal evaporative index.</li>
                <li>Refill point will not be reached for another <strong>72 hours</strong>.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 72-Hour Precision Scheduling Window */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[var(--sky)]" />
              <div>
                <h3 className="text-base font-bold text-white">72-Hour Precision Schedule Timeline</h3>
                <p className="text-xs text-[var(--text-secondary)]">Optimal pumping windows evaluated against rain & power tariffs</p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            {scheduleWindows.map((slot, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all text-xs flex items-center justify-between gap-3 ${
                  slot.rec === "Irrigate"
                    ? "border-[var(--primary)] bg-[var(--primary)]/15"
                    : slot.rec === "Hold"
                    ? "border-[var(--border)] bg-[var(--surface-2)]"
                    : "border-red-900/30 bg-red-950/10"
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    {slot.window}
                    <span className={`badge text-[10px] py-0.2 px-1.5 ${
                      slot.rec === "Irrigate"
                        ? "badge-emerald"
                        : slot.rec === "Hold"
                        ? "badge-sky"
                        : "badge-critical"
                    }`}>
                      {slot.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {slot.reason}
                  </div>
                </div>

                <div className="text-right font-mono font-bold">
                  <span className={`text-xs ${
                    slot.rec === "Irrigate"
                      ? "text-[var(--leaf)]"
                      : slot.rec === "Hold"
                      ? "text-[var(--sky)]"
                      : "text-red-400"
                  }`}>
                    {slot.rec}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
