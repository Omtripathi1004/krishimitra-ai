import React, { useState } from "react";
import {
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  Award,
  Layers,
  Info,
  ShieldCheck,
  Cpu
} from "lucide-react";
import confetti from "canvas-confetti";

export default function AICropRecommendation({
  farm,
  weather,
  recommendation,
  onRunPrediction,
  isComputing,
  t
}) {
  const [params, setParams] = useState({
    nitrogen: farm?.nitrogen || 85,
    phosphorus: farm?.phosphorus || 45,
    potassium: farm?.potassium || 40,
    temperature: weather?.temperature || 24.5,
    humidity: weather?.humidity || 62,
    ph: farm?.soil_ph || 6.8,
    rainfall: weather?.rainfall_forecast_7d ? Math.max(30, weather.rainfall_forecast_7d * 5) : 75
  });

  const handleSliderChange = (key, val) => {
    setParams((prev) => ({ ...prev, [key]: parseFloat(val) }));
  };

  const autoFillLiveContext = () => {
    if (farm && weather) {
      setParams({
        nitrogen: farm.nitrogen || 85,
        phosphorus: farm.phosphorus || 45,
        potassium: farm.potassium || 40,
        temperature: weather.temperature || 24.5,
        humidity: weather.humidity || 60,
        ph: farm.soil_ph || 6.8,
        rainfall: weather.rainfall_forecast_7d ? Math.max(35, weather.rainfall_forecast_7d * 6) : 75
      });
    }
  };

  const handleCompute = async () => {
    const result = await onRunPrediction(params);
    if (result && result.suitability >= 75) {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.65 },
          colors: ["#E2A83B", "#59C7B1", "#1E8A78"]
        });
      } catch (e) {
        // Safe fallback
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-[var(--border-cyan)]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-[rgba(89,199,177,0.15)] flex items-center justify-center text-[var(--color-rain-glow)] border border-[var(--border-cyan)]">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-[var(--text-primary)]">
              {t.recommendation.title}
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{t.recommendation.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={autoFillLiveContext}
          className="btn btn-cyan text-xs self-start md:self-auto py-2 px-3.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>{t.recommendation.useLiveContext}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Parameter Controls (5 Cols) */}
        <div className="lg:col-span-5 glass-card p-6 space-y-5">
          <div className="border-b border-[var(--border-subtle)] pb-3">
            <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-rain-glow)]">
              {t.recommendation.paramsHeader}
            </h3>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              Simulate soil fertility and micro-climatic inputs for ML inference.
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Nitrogen */}
            <div>
              <div className="flex justify-between text-[var(--text-secondary)] mb-1 font-semibold">
                <span>Nitrogen (N)</span>
                <span className="text-[var(--color-harvest)] font-bold">{params.nitrogen} kg/ha</span>
              </div>
              <input
                type="range"
                min="10"
                max="140"
                value={params.nitrogen}
                onChange={(e) => handleSliderChange("nitrogen", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Phosphorus */}
            <div>
              <div className="flex justify-between text-[var(--text-secondary)] mb-1 font-semibold">
                <span>Phosphorus (P)</span>
                <span className="text-[var(--color-rain-glow)] font-bold">{params.phosphorus} kg/ha</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={params.phosphorus}
                onChange={(e) => handleSliderChange("phosphorus", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Potassium */}
            <div>
              <div className="flex justify-between text-[var(--text-secondary)] mb-1 font-semibold">
                <span>Potassium (K)</span>
                <span className="text-[var(--color-soil)] font-bold">{params.potassium} kg/ha</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                value={params.potassium}
                onChange={(e) => handleSliderChange("potassium", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Temperature */}
            <div>
              <div className="flex justify-between text-[var(--text-secondary)] mb-1 font-semibold">
                <span>Temperature</span>
                <span className="text-[var(--color-risk)] font-bold">{params.temperature}°C</span>
              </div>
              <input
                type="range"
                min="8"
                max="45"
                step="0.5"
                value={params.temperature}
                onChange={(e) => handleSliderChange("temperature", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Humidity */}
            <div>
              <div className="flex justify-between text-[var(--text-secondary)] mb-1 font-semibold">
                <span>Relative Humidity</span>
                <span className="text-[var(--color-sky)] font-bold">{params.humidity}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={params.humidity}
                onChange={(e) => handleSliderChange("humidity", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Soil pH */}
            <div>
              <div className="flex justify-between text-[var(--text-secondary)] mb-1 font-semibold">
                <span>Soil pH</span>
                <span className="text-[#6EE7B7] font-bold">{params.ph}</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="9.0"
                step="0.1"
                value={params.ph}
                onChange={(e) => handleSliderChange("ph", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Seasonal Rainfall */}
            <div>
              <div className="flex justify-between text-[var(--text-secondary)] mb-1 font-semibold">
                <span>Seasonal Rainfall</span>
                <span className="text-[var(--color-rain-glow)] font-bold">{params.rainfall} mm</span>
              </div>
              <input
                type="range"
                min="20"
                max="280"
                value={params.rainfall}
                onChange={(e) => handleSliderChange("rainfall", e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <button
            onClick={handleCompute}
            disabled={isComputing}
            className="btn btn-primary w-full justify-center py-3 text-sm shadow-xl"
          >
            <Cpu className={`h-4 w-4 ${isComputing ? "animate-spin" : ""}`} />
            <span>{isComputing ? t.recommendation.computing : t.recommendation.calculate}</span>
          </button>
        </div>

        {/* Right Area: Explainable AI Result Card (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {recommendation ? (
            <div className="glass-card-saffron p-6 sm:p-7 space-y-6">
              {/* Top Banner: Crop & Suitability */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(226,168,59,0.2)] pb-5">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-heading font-extrabold uppercase tracking-widest text-[var(--color-harvest)]">
                    <Award className="h-4 w-4" />
                    {t.recommendation.recommendedCrop}
                  </div>
                  <div className="text-3xl sm:text-4xl font-heading font-extrabold text-[var(--text-primary)] mt-1">
                    {recommendation.recommended_crop}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {recommendation.season} Season • {recommendation.crop_description}
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border-saffron)] bg-[rgba(226,168,59,0.15)] p-4 text-center min-w-[110px]">
                  <div className="telemetry-val text-3xl sm:text-4xl font-mono text-[var(--color-harvest)]">
                    {recommendation.suitability}%
                  </div>
                  <div className="text-[9px] uppercase font-heading font-extrabold tracking-wider text-[var(--text-muted)]">
                    {t.recommendation.suitabilityScore}
                  </div>
                </div>
              </div>

              {/* Measured Validation Accuracy */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border-subtle)] bg-[#183A2D]/80 p-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <ShieldCheck className="h-4 w-4 text-[var(--color-rain-glow)]" />
                  <span>{t.recommendation.validationAccuracy}:</span>
                  <span className="font-bold text-[var(--text-primary)]">
                    {recommendation.measured_validation_accuracy}%
                  </span>
                  <span className="text-[11px] text-[var(--text-dim)]">(Random Forest 80/20 Holdout)</span>
                </div>
                <div>
                  Context Fit: <span className="font-bold text-[var(--color-harvest)]">{recommendation.historical_context_fit}</span>
                </div>
              </div>

              {/* Primary Explainable Reason */}
              <div className="rounded-xl border border-[var(--border-saffron)] bg-[rgba(226,168,59,0.08)] p-4">
                <div className="flex items-center gap-2 text-[10px] font-heading font-bold text-[var(--color-harvest)] uppercase tracking-wider mb-1">
                  <Info className="h-3.5 w-3.5" />
                  {t.recommendation.primaryReason}
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                  {recommendation.primary_reason}
                </p>
              </div>

              {/* EXPLAINABLE AI FACTOR MATRIX */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-heading font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    {t.recommendation.explainableFactors}
                  </h4>
                  <span className="text-[11px] text-[var(--text-dim)] font-mono">
                    Agronomic Feature Bounds
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {recommendation.factors?.map((item, idx) => {
                    let badge = "badge badge-emerald";
                    let icon = <CheckCircle2 className="h-3.5 w-3.5 text-[#6EE7B7]" />;
                    if (item.influence === "warning") {
                      badge = "badge badge-rose";
                      icon = <AlertTriangle className="h-3.5 w-3.5 text-[#F87171]" />;
                    } else if (item.influence === "neutral") {
                      badge = "badge badge-amber";
                      icon = <HelpCircle className="h-3.5 w-3.5 text-[var(--color-harvest)]" />;
                    }

                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-[var(--border-subtle)] bg-[#183A2D]/70 p-3 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-[var(--text-primary)]">{item.factor}</span>
                          <span className={badge}>{item.status}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
                          <span>Val: <strong className="text-[var(--text-primary)]">{item.value}</strong></span>
                          <span>Ideal: {item.ideal_range}</span>
                        </div>
                        <div className="mt-1.5 text-[11px] text-[var(--text-secondary)] leading-tight">
                          {item.detail}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Viable Alternatives */}
              {recommendation.alternatives?.length > 0 && (
                <div className="border-t border-[rgba(226,168,59,0.2)] pt-4 space-y-2">
                  <div className="text-xs font-heading font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    {t.recommendation.alternatives}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {recommendation.alternatives.map((alt, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-[var(--border-subtle)] bg-[#183A2D]/60 p-2.5 text-xs font-mono"
                      >
                        <div className="flex justify-between items-center font-bold text-[var(--text-primary)]">
                          <span>{alt.crop}</span>
                          <span className="text-[var(--color-harvest)]">{alt.suitability}%</span>
                        </div>
                        <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">{alt.season}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-4">
              <BrainCircuit className="h-12 w-12 text-[var(--text-dim)]" />
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-heading font-bold text-[var(--text-primary)]">Ready for ML Inference</h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Adjust soil and weather parameters on the left and click Compute Crop Suitability.
                </p>
              </div>
              <button onClick={handleCompute} className="btn btn-primary text-xs py-2 px-4">
                Calculate Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
