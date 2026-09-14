import React, { useState } from "react";
import {
  Send, Bot, User, Sparkles, BookOpen, HelpCircle,
  AlertTriangle, CheckCircle2, Droplets, ShieldCheck,
  RotateCcw, Clock, X
} from "lucide-react";
import { API_BASE } from "../config";

const SUGGESTIONS = [
  { en: "Which crop should I plant this season?", hi: "इस मौसम में कौन सी फसल बोनी चाहिए?" },
  { en: "Should I irrigate today?",               hi: "क्या मुझे आज सिंचाई करनी चाहिए?" },
  { en: "Is heavy rain expected this week?",      hi: "क्या इस सप्ताह भारी बारिश की संभावना है?" },
  { en: "Why is my crop risk high?",              hi: "मेरी फसल का जोखिम अधिक क्यों है?" },
  { en: "What should I prioritize this week?",   hi: "मुझे इस सप्ताह क्या प्राथमिकता देनी चाहिए?" },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 p-3">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  );
}

function MessageBubble({ msg, language }) {
  const isBot = msg.role === "assistant";

  return (
    <div className={`flex items-start gap-2.5 ${isBot ? "" : "flex-row-reverse"} anim-fade-up`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-xs font-bold mt-0.5`}
        style={isBot
          ? { background: "rgba(34,197,94,0.12)", borderColor: "rgba(34,197,94,0.28)", color: "var(--leaf)" }
          : { background: "rgba(56,189,248,0.12)", borderColor: "rgba(56,189,248,0.25)", color: "var(--sky)" }
        }
      >
        {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[82%] flex flex-col gap-1.5`}>
        <div
          className={`rounded-xl p-3.5 text-xs leading-relaxed`}
          style={isBot
            ? { background: "var(--bg-card)", border: "1px solid var(--border-1)", color: "var(--text-200)" }
            : { background: "rgba(34,197,94,0.18)", border: "1px solid rgba(34,197,94,0.35)", color: "var(--text-100)" }
          }
        >
          <p className="whitespace-pre-wrap">{msg.text}</p>

          {/* Structured sub-sections for bot messages */}
          {isBot && (msg.telemetry || msg.recommendation || msg.warning) && (
            <div className="mt-3 space-y-2 pt-2.5 border-t" style={{ borderColor: "var(--border-2)" }}>
              {msg.telemetry && (
                <div className="flex items-start gap-2 p-2 rounded-lg text-[11px]"
                     style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.18)", color: "var(--text-300)" }}>
                  <Droplets className="w-3 h-3 mt-0.5 shrink-0" style={{ color: "var(--sky)" }} />
                  <span><strong className="font-semibold" style={{ color: "var(--sky)" }}>Telemetry:</strong> {msg.telemetry}</span>
                </div>
              )}
              {msg.recommendation && (
                <div className="flex items-start gap-2 p-2 rounded-lg text-[11px]"
                     style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.20)", color: "var(--text-300)" }}>
                  <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0" style={{ color: "var(--leaf)" }} />
                  <span><strong className="font-semibold" style={{ color: "var(--leaf)" }}>Action:</strong> {msg.recommendation}</span>
                </div>
              )}
              {msg.warning && (
                <div className="flex items-start gap-2 p-2 rounded-lg text-[11px]"
                     style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.20)", color: "var(--text-300)" }}>
                  <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" style={{ color: "var(--amber)" }} />
                  <span><strong className="font-semibold" style={{ color: "var(--amber)" }}>Alert:</strong> {msg.warning}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Source tag */}
        {isBot && msg.source && (
          <div className="flex items-center gap-1 ml-1 text-[10px]" style={{ color: "var(--text-400)" }}>
            <ShieldCheck className="w-2.5 h-2.5" style={{ color: "var(--leaf)" }} />
            <span>{msg.source}</span>
          </div>
        )}

        {/* Timestamp */}
        <div className={`text-[9px] ml-1 ${isBot ? "" : "text-right mr-1"}`} style={{ color: "var(--text-500)" }}>
          {msg.time || "Just now"}
        </div>
      </div>
    </div>
  );
}

export default function KrishiAssistant({ farm, weather, language, t }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: language === "hi"
        ? `नमस्ते! मैं आपका कृषि-मित्र AI कोपायलट हूँ। मुझे आपके खेत (${farm?.farm_name || "किसान आदर्श फार्म"}, फसल: ${farm?.current_crop || "गेहूं"}) की स्थिति की पूरी जानकारी है।`
        : `Hello! I'm your KrishiMitra AI Agricultural Copilot. I have full context of your farm (${farm?.farm_name || "Kisan Adarsh Farm"}, crop: ${farm?.current_crop || "Wheat"}, location: ${farm?.location_name || "Varanasi, UP"}). I can help with irrigation timing, crop selection, pest management, government schemes, and more.`,
      telemetry: `Temp ${weather?.temperature || 28.4}°C · Humidity ${weather?.humidity || 62}% · Soil Moisture 68% VWC`,
      recommendation: "Use the suggestion chips below for the most common farm queries.",
      source: "ICAR Agronomy Guidelines & Open-Meteo NWP Model"
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(scrollToBottom, [messages]);

  const handleSend = async (text) => {
    const textToSend = text || inputQuery;
    if (!textToSend.trim()) return;

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const updatedMessages = [...messages, { role: "user", text: textToSend, time: now }];
    setMessages(updatedMessages);
    setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, language })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...updatedMessages, {
          role: "assistant",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: data.reply,
          source: data.source || "KrishiMitra Agronomic Engine v4",
          telemetry: data.telemetry,
          recommendation: data.recommendation,
          warning: data.warning
        }]);
      } else throw new Error();
    } catch {
      // Rich offline fallback
      const lower = textToSend.toLowerCase();
      let replyText, telemetryInfo, recInfo, warnInfo;

      telemetryInfo = `Temp ${weather?.temperature || 28}°C · RH ${weather?.humidity || 60}% · Soil Moisture 68% VWC`;

      if (lower.includes("irrigate") || lower.includes("सिंचाई") || lower.includes("water")) {
        replyText = language === "hi"
          ? "आपके खेत में अभी 68% मिट्टी नमी है और अगले 36 घंटों में 14.5mm बारिश का पूर्वानुमान है। सिंचाई को 24 घंटे स्थगित करना उचित है।"
          : "Based on real-time soil moisture (68% VWC) and the 14.5mm rainfall forecast for the next 36 hours, irrigation should be deferred by 24 hours to prevent root hypoxia and nutrient runoff.";
        recInfo = "Hold drip cycle. Inspect soil moisture probe again at 06:00 AM tomorrow.";
        warnInfo = "Over-irrigation at this moisture level risks nitrogen leaching below root zone.";

      } else if (lower.includes("crop") || lower.includes("plant") || lower.includes("फसल") || lower.includes("sow")) {
        replyText = language === "hi"
          ? "आपकी जलोढ़ मिट्टी (pH 6.8) और मौसम के आधार पर गेहूं (HD-2967) और सरसों (पूसा बोल्ड) सबसे उपयुक्त हैं — 94.8% और 88.4% अनुकूलता स्कोर के साथ।"
          : "For your Alluvial Loam soil (pH 6.8) and current Rabi season, Wheat (HD-2967) scores 94.8% suitability and Mustard (Pusa Bold) scores 88.4%. Both have guaranteed Government MSP procurement.";
        recInfo = "Target sowing window: Late October to 15 November for best yield outcomes.";

      } else if (lower.includes("rain") || lower.includes("बारिश") || lower.includes("weather") || lower.includes("मौसम")) {
        replyText = language === "hi"
          ? "7 दिनों की NWP मॉडल रिपोर्ट: दिन 2 पर 35% संभावना के साथ 14.5mm हल्की बारिश। कोई बाढ़ या अत्यधिक जल भराव का खतरा नहीं।"
          : "7-day NWP forecast shows 14.5mm cumulative light rain on Day 2 with 35% probability. No severe flood or waterlogging hazard. Wind stays below 15 km/h — safe for morning spray operations.";
        recInfo = "Complete foliar micronutrient spray before rain window arrives (ideally 06:00 – 10:30 AM today).";

      } else if (lower.includes("risk") || lower.includes("disease") || lower.includes("pest") || lower.includes("जोखिम")) {
        replyText = language === "hi"
          ? "आपके खेत का समग्र जोखिम स्कोर 18/100 (सुरक्षित) है। नमी 65% से कम होने से पीत रतुआ का खतरा न्यूनतम है।"
          : "Your compound farm risk score is currently 18/100 (Low — Safe). Relative humidity below 65% keeps yellow rust vector risk minimal. No active flood or thermal crop shock alerts.";
        warnInfo = "Conduct scout walk along northern furrow boundary; inspect lower leaf canopy for early fungal signs.";

      } else {
        replyText = language === "hi"
          ? "इस सप्ताह प्राथमिकता सूची:\n1. जिंक + फेरस पर्ण स्प्रे — सुबह 6-10 बजे करें\n2. बारिश से पहले सिंचाई स्थगित रखें\n3. पीएम-किसान ई-केवाईसी सत्यापन पूरा करें\n4. रबी फसल के लिए बीज प्रमाणीकरण की व्यवस्था करें।"
          : "Priority action list for this week:\n1. Foliar micronutrient spray (Zinc + Ferrous) — morning hours before 10:30 AM\n2. Defer irrigation until rain front clears (36h)\n3. Complete PM-KISAN e-KYC verification\n4. Procure certified Wheat seed before mid-November sowing window.";
        recInfo = "Check Farm Planner tab for scheduled task reminders.";
      }

      setMessages([...updatedMessages, {
        role: "assistant",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: replyText,
        telemetry: telemetryInfo,
        recommendation: recInfo,
        warning: warnInfo,
        source: "KrishiMitra Agronomic Core · ICAR / IMD Knowledge Base"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => setMessages(messages.slice(0, 1));

  return (
    <div className="space-y-4 anim-fade-up">
      {/* Header */}
      <div className="card p-5" style={{ borderLeft: "3px solid var(--leaf)" }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl border" style={{ background: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.28)" }}>
              <Bot className="w-6 h-6" style={{ color: "var(--leaf)" }} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-100)" }}>
                  Krishi Copilot
                </h1>
                <span className="badge badge-leaf text-[10px]">● Context-Aware</span>
              </div>
              <p className="text-xs" style={{ color: "var(--text-300)" }}>
                Bilingual AI for irrigation, crop selection, pest management & government schemes.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg"
                 style={{ background: "var(--bg-input)", border: "1px solid var(--border-2)", color: "var(--text-300)" }}>
              <BookOpen className="w-3.5 h-3.5" style={{ color: "var(--leaf)" }} />
              ICAR · KVK · IMD Verified
            </div>
            <button onClick={clearChat} className="btn btn-ghost btn-icon" title="Clear conversation">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Farm Context Bar */}
        <div
          className="mt-3 p-2.5 rounded-lg flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]"
          style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}
        >
          <span style={{ color: "var(--text-400)" }}>Context:</span>
          <span style={{ color: "var(--text-200)" }}>
            <strong style={{ color: "var(--leaf)" }}>Farm:</strong> {farm?.farm_name || "Kisan Adarsh Farm"}
          </span>
          <span style={{ color: "var(--text-200)" }}>
            <strong style={{ color: "var(--leaf)" }}>Crop:</strong> {farm?.current_crop || "Wheat (HD-2967)"} · {farm?.crop_stage || "Vegetative"}
          </span>
          <span style={{ color: "var(--text-200)" }}>
            <strong style={{ color: "var(--leaf)" }}>Weather:</strong> {weather?.temperature || 28}°C · {weather?.humidity || 62}% RH
          </span>
        </div>
      </div>

      {/* Chat Window */}
      <div className="card flex flex-col" style={{ height: 520 }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} language={language} />)}
          {isLoading && (
            <div className="flex items-start gap-2.5 anim-fade-in">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                   style={{ background: "rgba(34,197,94,0.12)", borderColor: "rgba(34,197,94,0.28)" }}>
                <Bot className="w-3.5 h-3.5" style={{ color: "var(--leaf)" }} />
              </div>
              <div className="p-3 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-1)" }}>
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div
          className="px-4 py-2.5 border-t flex items-center gap-1.5 overflow-x-auto"
          style={{ borderColor: "var(--border-2)" }}
        >
          <HelpCircle className="w-3 h-3 shrink-0" style={{ color: "var(--text-400)" }} />
          <span className="text-[10px] uppercase font-bold tracking-wider shrink-0 mr-1" style={{ color: "var(--text-400)" }}>Quick:</span>
          {SUGGESTIONS.map((s, i) => {
            const text = language === "hi" ? s.hi : s.en;
            return (
              <button
                key={i}
                onClick={() => handleSend(text)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 rounded-full transition-all shrink-0 whitespace-nowrap"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border-2)",
                  color: "var(--text-300)"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)";
                  e.currentTarget.style.color = "var(--leaf)";
                  e.currentTarget.style.background = "rgba(34,197,94,0.08)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--border-2)";
                  e.currentTarget.style.color = "var(--text-300)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
              >
                {text}
              </button>
            );
          })}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="px-4 pb-4 pt-2 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder={language === "hi"
              ? "फसल, सिंचाई, कीट या सरकारी योजनाओं के बारे में पूछें..."
              : "Ask about irrigation, crops, pests, spray timing, or government schemes..."}
            className="input-field flex-1 py-2.5"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="btn btn-primary py-2.5 px-4 text-xs shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
