import React, { useState } from "react";
import {
  Settings,
  User,
  Globe,
  Download,
  CheckCircle2,
  FileText
} from "lucide-react";

export default function ProfileSettings({ farm, language, setLanguage, t }) {
  const [unitArea, setUnitArea] = useState("Acres");
  const [unitTemp, setUnitTemp] = useState("Celsius (°C)");
  const [reportExported, setReportExported] = useState(false);

  const handleExportReport = () => {
    const reportData = {
      title: "KrishiMitra AI - Farm Decision Report",
      exported_at: new Date().toISOString(),
      farm_profile: farm,
      units: { area: unitArea, temperature: unitTemp },
      language_mode: language
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-[var(--border-cyan)]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-[rgba(89,199,177,0.15)] flex items-center justify-center text-[var(--color-rain-glow)] border border-[var(--border-cyan)]">
              <Settings className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-[var(--text-primary)]">
              {t.tabs.profile} & Preferences
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Configure telemetry units, bilingual localization, and export farm decision records.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="btn btn-primary text-xs self-start md:self-auto py-2.5 px-4"
        >
          <Download className="h-4 w-4" />
          <span>Export Farm JSON Report</span>
        </button>
      </div>

      {reportExported && (
        <div className="rounded-xl border border-[var(--border-cyan)] bg-[#183A2D] p-3 text-xs text-[var(--color-rain-glow)] flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Farm telemetry decision report exported successfully!</span>
        </div>
      )}

      {/* Preferences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Card */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-heading font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3">
            <User className="h-4 w-4 text-[var(--color-harvest)]" />
            <span>Registered Farm Identity</span>
          </div>

          <div className="space-y-3 text-xs font-mono text-[var(--text-secondary)]">
            <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] font-sans">Farmer Name:</span>
              <strong className="text-[var(--text-primary)]">{farm?.farmer_name}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] font-sans">Farm Holding:</span>
              <strong className="text-[var(--text-primary)]">{farm?.farm_name}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] font-sans">Agro-Climatic Zone:</span>
              <strong className="text-[var(--text-primary)]">{farm?.location_name}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] font-sans">Total Area:</span>
              <strong className="text-[var(--color-rain-glow)]">{farm?.area_acres} Acres</strong>
            </div>
          </div>
        </div>

        {/* Units & Localization */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-heading font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3">
            <Globe className="h-4 w-4 text-[var(--color-rain-glow)]" />
            <span>Telemetry Units & Localization</span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-sans font-medium">Interface Language</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`flex-1 rounded-lg py-2 px-3 text-xs font-heading font-bold border transition-all ${
                    language === "en"
                      ? "btn-primary"
                      : "bg-[#183A2D]/80 text-[var(--text-secondary)] border-[var(--border-subtle)]"
                  }`}
                >
                  English (Default)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`flex-1 rounded-lg py-2 px-3 text-xs font-heading font-bold border transition-all ${
                    language === "hi"
                      ? "btn-primary"
                      : "bg-[#183A2D]/80 text-[var(--text-secondary)] border-[var(--border-subtle)]"
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-sans font-medium">Land Area Unit</label>
              <div className="flex gap-2">
                {["Acres", "Hectares", "Bigha"].map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setUnitArea(unit)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-medium border ${
                      unitArea === unit
                        ? "bg-[#224C3C] text-[var(--color-rain-glow)] border-[var(--border-cyan)]"
                        : "bg-[#183A2D]/60 text-[var(--text-muted)] border-[var(--border-subtle)]"
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-sans font-medium">Temperature Unit</label>
              <div className="flex gap-2">
                {["Celsius (°C)", "Fahrenheit (°F)"].map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setUnitTemp(unit)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-medium border ${
                      unitTemp === unit
                        ? "bg-[#224C3C] text-[var(--color-rain-glow)] border-[var(--border-cyan)]"
                        : "bg-[#183A2D]/60 text-[var(--text-muted)] border-[var(--border-subtle)]"
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
    </div>
  );
}
