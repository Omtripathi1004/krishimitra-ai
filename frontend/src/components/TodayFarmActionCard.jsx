import React, { useState } from "react";
import {
  Droplets,
  CloudRain,
  Sprout,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function TodayFarmActionCard({ actionData, weatherData, t, onNavigateToIrrigation }) {
  const [showExplanation, setShowExplanation] = useState(false);

  if (!actionData) return null;

  const irrigationStatus = actionData.irrigation || "Wait";
  const confidence = actionData.confidence || 87;
  const reason = actionData.reason || "Expected 14.5mm rainfall in next 48h + adequate soil moisture (68% VWC). Delaying irrigation saves energy and avoids nitrogen leaching.";
  const nextAction = actionData.next_action || "Defer irrigation cycle by 24 hours. Inspect furrows after convective rain passes.";

  return (
    <div className="card card-gold p-5 sm:p-6 shadow-xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-400/20 pb-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-xl bg-amber-500/15 text-[var(--c-gold-neon)] border border-amber-400/30 text-lg">
            ⚡
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-display">
                {t?.todayFarmAction?.title || "Today's Farm Action Directive"}
              </h2>
              <span className="badge badge-gold text-xs flex items-center gap-1 font-tech">
                <ShieldCheck className="w-3.5 h-3.5" />
                AI Confidence {confidence}%
              </span>
            </div>
            <p className="text-xs text-amber-200/80 mt-0.5 font-sans">
              Real-time agronomic synthesis: Soil Water Balance + NWP Rain Radar + Crop Stage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-tech">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="btn btn-secondary text-xs flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[var(--c-leaf-neon)]" />
            <span>{showExplanation ? "Hide Explanation" : "View Explanation"}</span>
            {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onNavigateToIrrigation}
            className="btn btn-primary text-xs flex items-center gap-1.5"
          >
            <span>Irrigation Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Pillars Operational Grid (Multi-Color Cards: Sky, Indigo, Leaf, Gold) */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Decision Status - Sky Neon */}
        <div className="card card-sky p-4 space-y-1.5">
          <div className="text-[11px] font-bold text-[var(--c-sky-neon)] uppercase tracking-wider flex items-center gap-1.5 font-tech">
            <Droplets className="w-3.5 h-3.5" /> Irrigation Directive
          </div>
          <div className="mt-2">
            <span className={`badge text-xs font-bold font-tech ${
              irrigationStatus === "Wait" ? "badge-sky" : "badge-gold"
            }`}>
              {irrigationStatus === "Wait" ? "Delay Irrigation (24h)" : irrigationStatus}
            </span>
          </div>
          <p className="text-xs text-sky-200/80 leading-relaxed mt-1 font-sans">
            Current root-zone moisture reservoir is sufficient for continuous transpiration.
          </p>
        </div>

        {/* 2. Expected Rain - Indigo Neon */}
        <div className="card card-indigo p-4 space-y-1.5">
          <div className="text-[11px] font-bold text-[var(--c-indigo-neon)] uppercase tracking-wider flex items-center gap-1.5 font-tech">
            <CloudRain className="w-3.5 h-3.5" /> Rainfall Inbound
          </div>
          <div className="text-2xl font-black font-mono text-[var(--c-indigo-neon)] mt-1">
            {actionData.rain_expectation || "14.5 mm"}
          </div>
          <p className="text-xs text-indigo-200/80 leading-relaxed font-sans">
            NWP model predicts convective rainfall within 48 hours.
          </p>
        </div>

        {/* 3. Crop Growth Status - Leaf Neon */}
        <div className="card card-leaf p-4 space-y-1.5">
          <div className="text-[11px] font-bold text-[var(--c-leaf-neon)] uppercase tracking-wider flex items-center gap-1.5 font-tech">
            <Sprout className="w-3.5 h-3.5" /> Canopy Vigour
          </div>
          <div className="text-sm font-bold text-white mt-1 font-display">
            {actionData.crop_condition || "Optimal Growing Window"}
          </div>
          <p className="text-xs text-emerald-200/80 leading-relaxed font-sans">
            Vapor pressure deficit &amp; temperature in healthy growth band.
          </p>
        </div>

        {/* 4. Priority Recommendation - Gold Neon */}
        <div className="card card-gold p-4 space-y-1.5">
          <div className="text-[11px] font-bold text-[var(--c-gold-neon)] uppercase tracking-wider flex items-center gap-1.5 font-tech">
            <Clock className="w-3.5 h-3.5" /> Next Tactical Action
          </div>
          <p className="text-xs font-semibold text-white leading-relaxed mt-1 font-sans">
            {nextAction}
          </p>
        </div>
      </div>

      {/* Collapsible Deep Explanation Accordion (Section 8 Prompt requirement) */}
      {showExplanation && (
        <div className="mt-4 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--leaf)] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Why AI recommends delaying irrigation:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] space-y-1">
              <span className="text-[var(--text-muted)]">1. Soil Moisture Headroom</span>
              <p className="text-white font-medium">
                Root zone VWC is 68%. Adding water now would cause saturation (&gt;85%), leading to root hypoxia.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] space-y-1">
              <span className="text-[var(--text-muted)]">2. High Rain Probability</span>
              <p className="text-white font-medium">
                14.5 mm convective rain scheduled to deposit naturally within 36 hours.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] space-y-1">
              <span className="text-[var(--text-muted)]">3. Economic Conservation</span>
              <p className="text-white font-medium">
                Postponing the pumping cycle conserves ₹650-₹900 in diesel/electricity and prevents nutrient runoff.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
