import React from "react";
import {
  Sparkles, ArrowRight, Droplets, Sprout, Wind, Sun,
  ShieldCheck, Activity, Layers, MapPin, Cpu, BarChart2,
  TrendingUp, ThermometerSun, Leaf, Zap
} from "lucide-react";
import TodayFarmActionCard from "./TodayFarmActionCard";

function MetricPod({ label, value, sub, accent, icon: Icon, badge, badgeClass }) {
  return (
    <div className={`metric-card metric-card-${accent}`}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className={`stat-icon-wrap stat-icon-${accent}`}>
          <Icon style={{ width: 18, height: 18 }} />
        </div>
        {badge
          ? <span className={`neon-badge ${badgeClass || "neon-badge-cyan"}`}>{badge}</span>
          : <span className={`neon-dot neon-dot-${accent}`} />
        }
      </div>
      <div>
        <div style={{ fontSize: "0.62rem", fontFamily: "var(--font-heading)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: `var(--color-${accent === "saffron" ? "harvest" : accent === "cyan" ? "rain-glow" : accent === "emerald" ? "monsoon" : "ai"})`, marginBottom: "0.3rem" }}>
          {label}
        </div>
        <div className="telemetry-val">{value}</div>
        <div className="telemetry-sub">{sub}</div>
      </div>
    </div>
  );
}

function StatBar({ label, value, max, fillClass, right }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem", fontSize: "0.73rem" }}>
        <span style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{label}</span>
        <span style={{ color: "var(--text-primary)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>{right}</span>
      </div>
      <div className="progress-track">
        <div className={`progress-fill ${fillClass}`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
      </div>
    </div>
  );
}

export default function Dashboard({ farm, weather, smartIrrigation, recommendation, analytics, t, onRunAiAnalysis, isAnalyzing, onNavigate }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* ── HERO BANNER ── */}
      <div className="glass-card-saffron animate-fade-up" style={{ padding: "1.75rem 2rem", position: "relative", overflow: "hidden" }}>
        {/* Background glow orbs */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "var(--color-harvest)", filter: "blur(70px)", opacity: 0.12, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -30, left: 60, width: 140, height: 140, borderRadius: "50%", background: "var(--color-rain-glow)", filter: "blur(60px)", opacity: 0.08, pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "1.5rem" }}>
          <div style={{ maxWidth: 580 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <span className="neon-badge neon-badge-saffron">
                <Sparkles style={{ width: 10, height: 10 }} />
                {t?.dashboard?.quickActionTitle || "AI Platform Active"}
              </span>
              <span className="neon-dot neon-dot-saffron" />
            </div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.9rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: "0.6rem" }}>
              {farm?.farm_name || "Kisan Kalyan Demo Farm"}
            </h1>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }}>
              {t?.dashboard?.quickActionSub || "Hyperlocal precision agronomy — monitor, analyze, and optimize your harvest."}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {[
                { icon: MapPin, label: farm?.location_name || "Ludhiana, Punjab", color: "var(--color-harvest)" },
                { icon: Layers, label: farm?.soil_type || "Alluvial / Loam", color: "var(--color-rain-glow)" },
                { icon: Sprout, label: `${farm?.current_crop} · ${farm?.crop_stage}`, color: "#6EE7B7" },
                { icon: Droplets, label: farm?.irrigation_method, color: "var(--color-ai-light)" },
              ].filter(b => b.label && b.label !== "undefined · undefined").map((b, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.25rem 0.65rem", borderRadius: 9999, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                  <b.icon style={{ width: 11, height: 11, color: b.color }} />
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", minWidth: 200 }}>
            <button
              onClick={onRunAiAnalysis}
              disabled={isAnalyzing}
              className="btn btn-primary"
              style={{ padding: "0.85rem 1.5rem", fontSize: "0.9rem", width: "100%", justifyContent: "center" }}
            >
              <Cpu style={{ width: 16, height: 16 }} className={isAnalyzing ? "animate-spin" : ""} />
              {isAnalyzing ? (t?.dashboard?.analyzing || "Analyzing…") : (t?.dashboard?.runAiAnalysis || "Run AI Analysis")}
              {!isAnalyzing && <ArrowRight style={{ width: 15, height: 15 }} />}
            </button>
            <button
              onClick={() => onNavigate("myFarm")}
              className="btn btn-secondary"
              style={{ width: "100%", justifyContent: "center", fontSize: "0.8rem" }}
            >
              Configure Farm Setup
            </button>
          </div>
        </div>
      </div>

      {/* ── 4 METRIC PODS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <MetricPod
          label="Crop Phenology"
          value={farm?.current_crop || "Wheat"}
          sub={<><span>{farm?.crop_stage || "Vegetative"}</span><span>·</span><span style={{ color: "var(--color-rain-glow)" }}>{farm?.area_acres || 5} Acres</span></>}
          accent="saffron"
          icon={Sprout}
        />
        <MetricPod
          label="Hyperlocal Climate"
          value={weather ? `${weather.temperature}°C` : "—"}
          sub={<><span style={{ textTransform: "capitalize" }}>{weather?.condition || "—"}</span><span>·</span><span>RH {weather?.humidity || "—"}%</span></>}
          accent="cyan"
          icon={ThermometerSun}
        />
        <MetricPod
          label="Soil Health Index"
          value={`${analytics?.soil_health?.overall_score || 88}`}
          sub={<><span style={{ color: "#6EE7B7" }}>pH {farm?.soil_ph || 6.8}</span><span>·</span><span>N {farm?.nitrogen || 85} kg/ha</span></>}
          accent="emerald"
          icon={Leaf}
          badge="/ 100"
          badgeClass="neon-badge-emerald"
        />
        <MetricPod
          label="Water Conservation"
          value={`~${analytics?.irrigation_savings_pct || 38}%`}
          sub={<span>Saved vs Flood Irrigation</span>}
          accent="purple"
          icon={Zap}
          badge="Micro-Irr"
          badgeClass="neon-badge-purple"
        />
      </div>

      {/* ── TODAY'S FARM ACTION ── */}
      <TodayFarmActionCard
        actionData={smartIrrigation?.today_farm_action}
        weatherData={weather}
        t={t}
        onNavigateToIrrigation={() => onNavigate("smartIrrigation")}
      />

      {/* ── 3-COLUMN PANELS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>

        {/* Weather Panel */}
        <div className="glass-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div className="stat-icon-wrap stat-icon-saffron"><Sun style={{ width: 16, height: 16 }} /></div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", fontWeight: 700 }}>Weather Telemetry</h3>
            </div>
            <button onClick={() => onNavigate("weather")} className="btn btn-ghost" style={{ padding: "0.3rem 0.6rem", fontSize: "0.72rem" }}>
              Forecast <ArrowRight style={{ width: 12, height: 12 }} />
            </button>
          </div>

          {weather ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "2.8rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)", lineHeight: 1 }}>
                    {weather.temperature}°
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", textTransform: "capitalize", marginTop: "0.25rem", fontWeight: 600 }}>{weather.condition}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className={`neon-badge ${weather.is_fallback ? "neon-badge-rose" : "neon-badge-cyan"}`}>
                    {weather.is_fallback ? "Fallback" : "Live"}
                  </span>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-dim)", marginTop: "0.3rem", fontFamily: "var(--font-mono)" }}>{weather.updated_at}</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", textAlign: "center" }}>
                {[
                  { l: "Humidity", v: `${weather.humidity}%` },
                  { l: "Wind", v: `${weather.wind_speed} km/h` },
                  { l: "Rain 24h", v: `${weather.rainfall_forecast_24h} mm`, col: "var(--color-rain-glow)" },
                ].map(s => (
                  <div key={s.l} style={{ background: "rgba(19,42,32,0.80)", borderRadius: 10, padding: "0.6rem 0.4rem", border: "1px solid var(--border-subtle)" }}>
                    <div style={{ fontSize: "0.62rem", color: "var(--text-muted)" }}>{s.l}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.88rem", color: s.col || "var(--text-primary)", marginTop: "0.15rem" }}>{s.v}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(86,199,176,0.06)", border: "1px solid var(--border-cyan)", borderRadius: 10, padding: "0.65rem", fontSize: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--color-rain-glow)", marginBottom: "0.25rem" }}>
                  <Wind style={{ width: 13, height: 13 }} />
                  {t?.dashboard?.sprayAdvisor || "Spray Advisor"}
                </div>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>{weather.spray_suitability}</p>
              </div>
            </div>
          ) : (
            <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>Loading weather…</div>
          )}
        </div>

        {/* AI Crop Snapshot */}
        <div className="glass-card-saffron" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(233,172,58,0.18)", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div className="stat-icon-wrap stat-icon-saffron"><Sprout style={{ width: 16, height: 16 }} /></div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", fontWeight: 700 }}>AI Crop Suitability</h3>
            </div>
            <button onClick={() => onNavigate("aiRecommendation")} className="btn btn-ghost" style={{ padding: "0.3rem 0.6rem", fontSize: "0.72rem", color: "var(--color-harvest)" }}>
              Full Analysis <ArrowRight style={{ width: 12, height: 12 }} />
            </button>
          </div>

          {recommendation ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
                <div>
                  <div style={{ fontSize: "0.62rem", fontFamily: "var(--font-heading)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-harvest)", marginBottom: "0.3rem" }}>Recommended Crop</div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.7rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", lineHeight: 1.1 }}>{recommendation.recommended_crop}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>{recommendation.season} Season</div>
                </div>
                <div style={{ background: "rgba(233,172,58,0.12)", border: "1px solid var(--border-saffron)", borderRadius: 12, padding: "0.6rem 1rem", textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", fontWeight: 800, color: "var(--color-harvest)", lineHeight: 1 }}>{recommendation.suitability}%</div>
                  <div style={{ fontSize: "0.6rem", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-heading)", marginTop: "0.2rem" }}>Suitability</div>
                </div>
              </div>

              <div style={{ background: "rgba(19,42,32,0.80)", borderRadius: 10, padding: "0.6rem 0.85rem", border: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
                <span style={{ color: "var(--text-secondary)" }}>Model Accuracy:</span>
                <span style={{ fontWeight: 700, color: "var(--color-rain-glow)" }}>{recommendation.measured_validation_accuracy}%</span>
              </div>

              <div>
                <div style={{ fontSize: "0.62rem", fontFamily: "var(--font-heading)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.09em", color: "var(--text-muted)", marginBottom: "0.45rem" }}>Key Factors</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {recommendation.factors?.slice(0, 4).map((f, i) => (
                    <span key={i} style={{ fontSize: "0.7rem", padding: "0.2rem 0.55rem", borderRadius: 9999, border: "1px solid", fontFamily: "var(--font-mono)", fontWeight: 600, background: f.influence === "positive" ? "rgba(30,138,120,0.12)" : "rgba(233,172,58,0.10)", borderColor: f.influence === "positive" ? "var(--border-emerald)" : "var(--border-saffron)", color: f.influence === "positive" ? "#6EE7B7" : "var(--color-harvest)" }}>
                      {f.factor.split(" ")[0]}: {f.status}
                    </span>
                  ))}
                </div>
              </div>

              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontStyle: "italic", borderLeft: "2px solid var(--color-harvest)", paddingLeft: "0.65rem", lineHeight: 1.55 }}>
                "{recommendation.primary_reason}"
              </p>
            </div>
          ) : (
            <div style={{ height: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No AI prediction run yet.</p>
              <button onClick={onRunAiAnalysis} className="btn btn-primary" style={{ fontSize: "0.8rem", padding: "0.5rem 1.1rem" }}>
                Run AI Assessment
              </button>
            </div>
          )}
        </div>

        {/* Soil & Agronomy */}
        <div className="glass-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div className="stat-icon-wrap stat-icon-purple"><Activity style={{ width: 16, height: 16 }} /></div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", fontWeight: 700 }}>Agronomic Health</h3>
            </div>
            <button onClick={() => onNavigate("analytics")} className="btn btn-ghost" style={{ padding: "0.3rem 0.6rem", fontSize: "0.72rem", color: "var(--color-ai-light)" }}>
              Analytics <ArrowRight style={{ width: 12, height: 12 }} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>{t?.dashboard?.soilHealthScore || "Soil Health Score"}</div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#6EE7B7", lineHeight: 1 }}>
                  {analytics?.soil_health?.overall_score || 88}
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 400 }}> / 100</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.68rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>{t?.dashboard?.waterSaved || "Water Saved"}</div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 800, color: "var(--color-rain-glow)", lineHeight: 1 }}>
                  ~{analytics?.irrigation_savings_pct || 38}%
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              <StatBar label="Nitrogen (N)" value={farm?.nitrogen || 85} max={120} fillClass="progress-saffron" right={`${farm?.nitrogen || 85} kg/ha`} />
              <StatBar label="Phosphorus (P)" value={farm?.phosphorus || 45} max={70} fillClass="progress-cyan" right={`${farm?.phosphorus || 45} kg/ha`} />
              <StatBar label="Potassium (K)" value={farm?.potassium || 40} max={60} fillClass="progress-emerald" right={`${farm?.potassium || 40} kg/ha`} />
              <StatBar label="Soil pH" value={farm?.soil_ph || 6.8} max={9} fillClass="progress-purple" right={`${farm?.soil_ph || 6.8} (Opt: 6.5–7.5)`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
