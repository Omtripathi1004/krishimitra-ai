import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import MyFarm from "./components/MyFarm";
import AICropRecommendation from "./components/AICropRecommendation";
import WeatherIntelligence from "./components/WeatherIntelligence";
import SmartIrrigation from "./components/SmartIrrigation";
import FarmPlanner from "./components/FarmPlanner";
import KrishiAssistant from "./components/KrishiAssistant";
import FarmAnalytics from "./components/FarmAnalytics";
import FarmRiskCenter from "./components/FarmRiskCenter";
import AlertCenter from "./components/AlertCenter";
import ViksitBharat from "./components/ViksitBharat";
import FarmMap from "./components/FarmMap";
import ProfileSettings from "./components/ProfileSettings";
import { translations } from "./translations";
import confetti from "canvas-confetti";
import {
  Menu,
  Bell,
  MapPin,
  Compass,
  CheckCircle2,
  Globe2,
  User
} from "lucide-react";
import {
  API_BASE,
  DEFAULT_FALLBACK_FARM,
  DEFAULT_FALLBACK_WEATHER,
  DEFAULT_FALLBACK_IRRIGATION,
  DEFAULT_FALLBACK_TASKS,
  DEFAULT_FALLBACK_ANALYTICS,
  DEFAULT_FALLBACK_RECOMMENDATION
} from "./config";

export default function App() {
  const [language, setLanguage] = useState("en");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Core Data States
  const [farm, setFarm] = useState(null);
  const [weather, setWeather] = useState(null);
  const [smartIrrigation, setSmartIrrigation] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Loading States
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [gpsDetecting, setGpsDetecting] = useState(false);

  const t = translations[language] || translations.en;

  // Initial Data Fetch
  useEffect(() => {
    async function loadInitialData() {
      setIsInitializing(true);
      try {
        const [farmRes, weatherRes, irrRes, tasksRes, analyticsRes] = await Promise.all([
          fetch(`${API_BASE}/farm`).then((r) => r.json()),
          fetch(`${API_BASE}/weather`).then((r) => r.json()),
          fetch(`${API_BASE}/smart-irrigation`).then((r) => r.json()),
          fetch(`${API_BASE}/tasks`).then((r) => r.json()),
          fetch(`${API_BASE}/analytics`).then((r) => r.json())
        ]);

        setFarm(farmRes);
        setWeather(weatherRes);
        setSmartIrrigation(irrRes);
        setTasks(tasksRes);
        setAnalytics(analyticsRes);

        // Run initial seed recommendation
        if (farmRes && weatherRes) {
          const recRes = await fetch(`${API_BASE}/recommend-crop`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nitrogen: farmRes.nitrogen || 85,
              phosphorus: farmRes.phosphorus || 45,
              potassium: farmRes.potassium || 40,
              temperature: weatherRes.temperature || 24,
              humidity: weatherRes.humidity || 60,
              ph: farmRes.soil_ph || 6.8,
              rainfall: weatherRes.rainfall_forecast_7d ? Math.max(35, weatherRes.rainfall_forecast_7d * 6) : 75
            })
          }).then((r) => r.json());
          setRecommendation(recRes);
        }
      } catch (err) {
        console.warn("Backend offline or unreachable, deploying in resilient demo mode:", err);
        setFarm(DEFAULT_FALLBACK_FARM);
        setWeather(DEFAULT_FALLBACK_WEATHER);
        setSmartIrrigation(DEFAULT_FALLBACK_IRRIGATION);
        setTasks(DEFAULT_FALLBACK_TASKS);
        setAnalytics(DEFAULT_FALLBACK_ANALYTICS);
        setRecommendation(DEFAULT_FALLBACK_RECOMMENDATION);
      } finally {
        setIsInitializing(false);
      }
    }

    loadInitialData();
  }, []);

  // Update Farm API Handler
  const handleUpdateFarm = async (updatedData) => {
    try {
      const res = await fetch(`${API_BASE}/farm`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const data = await res.json();
        setFarm(data);
        refreshWeatherAndIrrigation(data.latitude, data.longitude, data.location_name);
        return data;
      }
    } catch (e) {
      setFarm((prev) => ({ ...prev, ...updatedData }));
    }
  };

  const refreshWeatherAndIrrigation = async (lat, lon, loc) => {
    try {
      const [wRes, irrRes] = await Promise.all([
        fetch(`${API_BASE}/weather?lat=${lat}&lon=${lon}&location=${encodeURIComponent(loc)}`).then((r) => r.json()),
        fetch(`${API_BASE}/smart-irrigation`).then((r) => r.json())
      ]);
      setWeather(wRes);
      setSmartIrrigation(irrRes);
    } catch (e) {
      console.warn("Refresh failed:", e);
    }
  };

  // Update coordinates from Map
  const handleUpdateCoordinates = async (lat, lon) => {
    try {
      const res = await fetch(`${API_BASE}/farm`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lon })
      });
      if (res.ok) {
        const data = await res.json();
        setFarm(data);
        refreshWeatherAndIrrigation(lat, lon, data.location_name);
      }
    } catch (e) {
      setFarm((prev) => ({ ...prev, latitude: lat, longitude: lon }));
    }
  };

  // GPS Quick Detect Handler for Header (Section 6)
  const handleHeaderGpsDetect = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGpsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        handleUpdateCoordinates(latitude, longitude);
        setGpsDetecting(false);
      },
      (err) => {
        console.warn("GPS error:", err);
        setGpsDetecting(false);
      }
    );
  };

  // Run AI Crop Prediction
  const handleRunPrediction = async (params) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch(`${API_BASE}/recommend-crop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendation(data);
        return data;
      }
    } catch (e) {
      console.warn("Prediction fallback applied:", e);
      setRecommendation(DEFAULT_FALLBACK_RECOMMENDATION);
      return DEFAULT_FALLBACK_RECOMMENDATION;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 60-Second Demo One-Click Runner
  const handleRunKillerDemoAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const params = {
        nitrogen: farm?.nitrogen || 85,
        phosphorus: farm?.phosphorus || 45,
        potassium: farm?.potassium || 40,
        temperature: weather?.temperature || 24,
        humidity: weather?.humidity || 60,
        ph: farm?.soil_ph || 6.8,
        rainfall: weather?.rainfall_forecast_7d ? Math.max(35, weather.rainfall_forecast_7d * 6) : 75
      };
      await handleRunPrediction(params);

      try {
        confetti({
          particleCount: 55,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#22C55E", "#15803D", "#E2A83B"]
        });
      } catch (e) {
        // Safe fallback
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Task Handlers
  const handleToggleTask = async (taskId) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/toggle`, { method: "PATCH" });
      if (res.ok) {
        const updated = await res.json();
        setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      }
    } catch (e) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
      );
    }
  };

  const handleCreateTask = async (taskPayload) => {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskPayload)
      });
      if (res.ok) {
        const created = await res.json();
        setTasks((prev) => [created, ...prev]);
      }
    } catch (e) {
      const fallbackNewTask = { id: Date.now(), ...taskPayload, completed: false };
      setTasks((prev) => [fallbackNewTask, ...prev]);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, { method: "DELETE" });
      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      }
    } catch (e) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    }
  };

  if (isInitializing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-white p-4 bg-[#091912]">
        <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-2xl shadow-lg mb-4 animate-bounce">
          🌾
        </div>
        <h2 className="text-lg font-bold tracking-tight">
          KrishiMitra <span className="text-emerald-400">AI</span> Command Center
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Synchronizing precision agro-meteorological telemetry...
        </p>
      </div>
    );
  }

  // Page title mapping
  const pageTitles = {
    dashboard: "Dashboard Overview",
    farmIntelligence: "Farm Intelligence & Field Telemetry",
    weather: "Weather Intelligence & NWP Forecast",
    cropIntelligence: "Crop Intelligence & ML Recommendations",
    diseaseRisk: "Farm Risk Command Center",
    smartIrrigation: "Smart Irrigation & Soil Hydrology",
    irrigation: "Smart Irrigation & Soil Hydrology",
    planner: "Farm Milestone & Work Planner",
    maps: "Geospatial Agricultural Map",
    assistant: "Krishi Copilot AI Assistant",
    analytics: "Farm Performance Analytics",
    alerts: "Agronomic Alert & Advisory Center",
    viksitBharat: "Government Official Datasets & Schemes",
    settings: "Farm Profile & Platform Settings"
  };

  return (
    <div className="app-shell">
      {/* ── COLLAPSIBLE SIDEBAR (SECTION 5) ── */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        alertCount={3}
        farm={farm}
        weather={weather}
        t={t}
      />

      {/* ── MAIN CONTENT AREA ── */}
      <div className="command-main">
        {/* ── COMPACT TOP HEADER (SECTION 6) ── */}
        <header className="command-header">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 md:hidden"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Title */}
            <div>
              <div className="text-xs font-bold text-white tracking-tight flex items-center gap-2">
                <span>KrishiMitra AI</span>
                <span className="text-slate-500">/</span>
                <span className="text-emerald-400 font-semibold">{pageTitles[activeTab] || "Overview"}</span>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Location & GPS Control */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#091D14] border border-slate-800 px-2.5 py-1 rounded-lg text-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-300 font-medium truncate max-w-[140px]">
                {farm?.location_name || `${farm?.district || "Varanasi"}, ${farm?.state || "UP"}`}
              </span>
              <button
                onClick={handleHeaderGpsDetect}
                disabled={gpsDetecting}
                title="Detect Current GPS Location"
                className="p-0.5 text-slate-400 hover:text-emerald-400 ml-1 transition-colors"
              >
                <Compass className={`w-3.5 h-3.5 ${gpsDetecting ? "animate-spin text-emerald-400" : ""}`} />
              </button>
            </div>

            {/* AI Status: Online Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/80 text-[10px] font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>AI Engine: Online</span>
            </div>

            {/* Language Selector */}
            <button
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1.5"
              title="Toggle Language"
            >
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === "en" ? "हिन्दी" : "EN"}</span>
            </button>

            {/* Notification Bell (Links to Alerts tab) */}
            <button
              onClick={() => setActiveTab("alerts")}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 relative transition-colors"
              title="Agronomic Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => setActiveTab("settings")}
              className="p-1.5 rounded-lg bg-emerald-900/60 border border-emerald-700/70 text-emerald-300 hover:bg-emerald-800 transition-colors"
              title="Farmer Profile & Settings"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ── LIVE TELEMETRY TICKER BAR ── */}
        <div className="bg-[var(--surface-2)]/90 border-b border-[var(--border)] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 overflow-x-auto py-0.5 scrollbar-none">
            <span className="flex items-center gap-1.5 font-mono text-[var(--leaf)] font-bold">
              <span className="w-2 h-2 rounded-full bg-[var(--leaf)] animate-ping inline-block" />
              <span>LIVE TELEMETRY</span>
            </span>
            <span className="text-[var(--border)]">|</span>
            <span className="text-[var(--text-secondary)]">
              Territory: <strong className="text-white">{farm?.location_name || "Ludhiana, Punjab"}</strong>
            </span>
            <span className="text-[var(--border)]">|</span>
            <span className="text-[var(--text-secondary)]">
              Temp: <strong className="text-[var(--harvest)]">{weather?.temperature || 28}°C</strong>
            </span>
            <span className="text-[var(--border)]">|</span>
            <span className="text-[var(--text-secondary)]">
              RH: <strong className="text-[var(--sky)]">{weather?.humidity || 62}%</strong>
            </span>
            <span className="text-[var(--border)]">|</span>
            <span className="text-[var(--text-secondary)]">
              Soil Moisture: <strong className="text-[var(--leaf)]">68% VWC</strong>
            </span>
            <span className="text-[var(--border)]">|</span>
            <span className="text-[var(--text-secondary)]">
              Irrigation Directive: <strong className="text-[var(--sky)]">{smartIrrigation?.irrigation_data?.status || "Hold (Rain 24h)"}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab("smartIrrigation")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "smartIrrigation" || activeTab === "irrigation"
                  ? "bg-[var(--primary)] text-white shadow"
                  : "bg-[var(--surface)] text-[var(--sky)] hover:text-white border border-[var(--sky)]/30"
              }`}
            >
              <span>💧 Smart Irrigation</span>
            </button>
            <button
              onClick={() => setActiveTab("maps")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "maps"
                  ? "bg-[var(--primary)] text-white shadow"
                  : "bg-[var(--surface)] text-[var(--leaf)] hover:text-white border border-[var(--primary)]/30"
              }`}
            >
              <span>🛰️ Satellite Map</span>
            </button>
          </div>
        </div>

        {/* ── PAGE CONTENT CONTAINER ── */}
        <main className="command-content">
          {activeTab === "dashboard" && (
            <Dashboard
              farm={farm}
              weather={weather}
              smartIrrigation={smartIrrigation}
              recommendation={recommendation}
              analytics={analytics}
              t={t}
              onRunAiAnalysis={handleRunKillerDemoAnalysis}
              isAnalyzing={isAnalyzing}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === "farmIntelligence" && (
            <MyFarm
              farm={farm}
              onUpdateFarm={handleUpdateFarm}
              t={t}
            />
          )}

          {(activeTab === "smartIrrigation" || activeTab === "irrigation") && (
            <SmartIrrigation
              smartIrrigation={smartIrrigation}
              farm={farm}
              weather={weather}
              t={t}
            />
          )}

          {(activeTab === "planner" || activeTab === "farmPlanner") && (
            <FarmPlanner
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onCreateTask={handleCreateTask}
              onDeleteTask={handleDeleteTask}
              t={t}
            />
          )}

          {activeTab === "weather" && (
            <WeatherIntelligence
              weather={weather}
              t={t}
            />
          )}

          {activeTab === "cropIntelligence" && (
            <AICropRecommendation
              farm={farm}
              weather={weather}
              recommendation={recommendation}
              onRunPrediction={handleRunPrediction}
              isComputing={isAnalyzing}
              t={t}
            />
          )}

          {activeTab === "diseaseRisk" && (
            <FarmRiskCenter
              farm={farm}
              weather={weather}
              smartIrrigation={smartIrrigation}
              t={t}
            />
          )}

          {activeTab === "maps" && (
            <FarmMap
              farm={farm}
              onUpdateCoordinates={handleUpdateCoordinates}
              t={t}
            />
          )}

          {activeTab === "assistant" && (
            <KrishiAssistant
              farm={farm}
              weather={weather}
              language={language}
              t={t}
            />
          )}

          {activeTab === "analytics" && (
            <FarmAnalytics
              analytics={analytics}
              farm={farm}
              t={t}
            />
          )}

          {activeTab === "alerts" && (
            <AlertCenter
              farm={farm}
              weather={weather}
              smartIrrigation={smartIrrigation}
              t={t}
            />
          )}

          {activeTab === "viksitBharat" && (
            <ViksitBharat
              t={t}
            />
          )}

          {activeTab === "settings" && (
            <ProfileSettings
              farm={farm}
              language={language}
              setLanguage={setLanguage}
              t={t}
            />
          )}
        </main>
      </div>
    </div>
  );
}
