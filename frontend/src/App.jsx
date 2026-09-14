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
import ViksitBharat from "./components/ViksitBharat";
import FarmMap from "./components/FarmMap";
import ProfileSettings from "./components/ProfileSettings";
import { translations } from "./translations";
import confetti from "canvas-confetti";
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
    throw new Error("Failed to update farm");
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
      console.error(e);
    }
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
      console.error("Prediction failed:", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 60-Second Killer Demo One-Click Runner
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
      const res = await handleRunPrediction(params);
      const irrRes = await fetch(`${API_BASE}/smart-irrigation`).then((r) => r.json());
      setSmartIrrigation(irrRes);

      // Trigger Confetti celebration
      try {
        confetti({
          particleCount: 55,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#E2A83B", "#59C7B1", "#1E8A78"]
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
      console.error(e);
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
      console.error(e);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, { method: "DELETE" });
      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-[var(--text-primary)] p-4" style={{ background: "var(--bg-canvas)" }}>
        <div style={{ position: "relative", marginBottom: "2rem" }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, background: "linear-gradient(135deg, var(--color-harvest), var(--color-harvest-dark))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", boxShadow: "0 0 40px rgba(233,172,58,0.45), 0 8px 24px rgba(0,0,0,0.4)", animation: "float 2s ease-in-out infinite" }}>
            🌾
          </div>
        </div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
          KrishiMitra <span style={{ color: "var(--color-harvest)" }}>AI</span> is loading…
        </h2>
        <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", marginBottom: "1.5rem" }}>
          Hyperlocal Climate-to-Crop Decision Intelligence
        </p>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[0,1,2].map(i => (
            <div key={i} className="neon-dot neon-dot-saffron" style={{ animationDelay: `${i * 220}ms`, width: 9, height: 9 }} />
          ))}
        </div>
      </div>
    );
  }

  // Page label map
  const pageTitles = {
    dashboard: { title: "Dashboard", sub: "Live farm overview & telemetry" },
    myFarm: { title: "My Farm", sub: "Configure your farm parameters" },
    aiRecommendation: { title: "AI Crop Advisor", sub: "ML-powered crop suitability analysis" },
    weather: { title: "Weather Intelligence", sub: "Hyperlocal climate telemetry" },
    smartIrrigation: { title: "Smart Irrigation", sub: "Precision water management" },
    planner: { title: "Farm Planner", sub: "Task management & scheduling" },
    assistant: { title: "Krishi Assistant", sub: "Bilingual agronomy Q&A" },
    analytics: { title: "Farm Analytics", sub: "Performance metrics & insights" },
    viksitBharat: { title: "Viksit Bharat", sub: "Government schemes & subsidies" },
    farmMap: { title: "Farm Map", sub: "Geospatial farm visualisation" },
    profile: { title: "Profile Settings", sub: "Account & preferences" },
  };
  const currentPage = pageTitles[activeTab] || pageTitles.dashboard;

  return (
    <div className="app-layout">
      {/* Sidebar + mobile nav */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        farm={farm}
        weather={weather}
        t={t}
      />

      {/* Right: topbar + page content */}
      <div className="app-content">
        {/* Top Bar */}
        <div className="topbar">
          <div className="topbar-ticker">
            <span className="neon-dot neon-dot-cyan" />
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.72rem", color: "var(--color-rain-glow)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Live</span>
            <span style={{ color: "var(--text-dim)" }}>|</span>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>{currentPage.title}</span>
            <span style={{ color: "var(--text-dim)", fontSize: "0.68rem" }}>— {currentPage.sub}</span>
          </div>
          <div className="topbar-actions">
            {weather && (
              <span className="neon-badge neon-badge-cyan" style={{ gap: "0.4rem" }}>
                <span>{weather.temperature}°C</span>
                <span style={{ opacity: 0.5 }}>·</span>
                <span>RH {weather.humidity}%</span>
              </span>
            )}
            <button
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="neon-badge neon-badge-saffron"
              style={{ cursor: "pointer", border: "1px solid var(--border-saffron)" }}
            >
              {language === "en" ? "हिन्दी" : "EN"}
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="page-container">
          {networkError && (
            <div style={{ marginBottom: "1.25rem", borderRadius: 12, border: "1px solid rgba(208,96,78,0.40)", background: "rgba(19,42,32,0.80)", padding: "0.85rem 1rem", fontSize: "0.78rem", color: "#fca5a5", fontFamily: "var(--font-mono)" }}>
              ⚠ {networkError}
            </div>
          )}

          <div className="animate-fade-up">
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

            {activeTab === "myFarm" && (
              <MyFarm
                farm={farm}
                onUpdateFarm={handleUpdateFarm}
                t={t}
              />
            )}

            {activeTab === "aiRecommendation" && (
              <AICropRecommendation
                farm={farm}
                weather={weather}
                recommendation={recommendation}
                onRunPrediction={handleRunPrediction}
                isComputing={isAnalyzing}
                t={t}
              />
            )}

            {activeTab === "weather" && (
              <WeatherIntelligence
                weather={weather}
                t={t}
              />
            )}

            {activeTab === "smartIrrigation" && (
              <SmartIrrigation
                smartIrrigation={smartIrrigation}
                farm={farm}
                weather={weather}
                t={t}
              />
            )}

            {activeTab === "planner" && (
              <FarmPlanner
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onCreateTask={handleCreateTask}
                onDeleteTask={handleDeleteTask}
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

            {activeTab === "viksitBharat" && (
              <ViksitBharat
                t={t}
              />
            )}

            {activeTab === "farmMap" && (
              <FarmMap
                farm={farm}
                onUpdateCoordinates={handleUpdateCoordinates}
                t={t}
              />
            )}

            {activeTab === "profile" && (
              <ProfileSettings
                farm={farm}
                language={language}
                setLanguage={setLanguage}
                t={t}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
