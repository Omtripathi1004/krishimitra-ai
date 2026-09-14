import React, { useState, useEffect } from "react";
import {
  Thermometer,
  CloudRain,
  Droplets,
  Sprout,
  ShieldCheck,
  Sparkles,
  MapPin,
  Layers,
  ChevronRight,
  Cpu,
  Info,
  Wind,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Activity,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Calendar,
  Sliders,
  Navigation as CompassIcon,
  Zap,
  Flame,
  Award
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
      if (start >= t) {
        setValue(t);
        clearInterval(id);
      } else {
        setValue(parseFloat(start.toFixed(1)));
      }
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return value;
}

/* ── Ring Progress Component ── */
function RingProgress({ value, max = 100, size = 56, strokeWidth = 5.5, color = "#22C55E" }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const progress = circ * (1 - Math.min(value, max) / max);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${circ - progress} ${progress}`}
        style={{
          transition: "stroke-dasharray 0.6s cubic-bezier(0.34,1.56,0.64,1)",
          filter: `drop-shadow(0 0 6px ${color}80)`
        }}
      />
    </svg>
  );
}

/* ── Vibrant Multi-Colored KPI Card ── */
function KPICard({
  title,
  value,
  unit,
  trend,
  trendUp,
  icon: Icon,
  explanation,
  cardTheme, // "gold" | "sky" | "indigo" | "leaf" | "pink"
  color,
  ringValue,
  ringMax,
  ringColor
}) {
  const animated = useCountUp(value);
  const isPositive = trendUp === true;
  const isNegative = trendUp === false;

  const themeClasses = {
    gold: "card-gold border-[rgba(245,158,11,0.4)]",
    sky: "card-sky border-[rgba(56,189,248,0.4)]",
    indigo: "card-indigo border-[rgba(99,102,241,0.4)]",
    leaf: "card-leaf border-[rgba(34,197,94,0.4)]",
    pink: "card-pink border-[rgba(244,63,94,0.4)]"
  }[cardTheme || "leaf"];

  const labelColorClass = {
    gold: "text-gold-neon",
    sky: "text-sky-neon",
    indigo: "text-indigo-neon",
    leaf: "text-leaf-neon",
    pink: "text-pink-neon"
  }[cardTheme || "leaf"];

  return (
    <div className={`p-4.5 rounded-2xl flex flex-col justify-between gap-3 transition-all duration-200 hover:-translate-y-1 ${themeClasses}`}>
      {/* Header Row */}
      <div className="flex items-start justify-between">
        <div>
          <div className={`section-eyebrow mb-1.5 flex items-center gap-1.5 ${labelColorClass}`}>
            <span>{title}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-mono font-extrabold tracking-tight"
              style={{
                fontSize: "2.1rem",
                color: color || "var(--text-100)",
                textShadow: `0 0 16px ${color}50`
              }}
            >
              {Number.isInteger(parseFloat(value)) ? Math.round(animated) : animated}
            </span>
            <span className="text-xs font-bold text-slate-300 font-mono">{unit}</span>
          </div>
        </div>

        {ringValue !== undefined ? (
          <div className="relative">
            <RingProgress value={ringValue} max={ringMax || 100} size={56} color={ringColor || color} />
            <div
              className="absolute inset-0 flex items-center justify-center text-[11px] font-mono font-extrabold"
              style={{ color: ringColor || color }}
            >
              {ringValue}%
            </div>
          </div>
        ) : (
          <div
            className="p-2.5 rounded-xl border shadow-sm flex items-center justify-center"
            style={{
              background: `${color}18`,
              borderColor: `${color}40`,
              color: color
            }}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Trend Badge */}
      {trend && (
        <div className="flex items-center gap-1.5 text-xs font-bold">
          {isPositive && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
          {isNegative && <TrendingDown className="w-3.5 h-3.5 text-rose-400" />}
          <span className={isPositive ? "text-emerald-300 font-bold" : isNegative ? "text-rose-300 font-bold" : "text-slate-300"}>
            {trend}
          </span>
        </div>
      )}

      {/* Explanation */}
      <div className="text-[11px] leading-relaxed border-t border-white/10 pt-2 text-slate-300">
        {explanation}
      </div>
    </div>
  );
}

/* ── Multi-Colored Subsystem Module Tile ── */
function ModuleTile({ title, eyebrow, icon: Icon, theme, stats, onNavigate, target }) {
  const themeCardClass = {
    sky: "card-sky hover:border-sky-400",
    indigo: "card-indigo hover:border-indigo-400",
    pink: "card-pink hover:border-rose-400",
    gold: "card-gold hover:border-amber-400"
  }[theme || "sky"];

  const themeTextColor = {
    sky: "text-sky-light",
    indigo: "text-indigo-light",
    pink: "text-pink-light",
    gold: "text-gold-amber"
  }[theme || "sky"];

  const iconColor = {
    sky: "#38BDF8",
    indigo: "#818CF8",
    pink: "#FB7185",
    gold: "#FCD34D"
  }[theme || "sky"];

  return (
    <div className={`p-5 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 ${themeCardClass}`}>
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2.5 rounded-xl border flex items-center justify-center shadow-md"
              style={{ background: `${iconColor}20`, borderColor: `${iconColor}45` }}
            >
              <Icon className="w-4 h-4" style={{ color: iconColor }} />
            </div>
            <div>
              <span className={`section-eyebrow block ${themeTextColor}`}>{eyebrow}</span>
              <h3 className="text-sm font-extrabold text-white font-display tracking-tight">{title}</h3>
            </div>
          </div>

          <button
            onClick={() => onNavigate(target)}
            className="flex items-center gap-1 text-xs font-bold text-white hover:underline transition-all group"
          >
            <span>Launch</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="space-y-2 pt-1">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0">
              <span className="text-slate-300 font-medium">{s.label}:</span>
              <span className="font-bold text-white font-mono" style={{ color: s.valueColor || "#FFFFFF" }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── AI Recommendation Banner (Vibrant Pink & Golden Theme) ── */
function AIBanner({ recommendation, smartIrrigation, onNavigate }) {
  const [expanded, setExpanded] = useState(false);

  const irrData = smartIrrigation?.irrigation_data || smartIrrigation || {};
  const isWait = irrData.status === "Wait" || !irrData.status;

  return (
    <div className="p-6 rounded-3xl relative overflow-hidden card-pink border-l-4 border-l-rose-500 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-rose-400/40 bg-rose-950/40 text-rose-300 shadow-lg shadow-rose-900/30">
            <Sparkles className="w-6 h-6 text-rose-300 animate-pulse" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="badge badge-pink text-xs">
                ⚡ CRITICAL AI DIRECTIVE
              </span>
              <span className="badge badge-gold text-xs">
                AI Confidence: 87%
              </span>
              <span className="badge badge-sky text-xs">
                NWP Radar + Hydrology
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-white font-display tracking-tight leading-snug mb-1.5">
              {isWait
                ? "Hold Scheduled Irrigation Cycle by 24–36 Hours"
                : "Initiate Scheduled Micro-Emitter Cycle"}
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
              <strong className="text-rose-300 font-bold">Agronomic Rationale:</strong> 14.5 mm convective precipitation inbound over the next 48h while root-zone moisture is already at an optimal <strong className="text-sky-300">68% VWC</strong>. Deferring the solar/grid pumping cycle conserves <strong className="text-amber-300">₹850 in energy</strong> and prevents soil nitrogen leaching.
            </p>

            {expanded && (
              <div className="mt-4 p-4 rounded-2xl bg-black/50 border border-white/10 text-xs space-y-2.5">
                <div className="font-bold text-white flex items-center gap-2 font-display">
                  <Info className="w-4 h-4 text-rose-400" />
                  <span>Decisional Parameter Contribution Matrix:</span>
                </div>
                {[
                  { factor: "Rhizosphere Storage", val: "68% VWC (Optimal 55–75% band)", badge: "Safe Buffer", color: "#38BDF8" },
                  { factor: "Forecast Rain Radar", val: "14.5mm rain expected in Day 2 window (35% prob)", badge: "Delay Cycle", color: "#818CF8" },
                  { factor: "Crop Water Need (ETc)", val: "1.36 mm/day (Wheat tillering stage Kc = 0.85)", badge: "Low Demand", color: "#FB7185" },
                  { factor: "Economic Return", val: "320 m³ water conserved • ₹850 tariff avoided", badge: "+Savings", color: "#FCD34D" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/10 last:border-0">
                    <span className="text-slate-300 font-medium">{item.factor}:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{item.val}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${item.color}25`, color: item.color }}>
                        {item.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-bold text-rose-300 hover:text-rose-200 mt-2 flex items-center gap-1 cursor-pointer"
            >
              {expanded ? "Hide Detailed Scientific Matrix ↑" : "Inspect Detailed Scientific Matrix →"}
            </button>
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate("smartIrrigation")}
            className="btn btn-primary text-xs py-2.5 px-4 shadow-lg flex items-center gap-2"
          >
            <Droplets className="w-4 h-4" />
            <span>Open Irrigation Simulator</span>
          </button>
          <button
            onClick={() => onNavigate("cropIntelligence")}
            className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Crop Advisor</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── IMPROVISED MULTI-COLORED INTERACTIVE GRAPHS SECTION ── */
function DashboardGraphsSection({ weather, analytics, smartIrrigation, onNavigate }) {
  const [graphTab, setGraphTab] = useState("weatherTrajectory"); // "weatherTrajectory" | "soilChemistry"

  // 7-day weather trend points
  const forecastDays = weather?.forecast_days || [
    { day: "Mon", temp_max: 31, temp_min: 21, rain_prob: 5, condition: "Sunny" },
    { day: "Tue", temp_max: 30, temp_min: 20, rain_prob: 35, condition: "Rain Inbound" },
    { day: "Wed", temp_max: 29, temp_min: 19, rain_prob: 50, condition: "Showers" },
    { day: "Thu", temp_max: 31, temp_min: 22, rain_prob: 15, condition: "Partly Cloudy" },
    { day: "Fri", temp_max: 32, temp_min: 23, rain_prob: 10, condition: "Sunny" },
    { day: "Sat", temp_max: 30, temp_min: 21, rain_prob: 5, condition: "Clear" },
    { day: "Sun", temp_max: 29, temp_min: 20, rain_prob: 0, condition: "Sunny" }
  ];

  // Soil Macronutrient data
  const nutrients = [
    { name: "Nitrogen (N)", actual: 85, ideal: 100, unit: "kg/ha", theme: "sky", color: "#38BDF8", label: "Vegetative Growth" },
    { name: "Phosphorus (P)", actual: 42, ideal: 50, unit: "kg/ha", theme: "gold", color: "#F59E0B", label: "Root Biomass" },
    { name: "Potassium (K)", actual: 180, ideal: 200, unit: "kg/ha", theme: "pink", color: "#FB7185", label: "Disease Immunity" },
    { name: "Soil pH", actual: 6.8, ideal: 7.0, unit: "pH", theme: "leaf", color: "#4ADE80", label: "Neutral Fertility" }
  ];

  return (
    <div className="space-y-4">
      {/* Section Header with Multi-Color Eye-Catching Typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="section-eyebrow text-gold-neon flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Interactive Dynamic Visualizations & Telemetry Curves</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-tight mt-0.5">
            Agro-Meteorological Trajectory & Soil Nutrient Chemistry
          </h2>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setGraphTab("weatherTrajectory")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              graphTab === "weatherTrajectory"
                ? "bg-sky-500 text-black shadow-md font-extrabold"
                : "text-slate-300 hover:text-white"
            }`}
          >
            🌦️ 7-Day Microclimate Graph
          </button>
          <button
            onClick={() => setGraphTab("soilChemistry")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              graphTab === "soilChemistry"
                ? "bg-amber-400 text-black shadow-md font-extrabold"
                : "text-slate-300 hover:text-white"
            }`}
          >
            🧪 Soil NPK Chemistry
          </button>
        </div>
      </div>

      {/* GRAPH 1: 7-DAY TEMPERATURE & RAINFALL DUAL-AXIS VISUALIZER */}
      {graphTab === "weatherTrajectory" && (
        <div className="card-sky p-6 rounded-3xl border border-sky-500/40 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white font-display">
                  7-Day Thermal & Precipitation Curve (Open-Meteo NWP Radar)
                </h3>
                <p className="text-xs text-sky-200">
                  Dual-parameter visualization: High/Low Temperatures (°C) vs Rainfall Probability (%)
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" /> Max Temp (°C)
              </span>
              <span className="flex items-center gap-1.5 text-sky-300">
                <span className="w-3 h-3 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50" /> Min Temp (°C)
              </span>
              <span className="flex items-center gap-1.5 text-indigo-300">
                <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-indigo-600 to-sky-400" /> Rain Prob (%)
              </span>
            </div>
          </div>

          {/* Dynamic Interactive Chart Bars & Curve Grid */}
          <div className="grid grid-cols-7 gap-2.5 pt-3">
            {forecastDays.map((day, idx) => {
              const rainHeight = Math.max(12, day.rain_prob * 1.5);
              const isHighRain = day.rain_prob >= 35;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-between border transition-all duration-200 hover:-translate-y-1 ${
                    isHighRain
                      ? "bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-950/40"
                      : "bg-slate-900/60 border-slate-800 hover:border-sky-500/40"
                  }`}
                >
                  <span className="text-xs font-bold text-white font-tech uppercase tracking-wider mb-2">
                    {day.day}
                  </span>

                  {/* Temperature Pill */}
                  <div className="text-center my-1">
                    <span className="text-sm font-extrabold font-mono text-amber-300 block">
                      {day.temp_max}°C
                    </span>
                    <span className="text-[11px] font-mono text-sky-300">
                      {day.temp_min}°C
                    </span>
                  </div>

                  {/* Rain Probability Visual Bar */}
                  <div className="w-full flex flex-col items-center my-3">
                    <div className="w-full h-24 bg-slate-950/70 rounded-xl border border-white/5 flex items-end justify-center p-1 relative overflow-hidden">
                      <div
                        className="w-full rounded-lg chart-bar-sky transition-all duration-500 relative"
                        style={{ height: `${rainHeight}%` }}
                      >
                        {day.rain_prob > 20 && (
                          <span className="absolute top-1 left-0 right-0 text-center text-[9px] font-mono font-extrabold text-black">
                            {day.rain_prob}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-300 font-semibold text-center line-clamp-1">
                    {day.condition}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-sky-200 border-t border-white/10 font-mono">
            <span>⚡ Inbound Rainfall Peak: Day 2–3 (14.5mm convective replenishment)</span>
            <button
              onClick={() => onNavigate("weather")}
              className="text-white hover:underline font-bold flex items-center gap-1"
            >
              <span>Explore Detailed Radar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* GRAPH 2: SOIL MACRONUTRIENT RADAR & HORIZONTAL MULTI-COLOR BARS */}
      {graphTab === "soilChemistry" && (
        <div className="card-gold p-6 rounded-3xl border border-amber-500/40 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white font-display">
                  Soil Chemistry Macronutrients (NPK + pH Balance)
                </h3>
                <p className="text-xs text-amber-200">
                  Precision laboratory soil test metrics vs ICAR optimum vegetative thresholds
                </p>
              </div>
            </div>
            <span className="badge badge-gold text-xs">Fertile Loam Profile</span>
          </div>

          {/* 4 Multi-Colored Nutrient Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {nutrients.map((n, i) => {
              const pct = Math.min(100, Math.round((n.actual / n.ideal) * 100));
              return (
                <div key={i} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-sm text-white font-display block">
                        {n.name}
                      </span>
                      <span className="text-[11px] text-slate-300">{n.label}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-sm font-extrabold" style={{ color: n.color }}>
                        {n.actual} <span className="text-xs text-slate-400 font-normal">{n.unit}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 block">Target: {n.ideal} {n.unit}</span>
                    </div>
                  </div>

                  {/* Colored Meter Bar */}
                  <div className="h-3 w-full rounded-full bg-slate-800 border border-white/10 overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-700 shadow-lg"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${n.color}80, ${n.color})`
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <span>Index: {pct}% of optimal</span>
                    <span className="font-bold text-emerald-400">✓ In Safe Range</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-amber-200 border-t border-white/10 font-mono">
            <span>🌾 Optimal NPK ratio balance (4:2:1 equivalent) for current wheat vegetative stage</span>
            <button
              onClick={() => onNavigate("cropIntelligence")}
              className="text-white hover:underline font-bold flex items-center gap-1"
            >
              <span>View Crop Fertilizer Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── MAIN DASHBOARD ── */
export default function Dashboard({
  farm,
  weather,
  smartIrrigation,
  recommendation,
  analytics,
  t,
  onRunAiAnalysis,
  isAnalyzing,
  onNavigate
}) {
  const healthScore = analytics?.soil_health_score || 88;

  // 6 Multi-Colored Distinct KPI Cards
  const kpis = [
    {
      title: "Microclimate Temp",
      value: weather?.temperature || 28.4,
      unit: "°C",
      trend: "+1.2°C from dawn",
      trendUp: null,
      icon: Thermometer,
      explanation: "Within the 20–35°C optimal vegetative band. No active thermal stress.",
      cardTheme: "gold",
      color: "#FCD34D",
      ringValue: undefined
    },
    {
      title: "7-Day Precipitation",
      value: weather?.rainfall_forecast_7d || 14.5,
      unit: "mm",
      trend: "35% rain prob Day 2",
      trendUp: null,
      icon: CloudRain,
      explanation: "Light convective showers forecast. Sufficient natural recharge.",
      cardTheme: "sky",
      color: "#38BDF8",
      ringValue: undefined
    },
    {
      title: "Atmospheric Humidity",
      value: weather?.humidity || 62,
      unit: "% RH",
      trend: "−4% since morning",
      trendUp: false,
      icon: Droplets,
      explanation: "Below 70% fungal foliar hazard threshold. Safe for morning spraying.",
      cardTheme: "indigo",
      color: "#818CF8",
      ringValue: weather?.humidity || 62,
      ringMax: 100,
      ringColor: "#818CF8"
    },
    {
      title: "Root-Zone Moisture",
      value: smartIrrigation?.soil_moisture_pct || 68,
      unit: "% VWC",
      trend: "Ideal Rhizosphere",
      trendUp: true,
      icon: Layers,
      explanation: "Root zone VWC in 55–75% safe buffer. Defer scheduled pumping.",
      cardTheme: "leaf",
      color: "#4ADE80",
      ringValue: smartIrrigation?.soil_moisture_pct || 68,
      ringMax: 100,
      ringColor: "#4ADE80"
    },
    {
      title: "Canopy Vigour Index",
      value: analytics?.soil_health_score || 88,
      unit: "/ 100",
      trend: "+3 pts (Excellent)",
      trendUp: true,
      icon: Sprout,
      explanation: "NDVI 0.78 — robust biomass cover and high chlorophyll reflectance.",
      cardTheme: "gold",
      color: "#FBBF24",
      ringValue: analytics?.soil_health_score || 88,
      ringMax: 100,
      ringColor: "#FBBF24"
    },
    {
      title: "Compound Pest Risk",
      value: 18,
      unit: "/ 100",
      trend: "Low — Safe to cultivate",
      trendUp: null,
      icon: ShieldCheck,
      explanation: "No active critical blight or rust vectors. Safe physiological growth.",
      cardTheme: "pink",
      color: "#FB7185",
      ringValue: 18,
      ringMax: 100,
      ringColor: "#FB7185"
    }
  ];

  // 4 Multi-Colored Subsystem Module Tiles
  const moduleTiles = [
    {
      title: "Smart Irrigation",
      eyebrow: "HYDROLOGY COMMAND",
      icon: Droplets,
      theme: "sky",
      target: "smartIrrigation",
      stats: [
        { label: "Action", value: "HOLD (Rain Inbound)", valueColor: "#38BDF8" },
        { label: "Root VWC", value: "68% (Optimal)", valueColor: "#4ADE80" },
        { label: "Water Need", value: "1.36 mm/day", valueColor: "#FFFFFF" },
        { label: "Cost Saved", value: "₹850 / 320 m³", valueColor: "#FCD34D" }
      ]
    },
    {
      title: "Weather Intelligence",
      eyebrow: "NWP RADAR SUITE",
      icon: CloudRain,
      theme: "indigo",
      target: "weather",
      stats: [
        { label: "Wind Velocity", value: "9.8 km/h (Safe)", valueColor: "#4ADE80" },
        { label: "ET₀ Evaporation", value: "4.2 mm/day", valueColor: "#A5B4FC" },
        { label: "Atm. Pressure", value: "1012 hPa", valueColor: "#FFFFFF" },
        { label: "Spray Window", value: "06:00 – 10:30 AM", valueColor: "#38BDF8" }
      ]
    },
    {
      title: "Pest & Disease Risk",
      eyebrow: "PATHOGEN MONITOR",
      icon: ShieldCheck,
      theme: "pink",
      target: "diseaseRisk",
      stats: [
        { label: "Yellow Rust", value: "Low (Safe)", valueColor: "#4ADE80" },
        { label: "Thermal Stress", value: "Mid-day Only", valueColor: "#FCD34D" },
        { label: "Soil Hypoxia", value: "None (Aerate)", valueColor: "#4ADE80" },
        { label: "Risk Score", value: "18 / 100 (Safe)", valueColor: "#FB7185" }
      ]
    },
    {
      title: "AI Crop Advisor",
      eyebrow: "AGRONOMY MODEL",
      icon: Sprout,
      theme: "gold",
      target: "cropIntelligence",
      stats: [
        { label: "Top Recommendation", value: recommendation?.top_crop || "Wheat (PBW-343)", valueColor: "#FCD34D" },
        { label: "Suitability Score", value: `${recommendation?.confidence || 94.8}%`, valueColor: "#4ADE80" },
        { label: "Sowing Window", value: "Late Oct – Mid Nov", valueColor: "#FFFFFF" },
        { label: "Yield Potential", value: "19–22 Q/Acre", valueColor: "#FCD34D" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* ── HERO STATUS BANNER ── */}
      <div className="card-leaf p-6 rounded-3xl relative overflow-hidden shadow-2xl border border-emerald-500/30">
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Farm Info with Outfit Headline Typography */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="section-eyebrow text-emerald-300">
                LIVE PRECISION SATELLITE & SENSOR TELEMETRY
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display truncate">
              {farm?.farm_name || "Kisan Adarsh Farm Holding"}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs">
              <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <strong className="text-white">{farm?.location_name || "Ludhiana, Punjab, India"}</strong>
              </span>
              <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>
                  {farm?.current_crop || "Wheat"} ({farm?.crop_stage || "Vegetative / Tillering"}) • {farm?.area_acres || 5.0} Acres
                </span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-300 font-bold font-mono">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>{weather?.temperature || 28.4}°C • Mainly Clear</span>
              </span>
            </div>
          </div>

          {/* Right: Health Score Gauge + Actions */}
          <div className="flex items-center gap-5 shrink-0">
            <div className="flex flex-col items-center">
              <div className="relative">
                <RingProgress value={healthScore} size={68} strokeWidth={6} color="#4ADE80" />
                <div className="absolute inset-0 flex items-center justify-center font-mono font-extrabold text-base text-emerald-300">
                  {healthScore}
                </div>
              </div>
              <span className="text-[10px] font-tech uppercase tracking-widest text-slate-300 mt-1 font-bold">
                Health Score
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={onRunAiAnalysis}
                disabled={isAnalyzing}
                className="btn btn-primary px-4 py-2 text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <Cpu className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`} />
                <span>{isAnalyzing ? "Computing..." : "Run AI Analysis"}</span>
              </button>
              <button
                onClick={() => onNavigate("smartIrrigation")}
                className="btn btn-secondary px-4 py-2 text-xs flex items-center justify-center gap-1.5"
              >
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>Smart Irrigation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── AI RECOMMENDATION DIRECTIVE BANNER ── */}
      <AIBanner
        recommendation={recommendation}
        smartIrrigation={smartIrrigation}
        onNavigate={onNavigate}
      />

      {/* ── 6 DISTINCT MULTI-COLORED KPI CARDS ── */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <span className="section-eyebrow text-sky-light flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <span>Hyperlocal Meteorological & Rhizosphere Telemetry</span>
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Telemetry Feed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi) => (
            <KPICard key={kpi.title} {...kpi} />
          ))}
        </div>
      </div>

      {/* ── IMPROVISED MULTI-COLORED INTERACTIVE GRAPHS & CHARTS SECTION ── */}
      <DashboardGraphsSection
        weather={weather}
        analytics={analytics}
        smartIrrigation={smartIrrigation}
        onNavigate={onNavigate}
      />

      {/* ── SOIL MOISTURE HYDROLOGY STRIP PREVIEW (LIGHT BLUE TO INDIGO GRADIENT) ── */}
      <div className="card-sky p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl border border-sky-500/40">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-md">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-white font-display">
                Root-Zone Soil Moisture Storage: 68% VWC
              </h3>
              <span className="badge badge-sky text-xs">Safe Moisture Band</span>
            </div>
            <p className="text-xs text-sky-200 mt-0.5">
              Refill threshold is 55% VWC. Available moisture sustains wheat root-zone transpiration for the next 72 hours.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 shrink-0">
          <div className="w-40 h-3 rounded-full bg-slate-950 border border-white/10 overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-emerald-400 to-indigo-500 rounded-full"
              style={{ width: "68%" }}
            />
          </div>
          <button
            onClick={() => onNavigate("smartIrrigation")}
            className="btn btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow"
          >
            <span>Open Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── 4 MULTI-COLORED MODULE QUICK-ACCESS TILES ── */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <span className="section-eyebrow text-gold-neon">Agricultural Subsystem Commands</span>
          <span className="text-xs text-slate-300">Direct Navigation</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {moduleTiles.map((tile) => (
            <ModuleTile key={tile.title} {...tile} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
}
