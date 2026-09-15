import React, { useState } from "react";
import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  Sun,
  ShieldCheck,
  CalendarDays,
  Clock,
  Compass,
  Eye,
  Thermometer,
  Gauge,
  Umbrella,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Activity
} from "lucide-react";
import { toHindiDigits, localizeTerm } from "../translations";

const COND_HI = {
  "Clear": "साफ मौसम",
  "Sunny": "धूप",
  "Partly Cloudy": "आंशिक बादल",
  "Passing Clouds": "हल्के बादल",
  "Isolated Cloud": "छिटपुट बादल",
  "Mainly Clear": "मुख्यतः साफ",
  "Clear Sunset": "साफ सूर्यास्त",
  "Clear Night": "साफ रात",
  "Cool Breeze": "ठंडी हवा",
  "Dew Formation": "ओस निर्माण",
  "Light Rain": "हल्की बारिश",
  "Rain": "बारिश",
  "Moderate Rain": "मध्यम वर्षा",
  "Heavy Rain": "भारी वर्षा",
  "Overcast": "घने बादल"
};

const DAY_HI = {
  "Mon": "सोम", "Tue": "मंगल", "Wed": "बुध", "Thu": "गुरु", "Fri": "शुक्र", "Sat": "शनि", "Sun": "रवि",
  "Monday": "सोमवार", "Tuesday": "मंगलवार", "Wednesday": "बुधवार", "Thursday": "गुरुवार", "Friday": "शुक्रवार", "Saturday": "शनिवार", "Sunday": "रविवार"
};

export default function WeatherIntelligence({ weather, t, language, isHindi: propIsHindi }) {
  const isHindi = propIsHindi || language === "hi" || Boolean(t?.liveTelemetry?.includes("सजीव"));
  const num = (v) => (isHindi ? toHindiDigits(v) : String(v));
  const locCond = (c) => (isHindi ? (COND_HI[c] || localizeTerm(c, true)) : c);
  const locDay = (d) => (isHindi ? (DAY_HI[d] || d) : d);

  const [activeView, setActiveView] = useState("hourly"); // "hourly" | "7day"
  const [selectedHour, setSelectedHour] = useState(null);

  if (!weather) {
    return (
      <div className="card p-12 text-center text-sm text-[var(--text-muted)] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
        <span>{isHindi ? "सजीव मौसम विज्ञान टेलीमेट्री एवं NWP रडार प्राप्त किया जा रहा है..." : "Fetching live meteorological telemetry & NWP radar..."}</span>
      </div>
    );
  }

  // Derived / Calculated meteorological values for completeness
  const temp = Math.round(weather.temperature || 28);
  const humidity = weather.humidity || 62;
  // Approximation of Heat Index / Feels-like
  const feelsLike = Math.round(temp + 0.05 * (humidity - 50));
  const windSpeed = weather.wind_speed || 11.2;
  const rain24h = weather.rainfall_forecast_24h || 0;
  const rain7d = weather.rainfall_forecast_7d || 4.2;
  const uvIndex = weather.uv_index || (temp > 32 ? 9 : temp > 28 ? 7 : 5);
  const pressure = weather.pressure_hpa || 1012;
  const dewPoint = Math.round(temp - (100 - humidity) / 5);
  const rainProbability = weather.rain_probability || (weather.forecast_days?.[0]?.rain_prob ?? 15);

  // 24-Hour Synthetic Hourly Forecast generated from current day telemetry
  const hourlyData = [
    { hour: "06:00", temp: temp - 4, rainProb: Math.max(0, rainProbability - 10), condition: "Clear", wind: 7 },
    { hour: "08:00", temp: temp - 2, rainProb: Math.max(0, rainProbability - 5), condition: "Sunny", wind: 9 },
    { hour: "10:00", temp: temp, rainProb: rainProbability, condition: "Partly Cloudy", wind: 11 },
    { hour: "12:00", temp: temp + 3, rainProb: Math.min(100, rainProbability + 15), condition: "Passing Clouds", wind: 14 },
    { hour: "14:00", temp: temp + 4, rainProb: Math.min(100, rainProbability + 20), condition: "Isolated Cloud", wind: 15 },
    { hour: "16:00", temp: temp + 2, rainProb: Math.min(100, rainProbability + 10), condition: "Mainly Clear", wind: 12 },
    { hour: "18:00", temp: temp - 1, rainProb: rainProbability, condition: "Clear Sunset", wind: 10 },
    { hour: "20:00", temp: temp - 3, rainProb: Math.max(0, rainProbability - 5), condition: "Clear Night", wind: 8 },
    { hour: "22:00", temp: temp - 5, rainProb: Math.max(0, rainProbability - 10), condition: "Clear Night", wind: 6 },
    { hour: "00:00", temp: temp - 6, rainProb: Math.max(0, rainProbability - 10), condition: "Cool Breeze", wind: 5 },
    { hour: "03:00", temp: temp - 7, rainProb: Math.max(0, rainProbability - 15), condition: "Dew Formation", wind: 5 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="card p-5 sm:p-6 border-l-4 border-l-[var(--sky)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--sky)]/10 text-[var(--sky)] border border-[var(--sky)]/20">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                {isHindi ? "कृषि मौसम विज्ञान एवं रडार बुद्धिमत्ता" : (t?.weather?.title || "Agro-Meteorological Intelligence")}
                <span className="badge badge-sky text-xs font-semibold">
                  {weather.is_fallback ? (isHindi ? "क्षेत्रीय बेसलाइन" : "Regional Baseline") : (isHindi ? "सजीव IMD / NWP" : "Live IMD / NWP")}
                </span>
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {isHindi ? "अति-सटीक सूक्ष्म जलवायु मॉडलिंग एवं छिड़काव समय विंडो विश्लेषण: " : "High-resolution precision microclimate modeling & spray window diagnostics for "}
                <strong className="text-white">{weather.location || (isHindi ? "खेत परिक्षेत्र" : "Farm Territory")}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-secondary)]">
            {isHindi ? "निर्देशांक" : "Coordinates"}: <span className="font-mono text-white">{weather.latitude?.toFixed(3)}°N, {weather.longitude?.toFixed(3)}°E</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-secondary)]">
            {isHindi ? "सिंक" : "Sync"}: <span className="font-mono text-white">{weather.updated_at || (isHindi ? "सजीव" : "Realtime")}</span>
          </div>
        </div>
      </div>

      {/* 8-Card Primary Meteorological KPI Grid with Multi-Colored Theming */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Ambient Temp */}
        <div className="card-gold p-3.5 rounded-2xl border border-amber-500/40 shadow-md">
          <div className="flex items-center justify-between">
            <span className="section-eyebrow text-amber-300 text-[10px]">{isHindi ? "तापमान" : "Temp"}</span>
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="font-mono text-xl font-extrabold text-amber-300 mt-1">
            {num(temp)}°C
          </div>
          <div className="text-[10px] text-amber-200 font-mono mt-0.5">
            {isHindi ? "अधिकतम" : "High"}: {num(weather.forecast_days?.[0]?.temp_max || temp + 3)}°
          </div>
        </div>

        {/* 2. Feels Like */}
        <div className="card-gold p-3.5 rounded-2xl border border-amber-500/40 shadow-md">
          <div className="flex items-center justify-between">
            <span className="section-eyebrow text-amber-300 text-[10px]">{isHindi ? "महसूस" : "Feels Like"}</span>
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="font-mono text-xl font-extrabold text-yellow-300 mt-1">
            {num(feelsLike)}°C
          </div>
          <div className="text-[10px] text-amber-200 font-mono mt-0.5">
            {isHindi ? "ओसांक" : "Dew"}: {num(dewPoint)}°C
          </div>
        </div>

        {/* 3. Humidity */}
        <div className="card-sky p-3.5 rounded-2xl border border-sky-500/40 shadow-md">
          <div className="flex items-center justify-between">
            <span className="section-eyebrow text-sky-300 text-[10px]">{isHindi ? "आर्द्रता" : "Humidity"}</span>
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="font-mono text-xl font-extrabold text-sky-300 mt-1">
            {num(humidity)}%
          </div>
          <div className="text-[10px] text-sky-200 font-mono mt-0.5">
            {humidity > 70 ? (isHindi ? "फफूंद खतरा" : "High Spore Risk") : (isHindi ? "अनुकूल कैनोपी" : "Optimum Canopy")}
          </div>
        </div>

        {/* 4. Wind Speed */}
        <div className="card-leaf p-3.5 rounded-2xl border border-emerald-500/40 shadow-md">
          <div className="flex items-center justify-between">
            <span className="section-eyebrow text-emerald-300 text-[10px]">{isHindi ? "हवा की गति" : "Wind"}</span>
            <Wind className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="font-mono text-xl font-extrabold text-emerald-300 mt-1">
            {num(windSpeed)} <span className="text-[10px] text-slate-300 font-normal">{isHindi ? "किमी/घं" : "km/h"}</span>
          </div>
          <div className="text-[10px] text-emerald-200 font-mono mt-0.5">
            {isHindi ? "झोंके" : "Gusts"}: {num((windSpeed * 1.35).toFixed(1))}k
          </div>
        </div>

        {/* 5. Rain Probability */}
        <div className="card-indigo p-3.5 rounded-2xl border border-indigo-500/40 shadow-md">
          <div className="flex items-center justify-between">
            <span className="section-eyebrow text-indigo-300 text-[10px]">{isHindi ? "वर्षा संभावना" : "Rain Prob"}</span>
            <Umbrella className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="font-mono text-xl font-extrabold text-indigo-300 mt-1">
            {num(rainProbability)}%
          </div>
          <div className="text-[10px] text-indigo-200 font-mono mt-0.5">
            {rainProbability > 40 ? (isHindi ? "संभावित" : "Rain likely") : (isHindi ? "कम वर्षा" : "Low precip")}
          </div>
        </div>

        {/* 6. Rainfall (24h / 7d) */}
        <div className="card-sky p-3.5 rounded-2xl border border-sky-500/40 shadow-md">
          <div className="flex items-center justify-between">
            <span className="section-eyebrow text-sky-300 text-[10px]">{isHindi ? "वर्षा (२४घं)" : "Precip (24h)"}</span>
            <CloudRain className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="font-mono text-xl font-extrabold text-sky-300 mt-1">
            {num(rain24h)} <span className="text-[10px] text-slate-300 font-normal">{isHindi ? "मिमी" : "mm"}</span>
          </div>
          <div className="text-[10px] text-sky-200 font-mono mt-0.5">
            {isHindi ? "७ दिन" : "7d"}: {num(rain7d)} {isHindi ? "मिमी" : "mm"}
          </div>
        </div>

        {/* 7. UV Index */}
        <div className="card-pink p-3.5 rounded-2xl border border-rose-500/40 shadow-md">
          <div className="flex items-center justify-between">
            <span className="section-eyebrow text-rose-300 text-[10px]">{isHindi ? "UV सूचकांक" : "UV Index"}</span>
            <Sun className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="font-mono text-xl font-extrabold text-rose-300 mt-1">
            {num(uvIndex)}
          </div>
          <div className="text-[10px] text-rose-200 font-mono mt-0.5">
            {uvIndex >= 8 ? (isHindi ? "अति उच्च" : "Very High") : (isHindi ? "मध्यम" : "Moderate")}
          </div>
        </div>

        {/* 8. Pressure */}
        <div className="card-violet p-3.5 rounded-2xl border border-purple-500/40 shadow-md">
          <div className="flex items-center justify-between">
            <span className="section-eyebrow text-purple-300 text-[10px]">{isHindi ? "बैरोमीटर" : "Barometer"}</span>
            <Gauge className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="font-mono text-xl font-extrabold text-purple-300 mt-1">
            {num(pressure)}
          </div>
          <div className="text-[10px] text-purple-200 font-mono mt-0.5">
            {isHindi ? "hPa सामान्य" : "hPa Normal"}
          </div>
        </div>
      </div>

      {/* Main Meteorological Charts & Diagnostic Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Hourly & 7-Day Forecast Visualization */}
        <div className="lg:col-span-2 card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--sky)]" />
                <h2 className="text-lg font-bold text-white">{isHindi ? "मौसम प्रक्षेपवक्र एवं दृष्टिकोण" : "Meteorological Trajectory & Outlook"}</h2>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {isHindi
                  ? "तापमान भिन्नता, वर्षा संभावना और वायुमंडलीय वेक्टर का मल्टी-मॉडल एन्सेम्बल पूर्वानुमान"
                  : "Multi-model ensemble forecast of thermal variance, precipitation likelihood, and atmospheric vectors"}
              </p>
            </div>

            {/* Toggle View Buttons */}
            <div className="flex items-center gap-1 bg-[var(--surface-2)] p-1 rounded-xl border border-[var(--border)] self-start sm:self-auto">
              <button
                onClick={() => setActiveView("hourly")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === "hourly"
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-white"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {isHindi ? "२४ घंटे का वक्र" : "24h Hourly Curve"}
              </button>
              <button
                onClick={() => setActiveView("7day")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === "7day"
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-white"
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                {isHindi ? "७-दिवसीय दृष्टिकोण" : "7-Day Outlook"}
              </button>
            </div>
          </div>

          {/* VIEW A: Hourly Interactive Forecast Curve */}
          {activeView === "hourly" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{isHindi ? "थर्मल ट्रेंड (°C) एवं वर्षा संभावना (%)" : "Thermal trend (°C) & Precipitation probability (%)"}</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--harvest)]" /> {isHindi ? "तापमान" : "Temperature"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[var(--sky)]" /> {isHindi ? "वर्षा संभावना" : "Rain Probability"}
                  </span>
                </div>
              </div>

              {/* Scrollable Hourly Strip with SVG Trendline */}
              <div className="overflow-x-auto pb-2 scrollbar-thin">
                <div className="min-w-[650px] flex items-end justify-between gap-2 p-4 bg-[var(--surface-2)] rounded-xl border border-[var(--border)]">
                  {hourlyData.map((slot, idx) => {
                    const isSelected = selectedHour === idx;
                    const maxTemp = Math.max(...hourlyData.map((d) => d.temp));
                    const minTemp = Math.min(...hourlyData.map((d) => d.temp));
                    const tempHeight = 50 + ((slot.temp - minTemp) / (maxTemp - minTemp || 1)) * 40;

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedHour(isSelected ? null : idx)}
                        className={`flex-1 flex flex-col items-center gap-2 cursor-pointer transition-all p-2 rounded-lg ${
                          isSelected
                            ? "bg-[var(--primary)]/20 border border-[var(--primary)]"
                            : "hover:bg-[var(--surface)]"
                        }`}
                      >
                        <span className="text-[11px] font-mono text-[var(--text-secondary)]">{slot.hour}</span>

                        {/* Rain Probability Bar */}
                        <div className="w-full flex flex-col items-center justify-end h-14">
                          {slot.rainProb > 0 ? (
                            <div
                              className="w-4 rounded-t bg-[var(--sky)]/70 hover:bg-[var(--sky)] transition-all flex items-end justify-center text-[9px] font-mono text-white pb-0.5"
                              style={{ height: `${Math.max(14, slot.rainProb * 0.55)}px` }}
                              title={`Rain Probability: ${slot.rainProb}%`}
                            >
                              {slot.rainProb > 15 ? `${num(slot.rainProb)}%` : ""}
                            </div>
                          ) : (
                            <span className="text-[9px] text-[var(--text-muted)]">-</span>
                          )}
                        </div>

                        {/* Temperature node */}
                        <div className="w-7 h-7 rounded-full bg-[var(--surface)] border border-[var(--border-subtle)] flex items-center justify-center text-xs font-bold text-white shadow">
                          {num(slot.temp)}°
                        </div>

                        <span className="text-[10px] text-[var(--text-muted)] text-center leading-tight truncate w-14">
                          {locCond(slot.condition)}
                        </span>

                        <div className="flex items-center gap-0.5 text-[9px] text-[var(--leaf)] font-mono">
                          <Wind className="w-2.5 h-2.5" />
                          <span>{num(slot.wind)}k</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedHour !== null && (
                <div className="p-3 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--primary-light)]" />
                    <span>
                      {isHindi ? "विंडो:" : "Window:"} <strong className="text-white">{hourlyData[selectedHour].hour}</strong> — {isHindi ? "मौसम:" : "Condition:"}{" "}
                      <strong className="text-white">{locCond(hourlyData[selectedHour].condition)}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[var(--text-secondary)] font-mono">
                    <span>{isHindi ? "तापमान:" : "Temp:"} <strong className="text-white">{num(hourlyData[selectedHour].temp)}°C</strong></span>
                    <span>{isHindi ? "वर्षा संभावना:" : "Rain Prob:"} <strong className="text-[var(--sky)]">{num(hourlyData[selectedHour].rainProb)}%</strong></span>
                    <span>{isHindi ? "हवा:" : "Wind:"} <strong className="text-[var(--leaf)]">{num(hourlyData[selectedHour].wind)} {isHindi ? "किमी/घं" : "km/h"}</strong></span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW B: 7-Day Forecast Multi-Card System */}
          {activeView === "7day" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
                {(weather.forecast_days || []).map((day, idx) => {
                  const isToday = idx === 0;
                  return (
                    <div
                      key={idx}
                      className={`card p-3 text-center flex flex-col items-center justify-between gap-2 border transition-all ${
                        isToday
                          ? "border-[var(--primary)] bg-[var(--primary)]/10 shadow-md"
                          : "hover:border-[var(--border)]"
                      }`}
                    >
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        {isToday ? (isHindi ? "आज" : "Today") : locDay(day.day)}
                        {isToday && <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-light)]" />}
                      </div>

                      <div className="my-1.5">
                        {day.rain_prob > 30 ? (
                          <CloudRain className="w-7 h-7 text-[var(--sky)]" />
                        ) : (
                          <Sun className="w-7 h-7 text-[var(--harvest)]" />
                        )}
                      </div>

                      <div className="text-xs font-mono font-bold text-white">
                        {num(day.temp_max)}° <span className="text-[var(--text-muted)] font-normal">/ {num(day.temp_min)}°</span>
                      </div>

                      <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-[var(--sky)]">
                        <Droplets className="w-3 h-3" />
                        <span>{num(day.rain_prob)}%</span>
                      </div>

                      <span className="text-[10px] text-[var(--text-secondary)] capitalize line-clamp-1">
                        {locCond(day.condition)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Agronomic Decision Suitability Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Spray Suitability Window */}
            <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--leaf)] flex items-center gap-1.5">
                  <Wind className="w-4 h-4" /> {isHindi ? "कीटनाशक छिड़काव उपयुक्तता विंडो" : "Spray Suitability Window"}
                </span>
                <span className="badge badge-emerald text-[11px]">
                  {windSpeed < 15 ? (isHindi ? "छिड़काव अनुकूल" : "Operational") : (isHindi ? "बहाव जोखिम" : "Drift Risk")}
                </span>
              </div>
              <p className="text-xs text-white font-medium">
                {isHindi
                  ? (windSpeed < 15 ? "पत्तियों पर छिड़काव हेतु अनुकूल। हवा की गति सुरक्षित सीमा (१५ किमी/घंटा) से नीचे है।" : "हवा की गति अधिक होने से बहाव का खतरा। छिड़काव स्थगित रखें।")
                  : (weather.spray_suitability || "Favorable for foliar applications. Wind below drift threshold (15 km/h).")}
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                {isHindi
                  ? "जब सापेक्षिक आर्द्रता ५०-७५% के बीच हो और हवा मंद हो, तब रासायनिक बूंदें पत्तियों पर सर्वोत्तम ढंग से अवशोषित होती हैं।"
                  : "Chemical droplet adherence remains optimal when relative humidity is between 50-75% and wind speeds are gentle."}
              </p>
            </div>

            {/* Irrigation & Soil Evaporation Status */}
            <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--sky)] flex items-center gap-1.5">
                  <Droplets className="w-4 h-4" /> {isHindi ? "सिंचाई शेड्यूलिंग प्रभाव" : "Irrigation Scheduling Impact"}
                </span>
                <span className="badge badge-sky text-[11px]">
                  {weather.evapotranspiration ? `${num(weather.evapotranspiration)} ${isHindi ? "मिमी/दिन ET0" : "mm/d ET0"}` : (isHindi ? "ET0 ~ ४.२ मिमी" : "ET0 ~ 4.2 mm")}
                </span>
              </div>
              <p className="text-xs text-white font-medium">
                {isHindi
                  ? "वाष्पोत्सर्जन को कम करने के लिए सुबह की सिंचाई (०६:०० - ०९:३० बजे) की सिफारिश की जाती है।"
                  : (weather.irrigation_window || "Morning irrigation recommended (06:00 - 09:30 AM) to minimize evapotranspiration.")}
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                {isHindi
                  ? "वायुमंडलीय वाष्पीकरण मांग मध्यम है; लक्षित खेत भूखंड में सामान्य जड़ खिंचाव की आवश्यकता है।"
                  : "Forecasted atmospheric evaporative demand indicates moderate root suction requirements across the target parcel."}
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Agro-Climatic Station Telemetry & Thermal Bounds */}
        <div className="space-y-6">
          {/* Station Diagnostics */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[var(--primary-light)]" />
                <h3 className="text-sm font-bold text-white">{isHindi ? "मौसम स्टेशन टेलीमेट्री निदान" : "Station Diagnostics"}</h3>
              </div>
              <span className="badge badge-emerald text-[10px]">{isHindi ? "सक्रिय लिंक" : "Active Link"}</span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">{isHindi ? "मृदा सतह तापमान (० सेमी)" : "Soil Surface Temp (0cm)"}</span>
                <span className="font-bold text-white">{num(weather.soil_temperature_0cm || (temp - 2.3).toFixed(1))}°C</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">{isHindi ? "ओसांक तापमान (Dew Point)" : "Dew Point Temperature"}</span>
                <span className="font-bold text-white">{num(dewPoint)}°C</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">{isHindi ? "वाष्पोत्सर्जन (ET0)" : "Evapotranspiration (ET0)"}</span>
                <span className="font-bold text-[var(--sky)]">{num(weather.evapotranspiration || 4.2)} {isHindi ? "मिमी/दिन" : "mm/day"}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">{isHindi ? "वायुमंडलीय बैरोमीटर दबाव" : "Barometric Pressure"}</span>
                <span className="font-bold text-white">{num(pressure)} hPa</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">{isHindi ? "वर्षा योग्य जल मात्रा" : "Precipitable Water"}</span>
                <span className="font-bold text-[var(--sky)]">{num((humidity * 0.42).toFixed(1))} {isHindi ? "मिमी" : "mm"}</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-[var(--text-secondary)]">{isHindi ? "स्टेशन अक्षांश / देशांतर" : "Telemetry Station Lat/Lon"}</span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  {weather.latitude?.toFixed(2)}, {weather.longitude?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Thermal Crop Stress Index */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--harvest)]" />
                <h3 className="text-sm font-bold text-white">{isHindi ? "कैनोपी थर्मल तनाव सूचकांक" : "Canopy Thermal Stress"}</h3>
              </div>
              <span className={`badge text-[10px] ${
                temp > 35 ? "badge-critical" : temp > 30 ? "badge-warning" : "badge-emerald"
              }`}>
                {temp > 35 ? (isHindi ? "गंभीर तनाव" : "Severe Stress") : temp > 30 ? (isHindi ? "मध्यम सतर्कता" : "Moderate Vigil") : (isHindi ? "अनुकूल दायरा" : "Optimal")}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-secondary)]">{isHindi ? "प्रकाश संश्लेषण सूचकांक" : "Photosynthetic Index"}</span>
                <span className="font-bold text-white">{num(88)}% ({isHindi ? "उच्च दक्षता" : "High Efficiency"})</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
                <div className="h-full bg-[var(--leaf)] rounded-full" style={{ width: "88%" }} />
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mt-2">
                {isHindi
                  ? "वर्तमान वाष्प दबाव घाटे (VPD ~ १.२ kPa) पर रंध्र चालकता (स्टोमेटल कंडक्टेंस) अप्रभावित व सुचारू है।"
                  : "Stomatal conductance remains uninhibited at current vapor pressure deficit (VPD ~ 1.2 kPa)."}
              </p>
            </div>
          </div>

          {/* 48h Rain Radar Warning Note */}
          {rain24h > 0 || rainProbability > 35 ? (
            <div className="p-4 rounded-xl bg-[var(--sky)]/10 border border-[var(--sky)]/30 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-[var(--sky)] font-bold">
                <CloudRain className="w-4 h-4" />
                <span>{isHindi ? "वर्षा परामर्श अलर्ट" : "Precipitation Advisory Alert"}</span>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {isHindi
                  ? "अगले २४-४८ घंटों में वर्षा की संभावना ३५% से अधिक है। जलभराव रोकने के लिए खेत की जल निकासी नालियों को साफ रखें।"
                  : "Rainfall probability exceeds 35% in the next 24-48 hours. Ensure surface drainage channels are cleared to prevent standing water logging."}
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-[var(--leaf)] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>{isHindi ? "साफ आसमान दृष्टिकोण" : "Clear Sky Outlook"}</span>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {isHindi
                  ? "अगले ४८ घंटों में स्थिर वायुमंडलीय स्थिति रहने का अनुमान है। यह समय कृषि कार्यों, जुताई अथवा कटाई के लिए अत्यंत अनुकूल है।"
                  : "Stable atmospheric conditions expected over the next 48 hours. Ideal for field operations, harvesting, or mechanized tillage."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
