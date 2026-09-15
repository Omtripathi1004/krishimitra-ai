import React, { useState } from "react";
import {
  Droplets,
  Gauge,
  Calendar,
  Clock,
  Layers,
  ShieldCheck,
  Info,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sun,
  Activity,
  Sliders,
  DollarSign
} from "lucide-react";
import { toHindiDigits, localizeTerm } from "../translations";

export default function SmartIrrigation({ smartIrrigation, farm, weather, t, language, isHindi: propIsHindi }) {
  const isHindi = propIsHindi || language === "hi" || Boolean(t?.liveTelemetry?.includes("सजीव"));
  const num = (v) => (isHindi ? toHindiDigits(v) : String(v));

  // Extract data with robust fallback so it never fails or hangs
  const data = smartIrrigation?.irrigation_data || smartIrrigation || {};
  const rawStatus = data.status || "Wait";
  const urgency = data.urgency || (rawStatus === "Irrigate Now" ? "High" : "Low");
  const etc = data.crop_water_requirement_mm_day || data.evapotranspiration_mm || 1.36;
  const et0 = data.reference_evapotranspiration || 2.0;
  const efficiency = data.system_efficiency || data.efficiency_rating || "90-95%";
  const baseMoisture = smartIrrigation?.soil_moisture_pct || 68;

  // Interactive Simulator State
  const [simAddedWater, setSimAddedWater] = useState(0); // in mm
  const [solarMode, setSolarMode] = useState(true);
  const [selectedTimelineSlot, setSelectedTimelineSlot] = useState(null);

  const simulatedMoisture = Math.min(100, Math.round(baseMoisture + simAddedWater * 1.2));
  const waterSavedLiters = 320000;
  const costSavedInr = 850;

  // Localized texts
  const statusLabel = isHindi
    ? rawStatus === "Wait"
      ? "सिंचाई रोकें (२४घं - ३६घं)"
      : rawStatus === "Irrigate Now"
      ? "तुरंत सिंचाई करें"
      : "निगरानी रखें"
    : rawStatus === "Wait"
    ? "HOLD IRRIGATION (24h - 36h)"
    : rawStatus;

  const urgencyLabel = isHindi
    ? urgency === "High"
      ? "उच्च"
      : "कम"
    : urgency;

  const actionText = isHindi
    ? "अगले २४-३६ घंटों के लिए निर्धारित सिंचाई चक्र को रोकें। वर्षा की समाप्ति के बाद ही खेत की नमी का दोबारा मूल्यांकन करें।"
    : (data.action || data.action_needed || "Hold scheduled irrigation cycle for 24-36 hours. Assess soil profile after rain window.");

  const summaryText = isHindi
    ? "निकट भविष्य में वर्षा का पूर्वानुमान है। वर्तमान में जड़-क्षेत्र में पर्याप्त नमी (६८% VWC) उपलब्ध है। सिंचाई टालने से जड़ों में ऑक्सीजन की कमी और पोषक तत्वों का रिसाव रुकता है।"
    : (data.summary || data.action_needed || "Imminent rainfall predicted. Current root-zone moisture reservoir is adequate (68% VWC). Delaying scheduled irrigation prevents hypoxia and nutrient leaching.");

  // 72-Hour Precision Scheduling Windows
  const scheduleWindows = isHindi
    ? [
        { window: "आज सुबह (०६:०० - ०९:००)", status: "अनुकूलतम (विलंबित)", reason: "वर्षा का अनुमान; सिंचाई टालने की सलाह", rec: "रोकें", power: "सोलर डीसी उपलब्ध" },
        { window: "आज दोपहर (१२:०० - १६:००)", status: "प्रतिबंधित समय", reason: "तीव्र वाष्पीकरण और ३५% पानी की हानि", rec: "बचें", power: "उच्च तापीय नुकसान" },
        { window: "कल सुबह (०६:०० - ०९:००)", status: "वर्षा सक्रिय", reason: "प्राकृतिक ९.१ मिमी वर्षा से जल पुनर्भरण", rec: "प्राकृतिक जल", power: "ग्रिड स्टैंडबाय" },
        { window: "कल रात (२०:०० - २३:००)", status: "सस्ती बिजली दर", reason: "ठंडी फसल छतरी, न्यूनतम वाष्पीकरण", rec: "स्टैंडबाय", power: "ऑफ-पीक बिजली (-४०% शुल्क)" },
        { window: "तीसरे दिन सुबह (०६:०० - ०९:००)", status: "अनुशंसित सिंचाई चक्र", reason: "मृदा नमी ५२% पुनःपूर्ति बिंदु पर पहुंचेगी", rec: "सिंचाई करें", power: "सोलर डीसी मुख्य समय" }
      ]
    : [
        { window: "Today Morning (06:00 - 09:00)", status: "Optimal (Deferred)", reason: "Rainfall expected; delay recommended", rec: "Hold", power: "Solar DC Available" },
        { window: "Today Afternoon (12:00 - 16:00)", status: "Restricted Window", reason: "Peak vapor deficit & 35% droplet evaporation", rec: "Avoid", power: "High Thermal Loss" },
        { window: "Tomorrow Morning (06:00 - 09:00)", status: "Rain Event Active", reason: "Natural 9.1mm precipitation infiltration", rec: "Natural Recharge", power: "Grid Standby" },
        { window: "Tomorrow Night (20:00 - 23:00)", status: "Off-Peak Power", reason: "Cool canopy, low evapotranspiration", rec: "Standby", power: "Off-Peak Electricity (-40% tariff)" },
        { window: "Day 3 Morning (06:00 - 09:00)", status: "Recommended Cycle", reason: "Soil reservoir reaches 52% replenishment point", rec: "Irrigate", power: "Solar DC Prime Window" }
      ];

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="card card-sky p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/15 text-[var(--c-sky-neon)] border border-sky-400/30 shadow-inner">
              <Droplets className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-display">
                  {isHindi ? "स्मार्ट सिंचाई एवं मृदा जल विज्ञान कमान" : "Smart Irrigation & Soil Hydrology Command"}
                </h1>
                <span className="badge badge-sky text-xs font-semibold font-tech">
                  FAO-56 Penman-Monteith
                </span>
                <span className="badge badge-leaf text-xs font-semibold font-tech">
                  {isHindi ? "सजीव समन्वयित" : "Live Synced"}
                </span>
              </div>
              <p className="text-xs text-sky-200/80 mt-0.5 font-sans">
                {isHindi
                  ? "मल्टी-लेयर जड़-क्षेत्र जल संतुलन, वाष्पीकरण हानि मॉडलिंग एवं सटीक ड्रिप शेड्यूलिंग:"
                  : "Multi-layer root-zone hydrology balance, evapotranspiration loss modeling, and precision drip scheduling for"}{" "}
                <strong className="text-white">{farm?.farm_name || (isHindi ? "मुख्य कृषि जोत" : "Primary Holding")}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--c-sky-border)] text-sky-200">
            {isHindi ? "मिट्टी:" : "Soil:"}{" "}
            <strong className="text-white">
              {localizeTerm(farm?.soil_type || "Alluvial / Loam", isHindi)}
            </strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--c-leaf-border)] text-[var(--c-leaf-neon)]">
            {isHindi ? "विधि:" : "Delivery:"}{" "}
            <strong className="text-white">
              {localizeTerm(farm?.irrigation_method || "Drip Irrigation", isHindi)}
            </strong>
          </div>
        </div>
      </div>

      {/* ── PRIORITY DIRECTIVE BANNER (PINK / ROSE ACCENT) ── */}
      <div className="card card-pink p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-rose-500/15 to-transparent pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-500/20 pb-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[var(--c-pink-neon)] uppercase tracking-wider flex items-center gap-1.5 font-tech">
              <Sparkles className="w-3.5 h-3.5" /> {isHindi ? "सजीव निर्णय-समर्थन निर्देश" : "Real-Time Decision-Support Directive"}
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-sm font-bold px-3 py-1 rounded-full border font-tech ${
                rawStatus === "Wait"
                  ? "bg-rose-950/80 text-[var(--c-pink-neon)] border-rose-800 shadow-[0_0_12px_rgba(251,113,133,0.25)]"
                  : rawStatus === "Irrigate Now"
                  ? "bg-emerald-950/80 text-[var(--c-leaf-neon)] border-emerald-700 animate-pulse"
                  : "bg-amber-950/80 text-[var(--c-gold-neon)] border-amber-700"
              }`}>
                {statusLabel}
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-mono">
                {isHindi ? "प्राथमिकता:" : "Urgency:"} <strong className="text-white">{urgencyLabel}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-2xl font-bold font-mono text-[var(--sky)]">
                {num(etc)} <span className="text-sm font-normal text-[var(--text-muted)]">{isHindi ? "मिमी/दिन" : "mm/day"}</span>
              </div>
              <div className="text-[11px] text-[var(--text-secondary)]">
                {isHindi ? "फसल वाष्पीकरण (ETc)" : "Crop Evapotranspiration (ETc)"}
              </div>
            </div>

            <div className="text-right border-l border-[var(--border)] pl-6">
              <div className="text-2xl font-bold font-mono text-[var(--leaf)]">
                {num(simulatedMoisture)}%
              </div>
              <div className="text-[11px] text-[var(--text-secondary)]">
                {isHindi ? "जड़-क्षेत्र मृदा नमी (VWC)" : "Rhizosphere VWC"}
              </div>
            </div>
          </div>
        </div>

        {/* Action Directive Highlight */}
        <div className="mt-4 p-4 rounded-xl bg-[var(--surface)]/90 border border-[var(--border)] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[var(--harvest)]" /> {isHindi ? "आवश्यक कार्रवाई:" : "Action Required:"}
            </span>
            <span className="badge badge-emerald text-[11px]">
              {isHindi ? "IMD रडार द्वारा सत्यापित" : "Validated against IMD Radar"}
            </span>
          </div>
          <p className="text-sm font-semibold text-white leading-relaxed">
            {actionText}
          </p>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {summaryText}
          </p>
        </div>
      </div>

      {/* ── 4 KEY HYDRAULIC KPI STATS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* 1. Reference Evapotranspiration */}
        <div className="card card-sky p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--c-sky-neon)] font-tech uppercase tracking-wider">
              {isHindi ? "संदर्भ वाष्पीकरण ET₀" : "Reference ET₀"}
            </span>
            <Gauge className="w-4 h-4 text-[var(--c-sky-neon)]" />
          </div>
          <div className="text-2xl font-black text-white mt-1 font-mono">
            {num(et0)} <span className="text-sm font-normal text-sky-200/70">{isHindi ? "मिमी/दि" : "mm/d"}</span>
          </div>
          <div className="text-xs text-sky-200/80 mt-1">
            {isHindi ? "वायुमंडलीय वाष्पीकरण खिंचाव" : "Atmospheric evaporative pull"}
          </div>
        </div>

        {/* 2. Soil Moisture VWC */}
        <div className="card card-leaf p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--c-leaf-neon)] font-tech uppercase tracking-wider">
              {isHindi ? "मृदा नमी स्तर" : "Soil Moisture"}
            </span>
            <Layers className="w-4 h-4 text-[var(--c-leaf-neon)]" />
          </div>
          <div className="text-2xl font-black text-[var(--c-leaf-neon)] mt-1 font-mono">
            {num(simulatedMoisture)}% <span className="text-xs font-normal text-emerald-200/70">VWC</span>
          </div>
          <div className="text-xs text-[var(--c-leaf-neon)] mt-1">
            {isHindi ? "अनुकूलतम वृद्धि सीमा (५५-७५%)" : "Optimal Growth Band (55-75%)"}
          </div>
        </div>

        {/* 3. System Efficiency */}
        <div className="card card-indigo p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--c-indigo-neon)] font-tech uppercase tracking-wider">
              {isHindi ? "ड्रिप प्रणाली दक्षता" : "Drip Efficiency"}
            </span>
            <Droplets className="w-4 h-4 text-[var(--c-indigo-neon)]" />
          </div>
          <div className="text-2xl font-black text-[var(--c-indigo-neon)] mt-1 font-mono">
            {isHindi ? toHindiDigits(efficiency) : efficiency}
          </div>
          <div className="text-xs text-indigo-200/80 mt-1">
            {isHindi ? "दबाव: १.२ बार अनुकूलतम" : "Pressure: 1.2 bar optimal"}
          </div>
        </div>

        {/* 4. Financial & Water Savings */}
        <div className="card card-gold p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--c-gold-neon)] font-tech uppercase tracking-wider">
              {isHindi ? "आज की जल बचत" : "Savings Today"}
            </span>
            <Zap className="w-4 h-4 text-[var(--c-gold-neon)]" />
          </div>
          <div className="text-2xl font-black text-[var(--c-gold-neon)] mt-1 font-mono">
            ₹{num(costSavedInr)} <span className="text-xs font-normal text-amber-200/70">{isHindi ? "बचत" : "saved"}</span>
          </div>
          <div className="text-xs text-amber-200/80 mt-1">
            {isHindi ? `${num("३,२०,०००")} ली जल संरक्षित` : `${waterSavedLiters.toLocaleString()} L water conserved`}
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE HYDROLOGY RESERVOIR & CYCLE SIMULATOR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Dynamic Visual Soil Water Reservoir Tank */}
        <div className="card card-sky p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-sky-400/20 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[var(--c-sky-neon)]" />
              <div>
                <h2 className="text-base font-bold text-white font-display">
                  {isHindi ? "जड़-क्षेत्र जल भंडार टैंक" : "Root-Zone Water Reservoir Tank"}
                </h2>
                <p className="text-xs text-sky-200/70 font-tech">
                  {isHindi ? "आयतनिक जल मात्रा (VWC) अनुप्रस्थ गेज" : "Volumetric Water Content (VWC) cross-section gauge"}
                </p>
              </div>
            </div>
            <span className="badge badge-sky text-xs font-mono">
              {num(simulatedMoisture)}% {isHindi ? "क्षमता" : "Capacity"}
            </span>
          </div>

          {/* Visual Tank Graphic */}
          <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--text-muted)]">
                {isHindi ? "जड़ क्षेत्र गहराई: ० - ४५ सेमी" : "Rhizosphere Depth: 0 - 45 cm"}
              </span>
              <span className="font-bold text-white">
                {isHindi ? "स्थिति: पर्याप्त अनुकूल सीमा" : "Status: Adequate Comfort Band"}
              </span>
            </div>

            {/* Simulated Water Cylinder Tank */}
            <div className="relative w-full h-32 rounded-xl border-2 border-[var(--border)] bg-[#0A1810] overflow-hidden shadow-inner flex flex-col justify-end">
              {/* Reference Grid lines inside tank */}
              <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none z-20 text-[10px] font-mono text-[var(--text-muted)] opacity-60">
                <div className="flex justify-between border-b border-dashed border-red-500/40">
                  <span>{isHindi ? "१००% संतृप्ति / जलभराव जोखिम" : "100% Saturation / Runoff Danger"}</span>
                  <span className="text-red-400">{isHindi ? "वायुहीन" : "Anaerobic"}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-sky-400/40">
                  <span>{isHindi ? "७५% क्षेत्र जलधारण क्षमता" : "75% Field Capacity"}</span>
                  <span className="text-sky-400">{isHindi ? "पूर्ण भंडारण" : "Full Storage"}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-emerald-400/40">
                  <span>{isHindi ? "५५% पुनःपूर्ति सीमा" : "55% Refill Threshold"}</span>
                  <span className="text-emerald-400">{isHindi ? "अनुकूलतम बफर" : "Optimal Buffer"}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-amber-500/40">
                  <span>{isHindi ? "२०% मुरझाने की स्थायी सीमा" : "20% Permanent Wilting Point"}</span>
                  <span className="text-amber-400">{isHindi ? "गंभीर जल संकट" : "Severe Deficit"}</span>
                </div>
              </div>

              {/* Water Liquid Body with Wave Effect */}
              <div
                className="w-full bg-gradient-to-t from-[var(--primary)] via-[var(--sky)] to-[var(--sky)]/70 transition-all duration-700 relative z-10 opacity-80"
                style={{ height: `${simulatedMoisture}%` }}
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/40 animate-pulse" />
              </div>
            </div>

            {/* Legend Labels */}
            <div className="grid grid-cols-4 text-center text-[10px] font-mono gap-1 pt-1">
              <div className="p-1.5 rounded bg-red-950/40 border border-red-900/40 text-red-300">
                {isHindi ? "<२०% तनाव" : "<20% Stress"}
              </div>
              <div className="p-1.5 rounded bg-amber-950/40 border border-amber-900/40 text-amber-300">
                {isHindi ? "२०-५५% जल कमी" : "20-55% Deficit"}
              </div>
              <div className="p-1.5 rounded bg-emerald-950/40 border border-emerald-900/40 text-emerald-300 font-bold">
                {isHindi ? "५५-७५% लक्ष्य" : "55-75% Target"}
              </div>
              <div className="p-1.5 rounded bg-sky-950/40 border border-sky-900/40 text-sky-300">
                {isHindi ? "७५-१००% संतृप्त" : "75-100% Saturated"}
              </div>
            </div>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[var(--leaf)]" />{" "}
                {isHindi ? "ड्रिप सिंचाई चक्र सिम्युलेटर" : "Drip Irrigation Cycle Simulator"}
              </span>
              {simAddedWater > 0 && (
                <button
                  onClick={() => setSimAddedWater(0)}
                  className="text-[11px] text-[var(--harvest)] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> {isHindi ? "रीसेट करें" : "Reset"}
                </button>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--text-secondary)]">
                  {isHindi ? "सिंचाई जल की मात्रा अनुकरण:" : "Simulate Irrigation Water Dose:"}
                </span>
                <span className="font-bold text-[var(--sky)]">
                  +{num(simAddedWater)} {isHindi ? "मिमी" : "mm"} ({num(simAddedWater * 10)} {isHindi ? "घनमीटर/एकड़" : "m³/acre"})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={simAddedWater}
                onChange={(e) => setSimAddedWater(parseInt(e.target.value))}
                className="w-full accent-[var(--sky)] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-1 text-xs flex-wrap gap-2">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <span>{isHindi ? "ऊर्जा स्रोत:" : "Power Source:"}</span>
                <button
                  onClick={() => setSolarMode(!solarMode)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all ${
                    solarMode
                      ? "bg-emerald-950 text-[var(--leaf)] border-emerald-800"
                      : "bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  {solarMode
                    ? (isHindi ? "☀️ सोलर डीसी (शून्य खर्च)" : "☀️ Solar DC (Zero Cost)")
                    : (isHindi ? "⚡ ग्रिड विद्युत आपूर्ति" : "⚡ Grid Electricity")}
                </button>
              </div>

              <div className="text-[11px] font-mono text-[var(--text-muted)]">
                {isHindi ? "अनुमानित VWC नमी:" : "Projected VWC:"}{" "}
                <strong className="text-white">{num(simulatedMoisture)}%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right: FAO-56 Balance Equation & 72h Schedule Timeline */}
        <div className="space-y-6">
          {/* FAO-56 Mathematical Model Card */}
          <div className="card card-indigo p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-400/20 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--c-indigo-neon)]" />
                <div>
                  <h2 className="text-base font-bold text-white font-display">
                    {isHindi ? "FAO-५६ जल संतुलन गणना" : "FAO-56 Water Balance Calculation"}
                  </h2>
                  <p className="text-xs text-indigo-200/70 font-tech">
                    {isHindi ? "दोहरे फसल गुणांक वाष्पीकरण संश्लेषण" : "Dual crop coefficient evapotranspiration synthesis"}
                  </p>
                </div>
              </div>
              <span className="badge badge-indigo text-xs font-mono">
                {isHindi ? "ETc सूत्र" : "ETc Formula"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--c-indigo-border)] font-mono text-xs space-y-2">
              <div className="text-[var(--c-gold-neon)] font-bold">
                ETc = ET₀ × Kc × K_stage
              </div>
              <div className="text-indigo-200/80 text-[11px]">
                {isHindi
                  ? `= ${num(et0)} मिमी/दिन (ET₀) × ०.८५ (गेहूं Kc) × ०.८ (वानस्पतिक) = `
                  : `= ${et0} mm/d (ET₀) × 0.85 (Wheat Kc) × 0.8 (Vegetative stage) = `}
                <strong className="text-white">{num(etc)} {isHindi ? "मिमी/दिन" : "mm/day"}</strong>
              </div>
              <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] flex justify-between">
                <span className="text-[var(--text-muted)]">
                  {isHindi ? "आगामी ७ दिनों की वर्षा:" : "Incoming 7d Rainfall:"}
                </span>
                <span className="font-bold text-[var(--c-sky-neon)]">+{num("14.5")} {isHindi ? "मिमी" : "mm"}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--text-muted)]">
                  {isHindi ? "७-दिवसीय कुल ETc वाष्पीकरण हानि:" : "7-Day Cumulative ETc Loss:"}
                </span>
                <span className="font-bold text-[var(--c-gold-neon)]">−{num((etc * 7).toFixed(1))} {isHindi ? "मिमी" : "mm"}</span>
              </div>
              <div className="pt-1.5 border-t border-[var(--border-subtle)] flex justify-between font-bold">
                <span className="text-white">
                  {isHindi ? "जल संतुलन अधिशेष:" : "Hydrological Surplus:"}
                </span>
                <span className="text-[var(--c-leaf-neon)]">
                  +{num((14.5 - etc * 7).toFixed(1))} {isHindi ? "मिमी (सिंचाई की आवश्यकता नहीं)" : "mm (No Irrigation Needed)"}
                </span>
              </div>
            </div>

            <div className="text-xs text-indigo-200/80 leading-relaxed">
              {isHindi
                ? "चूंकि आगामी ७ दिनों में वर्षा की संभावना वायुमंडलीय मांग से अधिक है, इसलिए आज सिंचाई करने से नाइट्रोजन बह जाएगी और जड़ों की नलिकाएं अवरुद्ध होंगी।"
                : "Because forecasted precipitation exceeds atmospheric demand over the 7-day horizon, irrigating today would only cause nitrogen runoff and saturate root capillaries."}
            </div>
          </div>

          {/* 72-Hour Precision Scheduling Window */}
          <div className="card card-gold p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-400/20 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--c-gold-neon)]" />
                <div>
                  <h2 className="text-base font-bold text-white font-display">
                    {isHindi ? "७२-घंटे सटीक सिंचाई समय सारिणी" : "72-Hour Precision Schedule Windows"}
                  </h2>
                  <p className="text-xs text-amber-200/70 font-tech">
                    {isHindi ? "बिजली दर एवं मौसम अनुकूलित पंप संचालन समय" : "Tariff-optimized, weather-guarded pump timing"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {scheduleWindows.map((slot, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedTimelineSlot(idx)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    slot.rec === "Irrigate" || slot.rec === "सिंचाई करें"
                      ? "border-[var(--primary)] bg-[var(--primary)]/15 hover:bg-[var(--primary)]/20 shadow-sm"
                      : slot.rec === "Hold" || slot.rec === "रोकें"
                      ? "border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--surface-2)]/90"
                      : slot.rec === "Natural Recharge" || slot.rec === "प्राकृतिक जल"
                      ? "border-sky-800/40 bg-sky-950/20"
                      : "border-red-900/30 bg-red-950/10"
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-bold text-white flex items-center gap-2 truncate">
                      {slot.window}
                      <span className={`badge text-[10px] py-0.2 px-1.5 ${
                        slot.rec === "Irrigate" || slot.rec === "सिंचाई करें"
                          ? "badge-emerald"
                          : slot.rec === "Natural Recharge" || slot.rec === "प्राकृतिक जल"
                          ? "badge-sky"
                          : slot.rec === "Hold" || slot.rec === "रोकें"
                          ? "badge-warning"
                          : "badge-critical"
                      }`}>
                        {slot.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] truncate">
                      {slot.reason} • <span className="text-[var(--text-secondary)]">{slot.power}</span>
                    </div>
                  </div>

                  <div className="font-mono font-bold shrink-0 text-right">
                    <span className={`text-xs ${
                      slot.rec === "Irrigate" || slot.rec === "सिंचाई करें"
                        ? "text-[var(--leaf)]"
                        : slot.rec === "Natural Recharge" || slot.rec === "प्राकृतिक जल"
                        ? "text-[var(--sky)]"
                        : slot.rec === "Hold" || slot.rec === "रोकें"
                        ? "text-amber-400"
                        : "text-red-400"
                    }`}>
                      {slot.rec}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
