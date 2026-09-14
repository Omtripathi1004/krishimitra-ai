import React from "react";
import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  Sun,
  ShieldCheck,
  CalendarDays,
  Info
} from "lucide-react";

export default function WeatherIntelligence({ weather, t }) {
  if (!weather) {
    return (
      <div className="glass-card p-12 text-center text-xs text-[var(--text-muted)]">
        Fetching live weather forecast...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-[var(--border-cyan)]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-[rgba(89,199,177,0.15)] flex items-center justify-center text-[var(--color-rain-glow)] border border-[var(--border-cyan)]">
              <CloudSun className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-[var(--text-primary)]">
              {t.weather.title}
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{t.weather.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`neon-badge ${weather.is_fallback ? "neon-badge-saffron" : "neon-badge-cyan"}`}>
            <span className="neon-dot neon-dot-cyan" />
            {weather.is_fallback ? t.weather.fallbackTag : t.weather.liveApiTag}
          </span>
          <span className="text-xs text-[var(--text-dim)] font-mono">Updated: {weather.updated_at}</span>
        </div>
      </div>

      {/* Main Meteorological Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Live Station */}
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
            <div>
              <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[var(--color-rain-glow)]">
                TELEMETRY STATION
              </span>
              <h3 className="text-lg font-heading font-bold text-[var(--text-primary)] mt-0.5">{weather.location}</h3>
            </div>
            <div className="h-11 w-11 rounded-xl bg-[rgba(89,199,177,0.15)] text-[var(--color-rain-glow)] flex items-center justify-center border border-[var(--border-cyan)]">
              <Sun className="h-6 w-6 text-[var(--color-harvest)]" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <div className="telemetry-val text-5xl font-mono text-[var(--text-primary)]">
                {weather.temperature}°C
              </div>
              <div className="text-xs font-semibold text-[var(--text-secondary)] capitalize mt-1">
                {weather.condition}
              </div>
            </div>
            <div className="text-right text-xs font-mono text-[var(--text-dim)]">
              <div>Lat: {weather.latitude?.toFixed(2)}</div>
              <div>Lon: {weather.longitude?.toFixed(2)}</div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[#183A2D]/80 p-3">
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <Droplets className="h-3.5 w-3.5 text-[var(--color-rain-glow)]" />
                <span>{t.weather.humidity}</span>
              </div>
              <div className="text-base font-bold text-[var(--text-primary)] mt-1">{weather.humidity}%</div>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[#183A2D]/80 p-3">
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <Wind className="h-3.5 w-3.5 text-[#6EE7B7]" />
                <span>{t.weather.windSpeed}</span>
              </div>
              <div className="text-base font-bold text-[var(--text-primary)] mt-1">{weather.wind_speed} km/h</div>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[#183A2D]/80 p-3">
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <CloudRain className="h-3.5 w-3.5 text-[var(--color-sky)]" />
                <span>{t.weather.rainfall24h}</span>
              </div>
              <div className="text-base font-bold text-[var(--color-rain-glow)] mt-1">{weather.rainfall_forecast_24h} mm</div>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[#183A2D]/80 p-3">
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <CloudRain className="h-3.5 w-3.5 text-[#C4B5FD]" />
                <span>{t.weather.rainfall7d}</span>
              </div>
              <div className="text-base font-bold text-[#C4B5FD] mt-1">{weather.rainfall_forecast_7d} mm</div>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Agronomic Meaning & Decision Implications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Spray suitability card */}
            <div className="glass-card p-5 border-[var(--border-cyan)]">
              <div className="flex items-center gap-2 text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--color-rain-glow)]">
                <Wind className="h-4 w-4" />
                {t.weather.spraySuitability}
              </div>
              <div className="mt-2 text-sm font-heading font-semibold text-[var(--text-primary)]">
                {weather.spray_suitability}
              </div>
              <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                Evaluated against chemical droplet drift thresholds and wash-off risks.
              </p>
            </div>

            {/* Crop condition card */}
            <div className="glass-card p-5 border-[var(--border-saffron)]">
              <div className="flex items-center gap-2 text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--color-harvest)]">
                <ShieldCheck className="h-4 w-4" />
                {t.weather.cropStress}
              </div>
              <div className="mt-2 text-sm font-heading font-semibold text-[var(--text-primary)]">
                {weather.crop_condition}
              </div>
              <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                Physiological development rate under current thermal bounds.
              </p>
            </div>
          </div>

          {/* 7-Day Forecast Cards */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-2 text-sm font-heading font-bold text-[var(--text-primary)]">
                <CalendarDays className="h-4 w-4 text-[var(--color-rain-glow)]" />
                <span>{t.weather.forecast7Days}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[var(--text-dim)] font-mono">
                <Info className="h-3 w-3" />
                <span>Probabilistic models</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {weather.forecast_days?.map((day, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-3 text-center transition-all ${
                    idx === 0
                      ? "border-[var(--border-saffron)] bg-[rgba(226,168,59,0.12)] shadow-md"
                      : "border-[var(--border-subtle)] bg-[#183A2D]/60 hover:bg-[#183A2D]"
                  }`}
                >
                  <div className="text-xs font-heading font-bold text-[var(--text-primary)]">{day.day}</div>
                  <div className="my-2 flex justify-center">
                    {day.rain_prob > 30 ? (
                      <CloudRain className="h-6 w-6 text-[var(--color-sky)]" />
                    ) : (
                      <Sun className="h-6 w-6 text-[var(--color-harvest)]" />
                    )}
                  </div>
                  <div className="text-xs font-mono font-bold text-[var(--text-primary)]">
                    {day.temp_max}° / {day.temp_min}°
                  </div>
                  <div className="mt-1.5 flex items-center justify-center gap-1 text-[10px] text-[var(--color-rain-glow)] font-mono font-medium">
                    <Droplets className="h-2.5 w-2.5" />
                    <span>{day.rain_prob}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
