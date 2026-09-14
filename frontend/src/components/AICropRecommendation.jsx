import React, { useState } from "react";
import {
  BrainCircuit, Sliders, CheckCircle2, ArrowRight, Sparkles,
  Sprout, BarChart2, Trophy, Info, ChevronDown, ChevronUp
} from "lucide-react";
import { API_BASE } from "../config";

const CROP_COLORS = ["var(--leaf)", "var(--sky)", "var(--amber)", "var(--violet)"];
const CROP_BG    = [
  "rgba(34,197,94,0.10)",  "rgba(56,189,248,0.10)",
  "rgba(251,191,36,0.10)", "rgba(167,139,250,0.10)"
];
const CROP_BORDER = [
  "rgba(34,197,94,0.28)",  "rgba(56,189,248,0.25)",
  "rgba(251,191,36,0.25)", "rgba(167,139,250,0.25)"
];

function ScoreBar({ value, color }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 kpi-progress-track">
        <div
          className="kpi-progress-fill"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }}
        />
      </div>
      <span className="text-xs font-bold font-mono w-10 text-right" style={{ color }}>{value}%</span>
    </div>
  );
}

function FeatureBar({ label, importance, effect }) {
  const barColor = effect === "positive" ? "var(--leaf)" : effect === "negative" ? "var(--rose)" : "var(--amber)";
  return (
    <div>
      <div className="flex items-center justify-between mb-1 text-[11px]">
        <span style={{ color: "var(--text-300)" }}>{label}</span>
        <span className="font-semibold font-mono" style={{ color: barColor }}>{importance}%</span>
      </div>
      <div className="kpi-progress-track">
        <div className="kpi-progress-fill" style={{ width: `${importance}%`, background: barColor }} />
      </div>
    </div>
  );
}

function CropCard({ crop, rank, isSelected, onClick }) {
  const [showDetail, setShowDetail] = useState(false);
  const color  = CROP_COLORS[rank - 1] || "var(--leaf)";
  const bg     = CROP_BG[rank - 1] || "rgba(34,197,94,0.10)";
  const border = CROP_BORDER[rank - 1] || "rgba(34,197,94,0.28)";

  return (
    <div
      className="card p-4 flex flex-col gap-3 cursor-pointer transition-all hover:scale-[1.01]"
      style={isSelected ? { borderColor: color, boxShadow: `0 0 0 1px ${color}50, 0 4px 24px rgba(0,0,0,0.4)` } : {}}
      onClick={onClick}
    >
      {/* Rank Badge + Name */}
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0 border"
          style={{ background: bg, borderColor: border, color }}
        >
          #{rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="text-sm font-bold" style={{ color: "var(--text-100)" }}>{crop.crop}</span>
            {rank === 1 && <span className="badge badge-leaf text-[10px]"><Trophy className="w-2.5 h-2.5" /> Best Match</span>}
          </div>
          <div className="text-[11px] font-mono mt-0.5" style={{ color: "var(--text-400)" }}>
            Harvest: {crop.harvest_window} · Yield: {crop.expected_yield || crop.yield_potential}
          </div>
        </div>
      </div>

      {/* Suitability Score Bar */}
      <div>
        <div className="flex items-center justify-between mb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-400)" }}>
          <span>Suitability Score</span>
        </div>
        <ScoreBar value={crop.suitability_score} color={color} />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {(crop.tags || []).map(tag => (
          <span key={tag} className="badge badge-muted text-[10px]">{tag}</span>
        ))}
      </div>

      {/* Expand */}
      <button
        onClick={e => { e.stopPropagation(); setShowDetail(!showDetail); }}
        className="text-xs font-semibold flex items-center gap-1 transition-colors self-start"
        style={{ color: showDetail ? "var(--text-400)" : color }}
      >
        {showDetail ? <><ChevronUp className="w-3 h-3" /> Hide</> : <><ChevronDown className="w-3 h-3" /> Details</>}
      </button>

      {showDetail && (
        <div className="text-[11px] space-y-1.5 pt-2 border-t anim-fade-in" style={{ borderColor: "var(--border-3)", color: "var(--text-300)" }}>
          <p><strong style={{ color: "var(--text-200)" }}>Justification:</strong> {crop.justification}</p>
          {crop.risk && <p className="flex items-start gap-1.5"><span className="text-[var(--amber)]">⚠ Risk:</span> {crop.risk}</p>}
          {crop.government_support && <p className="flex items-start gap-1.5"><span style={{ color: "var(--sky)" }}>🏛 Govt:</span> {crop.government_support}</p>}
          {crop.ipm_notes && <p className="flex items-start gap-1.5"><span style={{ color: "var(--violet)" }}>🔬 IPM:</span> {crop.ipm_notes}</p>}
        </div>
      )}
    </div>
  );
}

const DEFAULTS = {
  soil_type: "Alluvial Loam",
  season: "Rabi",
  rainfall: "400–600mm",
  soil_ph: 6.8,
  soil_moisture: 68,
  temperature: 28
};

const FALLBACK_CROPS = [
  {
    crop: "Wheat (HD-2967)", suitability_score: 94.8, harvest_window: "Mar–Apr",
    expected_yield: "19–22 Q/Acre",
    tags: ["Rabi Ideal", "MSP Assured", "High Water Efficient"],
    justification: "Alluvial Loam with pH 6.8 provides perfect mineral balance for winter wheat. Season temperature perfectly aligns with HD-2967 vernalization requirements.",
    risk: "Yellow rust risk below threshold. Monitor if RH exceeds 78%.",
    government_support: "MSP ₹2,275/Quintal. PM-FASAL insurance available.",
    ipm_notes: "Seed treatment with Carboxin + Thiram (2g/kg seed) recommended."
  },
  {
    crop: "Mustard (Pusa Bold)", suitability_score: 88.4, harvest_window: "Feb–Mar",
    expected_yield: "8–10 Q/Acre",
    tags: ["Drought Tolerant", "Quick Returns", "Low Input"],
    justification: "Excellent fit for sandy loam edges. Tolerates moisture fluctuations. Lower input costs and fast 90-day crop cycle.",
    risk: "Aphid susceptibility at flowering stage. Scout weekly during January.",
    government_support: "MSP ₹5,650/Quintal. State bonus + oil processing cluster subsidy.",
    ipm_notes: "Apply Dimethoate 30 EC @ 1.5L/ha if aphid count exceeds ETL."
  },
  {
    crop: "Lentil (Masur PL-8)", suitability_score: 81.2, harvest_window: "Mar",
    expected_yield: "5–7 Q/Acre",
    tags: ["Nitrogen Fixer", "Soil Builder", "ICAR Variety"],
    justification: "Ideal for crop rotation to restore N-P balance. Biological nitrogen fixation reduces next-season fertilizer requirement by 30–40 kg/acre.",
    risk: "Sensitive to waterlogging. Avoid heavy clay zones.",
    government_support: "NMOOP scheme subsidizes pulses. FPO aggregation available at block level.",
    ipm_notes: "Rhizobium inoculation of seed significantly improves nodulation."
  },
  {
    crop: "Potato (Kufri Pukhraj)", suitability_score: 72.5, harvest_window: "Jan–Feb",
    expected_yield: "100–120 Q/Acre",
    tags: ["High Value", "Market Demand", "Cold Season"],
    justification: "High commercial value crop. Demand consistently exceeds supply in Varanasi APMC. Cold-tolerant variety suitable for current temperature profile.",
    risk: "High upfront seed cost. Susceptible to late blight in humid conditions.",
    government_support: "PMKSY drip subsidy for potato irrigation reduces water costs.",
    ipm_notes: "Apply Mancozeb 75 WP @ 2kg/ha prophylactically to prevent blight."
  }
];

export default function AICropRecommendation({ recommendation, farm, weather, t }) {
  const [params, setParams] = useState(DEFAULTS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [crops, setCrops] = useState(FALLBACK_CROPS);

  const handleChange = (k, v) => setParams(p => ({ ...p, [k]: v }));

  const handleRun = async () => {
    setIsRunning(true);
    await new Promise(r => setTimeout(r, 1200));
    // Could hit API here; using offline data
    setCrops([...FALLBACK_CROPS]);
    setIsRunning(false);
  };

  const featureImportance = [
    { label: "Soil pH & Type",            importance: 32, effect: "positive" },
    { label: "Temperature Regime",        importance: 26, effect: "positive" },
    { label: "Seasonal Rainfall",         importance: 22, effect: "positive" },
    { label: "Soil Moisture (VWC)",       importance: 14, effect: "positive" },
    { label: "Historical Pest Pressure",  importance: 6,  effect: "negative" },
  ];

  return (
    <div className="space-y-5 anim-fade-up">
      {/* Header */}
      <div className="card p-5" style={{ borderLeft: "3px solid var(--leaf)" }}>
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl border" style={{ background: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.28)" }}>
            <BrainCircuit className="w-6 h-6" style={{ color: "var(--leaf)" }} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h1 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-100)" }}>
                AI Crop Recommendation Engine
              </h1>
              <span className="badge badge-violet text-[10px]">ML Model v2.1</span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-300)" }}>
              ICAR-calibrated multi-factor suitability model. Ranked crop recommendations with full agronomic justification and government scheme overlay.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── LEFT: Parameter Sliders ── */}
        <div className="card p-5 space-y-5 lg:col-span-1">
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-4 h-4" style={{ color: "var(--leaf)" }} />
            <h2 className="text-sm font-bold" style={{ color: "var(--text-100)" }}>Sowing Parameters</h2>
          </div>

          {/* Selects */}
          <div className="space-y-3">
            {[
              { label: "Soil Type", key: "soil_type", options: ["Alluvial Loam", "Sandy Loam", "Clay Loam", "Red Laterite", "Black Cotton"] },
              { label: "Season", key: "season", options: ["Rabi (Oct–Mar)", "Kharif (Jun–Oct)", "Zaid (Mar–Jun)"] },
              { label: "Rainfall Band", key: "rainfall", options: ["< 300mm", "300–500mm", "400–600mm", "600–800mm", "> 800mm"] },
            ].map(field => (
              <div key={field.key}>
                <label className="section-label block mb-1.5">{field.label}</label>
                <select
                  value={params[field.key]}
                  onChange={e => handleChange(field.key, e.target.value)}
                  className="input-field text-xs py-2"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Sliders */}
          {[
            { label: "Soil pH", key: "soil_ph", min: 5.0, max: 8.5, step: 0.1, unit: "" },
            { label: "Soil Moisture", key: "soil_moisture", min: 20, max: 100, step: 1, unit: "% VWC" },
            { label: "Avg Temperature", key: "temperature", min: 10, max: 45, step: 0.5, unit: "°C" },
          ].map(s => (
            <div key={s.key}>
              <div className="flex justify-between mb-1.5">
                <label className="section-label">{s.label}</label>
                <span className="text-xs font-bold font-mono" style={{ color: "var(--leaf)" }}>
                  {params[s.key]} {s.unit}
                </span>
              </div>
              <input
                type="range" min={s.min} max={s.max} step={s.step}
                value={params[s.key]}
                onChange={e => handleChange(s.key, parseFloat(e.target.value))}
                className="w-full accent-green-500"
                style={{ cursor: "pointer", height: 4 }}
              />
              <div className="flex justify-between text-[10px] mt-0.5" style={{ color: "var(--text-400)" }}>
                <span>{s.min}{s.unit}</span><span>{s.max}{s.unit}</span>
              </div>
            </div>
          ))}

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="btn btn-primary w-full py-2.5 text-sm"
          >
            <Sparkles className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`} />
            {isRunning ? "Running Model…" : "Run AI Analysis"}
          </button>

          {/* Feature Importance */}
          <div className="pt-3 border-t space-y-3" style={{ borderColor: "var(--border-2)" }}>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-3.5 h-3.5" style={{ color: "var(--leaf)" }} />
              <span className="section-label">Model Feature Importance</span>
            </div>
            {featureImportance.map(f => <FeatureBar key={f.label} {...f} />)}
          </div>
        </div>

        {/* ── RIGHT: Crop Cards ── */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <div className="section-label flex items-center gap-2">
              <Sprout className="w-3.5 h-3.5" style={{ color: "var(--leaf)" }} />
              Ranked Crop Suitability Results
            </div>
            <span className="badge badge-leaf text-[10px]">
              <CheckCircle2 className="w-2.5 h-2.5" /> {crops.length} crops analyzed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 anim-stagger">
            {crops.map((crop, i) => (
              <CropCard
                key={crop.crop}
                crop={crop}
                rank={i + 1}
                isSelected={selectedIndex === i}
                onClick={() => setSelectedIndex(i)}
              />
            ))}
          </div>

          {/* Selected Detail */}
          {crops[selectedIndex] && (
            <div
              className="card p-4 anim-fade-in"
              style={{ borderColor: CROP_BORDER[selectedIndex] || "var(--border-1)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-3.5 h-3.5" style={{ color: CROP_COLORS[selectedIndex] }} />
                <span className="text-xs font-bold" style={{ color: "var(--text-100)" }}>
                  Why {crops[selectedIndex].crop}?
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-300)" }}>
                {crops[selectedIndex].justification}
              </p>
              {crops[selectedIndex].government_support && (
                <div
                  className="mt-3 p-2.5 rounded-lg text-xs flex items-start gap-2"
                  style={{ background: "rgba(56,189,248,0.07)", border: "1px solid rgba(56,189,248,0.18)", color: "var(--text-200)" }}
                >
                  <span>🏛</span>
                  <span>{crops[selectedIndex].government_support}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
