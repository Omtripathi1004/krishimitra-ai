import React, { useState, useEffect } from "react";
import {
  Thermometer, CloudRain, Droplets, Sprout, ShieldCheck,
  Sparkles, MapPin, Layers, ChevronRight, Cpu, Info,
  Wind, TrendingUp, TrendingDown, ArrowRight, Activity,
  BarChart2, CheckCircle2, AlertTriangle, Sun
} from "lucide-react";

/* ── Animated number counter hook ── */
function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const t = parseFloat(target) || 0;
    if (t === 0) return;
    let start = 0;
    const step = t / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= t) { setValue(t); clearInterval(id); }
      else setValue(parseFloat(start.toFixed(1)));
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return value;
}

/* ── Ring Progress Component ── */
function RingProgress({ value, max = 100, size = 52, strokeWidth = 5, color = "#22C55E" }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const progress = circ * (1 - Math.min(value, max) / max);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeWidth} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${circ - progress} ${progress}`}
        style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}
      />
    </svg>
  );
}

/* ── KPI Card ── */
function KPICard({ title, value, unit, trend, trendUp, icon: Icon, explanation, color, bg, ringValue, ringMax, ringColor }) {
  const animated = useCountUp(value);
  const isPositive = trendUp === true;
  const isNegative = trendUp === false;

  return (
    <div className="card p-4 flex flex-col gap-3 hover:scale-[1.01] transition-transform cursor-default group">
      {/* Header Row */}
      <div className="flex items-start justify-between">
        <div>
          <div className="kpi-label mb-2">{title}</div>
          <div className="flex items-baseline gap-1.5">
            <span className="kpi-value" style={{ fontSize: "1.9rem", color: color || "var(--text-100)" }}>
              {Number.isInteger(parseFloat(value)) ? Math.round(animated) : animated}
            </span>
            <span className="text-xs font-semibold" style={{ color: "var(--text-400)" }}>{unit}</span>
          </div>
        </div>
        {ringValue !== undefined ? (
          <div className="relative">
            <RingProgress value={ringValue} max={ringMax || 100} size={52} color={ringColor || "#22C55E"} />
            <div
              className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
              style={{ color: ringColor || "#22C55E", transform: "rotate(0deg)" }}
            >
              {ringValue}%
            </div>
          </div>
        ) : (
          <div className={`p-2 rounded-lg border ${bg}`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
        )}
      </div>

      {/* Trend Badge */}
      {trend && (
        <div className="flex items-center gap-1.5">
          {isPositive && <TrendingUp className="w-3 h-3 text-[var(--leaf)]" />}
          {isNegative && <TrendingDown className="w-3 h-3 text-[var(--rose)]" />}
          <span className={`kpi-trend ${isPositive ? "text-[var(--leaf)]" : isNegative ? "text-[var(--rose)]" : "text-[var(--text-400)]"}`}>
            {trend}
          </span>
        </div>
      )}

      {/* Mini progress bar */}
      {ringValue !== undefined && (
        <div className="kpi-progress-track">
          <div
            className="kpi-progress-fill"
            style={{ width: `${Math.min(ringValue, 100)}%`, background: ringColor || "var(--leaf)" }}
          />
        </div>
      )}

      {/* Explanation */}
      <div
        className="text-[11px] leading-snug border-t pt-2.5"
        style={{ color: "var(--text-400)", borderColor: "var(--border-3)" }}
      >
        {explanation}
      </div>
    </div>
  );
}

/* ── Quick Stat Row ── */
function StatRow({ label, value, valueColor }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: "var(--border-3)" }}>
      <span className="text-xs" style={{ color: "var(--text-400)" }}>{label}</span>
      <span className={`text-xs font-semibold ${valueColor || "text-[var(--text-200)]"}`} style={{ color: valueColor }}>{value}</span>
    </div>
  );
}

/* ── Module Tile ── */
function ModuleTile({ title, icon: Icon, iconColor, stats, onNavigate, target }) {
  return (
    <div className="card p-5 flex flex-col justify-between hover:scale-[1.01] transition-transform">
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg border`} style={{ background: iconColor + "18", borderColor: iconColor + "35" }}>
              <Icon className="w-4 h-4" style={{ color: iconColor }} />
            </div>
            <h3 className="text-sm font-bold" style={{ color: "var(--text-100)" }}>{title}</h3>
          </div>
          <button
            onClick={() => onNavigate(target)}
            className="flex items-center gap-0.5 text-[11px] font-semibold hover:underline transition-colors"
            style={{ color: "var(--leaf)" }}
          >
            Open <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-0">
          {stats.map((s, i) => <StatRow key={i} {...s} />)}
        </div>
      </div>
    </div>
  );
}

/* ── AI Recommendation Banner ── */
function AIBanner({ recommendation, smartIrrigation, onViewExplanation, onNavigate }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="card p-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0B2218 0%, #112B1C 100%)",
        borderColor: "rgba(34,197,94,0.30)",
        borderLeft: "3px solid var(--leaf)"
      }}
    >
      {/* Glow orb */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.12), transparent 70%)" }}
      />

      <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {/* Animated pulse icon */}
          <div
            className="p-2.5 rounded-xl shrink-0 mt-0.5 border"
            style={{
              background: "rgba(34,197,94,0.12)",
              borderColor: "rgba(34,197,94,0.30)",
              boxShadow: "0 0 0 0 rgba(34,197,94,0.4)",
              animation: "pulse-glow 2.5s infinite"
            }}
          >
            <Sparkles className="w-5 h-5" style={{ color: "var(--leaf)" }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="badge badge-leaf text-[10px]">
                ● AI Primary Recommendation
              </span>
              <span className="badge badge-muted text-[10px]">
                <CheckCircle2 className="w-2.5 h-2.5 text-[var(--leaf)]" />
                87% Confidence
              </span>
            </div>

            <h2 className="text-base font-bold leading-tight mb-1" style={{ color: "var(--text-100)", fontFamily: "var(--font-display)" }}>
              Delay irrigation by 24 hours — rain forecast approaching.
            </h2>

            <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-300)" }}>
              Soil moisture at {smartIrrigation?.soil_moisture_pct || 68}% VWC with 14.5mm rainfall window in 36h.
              Irrigating now risks root hypoxia and nitrogen leaching below root zone.
            </p>

            {expanded && (
              <div
                className="text-xs rounded-lg p-3 mt-2 space-y-1.5 anim-fade-in"
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-2)", color: "var(--text-300)" }}
              >
                <div className="font-bold text-[10px] uppercase tracking-wider mb-2" style={{ color: "var(--leaf)" }}>Model Input Attribution:</div>
                {[
                  ["Soil Moisture (68% VWC)", "Sufficient — 55–75% safe band", "#22C55E"],
                  ["Rain Forecast (+14.5mm in 36h)", "Replenishment incoming — defer cycle", "#38BDF8"],
                  ["ET₀ Rate (4.2 mm/day)", "Moderate atmospheric draw — low urgency", "#FBBF24"],
                ].map(([k, v, c]) => (
                  <div key={k} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: c }} />
                    <div><span className="font-semibold" style={{ color: "var(--text-200)" }}>{k}:</span> {v}</div>
                  </div>
                ))}
                <div className="text-[10px] mt-1 pt-2 border-t" style={{ borderColor: "var(--border-3)", color: "var(--text-400)" }}>
                  ICAR FAO-56 Evapotranspiration Model · Multi-Factor Decision Matrix v2.1
                </div>
              </div>
            )}

            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-semibold mt-1 flex items-center gap-1 transition-colors"
              style={{ color: expanded ? "var(--text-400)" : "var(--leaf)" }}
            >
              {expanded ? "Hide explanation ↑" : "View full explanation →"}
            </button>
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-2 shrink-0 self-start">
          <button
            onClick={() => onNavigate("farmIntelligence")}
            className="btn btn-secondary text-xs py-2 px-3"
          >
            Farm Detail <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate("cropIntelligence")}
            className="btn btn-ghost text-xs py-2 px-3"
            style={{ color: "var(--text-300)" }}
          >
            Run AI Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN DASHBOARD ── */
export default function Dashboard({
  farm, weather, smartIrrigation, recommendation, analytics, t,
  onRunAiAnalysis, isAnalyzing, onNavigate
}) {
  const healthScore = analytics?.soil_health_score || 88;

  const kpis = [
    {
      title: "Temperature",
      value: weather?.temperature || 28.4,
      unit: "°C",
      trend: "+1.2°C from 6am",
      trendUp: null,
      icon: Thermometer,
      explanation: "Within the 20–35°C optimal vegetative band. No thermal crop stress.",
      color: "#FBBF24",
      bg: "bg-amber-950/40 border-amber-800/40",
      ringValue: undefined
    },
    {
      title: "7-Day Rainfall",
      value: weather?.rainfall_forecast_7d || 14.5,
      unit: "mm",
      trend: "35% probability",
      trendUp: null,
      icon: CloudRain,
      explanation: "Light convective showers forecast Day 2. Adequate natural replenishment.",
      color: "#38BDF8",
      bg: "bg-sky-950/40 border-sky-800/40",
      ringValue: undefined
    },
    {
      title: "Relative Humidity",
      value: weather?.humidity || 62,
      unit: "% RH",
      trend: "−4% since morning",
      trendUp: false,
      icon: Droplets,
      explanation: "Below 70% fungal risk threshold. Optimal spray conditions until noon.",
      color: "#38BDF8",
      bg: "bg-blue-950/40 border-blue-800/40",
      ringValue: weather?.humidity || 62,
      ringMax: 100,
      ringColor: "#38BDF8"
    },
    {
      title: "Soil Moisture",
      value: smartIrrigation?.soil_moisture_pct || 68,
      unit: "% VWC",
      trend: "Optimal rhizosphere",
      trendUp: null,
      icon: Layers,
      explanation: "Root zone VWC in 55–75% safe band. No stress. Defer irrigation.",
      color: "#22C55E",
      bg: "bg-emerald-950/40 border-emerald-800/40",
      ringValue: smartIrrigation?.soil_moisture_pct || 68,
      ringMax: 100,
      ringColor: "#22C55E"
    },
    {
      title: "Crop Health Index",
      value: analytics?.soil_health_score || 88,
      unit: "/ 100",
      trend: "+3 pts (Excellent)",
      trendUp: true,
      icon: Sprout,
      explanation: "NDVI 0.78 — vigorous canopy density, strong chlorophyll distribution.",
      color: "#22C55E",
      bg: "bg-emerald-950/40 border-emerald-800/40",
      ringValue: analytics?.soil_health_score || 88,
      ringMax: 100,
      ringColor: "#4ADE80"
    },
    {
      title: "Compound Risk",
      value: 18,
      unit: "/ 100",
      trend: "Low — Safe to operate",
      trendUp: null,
      icon: ShieldCheck,
      explanation: "No active severe pest or flood alerts. All vectors within safe limits.",
      color: "#22C55E",
      bg: "bg-emerald-950/40 border-emerald-800/40",
      ringValue: 18,
      ringMax: 100,
      ringColor: "#22C55E"
    }
  ];

  const moduleTiles = [
    {
      title: "Weather Intelligence",
      icon: CloudRain,
      iconColor: "#38BDF8",
      target: "weather",
      stats: [
        { label: "Wind Speed", value: `${weather?.wind_speed || 9.8} km/h — Safe for spray`, valueColor: "var(--leaf)" },
        { label: "ET₀ Evapotranspiration", value: `${weather?.et0_daily_mm || 4.2} mm/day` },
        { label: "Surface Pressure", value: `${weather?.surface_pressure || 1012} hPa` },
        { label: "Optimal Spray Window", value: "06:00 – 10:30 AM", valueColor: "var(--leaf)" },
      ]
    },
    {
      title: "Disease & Risk Monitor",
      icon: ShieldCheck,
      iconColor: "#22C55E",
      target: "diseaseRisk",
      stats: [
        { label: "Yellow Rust Risk", value: "Low (Safe)", valueColor: "var(--leaf)" },
        { label: "Thermal Stress", value: "Moderate — Mid-day only" },
        { label: "Hydrological Risk", value: "Safe (68% moisture)", valueColor: "var(--leaf)" },
        { label: "Pathogen Vector Index", value: "18 / 100 (Low)", valueColor: "var(--leaf)" },
      ]
    },
    {
      title: "AI Crop Advisor",
      icon: Sprout,
      iconColor: "#4ADE80",
      target: "cropIntelligence",
      stats: [
        { label: "Top Match", value: recommendation?.top_crop || "Wheat (HD-2967)", valueColor: "var(--leaf)" },
        { label: "Suitability Score", value: `${recommendation?.confidence || 94.8}%`, valueColor: "var(--leaf)" },
        { label: "Sowing Window", value: recommendation?.sowing_window || "Late Oct – Mid Nov" },
        { label: "Expected Yield", value: recommendation?.expected_yield || "19–22 Q/Acre" },
      ]
    }
  ];

  return (
    <div className="space-y-5 anim-fade-up">
      {/* ── HERO STATUS BANNER ── */}
      <div
        className="card p-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A1E14 0%, #102518 60%, #0D1F15 100%)", borderColor: "rgba(34,197,94,0.28)" }}
      >
        {/* Background subtle pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
             style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #22C55E 0%, transparent 40%)" }} />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Farm Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="live-dot" />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--leaf)", letterSpacing: "0.12em" }}>
                Live Telemetry Active
              </span>
            </div>
            <h1
              className="text-2xl font-bold tracking-tight mb-1.5 truncate"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-100)" }}
            >
              {farm?.farm_name || "Kisan Adarsh Farm"}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-300)" }}>
                <MapPin className="w-3.5 h-3.5" style={{ color: "var(--leaf)" }} />
                {farm?.location_name || `${farm?.district || "Varanasi"}, ${farm?.state || "Uttar Pradesh"}`}
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-200)" }}>
                <Sprout className="w-3.5 h-3.5" style={{ color: "var(--leaf)" }} />
                {farm?.current_crop || "Wheat"} · {farm?.crop_stage || "Vegetative"} · {farm?.total_area_acres || 4.5} Acres
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-300)" }}>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                {weather?.temperature || 28}°C · {weather?.weather_desc || "Clear Sky"}
              </span>
            </div>
          </div>

          {/* Right: Health Score + CTA */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Ring Health Gauge */}
            <div className="flex flex-col items-center gap-0.5">
              <div className="relative">
                <RingProgress value={healthScore} size={64} strokeWidth={6} color="#22C55E" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold" style={{ color: "#4ADE80" }}>{healthScore}</span>
                </div>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--text-400)" }}>Health</span>
            </div>

            <button
              onClick={onRunAiAnalysis}
              disabled={isAnalyzing}
              className="btn btn-primary px-4 py-2.5 text-sm"
              style={{ minWidth: 145 }}
            >
              <Cpu className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`} />
              {isAnalyzing ? "Analyzing…" : "Run AI Analysis"}
            </button>
          </div>
        </div>
      </div>

      {/* ── AI RECOMMENDATION BANNER ── */}
      <AIBanner
        recommendation={recommendation}
        smartIrrigation={smartIrrigation}
        onNavigate={onNavigate}
      />

      {/* ── 6 KPI CARDS ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="section-label flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" style={{ color: "var(--leaf)" }} />
            Real-Time Environmental & Agronomic Telemetry
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: "var(--leaf)" }}>
            <div className="live-dot" style={{ width: 5, height: 5 }} /> Live
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 anim-stagger">
          {kpis.map(kpi => <KPICard key={kpi.title} {...kpi} />)}
        </div>
      </div>

      {/* ── 3 MODULE QUICK-ACCESS TILES ── */}
      <div>
        <div className="section-label mb-3">Module Quick Access</div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 anim-stagger">
          {moduleTiles.map(tile => (
            <ModuleTile key={tile.title} {...tile} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
}
