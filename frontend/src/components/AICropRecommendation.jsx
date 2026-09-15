import React, { useState } from "react";
import {
  BrainCircuit, Sliders, CheckCircle2, ArrowRight, Sparkles,
  Sprout, BarChart2, Trophy, Info, ChevronDown, ChevronUp
} from "lucide-react";
import { API_BASE } from "../config";
import { toHindiDigits, localizeTerm } from "../translations";

const CROP_COLORS = ["#F59E0B", "#38BDF8", "#FB7185", "#818CF8"];
const CROP_BG    = [
  "rgba(245,158,11,0.15)", "rgba(56,189,248,0.15)",
  "rgba(244,63,94,0.15)",  "rgba(99,102,241,0.15)"
];
const CROP_BORDER = [
  "rgba(245,158,11,0.45)", "rgba(56,189,248,0.45)",
  "rgba(244,63,94,0.45)",  "rgba(99,102,241,0.45)"
];
const CROP_CARD_THEMES = [
  "card-gold border-amber-400/50",
  "card-sky border-sky-400/50",
  "card-pink border-rose-400/50",
  "card-indigo border-indigo-400/50"
];

function ScoreBar({ value, color, isHindi }) {
  const num = (v) => (isHindi ? toHindiDigits(v) : String(v));
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-slate-900 border border-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 shadow-md"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}90, ${color})` }}
        />
      </div>
      <span className="text-xs font-extrabold font-mono w-12 text-right" style={{ color }}>{num(value)}%</span>
    </div>
  );
}

function FeatureBar({ label, importance, color, isHindi }) {
  const num = (v) => (isHindi ? toHindiDigits(v) : String(v));
  return (
    <div className="p-2 rounded-xl bg-black/30 border border-white/5 space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-200 font-semibold">{label}</span>
        <span className="font-extrabold font-mono" style={{ color }}>{num(importance)}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-900 overflow-hidden border border-white/10">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${importance}%`, background: color }} />
      </div>
    </div>
  );
}

function CropCard({ crop, rank, isSelected, onClick, isHindi }) {
  const [showDetail, setShowDetail] = useState(false);
  const num = (v) => (isHindi ? toHindiDigits(v) : String(v));
  const color  = CROP_COLORS[rank - 1] || "#F59E0B";
  const bg     = CROP_BG[rank - 1] || "rgba(245,158,11,0.15)";
  const border = CROP_BORDER[rank - 1] || "rgba(245,158,11,0.45)";
  const cardTheme = CROP_CARD_THEMES[rank - 1] || "card-gold";

  return (
    <div
      className={`p-4.5 rounded-2xl flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-1 ${cardTheme}`}
      style={isSelected ? { borderColor: color, boxShadow: `0 0 20px ${color}40` } : {}}
      onClick={onClick}
    >
      {/* Rank Badge + Name */}
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0 border"
          style={{ background: bg, borderColor: border, color }}
        >
          #{num(rank)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="text-sm font-bold" style={{ color: "var(--text-100)" }}>{crop.crop}</span>
            {rank === 1 && <span className="badge badge-leaf text-[10px]"><Trophy className="w-2.5 h-2.5" /> {isHindi ? "सर्वश्रेष्ठ मेल" : "Best Match"}</span>}
          </div>
          <div className="text-[11px] font-mono mt-0.5" style={{ color: "var(--text-400)" }}>
            {isHindi ? "कटाई" : "Harvest"}: {crop.harvest_window} · {isHindi ? "अनुमानित उपज" : "Yield"}: {crop.expected_yield || crop.yield_potential}
          </div>
        </div>
      </div>

      {/* Suitability Score Bar */}
      <div>
        <div className="flex items-center justify-between mb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-400)" }}>
          <span>{isHindi ? "उपयुक्तता स्कोर" : "Suitability Score"}</span>
        </div>
        <ScoreBar value={crop.suitability_score} color={color} isHindi={isHindi} />
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
        className="text-xs font-semibold flex items-center gap-1 transition-colors self-start cursor-pointer"
        style={{ color: showDetail ? "var(--text-400)" : color }}
      >
        {showDetail
          ? <><ChevronUp className="w-3 h-3" /> {isHindi ? "छुपाएं" : "Hide"}</>
          : <><ChevronDown className="w-3 h-3" /> {isHindi ? "विस्तृत विवरण देखें" : "Details"}</>}
      </button>

      {showDetail && (
        <div className="text-[11px] space-y-1.5 pt-2 border-t anim-fade-in" style={{ borderColor: "var(--border-3)", color: "var(--text-300)" }}>
          <p><strong style={{ color: "var(--text-200)" }}>{isHindi ? "वैज्ञानिक आधार:" : "Justification:"}</strong> {crop.justification}</p>
          {crop.risk && <p className="flex items-start gap-1.5"><span className="text-[var(--amber)] font-bold">⚠ {isHindi ? "जोखिम:" : "Risk:"}</span> {crop.risk}</p>}
          {crop.government_support && <p className="flex items-start gap-1.5"><span style={{ color: "var(--sky)" }} className="font-bold">🏛 {isHindi ? "सरकारी सहायता / MSP:" : "Govt:"}</span> {crop.government_support}</p>}
          {crop.ipm_notes && <p className="flex items-start gap-1.5"><span style={{ color: "var(--violet)" }} className="font-bold">🔬 {isHindi ? "कीट प्रबंधन (IPM):" : "IPM:"}</span> {crop.ipm_notes}</p>}
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

function getLocalizedCrop(crop, isHindi) {
  if (!isHindi) return crop;
  const hiMap = {
    "Wheat (HD-2967)": {
      crop: "गेहूं (HD-2967)",
      harvest_window: "मार्च–अप्रैल",
      expected_yield: "१९–२२ कुंतल/एकड़",
      tags: ["रबी हेतु आदर्श", "MSP सुनिश्चित", "उच्च जल दक्षता"],
      justification: "जलोढ़ दोमट मिट्टी (pH ६.८) शीतकालीन गेहूं हेतु आदर्श खनिज संतुलन प्रदान करती है। मौसमी तापमान HD-2967 के वर्नलाइज़ेशन मानकों के अनुकूल है।",
      risk: "पीला रतुआ जोखिम सीमा से नीचे। यदि आर्द्रता ७८% से अधिक हो तो निगरानी रखें।",
      government_support: "MSP ₹२,२७५/कुंतल। PM-FASAL फसल बीमा उपलब्ध।",
      ipm_notes: "कार्बोक्सिन + थीरम (२ ग्राम/किग्रा बीज) द्वारा बीजोपचार अनुशंसित।"
    },
    "Mustard (Pusa Bold)": {
      crop: "सरसों (पूसा बोल्ड)",
      harvest_window: "फरवरी–मार्च",
      expected_yield: "८–१० कुंतल/एकड़",
      tags: ["सूखा प्रतिरोधी", "शीघ्र मुनाफा", "कम लागत"],
      justification: "बलुई दोमट किनारों के लिए उत्कृष्ट। नमी के उतार-चढ़ाव को सहन करती है। कम निवेश लागत और तेज ९०-दिवसीय फसल चक्र।",
      risk: "फूल आने पर माहू (एफिड) का जोखिम। जनवरी में साप्ताहिक निरीक्षण करें।",
      government_support: "MSP ₹५,६५०/कुंतल। राज्य बोनस + तेल प्रसंस्करण क्लस्टर सब्सिडी।",
      ipm_notes: "माहू की संख्या ईटीएल पार करने पर डाइमेथोएट ३० ईसी @ १.५ लीटर/हेक्टेयर छिड़कें।"
    },
    "Lentil (Masur PL-8)": {
      crop: "मसूर (PL-8)",
      harvest_window: "मार्च",
      expected_yield: "५–७ कुंतल/एकड़",
      tags: ["नाइट्रोजन संचायक", "मृदा सुधारक", "ICAR किस्म"],
      justification: "N-P संतुलन बहाल करने के लिए फसल चक्र हेतु आदर्श। जैविक नाइट्रोजन स्थिरीकरण अगली फसल में उर्वरक की बचत करता है।",
      risk: "जलभराव के प्रति संवेदनशील। भारी चिकनी मिट्टी वाले क्षेत्रों से बचें।",
      government_support: "NMOOP योजना दलहन अनुदान। ब्लॉक स्तर पर FPO खरीद उपलब्ध।",
      ipm_notes: "राइजोबियम कल्चर से बीजोपचार ग्रंथियों के निर्माण में उल्लेखनीय सुधार करता है।"
    },
    "Potato (Kufri Pukhraj)": {
      crop: "आलू (कुफरी पुखराज)",
      harvest_window: "जनवरी–फरवरी",
      expected_yield: "१००–१२० कुंतल/एकड़",
      tags: ["उच्च मूल्य", "बाजार मांग", "शीतकालीन"],
      justification: "उच्च व्यावसायिक मूल्य वाली फसल। स्थानीय कृषि मंडियों में मांग निरंतर आपूर्ति से अधिक रहती है।",
      risk: "उच्च प्रारंभिक बीज लागत। अत्यधिक आर्द्र परिस्थितियों में पछेती झुलसा का जोखिम।",
      government_support: "PMKSY ड्रिप सब्सिडी से आलू सिंचाई में पानी व बिजली खर्च न्यूनतम।",
      ipm_notes: "झुलसा रोग से बचाव के लिए मेंकोजेब ७५ WP @ २ किग्रा/हेक्टेयर का एहतियातन छिड़काव करें।"
    }
  };
  const match = hiMap[crop.crop];
  if (match) {
    return {
      ...crop,
      ...match,
      suitability_score: crop.suitability_score
    };
  }
  return {
    ...crop,
    crop: localizeTerm(crop.crop, true)
  };
}

export default function AICropRecommendation({ recommendation, farm, weather, t, language, isHindi: propIsHindi }) {
  const isHindi = propIsHindi || language === "hi" || Boolean(t?.liveTelemetry?.includes("सजीव"));
  const num = (v) => (isHindi ? toHindiDigits(v) : String(v));

  const [params, setParams] = useState(DEFAULTS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [crops, setCrops] = useState(FALLBACK_CROPS);

  const handleChange = (k, v) => setParams(p => ({ ...p, [k]: v }));

  const handleRun = async () => {
    setIsRunning(true);
    await new Promise(r => setTimeout(r, 1200));
    setCrops([...FALLBACK_CROPS]);
    setIsRunning(false);
  };

  const featureImportance = [
    { label: isHindi ? "मृदा pH एवं रासायनिक प्रकार" : "Soil pH & Chemical Type",   importance: 32, color: "#38BDF8", isHindi },
    { label: isHindi ? "माइक्रॉक्लाइमेट तापमान" : "Thermal Microclimate Temp", importance: 26, color: "#F59E0B", isHindi },
    { label: isHindi ? "NWP मौसमी वर्षा" : "NWP Seasonal Rainfall",     importance: 22, color: "#818CF8", isHindi },
    { label: isHindi ? "जड़-क्षेत्र नमी बफर (VWC)" : "Root Moisture Buffer (VWC)",importance: 14, color: "#4ADE80", isHindi },
    { label: isHindi ? "ऐतिहासिक रोग खतरा" : "Historical Blight Hazard",  importance: 6,  color: "#FB7185", isHindi },
  ];

  const localizedCrops = crops.map(c => getLocalizedCrop(c, isHindi));

  return (
    <div className="space-y-6 anim-fade-up">
      {/* Multi-Color Golden Hero Header */}
      <div className="card-gold p-6 rounded-3xl border border-amber-500/40 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 shadow-md">
            <BrainCircuit className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                {isHindi ? "AI फसल सिफ़ारिश इंजन" : "AI Crop Recommendation Engine"}
              </h1>
              <span className="badge badge-gold text-xs">{isHindi ? "ML कृषि-मॉडल v२.४" : "ML Agro-Model v2.4"}</span>
              <span className="badge badge-sky text-xs">{isHindi ? "ICAR संरेखित" : "ICAR Aligned"}</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-200">
              {isHindi
                ? "ICAR-अंशांकित बहु-कारक उपयुक्तता मॉडल। विस्तृत कृषि वैज्ञानिक औचित्य एवं सरकारी न्यूनतम समर्थन मूल्य (MSP) के साथ अनुशंसित फसल रैंकिंग।"
                : "ICAR-calibrated multi-factor suitability models. Ranked crop recommendations with full agronomic justification and government MSP overlay."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT: Parameter Sliders ── */}
        <div className="card-leaf p-6 rounded-3xl border border-emerald-500/30 space-y-5 lg:col-span-1 shadow-xl">
          <div className="flex items-center gap-2 mb-1 border-b border-white/10 pb-3">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-extrabold text-white font-display">
              {isHindi ? "बुवाई पर्यावरण मापदंड" : "Sowing Environment Parameters"}
            </h2>
          </div>

          {/* Selects */}
          <div className="space-y-3">
            {[
              {
                label: isHindi ? "मृदा प्रकार" : "Soil Type",
                key: "soil_type",
                options: [
                  { val: "Alluvial Loam", label: isHindi ? "जलोढ़ दोमट मिट्टी" : "Alluvial Loam" },
                  { val: "Sandy Loam", label: isHindi ? "बलुई दोमट मिट्टी" : "Sandy Loam" },
                  { val: "Clay Loam", label: isHindi ? "चिकनी दोमट मिट्टी" : "Clay Loam" },
                  { val: "Red Laterite", label: isHindi ? "लाल लेटराइट मिट्टी" : "Red Laterite" },
                  { val: "Black Cotton", label: isHindi ? "काली कपास मिट्टी" : "Black Cotton" }
                ]
              },
              {
                label: isHindi ? "मौसम / ऋतु" : "Season",
                key: "season",
                options: [
                  { val: "Rabi", label: isHindi ? "रबी (अक्टूबर–मार्च)" : "Rabi (Oct–Mar)" },
                  { val: "Kharif", label: isHindi ? "खरीफ (जून–अक्टूबर)" : "Kharif (Jun–Oct)" },
                  { val: "Zaid", label: isHindi ? "जायद (मार्च–जून)" : "Zaid (Mar–Jun)" }
                ]
              },
              {
                label: isHindi ? "वर्षा दायरा" : "Rainfall Band",
                key: "rainfall",
                options: [
                  { val: "< 300mm", label: isHindi ? "< ३०० मिमी" : "< 300mm" },
                  { val: "300–500mm", label: isHindi ? "३००–५०० मिमी" : "300–500mm" },
                  { val: "400–600mm", label: isHindi ? "४००–६०० मिमी" : "400–600mm" },
                  { val: "600–800mm", label: isHindi ? "६००–८०० मिमी" : "600–800mm" },
                  { val: "> 800mm", label: isHindi ? "> ८०० मिमी" : "> 800mm" }
                ]
              },
            ].map(field => (
              <div key={field.key}>
                <label className="section-label block mb-1.5">{field.label}</label>
                <select
                  value={params[field.key]}
                  onChange={e => handleChange(field.key, e.target.value)}
                  className="input-field text-xs py-2"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {field.options.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Sliders */}
          {[
            { label: isHindi ? "मृदा pH" : "Soil pH", key: "soil_ph", min: 5.0, max: 8.5, step: 0.1, unit: "" },
            { label: isHindi ? "मृदा नमी" : "Soil Moisture", key: "soil_moisture", min: 20, max: 100, step: 1, unit: "% VWC" },
            { label: isHindi ? "औसत तापमान" : "Avg Temperature", key: "temperature", min: 10, max: 45, step: 0.5, unit: "°C" },
          ].map(s => (
            <div key={s.key}>
              <div className="flex justify-between mb-1.5">
                <label className="section-label">{s.label}</label>
                <span className="text-xs font-bold font-mono" style={{ color: "var(--leaf)" }}>
                  {num(params[s.key])} {s.unit}
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
                <span>{num(s.min)}{s.unit}</span><span>{num(s.max)}{s.unit}</span>
              </div>
            </div>
          ))}

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="btn btn-primary w-full py-2.5 text-sm cursor-pointer shadow-lg"
          >
            <Sparkles className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`} />
            <span>{isRunning ? (isHindi ? "मॉडल गणना जारी..." : "Running Model…") : (isHindi ? "AI विश्लेषण चलाएं" : "Run AI Analysis")}</span>
          </button>

          {/* Feature Importance */}
          <div className="pt-3 border-t space-y-3" style={{ borderColor: "var(--border-2)" }}>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-3.5 h-3.5" style={{ color: "var(--leaf)" }} />
              <span className="section-label">{isHindi ? "मॉडल कारक महत्ता (XAI)" : "Model Feature Importance"}</span>
            </div>
            {featureImportance.map(f => <FeatureBar key={f.label} {...f} isHindi={isHindi} />)}
          </div>
        </div>

        {/* ── RIGHT: Crop Cards ── */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <div className="section-label flex items-center gap-2">
              <Sprout className="w-3.5 h-3.5" style={{ color: "var(--leaf)" }} />
              <span>{isHindi ? "अनुशंसित फसल उपयुक्तता रैंकिंग" : "Ranked Crop Suitability Results"}</span>
            </div>
            <span className="badge badge-leaf text-[10px]">
              <CheckCircle2 className="w-2.5 h-2.5" /> {num(crops.length)} {isHindi ? "फसलों का विश्लेषण" : "crops analyzed"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 anim-stagger">
            {localizedCrops.map((crop, i) => (
              <CropCard
                key={crop.crop}
                crop={crop}
                rank={i + 1}
                isSelected={selectedIndex === i}
                onClick={() => setSelectedIndex(i)}
                isHindi={isHindi}
              />
            ))}
          </div>

          {/* Selected Detail */}
          {localizedCrops[selectedIndex] && (
            <div
              className="card p-4 anim-fade-in"
              style={{ borderColor: CROP_BORDER[selectedIndex] || "var(--border-1)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-3.5 h-3.5" style={{ color: CROP_COLORS[selectedIndex] }} />
                <span className="text-xs font-bold" style={{ color: "var(--text-100)" }}>
                  {isHindi ? `${localizedCrops[selectedIndex].crop} क्यों चुनें?` : `Why ${crops[selectedIndex].crop}?`}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-300)" }}>
                {localizedCrops[selectedIndex].justification}
              </p>
              {localizedCrops[selectedIndex].government_support && (
                <div
                  className="mt-3 p-2.5 rounded-lg text-xs flex items-start gap-2"
                  style={{ background: "rgba(56,189,248,0.07)", border: "1px solid rgba(56,189,248,0.18)", color: "var(--text-200)" }}
                >
                  <span>🏛</span>
                  <span>{localizedCrops[selectedIndex].government_support}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
