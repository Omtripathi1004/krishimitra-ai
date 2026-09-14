import React, { useState } from "react";
import {
  Settings,
  User,
  Globe,
  Download,
  CheckCircle2,
  FileText,
  Sliders,
  ShieldCheck
} from "lucide-react";

export default function ProfileSettings({
  farm,
  language,
  setLanguage,
  fontSize,
  setFontSize,
  contrastMode,
  setContrastMode,
  t
}) {
  const [unitArea, setUnitArea] = useState("Acres");
  const [unitTemp, setUnitTemp] = useState("Celsius (°C)");
  const [reportExported, setReportExported] = useState(false);

  const handleExportReport = () => {
    const reportData = {
      title: "KrishiMitra AI - Farm Agronomic Decision Record",
      exported_at: new Date().toISOString(),
      farm_profile: farm,
      units: { area: unitArea, temperature: unitTemp },
      language_mode: language,
      compliance: "ICAR & Ministry of Agriculture & Farmers Welfare Standards"
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `KrishiMitra_Report_${farm?.farm_name?.replace(/\s+/g, "_") || "Farm"}.json`;
    a.click();
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-5 sm:p-6 border-l-4 border-l-[var(--leaf)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--primary)]/20 text-[var(--leaf)] border border-[var(--primary)]/30">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                {t?.tabs?.profile || "System Settings"} & Telemetry Configuration
                <span className="badge badge-emerald text-xs font-semibold">Active</span>
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Manage agro-meteorological units, bilingual localization, and export historical farm decision records
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportReport}
          className="btn btn-primary text-xs py-2.5 px-4 shadow-md flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Farm JSON Record</span>
        </button>
      </div>

      {reportExported && (
        <div className="p-3.5 rounded-xl bg-[var(--primary)]/20 border border-[var(--primary)] text-xs text-[var(--leaf)] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Comprehensive farm telemetry decision record downloaded successfully!</span>
        </div>
      )}

      {/* Preferences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Identity Card */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <User className="w-4 h-4 text-[var(--harvest)]" />
              <span>Registered Agronomic Holding</span>
            </div>
            <span className="badge badge-emerald text-xs">Verified</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] font-sans">Primary Agronomist / Farmer:</span>
              <strong className="text-white">{farm?.farmer_name || "Sardar Gurpreet Singh"}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] font-sans">Farm Holding Name:</span>
              <strong className="text-white">{farm?.farm_name || "Majha Agro Fields"}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] font-sans">Territory & Agro Zone:</span>
              <strong className="text-white">{farm?.location_name || "Ludhiana, Punjab"}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] font-sans">Total Geofenced Area:</span>
              <strong className="text-[var(--leaf)]">{farm?.area_acres || 5.0} Acres</strong>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[var(--text-muted)] font-sans">Standing Crop:</span>
              <strong className="text-white">{farm?.current_crop || "Wheat"} ({farm?.crop_stage || "Vegetative"})</strong>
            </div>
          </div>
        </div>

        {/* Units & Localization */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Globe className="w-4 h-4 text-[var(--sky)]" />
              <span>Language & Telemetry Units</span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[var(--text-secondary)] mb-1.5 font-medium">Platform Language</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`flex-1 rounded-xl py-2 px-3 text-xs font-bold border transition-all ${
                    language === "en"
                      ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                      : "bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--border)] hover:text-white"
                  }`}
                >
                  English (Default)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`flex-1 rounded-xl py-2 px-3 text-xs font-bold border transition-all ${
                    language === "hi"
                      ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                      : "bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--border)] hover:text-white"
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] mb-1.5 font-medium">Area Unit Preference</label>
              <div className="flex gap-2">
                {["Acres", "Hectares", "Bigha"].map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setUnitArea(unit)}
                    className={`flex-1 rounded-xl py-2 text-xs font-semibold border transition-all ${
                      unitArea === unit
                        ? "bg-[var(--surface-2)] text-[var(--leaf)] border-[var(--primary)]"
                        : "bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)] hover:text-white"
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] mb-1.5 font-medium">Temperature Metric</label>
              <div className="flex gap-2">
                {["Celsius (°C)", "Fahrenheit (°F)"].map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setUnitTemp(unit)}
                    className={`flex-1 rounded-xl py-2 text-xs font-semibold border transition-all ${
                      unitTemp === unit
                        ? "bg-[var(--surface-2)] text-[var(--leaf)] border-[var(--primary)] font-bold"
                        : "bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)] hover:text-white"
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility & Typography Controls Card */}
      <div className="card p-6 space-y-4 border-l-4 border-l-[var(--harvest)] shadow-lg">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Sliders className="w-4 h-4 text-[var(--harvest)]" />
            <span>Display Typography & Visual Contrast Controls</span>
          </div>
          <span className="badge badge-emerald text-xs">WCAG AAA Ready</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Font Size Scaling */}
          <div className="space-y-2">
            <label className="block text-white font-bold">
              Text Font Size Scaling
            </label>
            <p className="text-[11px] text-[var(--text-secondary)] mb-2">
              Scale all text across dashboards, tables, metrics, and advisory panels.
            </p>
            <div className="flex gap-2">
              {[
                { id: "normal", label: "Normal (100%)", size: "15.5px" },
                { id: "large", label: "Large (115%)", size: "17.5px" },
                { id: "xl", label: "Extra Large (130%)", size: "19.5px" }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFontSize && setFontSize(opt.id)}
                  className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                    fontSize === opt.id
                      ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md"
                      : "bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)] hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contrast Mode */}
          <div className="space-y-2">
            <label className="block text-white font-bold">
              Visual Color Contrast Level
            </label>
            <p className="text-[11px] text-[var(--text-secondary)] mb-2">
              Enhance visibility under harsh outdoor sunlight or high-glare field environments.
            </p>
            <div className="flex gap-2">
              {[
                { id: "normal", label: "Standard Contrast", icon: "🌱" },
                { id: "high", label: "Ultra-High Contrast (OLED)", icon: "◐" }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setContrastMode && setContrastMode(c.id)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    contrastMode === c.id
                      ? "bg-amber-400 text-black border-amber-300 font-extrabold shadow-md"
                      : "bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)] hover:text-white"
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Typography Preview Box */}
        <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1 mt-2">
          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider font-bold">
            Live Readability Preview:
          </span>
          <p className="text-white font-bold text-sm">
            🌾 Wheat Crop (PBW-343) • Volumetric Water Content: 68% • Irrigation Status: HOLD
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            High contrast text ensures agronomists and farmers can effortlessly read telemetry in all outdoor lighting conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
