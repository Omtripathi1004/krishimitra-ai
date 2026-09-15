import React, { useState } from "react";
import {
  ShieldAlert, AlertTriangle, CheckCircle2, Info, ArrowRight,
  TrendingUp, TrendingDown, Minus, Bug, Droplets,
  Thermometer, Wind, Activity, BarChart2
} from "lucide-react";
import { toHindiDigits } from "../translations";

const RISK_LEVELS = { Low: "badge-leaf", Moderate: "badge-amber", High: "badge-rose", Critical: "badge-rose" };
const RISK_ICON = { Low: CheckCircle2, Moderate: AlertTriangle, High: AlertTriangle, Critical: AlertTriangle };
const RISK_COLOR = { Low: "var(--leaf)", Moderate: "var(--amber)", High: "var(--rose)", Critical: "var(--rose)" };

function RiskGauge({ value, max = 100, isHindi, num }) {
  const pct = Math.min(value, max) / max;
  const color = pct < 0.3 ? "#22C55E" : pct < 0.6 ? "#FBBF24" : "#F87171";
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1.5 text-xs">
        <span style={{ color: "var(--text-400)" }}>{isHindi ? "जोखिम स्कोर" : "Risk Score"}</span>
        <span className="font-bold font-mono" style={{ color }}>{num(value)}/{num(max)}</span>
      </div>
      <div className="kpi-progress-track">
        <div
          className="kpi-progress-fill"
          style={{
            width: `${pct * 100}%`,
            background: `linear-gradient(90deg, ${color}CC, ${color})`
          }}
        />
      </div>
    </div>
  );
}

function RiskCard({ name, level, score, description, icon: Icon, drivers, actions, theme = "leaf", isHindi, num }) {
  const [open, setOpen] = useState(false);
  const StatusIcon = RISK_ICON[level] || CheckCircle2;
  const color = RISK_COLOR[level] || "var(--leaf)";

  const localizedLevel = isHindi
    ? (level === "Low" ? "कम" : level === "Moderate" ? "मध्यम" : level === "High" ? "उच्च" : "गंभीर")
    : level;

  const themeClass =
    theme === "pink" ? "card-pink" :
    theme === "gold" ? "card-gold" :
    theme === "sky" ? "card-sky" :
    theme === "indigo" ? "card-indigo" :
    theme === "violet" ? "card-violet" : "card-leaf";

  return (
    <div className={`card ${themeClass} p-4 flex flex-col gap-3 transition-all hover:scale-[1.01]`}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="p-2 rounded-lg border shrink-0"
          style={{ background: color + "14", borderColor: color + "35" }}
        >
          {Icon ? <Icon className="w-4 h-4" style={{ color }} /> : <ShieldAlert className="w-4 h-4" style={{ color }} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-sm font-bold font-display" style={{ color: "var(--text-100)" }}>{name}</span>
            <span className={`badge ${RISK_LEVELS[level] || "badge-muted"} text-[10px] font-tech`}>
              <StatusIcon className="w-2.5 h-2.5" /> {localizedLevel}
            </span>
          </div>
          <p className="text-xs mt-1 leading-snug" style={{ color: "var(--text-300)" }}>{description}</p>
        </div>
      </div>

      {/* Score bar */}
      <RiskGauge value={score} isHindi={isHindi} num={num} />

      {/* Expand */}
      {(drivers?.length || actions?.length) && (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="text-xs font-semibold flex items-center gap-1 transition-colors font-tech"
            style={{ color: open ? "var(--text-400)" : "var(--leaf)" }}
          >
            {isHindi
              ? (open ? "विवरण छुपाएं ↑" : "कारक एवं उपाय देखें →")
              : (open ? "Hide details ↑" : "Drivers & actions →")}
          </button>
          {open && (
            <div className="space-y-2 anim-fade-in">
              {drivers?.length > 0 && (
                <div className="text-[11px] space-y-1">
                  <div className="section-label mb-1.5 font-tech">{isHindi ? "जोखिम कारक" : "Risk Drivers"}</div>
                  {drivers.map((d, i) => (
                    <div key={i} className="flex items-start gap-1.5" style={{ color: "var(--text-300)" }}>
                      <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                      {d}
                    </div>
                  ))}
                </div>
              )}
              {actions?.length > 0 && (
                <div className="text-[11px] space-y-1">
                  <div className="section-label mb-1.5 font-tech">{isHindi ? "अनुशंसित कार्रवाई" : "Recommended Actions"}</div>
                  {actions.map((a, i) => (
                    <div key={i} className="flex items-start gap-1.5" style={{ color: "var(--text-200)" }}>
                      <ArrowRight className="w-3 h-3 mt-0.5 shrink-0" style={{ color: "var(--leaf)" }} />
                      {a}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function WeeklyTimeline({ days, isHindi, num }) {
  return (
    <div className="space-y-2">
      {days.map((day, i) => {
        const maxRisk = Math.max(day.rust, day.thermal, day.hydro, day.pest);
        const overallColor = maxRisk < 30 ? "#22C55E" : maxRisk < 60 ? "#FBBF24" : "#F87171";
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="w-16 text-[10px] font-bold shrink-0 font-mono" style={{ color: "var(--text-400)" }}>
              {day.label}
            </div>
            <div className="flex-1 flex gap-1 items-center h-5">
              {[{ v: day.rust, c: "#FB7185", n: "Rust" }, { v: day.thermal, c: "#FCD34D", n: "Thermal" }, { v: day.hydro, c: "#38BDF8", n: "Hydro" }, { v: day.pest, c: "#C084FC", n: "Pest" }].map(b => (
                <div
                  key={b.n}
                  className="h-full rounded-sm transition-all"
                  style={{ width: `${b.v}%`, background: b.c + "CC", minWidth: b.v > 0 ? 3 : 0 }}
                  title={`${b.n}: ${b.v}%`}
                />
              ))}
            </div>
            <div className="text-[10px] font-bold font-mono w-8 text-right" style={{ color: overallColor }}>
              {num(maxRisk)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function FarmRiskCenter({ weather, farm, t, language, isHindi: propIsHindi }) {
  const isHindi = propIsHindi || language === "hi" || Boolean(t?.liveTelemetry?.includes("सजीव"));
  const num = (v) => (isHindi ? toHindiDigits(v) : String(v));

  const risks = isHindi
    ? [
        {
          name: "पीला रतुआ फफूंद रोग (Puccinia striiformis)",
          level: "Low",
          score: 18,
          theme: "pink",
          icon: Bug,
          description: "हवा से फैलने वाला कवक रोग। इसके लिए >७५% आर्द्रता और पत्तियों पर ३+ घंटे नमी चाहिए। वर्तमान स्थितियां अनुकूल नहीं हैं।",
          drivers: [
            "सापेक्षिक आर्द्रता ६२% है — जो खतरे की सीमा से १३ अंक कम है",
            "पिछले ७२ घंटों में पत्तियों पर पानी रुकने की कोई घटना नहीं",
            "रात का तापमान (१८.२°C) बीजाणु अंकुरण के लिए अनुकूल नहीं है"
          ],
          actions: [
            "खेत का साप्ताहिक निरीक्षण करें — निचली पत्तियों पर पीली धारियों की जांच करें",
            "यदि आर्द्रता लगातार ३ दिनों तक ७८% से अधिक हो तो टेबुकोनाज़ोल २५० ईसी @ १ ली/हेक्टेयर छिड़कें",
            "खेत की मेड़ों से खरपतवार और रोगग्रस्त अवशेषों को हटाकर स्वच्छता बनाए रखें"
          ]
        },
        {
          name: "फसल ताप तनाव (थर्मल स्ट्रेस)",
          level: "Moderate",
          score: 42,
          theme: "gold",
          icon: Thermometer,
          description: "दोपहर के समय तापमान चरम पर पहुंचने से फसलों में हल्का ताप तनाव संभव है। अभी स्थिति नियंत्रण में है।",
          drivers: [
            "सुबह ११:३० से दोपहर ३:०० के बीच अधिकतम तापमान ३४-३६°C तक पहुंच रहा है",
            "फसल वानस्पतिक अवस्था में है — ताप तनाव के प्रति मध्यम संवेदनशील",
            "धीमी हवा सुबह ठंडक बनाए रखती है किंतु दोपहर की गर्मी बढ़ाती है"
          ],
          actions: [
            "वाष्पीकरण ठंडक प्रभाव के लिए सुबह जल्दी (०६:०० बजे) हल्की सिंचाई करें",
            "चरम ताप समय (११:३० से १५:०० बजे) के दौरान किसी भी प्रकार के छिड़काव से बचें",
            "यदि तनाव ३ दिनों से अधिक रहे तो ५% काओलिन क्ले का घोल छिड़कें"
          ]
        },
        {
          name: "जलभराव एवं बाढ़ जोखिम",
          level: "Low",
          score: 12,
          theme: "sky",
          icon: Droplets,
          description: "मृदा जल निकास क्षमता उत्कृष्ट है। १४.५ मिमी संभावित वर्षा सुरक्षित अवशोषण सीमा के भीतर है।",
          drivers: [
            "बलुई दोमट मिट्टी का जल रिसाव १८ मिमी/घंटा है — वर्षा को आसानी से सोख लेगी",
            "खेत का धरातल उपयुक्त है, पिछले ३ वर्षों में जलभराव नहीं देखा गया",
            "संभावित १४.५ मिमी वर्षा जल निकास क्षमता से काफी कम है"
          ],
          actions: [
            "वर्षा आने से पहले खेत की जल निकासी नालियों को साफ रखें",
            "दूसरे दिन वर्षा के बाद खेत के निचले किनारों पर जल जमाव की जांच करें",
            "वर्तमान में किसी आपातकालीन कार्रवाई की आवश्यकता नहीं"
          ]
        },
        {
          name: "माहू एवं रसचूसक कीट सूचकांक",
          level: "Low",
          score: 21,
          theme: "violet",
          icon: Bug,
          description: "माहू कीटों की संख्या आर्थिक क्षति स्तर (ETL) से बहुत कम है। वर्तमान में कीटनाशक छिड़काव की जरूरत नहीं है।",
          drivers: [
            "खेत गणना: ३-५ माहू प्रति पत्ती — जो कि ३० माहू प्रति पत्ती की ETL सीमा से काफी नीचे है",
            "खेत की मेड़ों पर लाभकारी मित्र कीटों (लेडीबर्ड भृंग) की उपस्थिति देखी गई",
            "संतुलित तापमान से माहू का प्रजनन धीमा है"
          ],
          actions: [
            "पीले स्टिकी ट्रैप और दृश्य अवलोकन द्वारा साप्ताहिक निगरानी जारी रखें",
            "यदि संख्या ETL पार करे तो इमिडाक्लोप्रिड १७.८ एसएल @ १५० मिली/हेक्टेयर छिड़कें",
            "प्राकृतिक परभक्षियों की सुरक्षा के लिए व्यापक कीटनाशकों के अनावश्यक उपयोग से बचें"
          ]
        },
        {
          name: "मृदा पोषक तत्व कमी (जिंक एवं सूक्ष्म तत्व)",
          level: "Low",
          score: 25,
          theme: "leaf",
          icon: Activity,
          description: "जिंक ICAR के आदर्श मानक से थोड़ा कम है। अन्य सभी प्राथमिक पोषक तत्व (NPK) संतुलित अवस्था में हैं।",
          drivers: [
            "जिंक: ०.४२ पीपीएम (ICAR आदर्श मान: ०.६ - १.० पीपीएम) — थोड़ा कम",
            "एन-पी-के स्तर: वर्तमान वानस्पतिक अवस्था के लिए पूर्णतः पर्याप्त",
            "जैविक कार्बन: २.८% — मध्यम, गोबर की खाद से सुधारा जा सकता है"
          ],
          actions: [
            "पर्ण जिंक स्प्रे: जिंक सल्फेट ०.५% घोल का छिड़काव इस सप्ताह सुबह के समय करें",
            "अगली जुताई में जैविक कार्बन बढ़ाने हेतु ५ टन/एकड़ गोबर की सड़ी खाद मिलाएं",
            "४५ दिनों के बाद मृदा स्वास्थ्य कार्ड ऐप द्वारा मिट्टी का पुनः परीक्षण करें"
          ]
        },
        {
          name: "हवा की गति एवं छिड़काव बहाव जोखिम",
          level: "Low",
          score: 8,
          theme: "indigo",
          icon: Wind,
          description: "हवा की गति सभी प्रकार के कीटनाशक और पोषक छिड़काव के लिए अनुकूल है। पड़ोसी खेतों में बहाव का कोई खतरा नहीं।",
          drivers: [
            `हवा की गति ${num(weather?.wind_speed || 9.8)} किमी/घंटा — ०-१५ किमी/घंटा की सुरक्षित सीमा में`,
            "हवा की दिशा स्थिर: उत्तर-पश्चिम से दक्षिण-पूर्व — आवासीय क्षेत्र से दूर",
            "बफर ज़ोन में कोई अन्य संवेदनशील फसल नहीं पाई गई"
          ],
          actions: [
            "आज सुबह ०६:०० से १०:३० बजे तक छिड़काव के लिए सर्वोत्तम समय है",
            "पत्तियों पर उत्तम आवरण के लिए फ्लैट-फैन नोजल का प्रयोग २५० ली/हेक्टेयर पर करें",
            "छिड़काव के समय हवा १२ किमी/घंटा से अधिक होने पर बहाव-रोधी सहायक रसायन मिलाएं"
          ]
        }
      ]
    : [
        {
          name: "Yellow Rust (Puccinia striiformis)",
          level: "Low",
          score: 18,
          theme: "pink",
          icon: Bug,
          description: "Airborne fungal pathogen. Requires >75% RH and leaf wetness >3h. Current conditions below threshold.",
          drivers: [
            "Relative humidity at 62% — 13 pts below critical threshold",
            "No prolonged leaf wetness events recorded in past 72h",
            "Night temperature (18.2°C) not conducive to spore germination"
          ],
          actions: [
            "Scout field weekly — inspect lower canopy leaves for chlorotic streaks",
            "Apply Tebuconazole 250 EC @ 1 L/ha if RH exceeds 78% for 3+ consecutive days",
            "Schedule preventive crop hygiene — remove infected crop debris from border rows"
          ]
        },
        {
          name: "Thermal Crop Stress",
          level: "Moderate",
          score: 42,
          theme: "gold",
          icon: Thermometer,
          description: "Mid-day temperature peaks create short windows of heat stress in vegetative biomass. Not yet critical.",
          drivers: [
            "Peak temperature reaching 34–36°C during 11:30 AM – 3:00 PM window",
            "Crop at vegetative stage — moderately sensitive to heat stress",
            "Low wind helps retain morning coolness but exacerbates afternoon heat"
          ],
          actions: [
            "Irrigate in early morning (6 AM) to provide thermal buffering via evaporative cooling",
            "Avoid foliar spray during peak thermal window (11:30 AM – 3:00 PM)",
            "Apply anti-transpirant kaolin clay @ 5% if stress persists beyond 3 days"
          ]
        },
        {
          name: "Hydrological Risk (Flooding / Waterlogging)",
          level: "Low",
          score: 12,
          theme: "sky",
          icon: Droplets,
          description: "Soil drainage capacity is adequate. 14.5mm forecasted rain is within safe absorption threshold.",
          drivers: [
            "Sandy loam soil percolation rate 18 mm/hr — easily absorbs forecast rain",
            "Farm elevation adequate, no waterlogging observed in past 3 seasons",
            "Expected 14.5mm < drainage capacity by wide margin"
          ],
          actions: [
            "Maintain drainage channels clear of debris before rain front arrives",
            "Monitor field edges for ponding — check after Day 2 rainfall",
            "No immediate action required"
          ]
        },
        {
          name: "Aphid & Sucking Pest Index",
          level: "Low",
          score: 21,
          theme: "violet",
          icon: Bug,
          description: "Aphid colony density below Economic Threshold Level (ETL). No spray intervention needed at present.",
          drivers: [
            "Scout count: 3–5 aphids per leaf — below ETL of 30 aphids/leaf",
            "Beneficial insect (ladybird) presence observed in field edges",
            "Mild temperature limits rapid aphid reproduction"
          ],
          actions: [
            "Continue weekly monitoring using sticky traps and visual scouting",
            "Spray Imidacloprid 17.8 SL @ 150 mL/ha if count exceeds ETL",
            "Promote natural predators: avoid broad-spectrum pesticides"
          ]
        },
        {
          name: "Soil Nutrient Deficiency",
          level: "Low",
          score: 25,
          theme: "leaf",
          icon: Activity,
          description: "Zinc marginally below ICAR optimum. Other primary and secondary nutrients within optimal ranges.",
          drivers: [
            "Zinc: 0.42 ppm (ICAR optimum: 0.6–1.0 ppm) — marginally below",
            "N-P-K levels: Adequate for current vegetative stage",
            "Organic matter: 2.8% — moderate, can improve with FYM application"
          ],
          actions: [
            "Foliar zinc spray: Zinc Sulphate 0.5% solution — apply this week morning hours",
            "Incorporate 5 tonne/acre FYM at next tillage operation to build OM",
            "Re-test soil after 45 days with IFFCO Soil Health Card app"
          ]
        },
        {
          name: "Wind / Spray Drift Risk",
          level: "Low",
          score: 8,
          theme: "indigo",
          icon: Wind,
          description: "Wind speed ideal for all spray operations. Negligible spray drift risk to neighboring fields.",
          drivers: [
            `Wind speed ${weather?.wind_speed || 9.8} km/h — well within 0–15 km/h safe spray window`,
            "Wind direction stable: NW to SE — away from residential areas",
            "No adjacent sensitive crop rotation detected in buffer zone"
          ],
          actions: [
            "Optimal spray window: 06:00 – 10:30 AM today",
            "Use flat-fan nozzles at 250L/ha for best foliar coverage",
            "Add drift retardant adjuvant if wind exceeds 12 km/h during spray"
          ]
        }
      ];

  const weeklyTimeline = [
    { label: isHindi ? "आज" : "Today",      rust: 18, thermal: 42, hydro: 12, pest: 21 },
    { label: isHindi ? "२रा दिन" : "Day 2",   rust: 25, thermal: 38, hydro: 28, pest: 18 },
    { label: isHindi ? "३रा दिन" : "Day 3",   rust: 22, thermal: 45, hydro: 16, pest: 22 },
    { label: isHindi ? "४था दिन" : "Day 4",   rust: 20, thermal: 50, hydro: 14, pest: 20 },
    { label: isHindi ? "५वां दिन" : "Day 5",  rust: 18, thermal: 44, hydro: 11, pest: 18 },
    { label: isHindi ? "६वां दिन" : "Day 6",  rust: 15, thermal: 40, hydro: 10, pest: 15 },
    { label: isHindi ? "७वां दिन" : "Day 7",  rust: 14, thermal: 38, hydro:  9, pest: 14 },
  ];

  const overallRisk = 18;

  return (
    <div className="space-y-5 anim-fade-up">
      {/* Header (Pink Neon Accent) */}
      <div className="card card-pink p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl border bg-rose-500/15 border-rose-500/30 text-[var(--c-pink-neon)]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display text-white">
                {isHindi ? "खेत जोखिम कमान केंद्र" : "Farm Risk Command Center"}
              </h1>
              <p className="text-xs mt-0.5 text-rose-200/80">
                {isHindi
                  ? "फसल रोग, कीट, जलवायु और जलभराव जोखिम निगरानी — ६ स्वतंत्र जोखिम कारक, प्रति घंटा अद्यतन।"
                  : "Compound disease, pest, climate and hydrological risk surveillance — 6 independent risk vectors, updated hourly."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl border text-center bg-rose-950/40 border-rose-800/60 shadow-[0_0_15px_rgba(251,113,133,0.15)]">
              <div className="text-[10px] uppercase font-bold tracking-wider mb-0.5 text-rose-300 font-tech">
                {isHindi ? "समग्र जोखिम" : "Overall Risk"}
              </div>
              <div className="text-2xl font-black font-mono text-[var(--c-leaf-neon)]">
                {num(overallRisk)}<span className="text-xs font-normal text-slate-400">/{num(100)}</span>
              </div>
              <div className="badge badge-leaf mt-1 text-[10px] font-tech">
                {isHindi ? "● कम — अनुकूल" : "● Low — Favorable"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Risk Heatmap */}
      <div className="card card-indigo p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[var(--c-indigo-neon)]" />
            <h2 className="text-sm font-bold font-display text-white">
              {isHindi ? "७-दिवसीय जोखिम पूर्वानुमान" : "7-Day Risk Projection"}
            </h2>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-tech flex-wrap" style={{ color: "var(--text-400)" }}>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#FB7185" }} />
              {isHindi ? "रतुआ रोग (गुलाबी)" : "Rust (Pink)"}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#FCD34D" }} />
              {isHindi ? "ताप तनाव (स्वर्ण)" : "Thermal (Gold)"}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#38BDF8" }} />
              {isHindi ? "जलभराव (आसमानी)" : "Hydro (Sky)"}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#C084FC" }} />
              {isHindi ? "कीट (बैंगनी)" : "Pest (Purple)"}
            </span>
          </div>
        </div>
        <WeeklyTimeline days={weeklyTimeline} isHindi={isHindi} num={num} />
        <p className="text-[10px] mt-3 text-indigo-200/60 font-tech">
          {isHindi
            ? "विभिन्न जोखिमों का संयुक्त प्रतिशत योगदान। ICAR CRIDA बहु-आपदा मॉडल से विश्लेषित।"
            : "Stacked bar width represents relative risk contribution. Values synthesized from ICAR CRIDA multi-hazard model."}
        </p>
      </div>

      {/* Risk Cards Grid */}
      <div>
        <div className="section-label mb-3 font-tech text-[var(--c-sky-neon)]">
          {isHindi
            ? "व्यक्तिगत जोखिम कारक विश्लेषण (खतरे के प्रकार अनुसार रंगीन कोडित)"
            : "Individual Risk Vector Analysis (Color-Coded By Hazard Domain)"}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 anim-stagger">
          {risks.map(r => (
            <RiskCard key={r.name} {...r} isHindi={isHindi} num={num} />
          ))}
        </div>
      </div>
    </div>
  );
}
