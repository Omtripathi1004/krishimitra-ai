import React, { useState } from "react";
import {
  MessageSquareText,
  Send,
  Bot,
  User,
  Sparkles,
  ShieldCheck,
  BookOpen,
  HelpCircle,
  Loader2
} from "lucide-react";
import { API_BASE } from "../config";

export default function KrishiAssistant({ farm, weather, language, t }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: language === "hi"
        ? `नमस्ते! मैं कृषि-मित्र AI सहायक हूँ। मैं आपके खेत (${farm?.current_crop || "गेहूं"}, मिट्टी: ${farm?.soil_type || "दोमट"}, स्थान: ${farm?.location_name || "पंजाब"}) की स्थिति से अवगत हूँ। खाद, कीट प्रबंधन, सिंचाई या सरकारी योजनाओं के बारे में कोई भी प्रश्न पूछें।`
        : `Greetings! I am your KrishiMitra AI Assistant. I have active contextual awareness of your farm (${farm?.current_crop || "Wheat"}, Soil: ${farm?.soil_type || "Alluvial"}, Location: ${farm?.location_name || "Punjab"}). How can I assist with your agronomy, nutrition, or pest management today?`
    }
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const updatedMessages = [...messages, { role: "user", text: textToSend }];
    setMessages(updatedMessages);
    setInputQuery("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          language: language
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            text: data.reply,
            source: data.source
          }
        ]);
      } else {
        throw new Error("Assistant response failed");
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          text: language === "hi"
            ? "क्षमा करें, सर्वर से संपर्क नहीं हो पाया। कृपया पुनः प्रयास करें।"
            : "Sorry, I could not establish a connection to the agronomic knowledge server. Please retry in a moment."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-[var(--border-cyan)]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-[rgba(89,199,177,0.15)] flex items-center justify-center text-[var(--color-rain-glow)] border border-[var(--border-cyan)]">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-[var(--text-primary)]">
              {t.assistant.title}
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{t.assistant.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[var(--border-cyan)] bg-[#183A2D]/80 px-3.5 py-1 text-xs font-mono text-[var(--color-rain-glow)]">
          <BookOpen className="h-3.5 w-3.5" />
          <span>ICAR / KVK Knowledge Base</span>
        </div>
      </div>

      {/* Context Awareness Banner */}
      <div className="rounded-xl border border-[var(--border-saffron)] bg-[rgba(226,168,59,0.08)] p-3.5 text-xs text-[var(--text-secondary)] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--color-harvest)] flex-shrink-0" />
          <span>{t.assistant.farmContextBanner}:</span>
          <strong className="text-[var(--text-primary)]">{farm?.current_crop}</strong> ({farm?.crop_stage}) in <strong className="text-[var(--text-primary)]">{farm?.location_name}</strong>
        </div>
        <div className="text-[var(--text-dim)] font-mono">
          Weather: {weather?.temperature}°C • Rain 24h: {weather?.rainfall_forecast_24h}mm
        </div>
      </div>

      {/* Chat Area */}
      <div className="glass-card p-4 sm:p-6 space-y-4 flex flex-col h-[520px]">
        {/* Messages scroll */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, index) => {
            const isBot = msg.role === "assistant";
            return (
              <div
                key={index}
                className={`flex items-start gap-3 ${isBot ? "" : "flex-row-reverse"}`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl flex-shrink-0 ${
                  isBot 
                    ? "bg-[rgba(89,199,177,0.15)] text-[var(--color-rain-glow)] border border-[var(--border-cyan)]" 
                    : "bg-[var(--color-harvest)] text-[#10251E] font-bold"
                }`}>
                  {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                <div className={`max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isBot
                    ? "bg-[#183A2D]/80 text-[var(--text-primary)] border border-[var(--border-subtle)]"
                    : "bg-gradient-to-r from-[var(--color-harvest)] to-[#C48722] text-[#10251E] font-medium shadow-md"
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  {msg.source && (
                    <div className="mt-2 text-[10px] text-[var(--color-rain-glow)] font-mono border-t border-[var(--border-subtle)] pt-1.5 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      <span>{msg.source}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] p-2 font-mono">
              <Bot className="h-4 w-4 text-[var(--color-rain-glow)] animate-bounce" />
              <span>Consulting agronomic knowledge base...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 border-t border-[var(--border-subtle)] text-xs">
          <span className="text-[10px] font-heading font-bold uppercase text-[var(--color-harvest)] whitespace-nowrap flex items-center gap-1">
            <HelpCircle className="h-3 w-3" />
            Prompts:
          </span>
          {t.assistant.suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sug)}
              className="rounded-full bg-[#183A2D] hover:bg-[#224C3C] px-3 py-1 text-[11px] text-[var(--text-secondary)] hover:text-white border border-[var(--border-subtle)] whitespace-nowrap transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 pt-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={t.assistant.placeholder}
            className="flex-1 rounded-xl bg-[#10251E] border border-[var(--border-subtle)] px-4 py-3 text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-rain-glow)] transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="btn btn-primary py-3 px-5 text-xs"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">{t.assistant.send}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
