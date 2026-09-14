import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Award,
  Droplets,
  Layers,
  Activity,
  CheckCircle2,
  Calendar,
  Filter,
  ArrowUpRight,
  HelpCircle,
  Sparkles,
  Percent,
  Sliders
} from "lucide-react";

export default function FarmAnalytics({ analytics, farm, t }) {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "soil" | "yield" | "efficiency"

  if (!analytics) {
    return (
      <div className="card p-12 text-center text-sm text-[var(--text-muted)] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
        <span>Aggregating longitudinal agro-analytics and ICAR benchmark datasets...</span>
      </div>
    );
  }

  const soilMetrics = analytics.soil_health?.metrics || [
    { name: "Nitrogen (N)", actual: 85, ideal: 100, unit: "kg/ha", status: "Optimal" },
    { name: "Phosphorus (P)", actual: 42, ideal: 50, unit: "kg/ha", status: "Optimal" },
    { name: "Potassium (K)", actual: 180, ideal: 200, unit: "kg/ha", status: "Optimal" },
    { name: "Organic Carbon", actual: 0.65, ideal: 0.75, unit: "%", status: "Good" },
    { name: "Soil pH", actual: 6.8, ideal: 7.0, unit: "pH", status: "Ideal" },
    { name: "Cation Exchange", actual: 24, ideal: 25, unit: "meq/100g", status: "Optimal" }
  ];

  const yieldHistory = analytics.yield_history || [
    { season: "Kharif 2024", yield_qtl_acre: 24.5, benchmark: 21.0, crop: "Paddy" },
    { season: "Rabi 2023-24", yield_qtl_acre: 22.8, benchmark: 19.5, crop: "Wheat" },
    { season: "Kharif 2023", yield_qtl_acre: 23.2, benchmark: 20.2, crop: "Paddy" },
    { season: "Rabi 2022-23", yield_qtl_acre: 21.0, benchmark: 18.8, crop: "Wheat" }
  ];

  const waterEfficiency = analytics.water_efficiency || [
    { method: "Drip Irrigation (Active)", efficiency: "88%", water_used_m3: "310", savings: "+32%" },
    { method: "Sprinkler Irrigation", efficiency: "74%", water_used_m3: "420", savings: "+18%" },
    { method: "Furrow / Border Strip", efficiency: "58%", water_used_m3: "560", savings: "Baseline" },
    { method: "Flood Irrigation (Traditional)", efficiency: "42%", water_used_m3: "780", savings: "-28%" }
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="card p-5 sm:p-6 border-l-4 border-l-[var(--harvest)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--harvest)]/10 text-[var(--harvest)] border border-[var(--harvest)]/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                {t?.analytics?.title || "Longitudinal Farm Analytics"}
                <span className="badge badge-emerald text-xs">ICAR Certified</span>
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Yield trends, soil chemistry benchmarks, and water-nutrient productivity diagnostics for{" "}
                <strong className="text-white">{farm?.farm_name || "Primary Holding"}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation Filter Tabs */}
          <div className="flex items-center gap-1 bg-[var(--surface-2)] p-1 rounded-xl border border-[var(--border)]">
            {[
              { id: "overview", label: "Executive Summary" },
              { id: "soil", label: "Soil Chemistry" },
              { id: "yield", label: "Yield Benchmarks" },
              { id: "efficiency", label: "Resource Efficiency" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Soil Health Index</span>
            <Layers className="w-4 h-4 text-[var(--leaf)]" />
          </div>
          <div className="stat-value text-2xl font-bold text-white mt-1">
            {analytics.soil_health?.overall_score || 88} <span className="text-sm font-normal text-[var(--text-muted)]">/ 100</span>
          </div>
          <div className="stat-meta text-xs text-[var(--leaf)] flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +4.2 pts vs district avg
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Average Yield</span>
            <Award className="w-4 h-4 text-[var(--harvest)]" />
          </div>
          <div className="stat-value text-2xl font-bold text-[var(--harvest)] mt-1">
            23.6 <span className="text-sm font-normal text-[var(--text-muted)]">qtl/acre</span>
          </div>
          <div className="stat-meta text-xs text-[var(--leaf)] flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +16.2% above baseline
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Water Efficiency</span>
            <Droplets className="w-4 h-4 text-[var(--sky)]" />
          </div>
          <div className="stat-value text-2xl font-bold text-[var(--sky)] mt-1">
            88%
          </div>
          <div className="stat-meta text-xs text-[var(--leaf)] flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> 310 m³/qtl target met
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Input Optimization</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="stat-value text-2xl font-bold text-white mt-1">
            ₹3,450 <span className="text-sm font-normal text-[var(--text-muted)]">/acre saved</span>
          </div>
          <div className="stat-meta text-xs text-[var(--text-secondary)] mt-1">
            Fertilizer & diesel reduction
          </div>
        </div>
      </div>

      {/* Main Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Soil Chemistry & Macro-Nutrient Balance (Radar / Horizontal Bars) */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[var(--leaf)]" />
              <div>
                <h3 className="text-base font-bold text-white">Soil Chemistry & Nutrient Balance</h3>
                <p className="text-xs text-[var(--text-secondary)]">Longitudinal soil testing comparison with ICAR standards</p>
              </div>
            </div>
            <span className="badge badge-emerald text-xs">Fertile Loam</span>
          </div>

          <div className="space-y-4 pt-2">
            {soilMetrics.map((m, idx) => {
              const ratio = Math.min(100, Math.round((m.actual / m.ideal) * 100));
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{m.name}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[var(--text-secondary)]">
                        {m.actual} / {m.ideal} {m.unit || ""}
                      </span>
                      <span className="badge badge-emerald text-[10px] py-0.5 px-2">
                        {m.status || "Optimal"}
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[var(--surface-2)] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--leaf)] rounded-full transition-all duration-700"
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] text-xs text-[var(--text-secondary)] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[var(--leaf)] flex-shrink-0 mt-0.5" />
            <span>
              <strong>Agronomist Observation:</strong> Soil pH at 6.8 is within the peak phosphorus availability window (6.5 - 7.2). Organic carbon at 0.65% reflects good green manuring practices.
            </span>
          </div>
        </div>

        {/* Panel 2: Longitudinal Yield History vs Regional Benchmark */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[var(--harvest)]" />
              <div>
                <h3 className="text-base font-bold text-white">Yield Performance vs District Average</h3>
                <p className="text-xs text-[var(--text-secondary)]">Quintals per acre comparison across the past 4 crop cycles</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[var(--harvest)]" /> Farm Yield
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[var(--text-muted)]" /> District Avg
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {yieldHistory.map((item, idx) => {
              const delta = (item.yield_qtl_acre - item.benchmark).toFixed(1);
              const maxScale = 30; // maximum quintals for visualization scale
              const farmWidth = Math.min(100, (item.yield_qtl_acre / maxScale) * 100);
              const benchWidth = Math.min(100, (item.benchmark / maxScale) * 100);

              return (
                <div key={idx} className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      {item.season}
                      <span className="text-[11px] font-normal text-[var(--text-muted)]">({item.crop})</span>
                    </span>
                    <span className="font-mono font-bold text-[var(--leaf)]">
                      +{delta} qtl/acre (+{Math.round((delta / item.benchmark) * 100)}%)
                    </span>
                  </div>

                  {/* Dual Bar Comparison */}
                  <div className="space-y-1.5 text-[11px] font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-[var(--text-muted)]">Farm:</span>
                      <div className="flex-1 h-2 rounded-full bg-[var(--surface)] overflow-hidden">
                        <div
                          className="h-full bg-[var(--harvest)] rounded-full transition-all duration-500"
                          style={{ width: `${farmWidth}%` }}
                        />
                      </div>
                      <span className="w-16 text-right font-bold text-white">{item.yield_qtl_acre} qtl</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-16 text-[var(--text-muted)]">District:</span>
                      <div className="flex-1 h-2 rounded-full bg-[var(--surface)] overflow-hidden">
                        <div
                          className="h-full bg-[var(--text-muted)]/40 rounded-full transition-all duration-500"
                          style={{ width: `${benchWidth}%` }}
                        />
                      </div>
                      <span className="w-16 text-right text-[var(--text-secondary)]">{item.benchmark} qtl</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] text-xs text-[var(--text-secondary)]">
            Consistently outperforming district benchmarks due to precision nutrient timing and drip fertigation scheduling.
          </div>
        </div>
      </div>

      {/* Water & Irrigation Method Efficiency Comparison Matrix */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-[var(--sky)]" />
            <div>
              <h3 className="text-base font-bold text-white">Irrigation Technology Water Productivity Matrix</h3>
              <p className="text-xs text-[var(--text-secondary)]">Conservation efficiency and volume consumed per quintal output</p>
            </div>
          </div>
          <span className="badge badge-sky text-xs">PMMY Micro-Irrigation Benchmark</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {waterEfficiency.map((w, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border transition-all ${
                w.method.includes("Active")
                  ? "border-[var(--primary)] bg-[var(--primary)]/10 shadow-md"
                  : "border-[var(--border)] bg-[var(--surface-2)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{w.method}</span>
                {w.method.includes("Active") && (
                  <span className="badge badge-emerald text-[10px]">Your System</span>
                )}
              </div>

              <div className="text-3xl font-bold font-mono text-[var(--sky)] mt-3">
                {w.efficiency}
              </div>

              <div className="space-y-1 mt-2 text-xs font-mono">
                <div className="text-[var(--text-secondary)]">
                  Water: <strong className="text-white">{w.water_used_m3} m³/qtl</strong>
                </div>
                <div className="text-[var(--leaf)] font-semibold">
                  Benefit: {w.savings}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
