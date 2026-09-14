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
import LoginPage, { DEMO_FARMER_ACCOUNTS } from "./components/LoginPage";
import { INDIA_STATES_DATA, findNearestIndianDistrict } from "./data/indiaLocations";
import { translations } from "./translations";
import confetti from "canvas-confetti";
import {
  Menu,
  Bell,
  MapPin,
  Compass,
  CheckCircle2,
  Globe2,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Crosshair
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

  // Authentication State (Separate Login Page)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("km_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Top Header Location Switcher Modal / Dropdown
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [headerSelectedState, setHeaderSelectedState] = useState("Punjab");

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

  // Accessibility Controls (Font Size & High Contrast)
  const [fontSize, setFontSize] = useState(() => localStorage.getItem("km_font_size") || "normal");
  const [contrastMode, setContrastMode] = useState(() => localStorage.getItem("km_contrast") || "normal");

  useEffect(() => {
    document.documentElement.setAttribute("data-font-size", fontSize);
    localStorage.setItem("km_font_size", fontSize);
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.setAttribute("data-contrast", contrastMode);
    localStorage.setItem("km_contrast", contrastMode);
  }, [contrastMode]);

  const cycleFontSize = () => {
    setFontSize((prev) => (prev === "normal" ? "large" : prev === "large" ? "xl" : "normal"));
  };

  const toggleContrast = () => {
    setContrastMode((prev) => (prev === "normal" ? "high" : "normal"));
  };

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

  // Update coordinates, location name, and soil from Map or Dropdown
  const handleUpdateCoordinates = async (lat, lon, locationName, soilType, extraFields = {}) => {
    const payload = {
      latitude: lat,
      longitude: lon,
      ...(locationName ? { location_name: locationName } : {}),
      ...(soilType ? { soil_type: soilType } : {}),
      ...extraFields
    };
    try {
      const res = await fetch(`${API_BASE}/farm`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setFarm(data);
        refreshWeatherAndIrrigation(lat, lon, data.location_name);
        return data;
      }
    } catch (e) {
      setFarm((prev) => ({ ...prev, ...payload }));
      refreshWeatherAndIrrigation(lat, lon, locationName || farm?.location_name || "Farm Parcel");
    }
  };

  // User Login Handler (Stores user and syncs profile with farm)
  const handleUserLogin = (userProfile) => {
    setCurrentUser(userProfile);
    localStorage.setItem("km_user", JSON.stringify(userProfile));
    handleUpdateCoordinates(
      userProfile.latitude,
      userProfile.longitude,
      userProfile.location_name,
      userProfile.soil_type,
      {
        farmer_name: userProfile.farmer_name,
        farm_name: userProfile.farm_name,
        area_acres: userProfile.area_acres,
        current_crop: userProfile.current_crop,
        crop_stage: userProfile.crop_stage
      }
    );
  };

  // User Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("km_user");
    setCurrentUser(null);
  };

  // GPS Quick Detect Handler for Header (Accurately resolves nearest Indian District)
  const handleHeaderGpsDetect = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGpsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const nearest = findNearestIndianDistrict(latitude, longitude);
        const resolvedName = `${nearest.name}, ${nearest.state}, India (GPS Fix)`;
        handleUpdateCoordinates(latitude, longitude, resolvedName, nearest.soil);
        setGpsDetecting(false);
      },
      (err) => {
        console.warn("GPS error:", err);
        setGpsDetecting(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
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

  // Render separate dedicated Login Page if farmer is not signed in
  if (!currentUser) {
    return (
      <LoginPage
        onLogin={handleUserLogin}
        language={language}
        setLanguage={setLanguage}
      />
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
            {/* Location & GPS Control with Interactive NovaVarsha AI Dropdown */}
            <div className="relative">
              <div
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="hidden sm:flex items-center gap-1.5 bg-[#091D14] border border-slate-800 hover:border-emerald-500/60 px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-colors"
                title="Change Farm Location (State & District)"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-bold truncate max-w-[150px]">
                  {farm?.location_name?.split(",")[0] || farm?.location_name || "Select Farm"}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHeaderGpsDetect();
                  }}
                  disabled={gpsDetecting}
                  title="Detect Current GPS Location"
                  className="p-0.5 text-slate-400 hover:text-emerald-400 ml-1 transition-colors"
                >
                  <Compass className={`w-3.5 h-3.5 ${gpsDetecting ? "animate-spin text-emerald-400" : ""}`} />
                </button>
              </div>

              {/* Floating Dropdown Modal */}
              {showLocationPicker && (
                <div className="absolute top-full mt-2 left-0 w-80 p-4 rounded-2xl bg-[#091912] border border-emerald-500/40 shadow-2xl z-[2000] space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Select Agro-Location
                    </span>
                    <button
                      onClick={() => setShowLocationPicker(false)}
                      className="text-slate-400 hover:text-white text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* State Select */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">State</label>
                    <select
                      value={headerSelectedState}
                      onChange={(e) => setHeaderSelectedState(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                    >
                      {INDIA_STATES_DATA.map((s) => (
                        <option key={s.state} value={s.state}>
                          {s.state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District Select */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">District / Agro-Zone</label>
                    <select
                      onChange={(e) => {
                        const dist = INDIA_STATES_DATA.find((s) => s.state === headerSelectedState)?.districts.find(
                          (d) => d.name === e.target.value
                        );
                        if (dist) {
                          handleUpdateCoordinates(dist.lat, dist.lon, `${dist.name}, ${headerSelectedState}, India`, dist.soil);
                          setShowLocationPicker(false);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="">-- Choose District --</option>
                      {(INDIA_STATES_DATA.find((s) => s.state === headerSelectedState)?.districts || []).map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name} ({d.crop})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Live GPS Button */}
                  <button
                    onClick={() => {
                      handleHeaderGpsDetect();
                      setShowLocationPicker(false);
                    }}
                    className="w-full py-2 rounded-lg bg-emerald-600/30 border border-emerald-500/50 hover:bg-emerald-600 text-emerald-300 hover:text-white transition-colors text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Detect My Current GPS</span>
                  </button>
                </div>
              )}
            </div>

            {/* AI Status: Online Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/80 text-[10px] font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>AI Engine: Online</span>
            </div>

            {/* Font Size Adjuster Button */}
            <button
              onClick={cycleFontSize}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1.5"
              title="Adjust Font Size: Normal (100%), Large (115%), Extra Large (130%)"
            >
              <span className="font-mono text-xs font-bold text-emerald-400">Aa</span>
              <span className="text-[11px] font-mono text-slate-300">
                {fontSize === "normal" ? "100%" : fontSize === "large" ? "115%" : "130%"}
              </span>
            </button>

            {/* High Contrast Toggle Button */}
            <button
              onClick={toggleContrast}
              className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                contrastMode === "high"
                  ? "bg-amber-400 text-black border-amber-300 shadow-md font-extrabold"
                  : "bg-slate-900 border-slate-800 text-slate-200 hover:text-white"
              }`}
              title="Toggle Ultra-High Contrast Mode (WCAG AAA)"
            >
              <span>◐</span>
              <span className="hidden sm:inline">{contrastMode === "high" ? "High Contrast" : "Contrast"}</span>
            </button>

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

            {/* Farmer Profile Badge */}
            <div
              onClick={() => setActiveTab("settings")}
              className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-colors text-xs"
              title="View Farmer Profile"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold text-xs">
                🌾
              </div>
              <span className="text-white font-bold max-w-[100px] truncate">
                {currentUser?.farmer_name || farm?.farmer_name || "Farmer"}
              </span>
            </div>

            {/* Logout / Switch Account Button */}
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-red-950/30 border border-red-800/50 text-red-300 hover:bg-red-900/50 hover:text-white transition-colors"
              title="Sign Out / Switch Farmer Account"
            >
              <LogOut className="w-4 h-4" />
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
              currentUser={currentUser}
              onLogout={handleLogout}
              language={language}
              setLanguage={setLanguage}
              fontSize={fontSize}
              setFontSize={setFontSize}
              contrastMode={contrastMode}
              setContrastMode={setContrastMode}
              t={t}
            />
          )}
        </main>
      </div>
    </div>
  );
}
