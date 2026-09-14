import React from "react";
import {
  LayoutDashboard,
  Sprout,
  CloudSun,
  BrainCircuit,
  ShieldAlert,
  Map,
  MessageSquareText,
  BarChart3,
  Bell,
  Settings,
  Building2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Droplets
} from "lucide-react";

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, category: "Overview" },
  { id: "farmIntelligence", label: "Farm Intelligence", icon: Sprout, category: "Core Operations" },
  { id: "weather", label: "Weather", icon: CloudSun, category: "Core Operations" },
  { id: "cropIntelligence", label: "Crop Intelligence", icon: BrainCircuit, badge: "ML", category: "Intelligence" },
  { id: "diseaseRisk", label: "Disease / Risk", icon: ShieldAlert, category: "Intelligence" },
  { id: "maps", label: "Maps", icon: Map, category: "Intelligence" },
  { id: "assistant", label: "AI Assistant", icon: MessageSquareText, category: "Decision Support" },
  { id: "analytics", label: "Analytics", icon: BarChart3, category: "Decision Support" },
  { id: "alerts", label: "Alerts", icon: Bell, badge: "3", category: "Decision Support" },
  { id: "viksitBharat", label: "Govt Datasets", icon: Building2, category: "Policy & Schemes" },
  { id: "settings", label: "Settings", icon: Settings, category: "System" }
];

export default function Navigation({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
  alertCount = 3,
  t
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`command-sidebar ${
          isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"
        } ${mobileOpen ? "mobile-open" : ""}`}
      >
        {/* Brand Header */}
        <div className="h-[60px] flex items-center justify-between px-4 border-b border-[var(--border-subtle)] shrink-0">
          <div
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer overflow-hidden select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
              🌾
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5 leading-tight">
                  Krishi<span className="text-emerald-400">Mitra</span> AI
                </div>
                <div className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                  Agri Command Hub
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (setMobileOpen) setMobileOpen(false);
                }}
                title={isCollapsed ? item.label : undefined}
                className={`nav-btn ${isActive ? "nav-btn-active" : ""} ${
                  isCollapsed ? "justify-center px-0 py-2.5" : ""
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                {!isCollapsed && (
                  <span className="truncate flex-1 text-xs">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      item.id === "alerts"
                        ? "bg-amber-950/80 text-amber-400 border border-amber-800"
                        : "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer / Collapse Toggle (Desktop only) */}
        <div className="hidden md:flex p-2.5 border-t border-[var(--border-subtle)] shrink-0 justify-between items-center bg-[#081710]">
          {!isCollapsed && (
            <div className="flex items-center gap-2 text-[11px] text-slate-400 px-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Engine Online</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors ${
              isCollapsed ? "mx-auto" : ""
            }`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (Visible on mobile screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#0B1D15] border-t border-[var(--border-subtle)] flex items-center justify-around px-2 z-30">
        {[
          { id: "dashboard", label: "Home", icon: LayoutDashboard },
          { id: "farmIntelligence", label: "Farm", icon: Sprout },
          { id: "cropIntelligence", label: "Advisor", icon: BrainCircuit },
          { id: "diseaseRisk", label: "Risk", icon: ShieldAlert },
          { id: "assistant", label: "Copilot", icon: MessageSquareText },
          { id: "alerts", label: "Alerts", icon: Bell }
        ].map((m) => {
          const Icon = m.icon;
          const isAct = activeTab === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveTab(m.id)}
              className={`flex flex-col items-center justify-center w-12 py-1 transition-colors ${
                isAct ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-semibold mt-0.5 tracking-tight">{m.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
