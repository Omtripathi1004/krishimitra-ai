import React from "react";
import { Droplets, CloudRain, Sprout, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function TodayFarmActionCard({ actionData, weatherData, t, onNavigateToIrrigation }) {
  if (!actionData) return null;

  const irrigationStatus = actionData.irrigation || "Wait";
  
  // Status styling matching NovaVarsha neon badges
  let statusBadgeClass = "neon-badge-cyan";
  let statusText = t.todayFarmAction.wait;
  if (irrigationStatus === "Recommended" || irrigationStatus === "Irrigate Now") {
    statusBadgeClass = "neon-badge-saffron animate-pulse";
    statusText = irrigationStatus === "Irrigate Now" ? t.todayFarmAction.irrigateNow : t.todayFarmAction.recommended;
  } else if (irrigationStatus === "Moderate") {
    statusBadgeClass = "neon-badge-gold";
    statusText = t.todayFarmAction.moderate;
  }

  return (
    <div className="glass-card-saffron p-6 sm:p-7 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-[rgba(226,168,59,0.12)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-[rgba(89,199,177,0.12)] blur-3xl" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(226,168,59,0.2)] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(226,168,59,0.2)] text-[var(--color-harvest)] border border-[var(--border-saffron)] shadow-[0_0_15px_rgba(226,168,59,0.2)] font-black text-xl">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight text-[var(--text-primary)]">
                {t.todayFarmAction.title}
              </h2>
              <span className="neon-badge neon-badge-emerald py-0.5 px-2 text-[10px]">
                <ShieldCheck className="h-3 w-3" />
                {t.todayFarmAction.liveVerified}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Farm + Location + Weather + Soil + Crop Context → AI Recommendation → Action
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToIrrigation}
          className="btn-cyan text-xs py-2 px-3.5"
        >
          <span>Irrigation Intelligence</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 4 Pillars Grid with NovaVarsha Styling */}
      <div className="relative z-10 mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Irrigation Decision */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[#183A2D]/70 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-heading font-bold text-[var(--text-muted)] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5 text-[var(--color-rain-glow)]" />
              {t.todayFarmAction.irrigation}
            </span>
          </div>
          <div className="mt-3">
            <span className={statusBadgeClass}>
              <span className="neon-dot neon-dot-saffron" />
              {statusText}
            </span>
          </div>
          <p className="mt-2.5 text-xs text-[var(--text-secondary)] leading-relaxed">
            {irrigationStatus === "Wait"
              ? "Moisture storage stable. Natural replenishment expected."
              : "Active evapotranspiration deficit. Water cycle recommended."}
          </p>
        </div>

        {/* 2. Rain Expectation */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[#183A2D]/70 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-heading font-bold text-[var(--text-muted)] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <CloudRain className="h-3.5 w-3.5 text-[var(--color-sky)]" />
              {t.todayFarmAction.rainExpectation}
            </span>
          </div>
          <div className="telemetry-val text-2xl font-mono mt-2 text-[var(--color-rain-glow)]">
            {actionData.rain_expectation || "0.0 mm"}
          </div>
          <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
            Open-Meteo precipitation projection
          </p>
        </div>

        {/* 3. Crop Condition */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[#183A2D]/70 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-heading font-bold text-[var(--text-muted)] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sprout className="h-3.5 w-3.5 text-[var(--color-harvest)]" />
              {t.todayFarmAction.cropCondition}
            </span>
          </div>
          <div className="mt-2 text-sm font-heading font-bold text-[var(--text-primary)]">
            {actionData.crop_condition || "Optimal Growing Environment"}
          </div>
          <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
            Thermal and moisture comfort bounds satisfied
          </p>
        </div>

        {/* 4. Recommended Action */}
        <div className="rounded-xl border border-[var(--border-saffron)] bg-[rgba(226,168,59,0.08)] p-4 shadow-[0_0_15px_rgba(226,168,59,0.1)]">
          <div className="flex items-center justify-between text-xs font-heading font-bold text-[var(--color-harvest)] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <ArrowRight className="h-3.5 w-3.5" />
              {t.todayFarmAction.nextAction}
            </span>
          </div>
          <div className="mt-2 text-xs sm:text-sm font-semibold text-[var(--text-primary)] leading-relaxed">
            {actionData.next_action || "Maintain regular visual pest scouting and soil moisture monitoring."}
          </div>
        </div>
      </div>
    </div>
  );
}
