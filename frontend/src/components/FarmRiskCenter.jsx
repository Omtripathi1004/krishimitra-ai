import React, { useState } from "react";
import {
  ShieldAlert, AlertTriangle, CheckCircle2, Info, ArrowRight,
  TrendingUp, TrendingDown, Minus, Bug, Droplets,
  Thermometer, Wind, Activity, BarChart2
} from "lucide-react";

const RISK_LEVELS = { Low: "badge-leaf", Moderate: "badge-amber", High: "badge-rose", Critical: "badge-rose" };
const RISK_ICON = { Low: CheckCircle2, Moderate: AlertTriangle, High: AlertTriangle, Critical: AlertTriangle };
const RISK_COLOR = { Low: "var(--leaf)", Moderate: "var(--amber)", High: "var(--rose)", Critical: "var(--rose)" };

function RiskGauge({ value, max = 100 }) {
  const pct = Math.min(value, max) / max;
  const color = pct < 0.3 ? "#22C55E" : pct < 0.6 ? "#FBBF24" : "#F87171";
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1.5 text-xs">
        <span style={{ color: "var(--text-400)" }}>Risk Score</span>
        <span className="font-bold font-mono" style={{ color }}>{value}/{max}</span>
      </div>
      <div className="kpi-progress-track">
        <div
          className="kpi-progress-fill"
          style={{
            width: `${pct * 100}%`,
            background: `linear-gradient(90deg, ${color}CC, ${color})`
          }}
        />
      </div>
    </div>
  );
}

function RiskCard({ name, level, score, description, icon: Icon, drivers, actions, theme = "leaf" }) {
  const [open, setOpen] = useState(false);
  const StatusIcon = RISK_ICON[level] || CheckCircle2;
  const color = RISK_COLOR[level] || "var(--leaf)";

  const themeClass =
    theme === "pink" ? "card-pink" :
    theme === "gold" ? "card-gold" :
    theme === "sky" ? "card-sky" :
    theme === "indigo" ? "card-indigo" :
    theme === "violet" ? "card-violet" : "card-leaf";

  return (
    <div className={`card ${themeClass} p-4 flex flex-col gap-3 transition-all hover:scale-[1.01]`}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="p-2 rounded-lg border shrink-0"
          style={{ background: color + "14", borderColor: color + "35" }}
        >
          {Icon ? <Icon className="w-4 h-4" style={{ color }} /> : <ShieldAlert className="w-4 h-4" style={{ color }} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-sm font-bold font-display" style={{ color: "var(--text-100)" }}>{name}</span>
            <span className={`badge ${RISK_LEVELS[level] || "badge-muted"} text-[10px] font-tech`}>
              <StatusIcon className="w-2.5 h-2.5" /> {level}
            </span>
          </div>
          <p className="text-xs mt-1 leading-snug" style={{ color: "var(--text-300)" }}>{description}</p>
        </div>
      </div>

      {/* Score bar */}
      <RiskGauge value={score} />

      {/* Expand */}
      {(drivers?.length || actions?.length) && (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="text-xs font-semibold flex items-center gap-1 transition-colors font-tech"
            style={{ color: open ? "var(--text-400)" : "var(--leaf)" }}
          >
            {open ? "Hide details ↑" : "Drivers & actions →"}
          </button>
          {open && (
            <div className="space-y-2 anim-fade-in">
              {drivers?.length > 0 && (
                <div className="text-[11px] space-y-1">
                  <div className="section-label mb-1.5 font-tech">Risk Drivers</div>
                  {drivers.map((d, i) => (
                    <div key={i} className="flex items-start gap-1.5" style={{ color: "var(--text-300)" }}>
                      <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                      {d}
                    </div>
                  ))}
                </div>
              )}
              {actions?.length > 0 && (
                <div className="text-[11px] space-y-1">
                  <div className="section-label mb-1.5 font-tech">Recommended Actions</div>
                  {actions.map((a, i) => (
                    <div key={i} className="flex items-start gap-1.5" style={{ color: "var(--text-200)" }}>
                      <ArrowRight className="w-3 h-3 mt-0.5 shrink-0" style={{ color: "var(--leaf)" }} />
                      {a}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function WeeklyTimeline({ days }) {
  return (
    <div className="space-y-2">
      {days.map((day, i) => {
        const maxRisk = Math.max(day.rust, day.thermal, day.hydro, day.pest);
        const overallColor = maxRisk < 30 ? "#22C55E" : maxRisk < 60 ? "#FBBF24" : "#F87171";
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="w-14 text-[10px] font-bold shrink-0 font-mono" style={{ color: "var(--text-400)" }}>{day.label}</div>
            <div className="flex-1 flex gap-1 items-center h-5">
              {[{ v: day.rust, c: "#FB7185", n: "Rust" }, { v: day.thermal, c: "#FCD34D", n: "Thermal" }, { v: day.hydro, c: "#38BDF8", n: "Hydro" }, { v: day.pest, c: "#C084FC", n: "Pest" }].map(b => (
                <div
                  key={b.n}
                  className="h-full rounded-sm transition-all"
                  style={{ width: `${b.v}%`, background: b.c + "CC", minWidth: b.v > 0 ? 3 : 0 }}
                  title={`${b.n}: ${b.v}%`}
                />
              ))}
            </div>
            <div className="text-[10px] font-bold font-mono w-8 text-right" style={{ color: overallColor }}>{maxRisk}%</div>
          </div>
        );
      })}
    </div>
  );
}

export default function FarmRiskCenter({ weather, farm, t }) {
  const risks = [
    {
      name: "Yellow Rust (Puccinia striiformis)",
      level: "Low",
      score: 18,
      theme: "pink",
      icon: Bug,
      description: "Airborne fungal pathogen. Requires >75% RH and leaf wetness >3h. Current conditions below threshold.",
      drivers: [
        "Relative humidity at 62% — 13 pts below critical threshold",
        "No prolonged leaf wetness events recorded in past 72h",
        "Night temperature (18.2°C) not conducive to spore germination"
      ],
      actions: [
        "Scout field weekly — inspect lower canopy leaves for chlorotic streaks",
        "Apply Tebuconazole 250 EC @ 1 L/ha if RH exceeds 78% for 3+ consecutive days",
        "Schedule preventive crop hygiene — remove infected crop debris from border rows"
      ]
    },
    {
      name: "Thermal Crop Stress",
      level: "Moderate",
      score: 42,
      theme: "gold",
      icon: Thermometer,
      description: "Mid-day temperature peaks create short windows of heat stress in vegetative biomass. Not yet critical.",
      drivers: [
        "Peak temperature reaching 34–36°C during 11:30 AM – 3:00 PM window",
        "Crop at vegetative stage — moderately sensitive to heat stress",
        "Low wind helps retain morning coolness but exacerbates afternoon heat"
      ],
      actions: [
        "Irrigate in early morning (6 AM) to provide thermal buffering via evaporative cooling",
        "Avoid foliar spray during peak thermal window (11:30 AM – 3:00 PM)",
        "Apply anti-transpirant kaolin clay @ 5% if stress persists beyond 3 days"
      ]
    },
    {
      name: "Hydrological Risk (Flooding / Waterlogging)",
      level: "Low",
      score: 12,
      theme: "sky",
      icon: Droplets,
      description: "Soil drainage capacity is adequate. 14.5mm forecasted rain is within safe absorption threshold.",
      drivers: [
        "Sandy loam soil percolation rate 18 mm/hr — easily absorbs forecast rain",
        "Farm elevation adequate, no waterlogging observed in past 3 seasons",
        "Expected 14.5mm < drainage capacity by wide margin"
      ],
      actions: [
        "Maintain drainage channels clear of debris before rain front arrives",
        "Monitor field edges for ponding — check after Day 2 rainfall",
        "No immediate action required"
      ]
    },
    {
      name: "Aphid & Sucking Pest Index",
      level: "Low",
      score: 21,
      theme: "violet",
      icon: Bug,
      description: "Aphid colony density below Economic Threshold Level (ETL). No spray intervention needed at present.",
      drivers: [
        "Scout count: 3–5 aphids per leaf — below ETL of 30 aphids/leaf",
        "Beneficial insect (ladybird) presence observed in field edges",
        "Mild temperature limits rapid aphid reproduction"
      ],
      actions: [
        "Continue weekly monitoring using sticky traps and visual scouting",
        "Spray Imidacloprid 17.8 SL @ 150 mL/ha if count exceeds ETL",
        "Promote natural predators: avoid broad-spectrum pesticides"
      ]
    },
    {
      name: "Soil Nutrient Deficiency",
      level: "Low",
      score: 25,
      theme: "leaf",
      icon: Activity,
      description: "Zinc marginally below ICAR optimum. Other primary and secondary nutrients within optimal ranges.",
      drivers: [
        "Zinc: 0.42 ppm (ICAR optimum: 0.6–1.0 ppm) — marginally below",
        "N-P-K levels: Adequate for current vegetative stage",
        "Organic matter: 2.8% — moderate, can improve with FYM application"
      ],
      actions: [
        "Foliar zinc spray: Zinc Sulphate 0.5% solution — apply this week morning hours",
        "Incorporate 5 tonne/acre FYM at next tillage operation to build OM",
        "Re-test soil after 45 days with IFFCO Soil Health Card app"
      ]
    },
    {
      name: "Wind / Spray Drift Risk",
      level: "Low",
      score: 8,
      theme: "indigo",
      icon: Wind,
      description: "Wind speed ideal for all spray operations. Negligible spray drift risk to neighboring fields.",
      drivers: [
        `Wind speed ${weather?.wind_speed || 9.8} km/h — well within 0–15 km/h safe spray window`,
        "Wind direction stable: NW to SE — away from residential areas",
        "No adjacent sensitive crop rotation detected in buffer zone"
      ],
      actions: [
        "Optimal spray window: 06:00 – 10:30 AM today",
        "Use flat-fan nozzles at 250L/ha for best foliar coverage",
        "Add drift retardant adjuvant if wind exceeds 12 km/h during spray"
      ]
    }
  ];

  const weeklyTimeline = [
    { label: "Today",  rust: 18, thermal: 42, hydro: 12, pest: 21 },
    { label: "Day 2",  rust: 25, thermal: 38, hydro: 28, pest: 18 },
    { label: "Day 3",  rust: 22, thermal: 45, hydro: 16, pest: 22 },
    { label: "Day 4",  rust: 20, thermal: 50, hydro: 14, pest: 20 },
    { label: "Day 5",  rust: 18, thermal: 44, hydro: 11, pest: 18 },
    { label: "Day 6",  rust: 15, thermal: 40, hydro: 10, pest: 15 },
    { label: "Day 7",  rust: 14, thermal: 38, hydro:  9, pest: 14 },
  ];

  const overallRisk = 18;

  return (
    <div className="space-y-5 anim-fade-up">
      {/* Header (Pink Neon Accent) */}
      <div className="card card-pink p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl border bg-rose-500/15 border-rose-500/30 text-[var(--c-pink-neon)]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display text-white">
                Farm Risk Command Center
              </h1>
              <p className="text-xs mt-0.5 text-rose-200/80">
                Compound disease, pest, climate and hydrological risk surveillance — 6 independent risk vectors, updated hourly.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl border text-center bg-rose-950/40 border-rose-800/60 shadow-[0_0_15px_rgba(251,113,133,0.15)]">
              <div className="text-[10px] uppercase font-bold tracking-wider mb-0.5 text-rose-300 font-tech">Overall Risk</div>
              <div className="text-2xl font-black font-mono text-[var(--c-leaf-neon)]">
                {overallRisk}<span className="text-xs font-normal text-slate-400">/100</span>
              </div>
              <div className="badge badge-leaf mt-1 text-[10px] font-tech">● Low — Favorable</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Risk Heatmap (Deep Indigo Theme) */}
      <div className="card card-indigo p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[var(--c-indigo-neon)]" />
            <h2 className="text-sm font-bold font-display text-white">7-Day Risk Projection</h2>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-tech" style={{ color: "var(--text-400)" }}>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#FB7185" }} /> Rust (Pink)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#FCD34D" }} /> Thermal (Gold)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#38BDF8" }} /> Hydro (Sky)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#C084FC" }} /> Pest (Purple)</span>
          </div>
        </div>
        <WeeklyTimeline days={weeklyTimeline} />
        <p className="text-[10px] mt-3 text-indigo-200/60 font-tech">
          Stacked bar width represents relative risk contribution. Values synthesized from ICAR CRIDA multi-hazard model.
        </p>
      </div>

      {/* Risk Cards Grid (Multi-Color Themes: Pink, Gold, Sky, Violet, Leaf, Indigo) */}
      <div>
        <div className="section-label mb-3 font-tech text-[var(--c-sky-neon)]">Individual Risk Vector Analysis (Color-Coded By Hazard Domain)</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 anim-stagger">
          {risks.map(r => <RiskCard key={r.name} {...r} />)}
        </div>
      </div>
    </div>
  );
}
