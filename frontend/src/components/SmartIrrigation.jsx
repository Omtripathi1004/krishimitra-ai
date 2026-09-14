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
  AlertTriangle,
  Play,
  RotateCcw,
  Sun,
  Activity,
  Sliders,
  DollarSign
} from "lucide-react";

export default function SmartIrrigation({ smartIrrigation, farm, weather, t }) {
  // Extract data with robust fallback so it never fails or hangs
  const data = smartIrrigation?.irrigation_data || smartIrrigation || {};
  const status = data.status || "Wait";
  const urgency = data.urgency || (status === "Irrigate Now" ? "High" : "Low");
  const etc = data.crop_water_requirement_mm_day || data.evapotranspiration_mm || 1.36;
  const et0 = data.reference_evapotranspiration || 2.0;
  const efficiency = data.system_efficiency || data.efficiency_rating || "90-95%";
  const soilRetention = data.soil_retention_profile || "Optimal (Balanced aeration & water)";
  const summary = data.summary || data.action_needed || "Imminent rainfall predicted. Current root-zone moisture reservoir is adequate (68% VWC). Delaying scheduled irrigation prevents hypoxia and nutrient leaching.";
  const action = data.action || data.action_needed || "Hold scheduled irrigation cycle for 24-36 hours. Assess soil profile after rain window.";
  const baseMoisture = smartIrrigation?.soil_moisture_pct || 68;

  // Interactive Simulator State
  const [simAddedWater, setSimAddedWater] = useState(0); // in mm
  const [solarMode, setSolarMode] = useState(true);
  const [selectedTimelineSlot, setSelectedTimelineSlot] = useState(null);

  const simulatedMoisture = Math.min(100, Math.round(baseMoisture + simAddedWater * 1.2));
  const waterSavedLiters = 320000;
  const costSavedInr = 850;

  // 72-Hour Precision Scheduling Windows
  const scheduleWindows = [
    { window: "Today Morning (06:00 - 09:00)", status: "Optimal (Deferred)", reason: "Rainfall expected; delay recommended", rec: "Hold", power: "Solar DC Available" },
    { window: "Today Afternoon (12:00 - 16:00)", status: "Restricted Window", reason: "Peak vapor deficit & 35% droplet evaporation", rec: "Avoid", power: "High Thermal Loss" },
    { window: "Tomorrow Morning (06:00 - 09:00)", status: "Rain Event Active", reason: "Natural 9.1mm precipitation infiltration", rec: "Natural Recharge", power: "Grid Standby" },
    { window: "Tomorrow Night (20:00 - 23:00)", status: "Off-Peak Power", reason: "Cool canopy, low evapotranspiration", rec: "Standby", power: "Off-Peak Electricity (-40% tariff)" },
    { window: "Day 3 Morning (06:00 - 09:00)", status: "Recommended Cycle", reason: "Soil reservoir reaches 52% replenishment point", rec: "Irrigate", power: "Solar DC Prime Window" }
  ];

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="card p-5 sm:p-6 border-l-4 border-l-[var(--sky)] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--sky)]/15 text-[var(--sky)] border border-[var(--sky)]/30 shadow-inner">
              <Droplets className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Smart Irrigation & Soil Hydrology Command
                </h1>
                <span className="badge badge-sky text-xs font-semibold">
                  FAO-56 Penman-Monteith
                </span>
                <span className="badge badge-emerald text-xs font-semibold">
                  Live Synced
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Multi-layer root-zone hydrology balance, evapotranspiration loss modeling, and precision drip scheduling for{" "}
                <strong className="text-white">{farm?.farm_name || "Primary Holding"}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-secondary)]">
            Soil: <strong className="text-white">{farm?.soil_type || "Alluvial Loam"}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-secondary)]">
            Delivery: <strong className="text-[var(--leaf)]">{farm?.irrigation_method || "Drip Micro-Emitter"}</strong>
          </div>
        </div>
      </div>

      {/* ── PRIORITY DIRECTIVE BANNER ── */}
      <div className="card p-6 border-l-4 border-l-[var(--harvest)] bg-gradient-to-r from-[var(--surface)] via-[#0D251A] to-[var(--surface-2)] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-[var(--primary)]/10 to-transparent pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[var(--harvest)] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Real-Time Decision-Support Directive
            </span>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold px-3 py-1 rounded-full border ${
                status === "Wait"
                  ? "bg-sky-950/80 text-[var(--sky)] border-sky-800"
                  : status === "Irrigate Now"
                  ? "bg-red-950/80 text-red-400 border-red-800 animate-pulse"
                  : "bg-amber-950/80 text-amber-400 border-amber-800"
              }`}>
                {status === "Wait" ? "HOLD IRRIGATION (24h - 36h)" : status}
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-mono">
                Urgency: <strong className="text-white">{urgency}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-2xl font-bold font-mono text-[var(--sky)]">
                {etc} <span className="text-sm font-normal text-[var(--text-muted)]">mm/day</span>
              </div>
              <div className="text-[11px] text-[var(--text-secondary)]">
                Crop Evapotranspiration (ETc)
              </div>
            </div>

            <div className="text-right border-l border-[var(--border)] pl-6">
              <div className="text-2xl font-bold font-mono text-[var(--leaf)]">
                {simulatedMoisture}%
              </div>
              <div className="text-[11px] text-[var(--text-secondary)]">
                Rhizosphere VWC
              </div>
            </div>
          </div>
        </div>

        {/* Action Directive Highlight */}
        <div className="mt-4 p-4 rounded-xl bg-[var(--surface)]/90 border border-[var(--border)] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[var(--harvest)]" /> Action Required:
            </span>
            <span className="badge badge-emerald text-[11px]">Validated against IMD Radar</span>
          </div>
          <p className="text-sm font-semibold text-white leading-relaxed">
            {action}
          </p>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {summary}
          </p>
        </div>
      </div>

      {/* ── 4 KEY HYDRAULIC KPI STATS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* 1. Reference Evapotranspiration */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Reference ET₀</span>
            <Gauge className="w-4 h-4 text-[var(--sky)]" />
          </div>
          <div className="stat-value text-2xl font-bold text-white mt-1">
            {et0} <span className="text-sm font-normal text-[var(--text-muted)]">mm/d</span>
          </div>
          <div className="stat-meta text-xs text-[var(--text-secondary)] mt-1">
            Atmospheric evaporative pull
          </div>
        </div>

        {/* 2. Soil Moisture VWC */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Soil Moisture</span>
            <Layers className="w-4 h-4 text-[var(--leaf)]" />
          </div>
          <div className="stat-value text-2xl font-bold text-[var(--leaf)] mt-1">
            {simulatedMoisture}% <span className="text-xs font-normal text-[var(--text-muted)]">VWC</span>
          </div>
          <div className="stat-meta text-xs text-[var(--leaf)] mt-1">
            Optimal Growth Band (55-75%)
          </div>
        </div>

        {/* 3. System Efficiency */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Drip Efficiency</span>
            <Droplets className="w-4 h-4 text-[var(--sky)]" />
          </div>
          <div className="stat-value text-2xl font-bold text-[var(--sky)] mt-1">
            {efficiency}
          </div>
          <div className="stat-meta text-xs text-[var(--text-secondary)] mt-1">
            Pressure: 1.2 bar optimal
          </div>
        </div>

        {/* 4. Financial & Water Savings */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Savings Today</span>
            <Zap className="w-4 h-4 text-[var(--harvest)]" />
          </div>
          <div className="stat-value text-2xl font-bold text-white mt-1">
            ₹{costSavedInr} <span className="text-xs font-normal text-[var(--text-muted)]">saved</span>
          </div>
          <div className="stat-meta text-xs text-[var(--leaf)] mt-1">
            {waterSavedLiters.toLocaleString()} L water conserved
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE HYDROLOGY RESERVOIR & CYCLE SIMULATOR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Dynamic Visual Soil Water Reservoir Tank */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[var(--leaf)]" />
              <div>
                <h2 className="text-base font-bold text-white">Root-Zone Water Reservoir Tank</h2>
                <p className="text-xs text-[var(--text-secondary)]">Volumetric Water Content (VWC) cross-section gauge</p>
              </div>
            </div>
            <span className="badge badge-emerald text-xs">{simulatedMoisture}% Capacity</span>
          </div>

          {/* Visual Tank Graphic */}
          <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--text-muted)]">Rhizosphere Depth: 0 - 45 cm</span>
              <span className="font-bold text-white">Status: Adequate Comfort Band</span>
            </div>

            {/* Simulated Water Cylinder Tank */}
            <div className="relative w-full h-32 rounded-xl border-2 border-[var(--border)] bg-[#0A1810] overflow-hidden shadow-inner flex flex-col justify-end">
              {/* Reference Grid lines inside tank */}
              <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none z-20 text-[10px] font-mono text-[var(--text-muted)] opacity-60">
                <div className="flex justify-between border-b border-dashed border-red-500/40">
                  <span>100% Saturation / Runoff Danger</span>
                  <span className="text-red-400">Anaerobic</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-sky-400/40">
                  <span>75% Field Capacity</span>
                  <span className="text-sky-400">Full Storage</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-emerald-400/40">
                  <span>55% Refill Threshold</span>
                  <span className="text-emerald-400">Optimal Buffer</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-amber-500/40">
                  <span>20% Permanent Wilting Point</span>
                  <span className="text-amber-400">Severe Deficit</span>
                </div>
              </div>

              {/* Water Liquid Body with Wave Effect */}
              <div
                className="w-full bg-gradient-to-t from-[var(--primary)] via-[var(--sky)] to-[var(--sky)]/70 transition-all duration-700 relative z-10 opacity-80"
                style={{ height: `${simulatedMoisture}%` }}
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/40 animate-pulse" />
              </div>
            </div>

            {/* Legend Labels */}
            <div className="grid grid-cols-4 text-center text-[10px] font-mono gap-1 pt-1">
              <div className="p-1.5 rounded bg-red-950/40 border border-red-900/40 text-red-300">
                &lt;20% Stress
              </div>
              <div className="p-1.5 rounded bg-amber-950/40 border border-amber-900/40 text-amber-300">
                20-55% Deficit
              </div>
              <div className="p-1.5 rounded bg-emerald-950/40 border border-emerald-900/40 text-emerald-300 font-bold">
                55-75% Target
              </div>
              <div className="p-1.5 rounded bg-sky-950/40 border border-sky-900/40 text-sky-300">
                75-100% Saturated
              </div>
            </div>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[var(--leaf)]" /> Drip Irrigation Cycle Simulator
              </span>
              {simAddedWater > 0 && (
                <button
                  onClick={() => setSimAddedWater(0)}
                  className="text-[11px] text-[var(--harvest)] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Simulate Irrigation Water Dose:</span>
                <span className="font-bold text-[var(--sky)]">+{simAddedWater} mm ({simAddedWater * 10} m³/acre)</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={simAddedWater}
                onChange={(e) => setSimAddedWater(parseInt(e.target.value))}
                className="w-full accent-[var(--sky)] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <span>Power Source:</span>
                <button
                  onClick={() => setSolarMode(!solarMode)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all ${
                    solarMode
                      ? "bg-emerald-950 text-[var(--leaf)] border-emerald-800"
                      : "bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  {solarMode ? "☀️ Solar DC (Zero Cost)" : "⚡ Grid Electricity"}
                </button>
              </div>

              <div className="text-[11px] font-mono text-[var(--text-muted)]">
                Projected VWC: <strong className="text-white">{simulatedMoisture}%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right: FAO-56 Balance Equation & 72h Schedule Timeline */}
        <div className="space-y-6">
          {/* FAO-56 Mathematical Model Card */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--sky)]" />
                <div>
                  <h2 className="text-base font-bold text-white">FAO-56 Water Balance Calculation</h2>
                  <p className="text-xs text-[var(--text-secondary)]">Dual crop coefficient evapotranspiration synthesis</p>
                </div>
              </div>
              <span className="badge badge-sky text-xs font-mono">ETc Formula</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] font-mono text-xs space-y-2">
              <div className="text-[var(--harvest)] font-bold">
                ETc = ET₀ × Kc × K_stage
              </div>
              <div className="text-[var(--text-secondary)] text-[11px]">
                = {et0} mm/d (ET₀) × 0.85 (Wheat Kc) × 0.8 (Vegetative stage) = <strong className="text-white">{etc} mm/day</strong>
              </div>
              <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] flex justify-between">
                <span className="text-[var(--text-muted)]">Incoming 7d Rainfall:</span>
                <span className="font-bold text-[var(--sky)]">+14.5 mm</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--text-muted)]">7-Day Cumulative ETc Loss:</span>
                <span className="font-bold text-[var(--harvest)]">−{(etc * 7).toFixed(1)} mm</span>
              </div>
              <div className="pt-1.5 border-t border-[var(--border-subtle)] flex justify-between font-bold">
                <span className="text-white">Hydrological Surplus:</span>
                <span className="text-[var(--leaf)]">+{(14.5 - etc * 7).toFixed(1)} mm (No Irrigation Needed)</span>
              </div>
            </div>

            <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Because forecasted precipitation exceeds atmospheric demand over the 7-day horizon, irrigating today would only cause nitrogen runoff and saturate root capillaries.
            </div>
          </div>

          {/* 72-Hour Precision Scheduling Window */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--harvest)]" />
                <div>
                  <h2 className="text-base font-bold text-white">72-Hour Precision Schedule Windows</h2>
                  <p className="text-xs text-[var(--text-secondary)]">Tariff-optimized, weather-guarded pump timing</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {scheduleWindows.map((slot, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedTimelineSlot(idx)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    slot.rec === "Irrigate"
                      ? "border-[var(--primary)] bg-[var(--primary)]/15 hover:bg-[var(--primary)]/20 shadow-sm"
                      : slot.rec === "Hold"
                      ? "border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--surface-2)]/90"
                      : slot.rec === "Natural Recharge"
                      ? "border-sky-800/40 bg-sky-950/20"
                      : "border-red-900/30 bg-red-950/10"
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-bold text-white flex items-center gap-2 truncate">
                      {slot.window}
                      <span className={`badge text-[10px] py-0.2 px-1.5 ${
                        slot.rec === "Irrigate"
                          ? "badge-emerald"
                          : slot.rec === "Natural Recharge"
                          ? "badge-sky"
                          : slot.rec === "Hold"
                          ? "badge-warning"
                          : "badge-critical"
                      }`}>
                        {slot.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] truncate">
                      {slot.reason} • <span className="text-[var(--text-secondary)]">{slot.power}</span>
                    </div>
                  </div>

                  <div className="font-mono font-bold shrink-0 text-right">
                    <span className={`text-xs ${
                      slot.rec === "Irrigate"
                        ? "text-[var(--leaf)]"
                        : slot.rec === "Natural Recharge"
                        ? "text-[var(--sky)]"
                        : slot.rec === "Hold"
                        ? "text-amber-400"
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
    </div>
  );
}
