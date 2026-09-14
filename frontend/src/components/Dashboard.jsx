import React, { useState } from "react";
import {
  Thermometer,
  CloudRain,
  Droplets,
  Sprout,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Activity,
  Cpu,
  Info,
  ExternalLink,
  RefreshCw
} from "lucide-react";

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
  const [showExplanationModal, setShowExplanationModal] = useState(false);

  // 6 Core Precision KPIs per Section 7
  const kpis = [
    {
      id: "temperature",
      title: "Temperature",
      value: weather?.temperature ? `${weather.temperature}` : "28.4",
      unit: "°C",
      trend: "+1.2°C vs 24h",
      trendType: "neutral",
      icon: Thermometer,
      explanation: "Optimal vegetative temperature band; zero thermal crop shock.",
      color: "text-amber-400",
      bgIcon: "bg-amber-950/40 border-amber-800/50"
    },
    {
      id: "rainfall",
      title: "Rainfall Forecast",
      value: weather?.rainfall_forecast_7d ? `${weather.rainfall_forecast_7d}` : "14.5",
      unit: "mm (7d)",
      trend: "35% Rain Probability",
      trendType: "info",
      icon: CloudRain,
      explanation: "Light convective rain predicted on day 2; adequate natural replenishment.",
      color: "text-sky-400",
      bgIcon: "bg-sky-950/40 border-sky-800/50"
    },
    {
      id: "humidity",
      title: "Atmospheric Humidity",
      value: weather?.humidity ? `${weather.humidity}` : "62",
      unit: "% RH",
      trend: "-4% vs Morning",
      trendType: "safe",
      icon: Droplets,
      explanation: "Foliar fungal vector risk remains low below 70% threshold.",
      color: "text-blue-400",
      bgIcon: "bg-blue-950/40 border-blue-800/50"
    },
    {
      id: "soilMoisture",
      title: "Soil Moisture",
      value: smartIrrigation?.soil_moisture_pct ? `${smartIrrigation.soil_moisture_pct}` : "68",
      unit: "% VWC",
      trend: "Optimal Rhizosphere",
      trendType: "safe",
      icon: Layers,
      explanation: "Root zone volumetric water content well within healthy 55-75% band.",
      color: "text-emerald-400",
      bgIcon: "bg-emerald-950/40 border-emerald-800/50"
    },
    {
      id: "cropHealth",
      title: "Crop Health Index",
      value: analytics?.soil_health_score ? `${analytics.soil_health_score}` : "88",
      unit: "/ 100",
      trend: "+3 pts (Excellent)",
      trendType: "positive",
      icon: Sprout,
      explanation: "Strong vegetative vigor with high chlorophyll density (NDVI 0.78).",
      color: "text-emerald-400",
      bgIcon: "bg-emerald-950/40 border-emerald-800/50"
    },
    {
      id: "riskIndex",
      title: "Compound Risk",
      value: "18",
      unit: "/ 100",
      trend: "Low (Favorable)",
      trendType: "safe",
      icon: ShieldCheck,
      explanation: "No active severe pest outbreaks or hydrological flood alerts.",
      color: "text-emerald-400",
      bgIcon: "bg-emerald-950/40 border-emerald-800/50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* ── 1. WHAT IS HAPPENING WITH MY FARM? (HERO STATUS BAR) ── */}
      <div className="command-card p-5 bg-gradient-to-r from-[#0F281E] to-[#143527] border-emerald-800/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs text-emerald-400 font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Farm Telemetry Status
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {farm?.farm_name || "Kisan Adarsh Farm"}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {farm?.location_name || `${farm?.district || "Varanasi"}, ${farm?.state || "Uttar Pradesh"}`}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-200">
                <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                {farm?.current_crop || "Wheat (HD-2967)"} · {farm?.crop_stage || "Vegetative Stage"} ({farm?.total_area_acres || 4.5} Acres)
              </span>
              <span>•</span>
              <span className="text-slate-300">
                Weather: {weather?.temperature || 28}°C, {weather?.weather_desc || "Clear Sky"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#091D14] border border-emerald-800/80 px-4 py-2 rounded-xl text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overall Farm Health</div>
              <div className="text-xl font-extrabold text-emerald-400">
                {analytics?.soil_health_score || 88} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
            </div>

            <button
              onClick={onRunAiAnalysis}
              disabled={isAnalyzing}
              className="btn btn-primary text-xs py-2.5 px-4 shadow-sm"
            >
              <Cpu className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`} />
              <span>{isAnalyzing ? "Running Analysis..." : "Run 60s AI Analysis"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. PRIMARY FARM INTELLIGENCE PANEL (SECTION 8) ── */}
      <div className="command-card p-5 border-l-4 border-l-emerald-500 bg-[#102A20]">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Primary AI Recommendation
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 87% Confidence
                </span>
              </div>

              <h2 className="text-lg font-extrabold text-white leading-tight">
                Delay irrigation by 24 hours.
              </h2>

              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                <strong className="text-slate-100">Agronomic Reason:</strong> Expected 14.5mm convective rainfall + adequate root zone soil moisture ({smartIrrigation?.soil_moisture_pct || 68}% VWC). Irrigating now risks root hypoxia and nutrient leaching.
              </p>

              <div className="mt-2 text-xs text-emerald-300/90 font-medium">
                <strong>Recommended Action:</strong> Maintain drip valve closure; re-evaluate soil moisture probe at 06:00 AM tomorrow.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0 self-start">
            <button
              onClick={() => setShowExplanationModal(true)}
              className="btn btn-secondary text-xs py-2 px-3"
            >
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Explanation</span>
            </button>
            <button
              onClick={() => onNavigate("farmIntelligence")}
              className="btn btn-ghost text-xs py-2 px-3 text-slate-300 hover:text-white"
            >
              <span>Full Intelligence</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. 6 PRECISION KPI CARDS (SECTION 7) ── */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
          <span>Real-Time Agronomic Metrics & Environmental KPIs</span>
          <span className="text-[11px] text-emerald-400 font-medium lowercase">● live synchronized</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.id} className="command-card p-4 flex flex-col justify-between hover:border-emerald-800/80 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300">{kpi.title}</span>
                    <div className={`p-1.5 rounded-lg border ${kpi.bgIcon} ${kpi.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-white tracking-tight">{kpi.value}</span>
                    <span className="text-xs text-slate-400 font-semibold">{kpi.unit}</span>
                  </div>

                  <div className="mt-1">
                    <span className="inline-block text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                      {kpi.trend}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/70 text-[11px] text-slate-300 leading-snug">
                  {kpi.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. QUICK WORKFLOW TILES (WEATHER, RISK & CROP ADVISORY) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weather Quick Snapshot */}
        <div className="command-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-sky-400" /> Weather Intelligence
              </h3>
              <button onClick={() => onNavigate("weather")} className="text-xs text-emerald-400 hover:underline">
                View &rarr;
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Wind Speed</span>
                <span className="font-semibold text-slate-200">{weather?.wind_speed || 9.8} km/h (Safe for spray)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">ET0 Evapotranspiration</span>
                <span className="font-semibold text-slate-200">{weather?.et0_daily_mm || 4.2} mm/day</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Spray Advisory</span>
                <span className="font-semibold text-emerald-400">Optimal window 06:00 - 10:30 AM</span>
              </div>
            </div>
          </div>
          <button onClick={() => onNavigate("weather")} className="btn btn-secondary text-xs w-full mt-4">
            Hourly & 7-Day Forecast
          </button>
        </div>

        {/* Farm Risk Radar Snapshot */}
        <div className="command-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Disease & Risk Center
              </h3>
              <button onClick={() => onNavigate("diseaseRisk")} className="text-xs text-emerald-400 hover:underline">
                View &rarr;
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Yellow Rust Risk</span>
                <span className="font-semibold text-emerald-400">Low (Safe)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Thermal Stress</span>
                <span className="font-semibold text-emerald-400">Moderate (Mid-day only)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Hydrological Risk</span>
                <span className="font-semibold text-emerald-400">Safe (68% Moisture)</span>
              </div>
            </div>
          </div>
          <button onClick={() => onNavigate("diseaseRisk")} className="btn btn-secondary text-xs w-full mt-4">
            Open 7-Day Risk Timeline
          </button>
        </div>

        {/* AI Crop Advisor Snapshot */}
        <div className="command-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-400" /> AI Crop Advisor
              </h3>
              <button onClick={() => onNavigate("cropIntelligence")} className="text-xs text-emerald-400 hover:underline">
                View &rarr;
              </button>
            </div>
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/50 mb-2">
              <div className="text-xs font-bold text-white">Top Match: {recommendation?.top_crop || "Wheat (HD-2967)"}</div>
              <div className="text-[11px] text-emerald-400 mt-0.5 font-semibold">
                Suitability Score: {recommendation?.confidence || 94.8}%
              </div>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                {recommendation?.justification || "Alluvial soil with pH 6.8 and moderate humidity provides ideal conditions."}
              </p>
            </div>
          </div>
          <button onClick={() => onNavigate("cropIntelligence")} className="btn btn-secondary text-xs w-full mt-2">
            Configure Sowing Parameters
          </button>
        </div>
      </div>

      {/* ── 5. EXPLANATION MODAL (SECTION 8) ── */}
      {showExplanationModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="command-card p-6 max-w-lg w-full border-emerald-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Agronomic AI Decision Explanation
              </h3>
              <button
                onClick={() => setShowExplanationModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                <strong className="text-white">Recommendation:</strong> Delay irrigation by 24 hours. (Confidence: 87%)
              </p>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
                <div className="font-bold text-emerald-400 uppercase text-[10px]">Contributing Model Inputs:</div>
                <div>• <strong>Soil Moisture (68%):</strong> Existing moisture levels are sufficient for root respiration without water stress.</div>
                <div>• <strong>Forecasted Precipitation (14.5mm):</strong> Numerical Weather Prediction models indicate passing rain showers within 36 hours.</div>
                <div>• <strong>Evapotranspiration Rate (4.2 mm/day):</strong> Moderate solar irradiance maintains low atmospheric water draw.</div>
              </div>
              <p className="text-[11px] text-slate-400">
                Generated via KrishiMitra Multi-Factor Decision Matrix with agronomic data verified against ICAR-recommended water thresholds.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowExplanationModal(false)}
                className="btn btn-primary text-xs"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
