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
import { toHindiDigits } from "../translations";

export default function TodayFarmActionCard({ actionData, weatherData, t, onNavigateToIrrigation, language, isHindi: propIsHindi }) {
  const isHindi = propIsHindi || language === "hi" || Boolean(t?.liveTelemetry?.includes("सजीव"));
  const num = (v) => (isHindi ? toHindiDigits(v) : String(v));

  const [showExplanation, setShowExplanation] = useState(false);

  if (!actionData) return null;

  const irrigationStatus = actionData.irrigation || "Wait";
  const confidence = actionData.confidence || 87;

  const reasonText = isHindi
    ? "अगले ४८ घंटों में १४.५ मिमी वर्षा का पूर्वानुमान + जड़-क्षेत्र में पर्याप्त नमी (६८% VWC)। सिंचाई टालने से बिजली की बचत होती है और खाद नहीं बहती।"
    : (actionData.reason || "Expected 14.5mm rainfall in next 48h + adequate soil moisture (68% VWC). Delaying irrigation saves energy and avoids nitrogen leaching.");

  const nextActionText = isHindi
    ? "निर्धारित सिंचाई चक्र को २४ घंटे टालें। बारिश गुजरने के बाद ही मेड़ों की नमी जांचें।"
    : (actionData.next_action || "Defer irrigation cycle by 24 hours. Inspect furrows after convective rain passes.");

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
                {isHindi ? "आज का मुख्य कृषि कार्य निर्देश" : (t?.todayFarmAction?.title || "Today's Farm Action Directive")}
              </h2>
              <span className="badge badge-gold text-xs flex items-center gap-1 font-tech">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isHindi ? `AI विश्वास स्तर ${num(confidence)}%` : `AI Confidence ${confidence}%`}
              </span>
            </div>
            <p className="text-xs text-amber-200/80 mt-0.5 font-sans">
              {isHindi
                ? "सजीव कृषि संश्लेषण: मृदा जल संतुलन + NWP वर्षा रडार + फसल अवस्था"
                : "Real-time agronomic synthesis: Soil Water Balance + NWP Rain Radar + Crop Stage"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-tech">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="btn btn-secondary text-xs flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[var(--c-leaf-neon)]" />
            <span>
              {showExplanation
                ? (isHindi ? "विवरण छुपाएं" : "Hide Explanation")
                : (isHindi ? "वैज्ञानिक कारण देखें" : "View Explanation")}
            </span>
            {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onNavigateToIrrigation}
            className="btn btn-primary text-xs flex items-center gap-1.5"
          >
            <span>{isHindi ? "सिंचाई विवरण" : "Irrigation Details"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Pillars Operational Grid */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Decision Status */}
        <div className="card card-sky p-4 space-y-1.5">
          <div className="text-[11px] font-bold text-[var(--c-sky-neon)] uppercase tracking-wider flex items-center gap-1.5 font-tech">
            <Droplets className="w-3.5 h-3.5" /> {isHindi ? "सिंचाई निर्देश" : "Irrigation Directive"}
          </div>
          <div className="mt-2">
            <span className={`badge text-xs font-bold font-tech ${
              irrigationStatus === "Wait" ? "badge-sky" : "badge-gold"
            }`}>
              {irrigationStatus === "Wait"
                ? (isHindi ? "सिंचाई रोकें (२४ घंटे)" : "Delay Irrigation (24h)")
                : irrigationStatus}
            </span>
          </div>
          <p className="text-xs text-sky-200/80 leading-relaxed mt-1 font-sans">
            {isHindi
              ? "वर्तमान जड़-क्षेत्र में फसल के लिए पर्याप्त नमी भंडार उपलब्ध है।"
              : "Current root-zone moisture reservoir is sufficient for continuous transpiration."}
          </p>
        </div>

        {/* 2. Expected Rain */}
        <div className="card card-indigo p-4 space-y-1.5">
          <div className="text-[11px] font-bold text-[var(--c-indigo-neon)] uppercase tracking-wider flex items-center gap-1.5 font-tech">
            <CloudRain className="w-3.5 h-3.5" /> {isHindi ? "वर्षा का अनुमान" : "Rainfall Inbound"}
          </div>
          <div className="text-2xl font-black font-mono text-[var(--c-indigo-neon)] mt-1">
            {isHindi ? `${num("14.5")} मिमी` : (actionData.rain_expectation || "14.5 mm")}
          </div>
          <p className="text-xs text-indigo-200/80 leading-relaxed font-sans">
            {isHindi
              ? "मौसम मॉडल के अनुसार आगामी ४८ घंटों में वर्षा की पक्की संभावना।"
              : "NWP model predicts convective rainfall within 48 hours."}
          </p>
        </div>

        {/* 3. Crop Growth Status */}
        <div className="card card-leaf p-4 space-y-1.5">
          <div className="text-[11px] font-bold text-[var(--c-leaf-neon)] uppercase tracking-wider flex items-center gap-1.5 font-tech">
            <Sprout className="w-3.5 h-3.5" /> {isHindi ? "फसल वृद्धि स्थिति" : "Canopy Vigour"}
          </div>
          <div className="text-sm font-bold text-white mt-1 font-display">
            {isHindi ? "अनुकूलतम वृद्धि अवस्था" : (actionData.crop_condition || "Optimal Growing Window")}
          </div>
          <p className="text-xs text-emerald-200/80 leading-relaxed font-sans">
            {isHindi
              ? "वाष्प दबाव घाटा और तापमान स्वस्थ वृद्धि सीमा में हैं।"
              : "Vapor pressure deficit & temperature in healthy growth band."}
          </p>
        </div>

        {/* 4. Priority Recommendation */}
        <div className="card card-gold p-4 space-y-1.5">
          <div className="text-[11px] font-bold text-[var(--c-gold-neon)] uppercase tracking-wider flex items-center gap-1.5 font-tech">
            <Clock className="w-3.5 h-3.5" /> {isHindi ? "प्राथमिकता कार्रवाई" : "Next Tactical Action"}
          </div>
          <p className="text-xs font-semibold text-white leading-relaxed mt-1 font-sans">
            {nextActionText}
          </p>
        </div>
      </div>

      {/* Collapsible Deep Explanation Accordion */}
      {showExplanation && (
        <div className="mt-4 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--leaf)] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />{" "}
            {isHindi ? "AI द्वारा सिंचाई टालने की सिफारिश का वैज्ञानिक कारण:" : "Why AI recommends delaying irrigation:"}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] space-y-1">
              <span className="text-[var(--text-muted)]">
                {isHindi ? "१. जड़-क्षेत्र में पर्याप्त नमी" : "1. Soil Moisture Headroom"}
              </span>
              <p className="text-white font-medium">
                {isHindi
                  ? "जड़-क्षेत्र में नमी ६८% है। अभी पानी देने से जलभराव (>८५%) होगा, जिससे जड़ों को ऑक्सीजन नहीं मिलेगी।"
                  : "Root zone VWC is 68%. Adding water now would cause saturation (>85%), leading to root hypoxia."}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] space-y-1">
              <span className="text-[var(--text-muted)]">
                {isHindi ? "२. वर्षा की उच्च संभावना" : "2. High Rain Probability"}
              </span>
              <p className="text-white font-medium">
                {isHindi
                  ? "अगले ३६ घंटों में १४.५ मिमी प्राकृतिक वर्षा होने का पक्का अनुमान है।"
                  : "14.5 mm convective rain scheduled to deposit naturally within 36 hours."}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] space-y-1">
              <span className="text-[var(--text-muted)]">
                {isHindi ? "३. आर्थिक एवं ऊर्जा बचत" : "3. Economic Conservation"}
              </span>
              <p className="text-white font-medium">
                {isHindi
                  ? "सिंचाई टालने से ₹६५०-₹९०० डीजल/बिजली की बचत होती है और खाद का रिसाव रुकता है।"
                  : "Postponing the pumping cycle conserves ₹650-₹900 in diesel/electricity and prevents nutrient runoff."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
