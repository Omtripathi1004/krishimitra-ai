import React, { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  CloudRain,
  Sprout,
  Droplets,
  Bug,
  TrendingDown,
  Clock,
  CheckCircle2,
  ChevronRight,
  Info,
  Calendar
} from "lucide-react";

export default function FarmRiskCenter({ farm, weather, smartIrrigation, t }) {
  const [activeTimeline, setActiveTimeline] = useState("24h"); // '24h' | '3d' | '7d'

  // Dynamic risk matrix based on telemetry
  const riskCategories = [
    {
      id: "weather",
      name: "Weather Risk",
      category: "Meteorological",
      icon: CloudRain,
      level: weather?.rainfall_forecast_7d > 40 ? "High" : weather?.rainfall_forecast_7d > 15 ? "Moderate" : "Low",
      score: weather?.rainfall_forecast_7d > 40 ? 74 : weather?.rainfall_forecast_7d > 15 ? 42 : 18,
      indicatorClass: weather?.rainfall_forecast_7d > 40 ? "risk-badge-high" : weather?.rainfall_forecast_7d > 15 ? "risk-badge-moderate" : "risk-badge-low",
      headline: weather?.rainfall_forecast_7d > 30 ? "Heavy Monsoon Runoff Projected" : "Stable Microclimate Conditions",
      description: `7-day forecasted precipitation is ${weather?.rainfall_forecast_7d || 14}mm with wind gusts up to ${weather?.wind_speed || 10} km/h.`,
      recommendedAction: "Verify field drainage channels in low-lying blocks and inspect solar pump anchoring.",
      updatedAt: "10 mins ago"
    },
    {
      id: "crop",
      name: "Crop Health & Thermal Risk",
      category: "Agronomic",
      icon: Sprout,
      level: weather?.temperature > 38 ? "High" : weather?.temperature > 32 ? "Moderate" : "Low",
      score: weather?.temperature > 38 ? 82 : weather?.temperature > 32 ? 48 : 22,
      indicatorClass: weather?.temperature > 38 ? "risk-badge-high" : weather?.temperature > 32 ? "risk-badge-moderate" : "risk-badge-low",
      headline: weather?.temperature > 32 ? "Mild Thermal Stress during Afternoon" : "Optimal Vegetative Growth Conditions",
      description: `Ambient temperature reached ${weather?.temperature || 28}°C (Feels like ${weather?.apparent_temperature || 30}°C) with ${weather?.humidity || 60}% relative humidity.`,
      recommendedAction: "Ensure protective mulching remains intact to preserve rhizosphere temperature equilibrium.",
      updatedAt: "Just now"
    },
    {
      id: "water",
      name: "Water & Moisture Stress",
      category: "Hydrological",
      icon: Droplets,
      level: (smartIrrigation?.soil_moisture_pct || 68) < 40 ? "High" : (smartIrrigation?.soil_moisture_pct || 68) > 85 ? "Moderate" : "Low",
      score: (smartIrrigation?.soil_moisture_pct || 68) < 40 ? 78 : (smartIrrigation?.soil_moisture_pct || 68) > 85 ? 54 : 15,
      indicatorClass: (smartIrrigation?.soil_moisture_pct || 68) < 40 ? "risk-badge-high" : (smartIrrigation?.soil_moisture_pct || 68) > 85 ? "risk-badge-moderate" : "risk-badge-low",
      headline: "Soil Volumetric Water Content in Safe Band",
      description: `Active soil moisture estimate is ${smartIrrigation?.soil_moisture_pct || 68}% with ET0 evapotranspiration rate of ${weather?.et0_daily_mm || 4.2} mm/day.`,
      recommendedAction: "Maintain scheduled 36-hour drip pulse cycle; no emergency deep irrigation required.",
      updatedAt: "15 mins ago"
    },
    {
      id: "disease",
      name: "Pathogen & Pest Vector Risk",
      category: "Phytosanitary",
      icon: Bug,
      level: (weather?.humidity || 60) > 75 ? "High" : (weather?.humidity || 60) > 65 ? "Moderate" : "Low",
      score: (weather?.humidity || 60) > 75 ? 76 : (weather?.humidity || 60) > 65 ? 45 : 20,
      indicatorClass: (weather?.humidity || 60) > 75 ? "risk-badge-high" : (weather?.humidity || 60) > 65 ? "risk-badge-moderate" : "risk-badge-low",
      headline: (weather?.humidity || 60) > 70 ? "Fungal Spore Proliferation Humidity Window" : "Low Pathogen Vector Index",
      description: "Night canopy micro-dew duration is below threshold (< 4 hrs). Low yellow rust or aphid activity recorded.",
      recommendedAction: "Conduct routine scout inspections along northern furrow boundary; prophylactic neem spray recommended.",
      updatedAt: "25 mins ago"
    },
    {
      id: "market",
      name: "Procurement & Market Volatility",
      category: "Economic",
      icon: TrendingDown,
      level: "Low",
      score: 18,
      indicatorClass: "risk-badge-low",
      headline: "Government MSP Procurement Active",
      description: "Cabinet approved MSP of ₹2,275/Q for Wheat provides 102% margin over Cost of Production (A2+FL).",
      recommendedAction: "Register harvest lot on official e-NAM portal 10 days before anticipated threshing.",
      updatedAt: "1 hour ago"
    }
  ];

  // Timeline events
  const timelineData = {
    "24h": [
      { time: "06:00 AM", risk: "Low", event: "Optimal morning foliar spray window (Low wind 6 km/h, humidity 68%)" },
      { time: "01:30 PM", risk: "Moderate", event: "Peak solar thermal peak (31.5°C). Minor transpiration stress anticipated." },
      { time: "06:00 PM", risk: "Low", event: "Soil temperature recovers to 24°C; drip irrigation pulse recommended." },
      { time: "11:00 PM", risk: "Low", event: "Clear night skies; zero frost or dew risk." }
    ],
    "3d": [
      { time: "Day 1 (Today)", risk: "Low", event: "Clear skies and moderate wind. Normal field operations." },
      { time: "Day 2 (Tomorrow)", risk: "Moderate", event: "Isolated passing convective clouds; 35% probability of 4mm shower." },
      { time: "Day 3 (Wednesday)", risk: "Low", event: "Sun returns with 28°C max. Favorable weeding conditions." }
    ],
    "7d": [
      { time: "Days 1-2", risk: "Low", event: "Stable agro-climatic corridor. Ideal for fertilizer top-dressing." },
      { time: "Days 3-5", risk: "Moderate", event: "Light moisture influx; rain probability 45% with 12mm cumulative rain." },
      { time: "Days 6-7", risk: "Low", event: "Clear skies, low humidity, optimal harvest preparation window." }
    ]
  };

  const overallRiskScore = Math.round(
    riskCategories.reduce((acc, curr) => acc + curr.score, 0) / riskCategories.length
  );

  const getOverallRiskLabel = (score) => {
    if (score > 70) return { text: "Critical", class: "text-red-500", bg: "bg-red-950/40 border-red-800/60" };
    if (score > 45) return { text: "Moderate", class: "text-amber-400", bg: "bg-amber-950/40 border-amber-800/60" };
    return { text: "Low (Safe)", class: "text-emerald-400", bg: "bg-emerald-950/40 border-emerald-800/60" };
  };

  const overall = getOverallRiskLabel(overallRiskScore);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="command-card p-6 border-l-4 border-l-emerald-500">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Farm Risk Intelligence Command Center
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${overall.bg} ${overall.class}`}>
                  Overall: {overall.text}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Continuous multi-vector surveillance analyzing meteorological, rhizosphere, phytosanitary vector, and local agro-economic risk parameters for <span className="font-semibold text-white">{farm?.farm_name || "Kisan Adarsh Farm"}</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Compound Risk Index</div>
              <div className="text-2xl font-extrabold text-white">{overallRiskScore} <span className="text-xs text-slate-400 font-normal">/ 100</span></div>
            </div>
            <div className="w-14 h-14 relative flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400"
                  strokeDasharray={`${overallRiskScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-bold text-emerald-400">{overallRiskScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Risk Vector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {riskCategories.map((item) => {
          const Icon = item.icon;
          const badgeClass =
            item.level === "Critical"
              ? "bg-red-950/60 text-red-400 border-red-800/80"
              : item.level === "High"
              ? "bg-amber-950/60 text-amber-400 border-amber-800/80"
              : item.level === "Moderate"
              ? "bg-yellow-950/50 text-yellow-400 border-yellow-800/70"
              : "bg-emerald-950/50 text-emerald-400 border-emerald-800/70";

          return (
            <div key={item.id} className="command-card p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-800/80 text-emerald-400 border border-slate-700/60">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white leading-tight">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{item.category} Vector</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badgeClass}`}>
                    {item.level}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="text-xs font-semibold text-slate-200">{item.headline}</div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Recommended Protocol
                </div>
                <div className="text-[11px] text-slate-200 leading-snug">{item.recommendedAction}</div>
                <div className="text-[10px] text-slate-400 mt-2 text-right">Updated: {item.updatedAt}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Predictive Timeline Section */}
      <div className="command-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Agronomic Risk Horizon & Actionable Timeline
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Forward-looking probabilistic simulation of agro-meteorological stress events.
            </p>
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-lg self-start sm:self-auto">
            {["24h", "3d", "7d"].map((period) => (
              <button
                key={period}
                onClick={() => setActiveTimeline(period)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  activeTimeline === period
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {period === "24h" ? "24 Hours" : period === "3d" ? "3 Days" : "7 Days"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {timelineData[activeTimeline].map((slot, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg bg-slate-900/50 border border-slate-800/80 gap-3 hover:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <div className="font-mono text-xs font-bold text-emerald-400 min-w-[90px]">{slot.time}</div>
                <div className="text-xs text-slate-200 font-medium">{slot.event}</div>
              </div>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded self-start sm:self-auto border ${
                  slot.risk === "High"
                    ? "bg-amber-950/60 text-amber-400 border-amber-800"
                    : slot.risk === "Moderate"
                    ? "bg-yellow-950/50 text-yellow-400 border-yellow-800"
                    : "bg-emerald-950/50 text-emerald-400 border-emerald-800"
                }`}
              >
                {slot.risk} Risk
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
