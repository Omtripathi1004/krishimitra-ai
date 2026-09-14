import React from "react";
import {
  BarChart3,
  TrendingUp,
  Award,
  Droplets,
  Layers,
  Activity,
  CheckCircle2
} from "lucide-react";

export default function FarmAnalytics({ analytics, farm, t }) {
  if (!analytics) {
    return (
      <div className="glass-card p-12 text-center text-xs text-[var(--text-muted)]">
        Loading farm analytics trends...
      </div>
    );
  }

  const soilMetrics = analytics.soil_health?.metrics || [];
  const yieldHistory = analytics.yield_history || [];
  const waterEfficiency = analytics.water_efficiency || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-[var(--border-cyan)]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-[rgba(89,199,177,0.15)] flex items-center justify-center text-[var(--color-rain-glow)] border border-[var(--border-cyan)]">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-[var(--text-primary)]">
              {t.analytics.title}
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{t.analytics.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-[var(--border-cyan)] bg-[#183A2D]/80 px-4 py-2 text-right">
            <div className="telemetry-val text-xl font-mono text-[var(--color-rain-glow)]">
              {analytics.soil_health?.overall_score || 88} <span className="text-xs text-[var(--text-secondary)]">/ 100</span>
            </div>
            <div className="text-[9px] uppercase font-heading font-extrabold text-[var(--text-muted)] tracking-wider">
              {t.analytics.overallHealth}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Soil Health Metrics & Yield Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Soil Health Breakdown */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-[var(--color-rain-glow)]" />
              <h3 className="text-base font-heading font-bold text-[var(--text-primary)]">{t.analytics.soilRadar}</h3>
            </div>
            <span className="text-xs text-[var(--color-rain-glow)] font-mono font-bold">ICAR Optimal Index</span>
          </div>

          <div className="space-y-3 pt-2">
            {soilMetrics.map((m, idx) => (
              <div key={idx} className="space-y-1 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--text-primary)]">{m.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-secondary)]">{m.actual} (Opt: {m.ideal})</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      m.status === "Optimal" || m.status === "Good" || m.status === "Adequate"
                        ? "badge-emerald"
                        : "badge-amber"
                    }`}>
                      {m.status}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-[#183A2D] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--color-monsoon)] to-[var(--color-rain-glow)] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (m.actual / m.ideal) * 85)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Yield Performance vs District Benchmark */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--color-harvest)]" />
              <h3 className="text-base font-heading font-bold text-[var(--text-primary)]">{t.analytics.yieldHistory}</h3>
            </div>
            <span className="text-xs text-[var(--text-secondary)] font-mono">Quintals / Acre</span>
          </div>

          <div className="space-y-4 pt-2">
            {yieldHistory.map((item, idx) => {
              const delta = (item.yield_qtl_acre - item.benchmark).toFixed(1);
              const isPositive = delta >= 0;
              return (
                <div key={idx} className="rounded-xl border border-[var(--border-subtle)] bg-[#183A2D]/70 p-3 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-[var(--text-primary)]">{item.season}</span>
                    <span className={`font-bold ${isPositive ? "text-[var(--color-rain-glow)]" : "text-[var(--color-risk)]"}`}>
                      {isPositive ? `+${delta}` : delta} qtl vs avg
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                    <span>Farm Yield: <strong className="text-[var(--text-primary)]">{item.yield_qtl_acre} qtl/acre</strong></span>
                    <span>District Benchmark: {item.benchmark} qtl/acre</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#183A2D] overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-harvest)] rounded-full"
                      style={{ width: `${Math.min(100, (item.yield_qtl_acre / 30) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Water Application Efficiency Table */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-[var(--color-rain-glow)]" />
            <h3 className="text-base font-heading font-bold text-[var(--text-primary)]">{t.analytics.waterEfficiency}</h3>
          </div>
          <span className="text-xs text-[var(--color-rain-glow)] font-mono">Conservation benchmark</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {waterEfficiency.map((w, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 text-xs font-mono ${
                w.method.includes("Active")
                  ? "border-[var(--border-saffron)] bg-[rgba(226,168,59,0.12)]"
                  : "border-[var(--border-subtle)] bg-[#183A2D]/70"
              }`}
            >
              <div className="font-heading font-bold text-[var(--text-primary)]">{w.method}</div>
              <div className="telemetry-val text-2xl font-mono text-[var(--color-harvest)] mt-2">
                {w.efficiency}
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-1">
                Avg Water Consumed: <span className="text-[var(--text-primary)] font-bold">{w.water_used_m3} m³/qtl</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
