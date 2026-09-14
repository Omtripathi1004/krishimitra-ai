import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Sprout, CloudSun, BrainCircuit, ShieldAlert,
  Map, MessageSquareText, BarChart3, Bell, Settings, Building2,
  ChevronLeft, ChevronRight, Droplets, Leaf, Zap
} from "lucide-react";

export const NAV_ITEMS = [
  {
    section: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard }
    ]
  },
  {
    section: "Farm Operations",
    items: [
      { id: "farmIntelligence", label: "Farm Intelligence", icon: Sprout },
      { id: "weather",          label: "Weather",           icon: CloudSun },
      { id: "smartIrrigation",  label: "Irrigation",        icon: Droplets },
    ]
  },
  {
    section: "AI Intelligence",
    items: [
      { id: "cropIntelligence", label: "Crop Advisor", icon: BrainCircuit, badge: "AI" },
      { id: "diseaseRisk",      label: "Risk Center",  icon: ShieldAlert },
      { id: "analytics",        label: "Analytics",    icon: BarChart3 },
    ]
  },
  {
    section: "Decision Support",
    items: [
      { id: "assistant",    label: "AI Copilot",    icon: MessageSquareText, badge: "●" },
      { id: "alerts",       label: "Alerts",        icon: Bell, badge: "3" },
      { id: "maps",         label: "Farm Map",      icon: Map },
    ]
  },
  {
    section: "Knowledge",
    items: [
      { id: "viksitBharat", label: "Govt Datasets", icon: Building2 },
      { id: "settings",     label: "Settings",      icon: Settings },
    ]
  }
];

// Flatten for mobile nav
export const ALL_NAV_ITEMS = NAV_ITEMS.flatMap(g => g.items);

export default function Navigation({
  activeTab, setActiveTab,
  isCollapsed, setIsCollapsed,
  mobileOpen, setMobileOpen,
  alertCount = 3, farm, weather
}) {
  const handleNav = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`command-sidebar ${isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"} ${mobileOpen ? "mobile-open" : ""}`}>

        {/* Brand Header */}
        <div
          className="flex items-center gap-3 px-4 shrink-0 border-b border-[var(--border-2)] cursor-pointer"
          style={{ height: "var(--header-h)" }}
          onClick={() => handleNav("dashboard")}
        >
          <div className="w-8 h-8 rounded-[10px] bg-[var(--leaf)] flex items-center justify-center text-lg font-bold text-[#041A0B] shrink-0 shadow-lg"
               style={{ boxShadow: "var(--glow-leaf)" }}>
            🌾
          </div>
          {!isCollapsed && (
            <div className="min-w-0 overflow-hidden">
              <div className="text-sm font-bold text-white leading-tight tracking-tight whitespace-nowrap" style={{ fontFamily: "var(--font-display)" }}>
                Krishi<span style={{ color: "var(--leaf)" }}>Mitra</span> AI
              </div>
              <div className="text-[10px] text-[var(--text-400)] font-semibold tracking-widest uppercase mt-0.5">
                Agri OS v4.0
              </div>
            </div>
          )}
        </div>

        {/* Live Status Bar (show in expanded mode) */}
        {!isCollapsed && weather && (
          <div className="mx-3 mt-3 px-3 py-2 rounded-md bg-[rgba(34,197,94,0.07)] border border-[var(--leaf-border)] flex items-center gap-2 shrink-0">
            <div className="live-dot shrink-0" />
            <div className="text-[11px] text-[var(--text-300)] font-medium truncate">
              {weather.temperature || 28.4}°C · {weather.humidity || 62}% RH · {weather.weather_desc || "Clear"}
            </div>
          </div>
        )}

        {/* Nav Groups */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
          {NAV_ITEMS.map((group) => (
            <div key={group.section}>
              {/* Section Header */}
              {!isCollapsed && (
                <div className="section-label px-2 mb-1.5">{group.section}</div>
              )}

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const isAlertBadge = item.id === "alerts" && alertCount > 0;
                  const isAiBadge = item.badge === "AI";
                  const isLiveBadge = item.badge === "●";

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      title={isCollapsed ? item.label : undefined}
                      className={`nav-btn ${isActive ? "nav-btn-active" : ""} ${
                        isCollapsed ? "justify-center !gap-0 !px-0" : ""
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[var(--leaf)]" : "text-[var(--text-400)]"}`} />

                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left truncate">{item.label}</span>
                          {isAlertBadge && (
                            <span className="badge badge-amber py-0.5 px-1.5 text-[10px]">{alertCount}</span>
                          )}
                          {isAiBadge && (
                            <span className="badge badge-violet py-0.5 px-1.5 text-[10px]">AI</span>
                          )}
                          {isLiveBadge && (
                            <div className="live-dot" style={{ width: 6, height: 6 }} />
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Farm Quick Stat (expanded) */}
        {!isCollapsed && farm && (
          <div className="mx-3 mb-3 px-3 py-2.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-2)] shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <Leaf className="w-3 h-3 text-[var(--leaf)]" />
              <span className="text-[10px] text-[var(--text-400)] font-semibold uppercase tracking-widest">Active Farm</span>
            </div>
            <div className="text-xs font-bold text-[var(--text-200)] truncate">{farm.farm_name || "Kisan Adarsh Farm"}</div>
            <div className="text-[10px] text-[var(--text-400)] truncate mt-0.5">
              {farm.district || "Varanasi"}, {farm.state || "Uttar Pradesh"}
            </div>
          </div>
        )}

        {/* Collapse Toggle (desktop only) */}
        <div className="hidden md:flex px-3 py-2 border-t border-[var(--border-2)] shrink-0 justify-end">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="btn-icon btn p-1.5"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 z-30"
           style={{ background: "rgba(8,18,13,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border-2)" }}>
        <div className="flex items-center justify-around h-full px-1">
          {[
            { id: "dashboard",       label: "Home",    icon: LayoutDashboard },
            { id: "farmIntelligence",label: "Farm",    icon: Sprout },
            { id: "cropIntelligence",label: "AI",      icon: BrainCircuit },
            { id: "diseaseRisk",     label: "Risk",    icon: ShieldAlert },
            { id: "assistant",       label: "Copilot", icon: MessageSquareText },
            { id: "alerts",          label: "Alerts",  icon: Bell },
          ].map(m => {
            const Icon = m.icon;
            const isAct = activeTab === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleNav(m.id)}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-lg transition-all ${
                  isAct ? "text-[var(--leaf)]" : "text-[var(--text-400)] hover:text-[var(--text-300)]"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isAct ? "scale-110" : ""} transition-transform`} style={{ width: 18, height: 18 }} />
                <span className={`text-[9px] font-semibold tracking-wide ${isAct ? "opacity-100" : "opacity-70"}`}>{m.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
