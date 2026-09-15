import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Clock,
  Radio,
  CheckCircle2,
  Layers,
  Award
} from "lucide-react";
import { toHindiDigits } from "../translations";

export const AD_SCENES_EN = [
  {
    id: "dashboard",
    tab: "dashboard",
    sceneNumber: 1,
    duration: 13,
    title: "Unified Hyperlocal Command Center",
    category: "Real-Time Telemetry & Autopilot",
    badge: "SCENE 1 • OVERVIEW",
    tagline: "Total Farm Vitality at a Single Glance",
    working: "Continuously tracks 6-vector environmental telemetry (Soil % VWC, NDVI canopy vitality, ET0 evapotranspiration, and compound agro-risk). Autonomous AI evaluates field conditions and prescribes instant agronomic directives.",
    impactMetric: "+35% Yield Predictability",
    metricSubtitle: "24/7 AI-monitored micro-climate & rhizosphere",
    highlightSelector: ".kpi-grid, .ai-banner, .dashboard-grid",
    action: "pan"
  },
  {
    id: "cropIntelligence",
    tab: "cropIntelligence",
    sceneNumber: 2,
    duration: 13,
    title: "ICAR-Trained ML Crop Intelligence",
    category: "Explainable Machine Learning",
    badge: "SCENE 2 • AI PREDICTIONS",
    tagline: "Multi-Objective Crop Ranking with 98.4% Accuracy",
    working: "Ingests soil Nitrogen, Phosphorus, Potassium, soil pH, and seasonal precipitation forecasts. Uses Random Forest algorithms trained on ICAR observational data to rank highest-margin crops with complete feature attribution.",
    impactMetric: "98.4% ML Precision",
    metricSubtitle: "Ranked by water efficiency, profit margin & climate resilience",
    highlightSelector: ".recommendation-card, .explainability-section",
    action: "scroll-mid"
  },
  {
    id: "weather",
    tab: "weather",
    sceneNumber: 3,
    duration: 13,
    title: "Hyperlocal Numerical Weather & Spray Advisory",
    category: "Agro-Meteorological Radar",
    badge: "SCENE 3 • WEATHER FORECAST",
    tagline: "Prevent Chemical Wash-off & Crop Heat Stress",
    working: "Delivers precision hourly temperature, humidity, dew-point curves, and wind vectors. Automatically models safe chemical spraying windows to ensure zero fungicide or pesticide wastage.",
    impactMetric: "Zero Spray Wastage",
    metricSubtitle: "Safe spray windows + 7-day precipitation horizon",
    highlightSelector: ".spray-advisory, .weather-chart",
    action: "scroll-mid"
  },
  {
    id: "smartIrrigation",
    tab: "smartIrrigation",
    sceneNumber: 4,
    duration: 13,
    title: "Precision Micro-Irrigation & Water Conservation",
    category: "Hydrology & Valve Telemetry",
    badge: "SCENE 4 • SMART IRRIGATION",
    tagline: "Save Groundwater with Automated Drip Scheduling",
    working: "Calculates daily soil moisture depletion and root-zone water deficits based on Penman-Monteith ET0. Syncs with solar pumps to deliver precise liters per acre, preventing over-watering and root rot.",
    impactMetric: "40% Water Saved",
    metricSubtitle: "Solar pump automation + automated soil moisture recharge",
    highlightSelector: ".irrigation-card, .valve-controls",
    action: "scroll-mid"
  },
  {
    id: "maps",
    tab: "maps",
    sceneNumber: 5,
    duration: 13,
    title: "Geospatial Satellite Parcel GIS & NDVI",
    category: "Satellite Earth Observation",
    badge: "SCENE 5 • SATELLITE MAP",
    tagline: "High-Resolution Parcel Snapping & Multi-Layer Overlays",
    working: "Interactive Leaflet geospatial mapping with GPS auto-detection, satellite basemaps, and parcel perimeter measurement. Allows farmers to monitor field topography and soil type distribution.",
    impactMetric: "Sub-Meter Precision",
    metricSubtitle: "Boundary perimeter calculation & satellite reconnaissance",
    highlightSelector: ".leaflet-container, .map-controls",
    action: "pan"
  },
  {
    id: "viksitBharat",
    tab: "viksitBharat",
    sceneNumber: 6,
    duration: 13,
    title: "Official Viksit Bharat Schemes & CCEA MSP Rates",
    category: "Government Agricultural Economics",
    badge: "SCENE 6 • VIKSIT BHARAT",
    tagline: "Guaranteed Floor Prices & 50%+ Production Profit Margins",
    working: "Connects directly to Cabinet Committee on Economic Affairs (CCEA) approved Minimum Support Prices, national production output leaderboards, and central welfare schemes (PM-KISAN, PMKSY) for direct income growth.",
    impactMetric: "50%+ Profit Margins",
    metricSubtitle: "CCEA benchmarked floor prices & verified subsidy portals",
    highlightSelector: ".msp-table, .scheme-grid",
    action: "scroll-mid"
  },
  {
    id: "assistant",
    tab: "assistant",
    sceneNumber: 7,
    duration: 12,
    title: "Krishi Copilot: Bilingual Voice & Text AI Advisor",
    category: "Generative Agronomic Copilot",
    badge: "SCENE 7 • KRISHI COPILOT",
    tagline: "Instant Expert Advice in English & हिन्दी",
    working: "24/7 intelligent agricultural companion trained on ICAR agronomic research. Answers farmer questions on pest remedies, soil fertilizers, sowing dates, and harvest storage with structured advice.",
    impactMetric: "Available 24/7",
    metricSubtitle: "Zero-latency bilingual advisory for every Indian kisan",
    highlightSelector: ".chat-container, .quick-prompts",
    action: "pan"
  }
];

export const AD_SCENES_HI = [
  {
    id: "dashboard",
    tab: "dashboard",
    sceneNumber: 1,
    duration: 13,
    title: "एकीकृत स्थानीय कृषि कमान केंद्र",
    category: "सजीव टेलीमेट्री एवं ऑटोपायलट",
    badge: "दृश्य १ • समग्र अवलोकन",
    tagline: "एक नज़र में पूरे खेत का संपूर्ण स्वास्थ्य",
    working: "६-वेक्टर पर्यावरणीय टेलीमेट्री (मृदा नमी VWC, NDVI हरापन, ET0 वाष्पीकरण और संयुक्त जोखिम) की निरंतर निगरानी। स्वायत्त AI खेत की स्थिति का मूल्यांकन कर तत्काल कृषि निर्देश देता है।",
    impactMetric: "+३५% पैदावार पूर्वानुमेयता",
    metricSubtitle: "२४/७ AI-निगरानी युक्त सूक्ष्म-जलवायु व जड़-क्षेत्र",
    highlightSelector: ".kpi-grid, .ai-banner, .dashboard-grid",
    action: "pan"
  },
  {
    id: "cropIntelligence",
    tab: "cropIntelligence",
    sceneNumber: 2,
    duration: 13,
    title: "ICAR-प्रशिक्षित मशीन लर्निंग फसल चयन",
    category: "व्याख्यात्मक मशीन लर्निंग (XAI)",
    badge: "दृश्य २ • AI फसल भविष्यवाणी",
    tagline: "९८.४% सटीकता के साथ बहु-आयामी फसल वरीयता",
    working: "मिट्टी के नाइट्रोजन, फास्फोरस, पोटाश, पीएच और मौसमी वर्षा पूर्वानुमान का विश्लेषण करता है। रैंडम फ़ॉरेस्ट एल्गोरिदम द्वारा अधिकतम लाभ देने वाली फसलों की रैंकिंग प्रस्तुत करता है।",
    impactMetric: "९८.४% ML सटीकता",
    metricSubtitle: "जल दक्षता, लाभ मार्जिन और जलवायु अनुकूलन पर आधारित",
    highlightSelector: ".recommendation-card, .explainability-section",
    action: "scroll-mid"
  },
  {
    id: "weather",
    tab: "weather",
    sceneNumber: 3,
    duration: 13,
    title: "अति-स्थानीय संख्यात्मक मौसम एवं छिड़काव सलाह",
    category: "कृषि-मौसम रडार पूर्वानुमान",
    badge: "दृश्य ३ • मौसम पूर्वानुमान",
    tagline: "कीटनाशक बहाव और ताप तनाव से फसलों की सुरक्षा",
    working: "घंटेवार तापमान, आर्द्रता, ओस बिंदु और हवा की गति का सटीक विवरण। कीटनाशक या खाद छिड़काव के लिए सुरक्षित समय विंडो की स्वचालित पहचान करता है।",
    impactMetric: "शून्य छिड़काव बर्बादी",
    metricSubtitle: "सुरक्षित स्प्रे समय + ७-दिवसीय वर्षा दृष्टिकोण",
    highlightSelector: ".spray-advisory, .weather-chart",
    action: "scroll-mid"
  },
  {
    id: "smartIrrigation",
    tab: "smartIrrigation",
    sceneNumber: 4,
    duration: 13,
    title: "सटीक ड्रिप सिंचाई एवं भूजल संरक्षण",
    category: "जल विज्ञान एवं वॉल्व टेलीमेट्री",
    badge: "दृश्य ४ • स्मार्ट सिंचाई",
    tagline: "स्वचालित ड्रिप शेड्यूलिंग से भूजल और बिजली बचाएं",
    working: "पेनमैन-मोंटीथ ET0 के आधार पर दैनिक मृदा नमी की कमी की गणना करता है। सोलर पंप के साथ तालमेल कर प्रति एकड़ आवश्यक पानी देता है, जिससे जलभराव और जड़ सड़न नहीं होती।",
    impactMetric: "४०% जल की बचत",
    metricSubtitle: "सोलर पंप स्वचालन + स्वचालित मृदा नमी पुनःपूर्ति",
    highlightSelector: ".irrigation-card, .valve-controls",
    action: "scroll-mid"
  },
  {
    id: "maps",
    tab: "maps",
    sceneNumber: 5,
    duration: 13,
    title: "भू-स्थानिक उपग्रह पार्सल GIS एवं NDVI",
    category: "उपग्रह पृथ्वी अवलोकन",
    badge: "दृश्य ५ • सैटेलाइट नक्शा",
    tagline: "उच्च-रेज़ोल्यूशन खेत सीमा और बहु-परत नक्शा",
    working: "सजीव GPS पहचान, उपग्रह इमेजरी और खेत सीमा मापन के साथ इंटरएक्टिव लीफलेट नक्शा। किसान अपने खेत की स्थलाकृति और मिट्टी वितरण की निगरानी कर सकते हैं।",
    impactMetric: "उप-मीटर परिशुद्धता",
    metricSubtitle: "खेत परिधि गणना एवं उपग्रह निगरानी",
    highlightSelector: ".leaflet-container, .map-controls",
    action: "pan"
  },
  {
    id: "viksitBharat",
    tab: "viksitBharat",
    sceneNumber: 6,
    duration: 13,
    title: "आधिकारिक विकसित भारत योजनाएं एवं CCEA MSP दरें",
    category: "सरकारी कृषि अर्थशास्त्र",
    badge: "दृश्य ६ • विकसित भारत",
    tagline: "न्यूनतम गारंटीशुदा मूल्य एवं ५०%+ लाभ मार्जिन",
    working: "सीसीईए (CCEA) द्वारा अनुमोदित न्यूनतम समर्थन मूल्य (MSP), राष्ट्रीय उत्पादन रैंकिंग और केंद्रीय योजनाओं (PM-KISAN, PMKSY) से किसानों की आय में प्रत्यक्ष वृद्धि।",
    impactMetric: "५०%+ लाभ मार्जिन",
    metricSubtitle: "CCEA प्रमाणित दरें और आधिकारिक सब्सिडी पोर्टल",
    highlightSelector: ".msp-table, .scheme-grid",
    action: "scroll-mid"
  },
  {
    id: "assistant",
    tab: "assistant",
    sceneNumber: 7,
    duration: 12,
    title: "Krishi Copilot: द्विभाषी आवाज़ एवं टेक्स्ट AI सलाहकार",
    category: "जेनरेटिव कृषि AI कोपायलट",
    badge: "दृश्य ७ • Krishi Copilot",
    tagline: "अंग्रेज़ी और हिन्दी में तत्काल विशेषज्ञ सलाह",
    working: "ICAR कृषि अनुसंधान पर आधारित २४/७ बुद्धिमान कृषि साथी। कीट उपचार, खाद संतुलन, बुवाई तिथियों और भंडारण संबंधी किसान प्रश्नों के त्वरित, संरचित उत्तर।",
    impactMetric: "२४/७ उपलब्ध",
    metricSubtitle: "हर भारतीय किसान के लिए शून्य-विलंबता द्विभाषी सलाह",
    highlightSelector: ".chat-container, .quick-prompts",
    action: "pan"
  }
];

export default function AdVideoShowcase({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  language,
  isHindi: propIsHindi
}) {
  const isHindi = propIsHindi || language === "hi";
  const AD_SCENES = isHindi ? AD_SCENES_HI : AD_SCENES_EN;

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const totalDuration = 90;
  const timerRef = useRef(null);
  const currentScene = AD_SCENES[currentSceneIndex] || AD_SCENES[0];

  const sceneStartTimes = useRef(
    AD_SCENES.reduce((acc, scene, index) => {
      if (index === 0) return [0];
      return [...acc, acc[index - 1] + AD_SCENES[index - 1].duration];
    }, [])
  ).current;

  // Sync scene change with active tab and smooth page auto-scroll
  useEffect(() => {
    if (!isOpen) return;

    const scene = AD_SCENES[currentSceneIndex];
    if (scene && scene.tab !== activeTab) {
      setActiveTab(scene.tab);
    }

    const scrollContainer = document.querySelector(".command-main") || window;
    if (scrollContainer) {
      if (scrollContainer.scrollTo) {
        scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
      }

      const scrollTimeout = setTimeout(() => {
        if (isPlaying && scrollContainer.scrollTo) {
          scrollContainer.scrollTo({ top: 320, behavior: "smooth" });
        }
      }, 4000);

      const scrollBackTimeout = setTimeout(() => {
        if (isPlaying && scrollContainer.scrollTo) {
          scrollContainer.scrollTo({ top: 60, behavior: "smooth" });
        }
      }, (scene.duration - 2) * 1000);

      return () => {
        clearTimeout(scrollTimeout);
        clearTimeout(scrollBackTimeout);
      };
    }
  }, [currentSceneIndex, isOpen, AD_SCENES]);

  // Main 90-Second Clock Loop
  useEffect(() => {
    if (!isOpen || !isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        const nextTime = prev + 1;
        if (nextTime >= totalDuration) {
          setIsPlaying(false);
          return totalDuration;
        }

        let targetSceneIndex = 0;
        for (let i = 0; i < sceneStartTimes.length; i++) {
          if (nextTime >= sceneStartTimes[i]) {
            targetSceneIndex = i;
          } else {
            break;
          }
        }

        if (targetSceneIndex !== currentSceneIndex) {
          setCurrentSceneIndex(targetSceneIndex);
        }

        return nextTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPlaying, currentSceneIndex, sceneStartTimes]);

  const handleSeekScene = (index) => {
    setCurrentSceneIndex(index);
    setElapsedTime(sceneStartTimes[index]);
    setIsPlaying(true);
  };

  const handleRestart = () => {
    setElapsedTime(0);
    setCurrentSceneIndex(0);
    setIsPlaying(true);
    setActiveTab(AD_SCENES[0].tab);
  };

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    const s = `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
    return isHindi ? toHindiDigits(s) : s;
  };

  if (!isOpen) return null;

  const currentSceneElapsed = elapsedTime - sceneStartTimes[currentSceneIndex];
  const currentSceneProgress = Math.min(
    100,
    Math.max(0, (currentSceneElapsed / currentScene.duration) * 100)
  );
  const totalProgress = (elapsedTime / totalDuration) * 100;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] flex flex-col justify-between p-4 sm:p-6 select-none animate-fadeIn">
      {/* ── TOP AD COMMERCIAL HEADER BANNER ── */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between pointer-events-auto bg-[#091912]/90 backdrop-blur-xl border border-emerald-500/40 rounded-2xl px-5 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/50">
            <Radio className="w-5 h-5 animate-pulse text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-widest border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {isHindi ? "आधिकारिक विज्ञापन शोकेस • ९० सेकंड" : "OFFICIAL AD COMMERCIAL • 90 SECONDS"}
              </span>
              <span className="text-[11px] font-bold text-amber-400 font-mono">
                {formatSeconds(elapsedTime)} / {formatSeconds(totalDuration)}
              </span>
            </div>
            <h1 className="text-white font-extrabold text-sm sm:text-base tracking-tight drop-shadow">
              KrishiMitra AI — {isHindi ? "सटीक कृषि वाणिज्यिक शोकेस" : "Precision Agriculture Commercial Showcase"}
            </h1>
          </div>
        </div>

        {/* Commercial Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1 shadow-md shadow-emerald-950"
            title={isPlaying ? (isHindi ? "विज्ञापन रोकें" : "Pause Commercial") : (isHindi ? "विज्ञापन चलाएं" : "Play Commercial")}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
            title={isHindi ? "शुरुआत से पुनः चलाएं" : "Restart Ad from Beginning"}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/80 border border-red-800/40 text-red-300 hover:text-white transition-colors ml-1"
            title={isHindi ? "शोकेस मोड बंद करें" : "Exit Showcase Mode"}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── CENTRAL FLOATING POP-UP: "HOW THIS PAGE WORKS" AD CALLOUT ── */}
      <div className="w-full max-w-xl ml-auto pointer-events-auto my-auto self-end mr-2 sm:mr-8 transition-all duration-500 ease-out transform">
        <div className="relative overflow-hidden rounded-3xl bg-[#0b1d16]/95 backdrop-blur-2xl border-2 border-emerald-400/60 p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)] ring-1 ring-emerald-500/30 animate-slideUp">
          
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Scene Header & Badge */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-black font-extrabold text-[10px] tracking-wider uppercase shadow-md shadow-emerald-500/30">
                {currentScene.badge}
              </span>
              <span className="text-[11px] font-bold text-emerald-300/80 tracking-wide uppercase font-mono">
                {currentScene.category}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-amber-400">
                {formatSeconds(elapsedTime)}
              </span>
            </div>
          </div>

          {/* Feature Title & Tagline */}
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
            {currentScene.title}
          </h2>
          <p className="text-xs font-semibold text-emerald-400 mt-0.5">
            ✦ {currentScene.tagline}
          </p>

          {/* POP-UP TEXT: WORKING OF THAT PARTICULAR PAGE */}
          <div className="my-3.5 p-3.5 rounded-2xl bg-black/40 border border-emerald-500/25">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{isHindi ? "यह सुविधा कैसे कार्य करती है:" : "How This Feature Works:"}</span>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-normal">
              {currentScene.working}
            </p>
          </div>

          {/* Impact Metric & Value Highlight */}
          <div className="flex items-center justify-between pt-2 border-t border-emerald-950/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-300">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-black text-white font-mono leading-none">
                  {currentScene.impactMetric}
                </div>
                <div className="text-[10px] font-semibold text-slate-400 mt-0.5">
                  {currentScene.metricSubtitle}
                </div>
              </div>
            </div>

            {/* Quick Next Feature Button */}
            {currentSceneIndex < AD_SCENES.length - 1 && (
              <button
                onClick={() => handleSeekScene(currentSceneIndex + 1)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-200 hover:text-white text-xs font-bold transition-colors flex items-center gap-1"
              >
                <span>{isHindi ? "अगला" : "Next"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Scene Progress Micro-Bar */}
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-green-400 to-amber-400 transition-all duration-300 ease-linear rounded-full"
              style={{ width: `${currentSceneProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── BOTTOM TIMELINE & SCENE STEPPER BAR (1m 30s) ── */}
      <div className="w-full max-w-5xl mx-auto pointer-events-auto bg-[#091912]/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-3 shadow-[0_12px_40px_rgba(0,0,0,0.85)]">
        {/* Full 90-Second Master Bar */}
        <div className="relative w-full bg-slate-800/80 h-2 rounded-full overflow-hidden mb-2.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-amber-400 transition-all duration-500 ease-linear"
            style={{ width: `${totalProgress}%` }}
          />
        </div>

        {/* 7 Interactive Scene Step Buttons */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {AD_SCENES.map((scene, idx) => {
            const isCurrent = idx === currentSceneIndex;
            const isCompleted = idx < currentSceneIndex;

            return (
              <button
                key={scene.id}
                onClick={() => handleSeekScene(idx)}
                className={`py-1 px-1.5 rounded-lg text-left transition-all flex flex-col justify-between h-12 border ${
                  isCurrent
                    ? "bg-emerald-600/40 border-emerald-400 shadow-md ring-1 ring-emerald-400/50"
                    : isCompleted
                    ? "bg-slate-900/90 border-slate-700 text-slate-300"
                    : "bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[9px] font-mono font-black ${
                      isCurrent
                        ? "text-emerald-300"
                        : isCompleted
                        ? "text-slate-400"
                        : "text-slate-600"
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  )}
                  {isCompleted && (
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-bold truncate leading-tight ${
                    isCurrent ? "text-white" : "text-slate-400"
                  }`}
                >
                  {scene.title.split(":")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
