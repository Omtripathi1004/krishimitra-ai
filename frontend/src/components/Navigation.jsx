import React, { useState } from "react";
import {
  LayoutDashboard,
  Sprout,
  BrainCircuit,
  CloudSun,
  Droplets,
  CalendarDays,
  MessageSquareText,
  BarChart3,
  Building2,
  MapPin,
  Settings,
  Languages,
  ChevronRight,
  Thermometer,
  Wind
} from "lucide-react";

const navGroups = [
  {
    label: "Core",
    items: [
      { id: "dashboard",       icon: LayoutDashboard,    label: "Dashboard",       accentClass: "" },
      { id: "myFarm",          icon: Sprout,             label: "My Farm",         accentClass: "" },
      { id: "aiRecommendation",icon: BrainCircuit,       label: "AI Crop Advisor", accentClass: "active-ai", highlight: true },
      { id: "weather",         icon: CloudSun,           label: "Weather",         accentClass: "" },
      { id: "smartIrrigation", icon: Droplets,           label: "Smart Irrigation",accentClass: "" },
    ]
  },
  {
    label: "Tools",
    items: [
      { id: "planner",         icon: CalendarDays,       label: "Farm Planner",    accentClass: "" },
      { id: "assistant",       icon: MessageSquareText,  label: "Krishi Assistant",accentClass: "" },
      { id: "analytics",       icon: BarChart3,          label: "Analytics",       accentClass: "" },
    ]
  },
  {
    label: "More",
    items: [
      { id: "viksitBharat",    icon: Building2,          label: "Viksit Bharat",   accentClass: "" },
      { id: "farmMap",         icon: MapPin,             label: "Farm Map",        accentClass: "" },
      { id: "profile",         icon: Settings,           label: "Profile",         accentClass: "" },
    ]
  }
];

const mobileItems = [
  { id: "dashboard",        icon: LayoutDashboard,   label: "Home" },
  { id: "aiRecommendation", icon: BrainCircuit,      label: "AI Crop" },
  { id: "weather",          icon: CloudSun,          label: "Weather" },
  { id: "smartIrrigation",  icon: Droplets,          label: "Irrigation" },
  { id: "assistant",        icon: MessageSquareText, label: "Assistant" },
];

export default function Navigation({ activeTab, setActiveTab, language, setLanguage, farm, weather, t }) {
  return (
    <>
      {/* ── SIDEBAR (desktop) ── */}
      <aside className="sidebar animate-fade-left">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="flex items-center gap-3 mb-1">
            <div className="sidebar-brand-logo">🌾</div>
            <div>
              <div className="sidebar-brand-title">
                Krishi<span style={{ color: "var(--color-harvest)" }}>Mitra</span>
              </div>
              <span className="sidebar-brand-badge">AI Platform</span>
            </div>
          </div>
          <p className="text-[11px] mt-2" style={{ color: "var(--text-muted)", lineHeight: 1.4 }}>
            Hyperlocal Climate-to-Crop Intelligence
          </p>
        </div>

        {/* Nav groups */}
        <nav className="sidebar-nav">
          {navGroups.map(group => (
            <div key={group.label}>
              <div className="sidebar-section-label">{group.label}</div>
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const cls = isActive
                  ? item.accentClass || "active"
                  : "";
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`sidebar-nav-item w-full ${cls}`}
                  >
                    <Icon className="sidebar-nav-icon" />
                    <span>{item.label}</span>
                    {item.highlight && !isActive && (
                      <span className="nav-highlight-dot" />
                    )}
                    {isActive && (
                      <ChevronRight className="ml-auto" style={{ width: 13, height: 13, opacity: 0.5 }} />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer: weather strip + lang toggle */}
        <div className="sidebar-footer space-y-3">
          {weather && (
            <div className="sidebar-weather-strip">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5" style={{ color: "var(--color-rain-glow)", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.09em" }}>
                  <span className="neon-dot neon-dot-cyan" />
                  Live Telemetry
                </div>
                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{farm?.location_name?.split(",")[0]}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Thermometer style={{ width: 13, height: 13, color: "var(--color-harvest)" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}>{weather.temperature}°C</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wind style={{ width: 12, height: 12, color: "var(--color-rain-glow)" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-secondary)" }}>{weather.wind_speed} km/h</span>
                </div>
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.3rem", textTransform: "capitalize" }}>{weather.condition}</div>
            </div>
          )}

          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="btn btn-secondary w-full text-xs py-2"
            style={{ justifyContent: "center", gap: "0.5rem" }}
          >
            <Languages style={{ width: 14, height: 14 }} />
            <span>{language === "en" ? "हिन्दी में बदलें" : "Switch to English"}</span>
          </button>

          <div style={{ fontSize: "0.62rem", color: "var(--text-dim)", textAlign: "center", fontFamily: "var(--font-heading)" }}>
            KrishiMitra AI v2.5 · Powered by FastAPI + React
          </div>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="mobile-nav-bar">
        {mobileItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`mobile-nav-item ${activeTab === item.id ? "active" : ""}`}
            >
              <Icon />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
