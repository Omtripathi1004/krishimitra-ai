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
import { toHindiDigits, localizeTerm } from "../translations";

export default function FarmAnalytics({ analytics, farm, t, language, isHindi: propIsHindi }) {
  const isHindi = propIsHindi || language === "hi" || Boolean(t?.liveTelemetry?.includes("सजीव"));
  const num = (v) => (isHindi ? toHindiDigits(v) : String(v));

  const [activeTab, setActiveTab] = useState("overview");

  if (!analytics) {
    return (
      <div className="card p-12 text-center text-sm text-[var(--text-muted)] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
        <span>
          {isHindi
            ? "दीर्घकालिक कृषि एनालिटिक्स एवं ICAR बेंचमार्क डेटा एकत्रित किया जा रहा है..."
            : "Aggregating longitudinal agro-analytics and ICAR benchmark datasets..."}
        </span>
      </div>
    );
  }

  const soilMetrics = isHindi
    ? [
        { name: "नाइट्रोजन (N)", actual: 85, ideal: 100, unit: "किग्रा/हे", status: "अनुकूलतम", color: "#38BDF8", grad: "from-sky-500 to-sky-400" },
        { name: "फास्फोरस (P)", actual: 42, ideal: 50, unit: "किग्रा/हे", status: "अनुकूलतम", color: "#F59E0B", grad: "from-amber-500 to-yellow-400" },
        { name: "पोटाश (K)", actual: 180, ideal: 200, unit: "किग्रा/हे", status: "अनुकूलतम", color: "#FB7185", grad: "from-rose-500 to-pink-400" },
        { name: "जैविक कार्बन (OC)", actual: 0.65, ideal: 0.75, unit: "%", status: "अच्छा", color: "#818CF8", grad: "from-indigo-500 to-blue-400" },
        { name: "मृदा पीएच (pH)", actual: 6.8, ideal: 7.0, unit: "pH", status: "आदर्श", color: "#4ADE80", grad: "from-emerald-500 to-green-400" },
        { name: "धनायन विनिमय", actual: 24, ideal: 25, unit: "meq/100g", status: "अनुकूलतम", color: "#C084FC", grad: "from-purple-500 to-violet-400" }
      ]
    : [
        { name: "Nitrogen (N)", actual: 85, ideal: 100, unit: "kg/ha", status: "Optimal", color: "#38BDF8", grad: "from-sky-500 to-sky-400" },
        { name: "Phosphorus (P)", actual: 42, ideal: 50, unit: "kg/ha", status: "Optimal", color: "#F59E0B", grad: "from-amber-500 to-yellow-400" },
        { name: "Potassium (K)", actual: 180, ideal: 200, unit: "kg/ha", status: "Optimal", color: "#FB7185", grad: "from-rose-500 to-pink-400" },
        { name: "Organic Carbon", actual: 0.65, ideal: 0.75, unit: "%", status: "Good", color: "#818CF8", grad: "from-indigo-500 to-blue-400" },
        { name: "Soil pH", actual: 6.8, ideal: 7.0, unit: "pH", status: "Ideal", color: "#4ADE80", grad: "from-emerald-500 to-green-400" },
        { name: "Cation Exchange", actual: 24, ideal: 25, unit: "meq/100g", status: "Optimal", color: "#C084FC", grad: "from-purple-500 to-violet-400" }
      ];

  const yieldHistory = isHindi
    ? [
        { season: "खरीफ २०२४", yield_qtl_acre: 24.5, benchmark: 21.0, crop: "धान" },
        { season: "रबी २०२३-२४", yield_qtl_acre: 22.8, benchmark: 19.5, crop: "गेहूं" },
        { season: "खरीफ २०२३", yield_qtl_acre: 23.2, benchmark: 20.2, crop: "धान" },
        { season: "रबी २०२२-२३", yield_qtl_acre: 21.0, benchmark: 18.8, crop: "गेहूं" }
      ]
    : [
        { season: "Kharif 2024", yield_qtl_acre: 24.5, benchmark: 21.0, crop: "Paddy" },
        { season: "Rabi 2023-24", yield_qtl_acre: 22.8, benchmark: 19.5, crop: "Wheat" },
        { season: "Kharif 2023", yield_qtl_acre: 23.2, benchmark: 20.2, crop: "Paddy" },
        { season: "Rabi 2022-23", yield_qtl_acre: 21.0, benchmark: 18.8, crop: "Wheat" }
      ];

  const irrigationMatrix = isHindi
    ? [
        { method: "ड्रिप सिंचाई (सक्रिय)", efficiency: "८८%", water_used_m3: "३१०", savings: "+३२%", cardClass: "card-sky border-sky-400", effColor: "text-sky-300", badge: "badge-sky", isUser: true },
        { method: "स्प्रिंकलर सिंचाई", efficiency: "७४%", water_used_m3: "४२०", savings: "+१८%", cardClass: "card-indigo border-indigo-400/50", effColor: "text-indigo-300", badge: "badge-indigo" },
        { method: "नाली / क्यारी सिंचाई", efficiency: "५८%", water_used_m3: "५६०", savings: "आधारभूत", cardClass: "card-gold border-amber-400/50", effColor: "text-amber-300", badge: "badge-gold" },
        { method: "पारंपरिक बाढ़ सिंचाई", efficiency: "४२%", water_used_m3: "७८०", savings: "-२८%", cardClass: "card-pink border-rose-400/50", effColor: "text-rose-300", badge: "badge-pink" }
      ]
    : [
        { method: "Drip Irrigation (Active)", efficiency: "88%", water_used_m3: "310", savings: "+32%", cardClass: "card-sky border-sky-400", effColor: "text-sky-300", badge: "badge-sky", isUser: true },
        { method: "Sprinkler Irrigation", efficiency: "74%", water_used_m3: "420", savings: "+18%", cardClass: "card-indigo border-indigo-400/50", effColor: "text-indigo-300", badge: "badge-indigo" },
        { method: "Furrow / Border Strip", efficiency: "58%", water_used_m3: "560", savings: "Baseline", cardClass: "card-gold border-amber-400/50", effColor: "text-amber-300", badge: "badge-gold" },
        { method: "Flood Irrigation (Traditional)", efficiency: "42%", water_used_m3: "780", savings: "-28%", cardClass: "card-pink border-rose-400/50", effColor: "text-rose-300", badge: "badge-pink" }
      ];

  const tabOptions = isHindi
    ? [
        { id: "overview", label: "कार्यकारी सारांश" },
        { id: "soil", label: "मृदा रसायन" },
        { id: "yield", label: "पैदावार बेंचमार्क" },
        { id: "efficiency", label: "संसाधन दक्षता" }
      ]
    : [
        { id: "overview", label: "Executive Summary" },
        { id: "soil", label: "Soil Chemistry" },
        { id: "yield", label: "Yield Benchmarks" },
        { id: "efficiency", label: "Resource Efficiency" }
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
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5 flex-wrap">
                {isHindi ? "खेत प्रदर्शन एनालिटिक्स एवं ऐतिहासिक रुझान" : (t?.analytics?.title || "Longitudinal Farm Analytics")}
                <span className="badge badge-emerald text-xs">
                  {isHindi ? "ICAR प्रमाणित" : "ICAR Certified"}
                </span>
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {isHindi
                  ? "ऐतिहासिक पैदावार, मृदा पोषक तत्व और जल दक्षता विश्लेषण:"
                  : "Yield trends, soil chemistry benchmarks, and water-nutrient productivity diagnostics for"}{" "}
                <strong className="text-white">{farm?.farm_name || (isHindi ? "मुख्य कृषि जोत" : "Primary Holding")}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation Filter Tabs */}
          <div className="flex items-center gap-1 bg-[var(--surface-2)] p-1 rounded-xl border border-[var(--border)] overflow-x-auto">
            {tabOptions.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
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
        <div className="card-leaf p-4.5 rounded-2xl border border-emerald-500/40 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="section-eyebrow text-emerald-300">
              {isHindi ? "मृदा स्वास्थ्य सूचकांक" : "Soil Health Index"}
            </span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-300 mt-2">
            {num(analytics.soil_health?.overall_score || 88)}{" "}
            <span className="text-xs font-normal text-slate-300">/ {num(100)}</span>
          </div>
          <div className="text-xs text-emerald-200 font-bold flex items-center gap-1 mt-1.5">
            <TrendingUp className="w-3.5 h-3.5" />{" "}
            {isHindi ? `+${num("4.2")} अंक जिला औसत से ऊपर` : "+4.2 pts above district avg"}
          </div>
        </div>

        <div className="card-gold p-4.5 rounded-2xl border border-amber-500/40 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="section-eyebrow text-amber-300">
              {isHindi ? "ऐतिहासिक पैदावार" : "Historical Yield"}
            </span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-300 mt-2">
            {num("23.6")}{" "}
            <span className="text-xs font-normal text-slate-300">
              {isHindi ? "क्विंटल/एकड़" : "qtl/acre"}
            </span>
          </div>
          <div className="text-xs text-amber-200 font-bold flex items-center gap-1 mt-1.5">
            <TrendingUp className="w-3.5 h-3.5" />{" "}
            {isHindi ? `+${num("16.2")}% आधारभूत से अधिक` : "+16.2% above baseline"}
          </div>
        </div>

        <div className="card-sky p-4.5 rounded-2xl border border-sky-500/40 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="section-eyebrow text-sky-300">
              {isHindi ? "जल उपयोग दक्षता" : "Water Efficiency"}
            </span>
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-sky-300 mt-2">
            {num(88)}%
          </div>
          <div className="text-xs text-sky-200 font-bold flex items-center gap-1 mt-1.5">
            <TrendingUp className="w-3.5 h-3.5" />{" "}
            {isHindi ? `${num(310)} घनमीटर/क्विंटल लक्ष्य पूर्ण` : "310 m³/qtl target met"}
          </div>
        </div>

        <div className="card-pink p-4.5 rounded-2xl border border-rose-500/40 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="section-eyebrow text-rose-300">
              {isHindi ? "इनपुट लागत बचत" : "Cost Savings"}
            </span>
            <Sparkles className="w-4 h-4 text-rose-400" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-rose-300 mt-2">
            ₹{num("3,450")}{" "}
            <span className="text-xs font-normal text-slate-300">
              {isHindi ? "/एकड़ बचत" : "/acre saved"}
            </span>
          </div>
          <div className="text-xs text-rose-200 font-bold flex items-center gap-1 mt-1.5">
            {isHindi ? "उर्वरक एवं बिजली अनुकूलन" : "Fertilizer & energy optimization"}
          </div>
        </div>
      </div>

      {/* Main Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Soil Chemistry & Macro-Nutrient Balance */}
        <div className="card-sky p-6 rounded-3xl border border-sky-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white font-display">
                  {isHindi ? "मृदा रसायन एवं पोषक तत्व संतुलन" : "Soil Chemistry & Nutrient Balance"}
                </h3>
                <p className="text-xs text-sky-200">
                  {isHindi
                    ? "ICAR स्पेक्ट्रोफोटोमीटर मानक से तुलनात्मक विश्लेषण"
                    : "ICAR spectrophotometer agronomic comparison benchmarks"}
                </p>
              </div>
            </div>
            <span className="badge badge-sky text-xs">
              {isHindi ? "उपजाऊ दोमट" : "Fertile Loam"}
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {soilMetrics.map((m, idx) => {
              const ratio = Math.min(100, Math.round((m.actual / m.ideal) * 100));
              return (
                <div key={idx} className="space-y-1.5 p-2 rounded-xl bg-black/30 border border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white font-display">{m.name}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold" style={{ color: m.color }}>
                        {num(m.actual)} / {num(m.ideal)} {m.unit || ""}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${m.color}25`, color: m.color }}>
                        {m.status}
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-900 overflow-hidden border border-white/10">
                    <div
                      className={`h-full bg-gradient-to-r ${m.grad} rounded-full transition-all duration-700 shadow-md`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 bg-black/40 rounded-xl border border-sky-500/30 text-xs text-sky-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>{isHindi ? "कृषि प्रयोगशाला निष्कर्ष:" : "Agronomist Laboratory Finding:"}</strong>{" "}
              {isHindi
                ? "मृदा पीएच ६.८ पर उपलब्ध है जो फास्फोरस की उपलब्धता (६.५-७.२) के लिए सर्वोत्तम है। जैविक कार्बन सूचकांक सफल हरी खाद और जुताई प्रबंधन को दर्शाता है।"
                : "Soil pH at 6.8 is precisely within the maximum phosphorus availability zone (6.5–7.2). Organic carbon index reflects successful conservation till and green mulching."}
            </span>
          </div>
        </div>

        {/* Panel 2: Longitudinal Yield History vs Regional Benchmark */}
        <div className="card-gold p-6 rounded-3xl border border-amber-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white font-display">
                  {isHindi ? "पैदावार प्रदर्शन बनाम जिला औसत" : "Yield Performance vs District Baseline"}
                </h3>
                <p className="text-xs text-amber-200">
                  {isHindi
                    ? "पिछले ४ फसल चक्रों में प्रति एकड़ क्विंटल उत्पादन तुलना"
                    : "Quintals per acre comparison across the past 4 harvesting cycles"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />{" "}
                {isHindi ? "खेत पैदावार" : "Farm Yield"}
              </span>
              <span className="flex items-center gap-1.5 text-indigo-300">
                <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50" />{" "}
                {isHindi ? "जिला औसत" : "District Avg"}
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {yieldHistory.map((item, idx) => {
              const delta = (item.yield_qtl_acre - item.benchmark).toFixed(1);
              const maxScale = 30;
              const farmWidth = Math.min(100, (item.yield_qtl_acre / maxScale) * 100);
              const benchWidth = Math.min(100, (item.benchmark / maxScale) * 100);

              return (
                <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-white font-display flex items-center gap-2">
                      {item.season}
                      <span className="text-[11px] font-normal text-amber-300">({item.crop})</span>
                    </span>
                    <span className="font-mono font-extrabold text-amber-300">
                      +{num(delta)} {isHindi ? "क्विंटल/एकड़" : "qtl/acre"} (+{num(Math.round((delta / item.benchmark) * 100))}% {isHindi ? "बढ़ोतरी" : "Surge"})
                    </span>
                  </div>

                  {/* Dual Bar Comparison */}
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center gap-2.5">
                      <span className="w-16 text-amber-300 font-bold">{isHindi ? "खेत:" : "Farm:"}</span>
                      <div className="flex-1 h-3 rounded-full bg-slate-900 border border-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500 shadow-md"
                          style={{ width: `${farmWidth}%` }}
                        />
                      </div>
                      <span className="w-20 text-right font-extrabold text-amber-300">{num(item.yield_qtl_acre)} {isHindi ? "क्विंटल" : "qtl"}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="w-16 text-indigo-300 font-bold">{isHindi ? "जिला:" : "District:"}</span>
                      <div className="flex-1 h-3 rounded-full bg-slate-900 border border-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-700 to-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${benchWidth}%` }}
                        />
                      </div>
                      <span className="w-20 text-right font-extrabold text-indigo-300">{num(item.benchmark)} {isHindi ? "क्विंटल" : "qtl"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 bg-black/40 rounded-xl border border-amber-500/30 text-xs text-amber-200">
            {isHindi
              ? "सटीक पोषक तत्व प्रबंधन और ड्रिप फर्टिगेशन शेड्यूलिंग के कारण पैदावार लगातार जिला बेंचमार्क से बेहतर है।"
              : "Consistently outperforming district benchmarks due to precision nutrient timing and drip fertigation scheduling."}
          </div>
        </div>
      </div>

      {/* Water & Irrigation Method Efficiency Comparison Matrix */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-[var(--sky)]" />
            <div>
              <h3 className="text-base font-bold text-white">
                {isHindi ? "सिंचाई प्रौद्योगिकी जल उत्पादकता तुलना" : "Irrigation Technology Water Productivity Matrix"}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                {isHindi
                  ? "प्रति क्विंटल उत्पादन पर जल संरक्षण दक्षता एवं जल खपत मात्रा"
                  : "Conservation efficiency and volume consumed per quintal output"}
              </p>
            </div>
          </div>
          <span className="badge badge-sky text-xs">
            {isHindi ? "PMMY सूक्ष्म-सिंचाई मानक" : "PMMY Micro-Irrigation Benchmark"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {irrigationMatrix.map((w, i) => (
            <div
              key={i}
              className={`p-4.5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${w.cardClass} shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-white font-display">{w.method}</span>
                {w.isUser && (
                  <span className="badge badge-emerald text-[10px]">
                    {isHindi ? "आपका सिस्टम" : "Your System"}
                  </span>
                )}
              </div>

              <div className={`text-3xl font-extrabold font-mono mt-3 ${w.effColor}`}>
                {w.efficiency}
              </div>

              <div className="space-y-1 mt-2 text-xs font-mono">
                <div className="text-slate-300">
                  {isHindi ? "जल खपत:" : "Water:"} <strong className="text-white">{w.water_used_m3} {isHindi ? "घनमीटर/क्विं" : "m³/qtl"}</strong>
                </div>
                <div className="font-bold" style={{ color: w.savings.startsWith("-") ? "#FB7185" : "#4ADE80" }}>
                  {isHindi ? "लाभ:" : "Benefit:"} {w.savings}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
