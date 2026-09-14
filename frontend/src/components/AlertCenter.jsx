import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  CloudLightning,
  Droplets,
  Sprout,
  ShieldAlert,
  Flame,
  CheckCircle2,
  ExternalLink,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock
} from "lucide-react";

export default function AlertCenter({ farm, weather, smartIrrigation, t }) {
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [expandedAlertId, setExpandedAlertId] = useState(null);
  const [resolvedIds, setResolvedIds] = useState([]);

  const alerts = [
    {
      id: "alt-1",
      category: "Water",
      title: "Optimized Irrigation Deferral Advised",
      severity: "Moderate",
      location: `${farm?.farm_name || "Plot A"} — Varanasi Sub-district`,
      timestamp: "Today, 08:30 AM",
      description: "Root zone volumetric water content is currently 68%, combined with 14.5mm forecast precipitation over the next 48 hours. Excessive irrigation now will cause root hypoxia and nitrogen runoff.",
      recommendedAction: "Defer scheduled 36-hour drip cycle. Re-evaluate probe metrics after convective rain window passes.",
      details: {
        sensorReading: "Volumetric Water Content: 68% (Target: 55-70%)",
        forecastSource: "IMD / Open-Meteo High Resolution NWP Model",
        estimatedWaterSaved: "320 Cubic Meters (₹850 pumping diesel savings)"
      }
    },
    {
      id: "alt-2",
      category: "Weather",
      title: "Gusty Winds & Convective Cloud Pre-Alert",
      severity: "Moderate",
      location: `${farm?.district || "Varanasi"}, ${farm?.state || "Uttar Pradesh"}`,
      timestamp: "Today, 06:15 AM",
      description: "Forecast indicates localized convective cloud buildup with wind gusts up to 28 km/h between 02:00 PM and 05:00 PM. High droplet drift makes spraying ineffective.",
      recommendedAction: "Complete micronutrient or pesticide foliar spray before 11:30 AM or postpone to tomorrow morning.",
      details: {
        windThreshold: "Spray safety cutoff: 15 km/h (Forecast: 28 km/h)",
        sprayEfficiencyImpact: "-45% chemical adherence if sprayed in gust conditions",
        alternateWindow: "Tomorrow 06:00 AM - 09:30 AM (Wind < 8 km/h)"
      }
    },
    {
      id: "alt-3",
      category: "Disease",
      title: "Favorable RH Corridor for Yellow Rust Surveillance",
      severity: "Low",
      location: `${farm?.farm_name || "Main Block"} — Northern Furrow`,
      timestamp: "Yesterday, 05:45 PM",
      description: "Relative humidity sustained above 65% for 14 hours with night temperatures around 16°C creates initial incubation conditions for Puccinia striiformis (Yellow Rust) in susceptible cereal cultivars.",
      recommendedAction: "Conduct random transect walk across north-facing field boundary; check lower leaf canopy for yellow spore pustules.",
      details: {
        susceptibleVarieties: "PBW-343, HD-2967 (if un-certified seed used)",
        prophylacticMeasure: "Propiconazole 25% EC (1ml / Liter water) only if active lesions detected.",
        expertHelpline: "KVK Varanasi Agronomy Line: 0542-2612345"
      }
    },
    {
      id: "alt-4",
      category: "Crop",
      title: "Sowing Window Optimization Reminder",
      severity: "Low",
      location: "Farm Planning Unit",
      timestamp: "2 days ago",
      description: "Soil temperatures have reached the ideal 20°C - 24°C bracket for high-yielding Rabi Wheat and Mustard companion cultivation.",
      recommendedAction: "Finalize land preparation, basal dose NPK application (120:60:40), and certified seed procurement before mid-November.",
      details: {
        optimumSowingWindow: "October 25 - November 15",
        expectedYieldBonus: "+12% yield retention compared to delayed December sowing",
        seedTreatment: "Carbendazim + Thiram (2:1) @ 2.5g/kg seed"
      }
    },
    {
      id: "alt-5",
      category: "Emergency",
      title: "High Voltage Grid Interruption Scheduled",
      severity: "Emergency",
      location: "Varanasi Rural Feeder #4",
      timestamp: "Today, 07:00 AM",
      description: "Rural electricity transmission maintenance will affect feeder #4 from 11:00 AM to 03:00 PM. Electric pumps will not have grid supply.",
      recommendedAction: "Rely on solar DC drip system for nursery beds or charge storage cisterns before 10:30 AM.",
      details: {
        feederAgency: "UPPCL Rural Distribution Division",
        solarBackupStatus: "5.2 kWh Solar Array active and online",
        affectedEquipment: "Primary 7.5 HP Submersible Borewell"
      }
    }
  ];

  const handleResolve = (id) => {
    setResolvedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredAlerts = alerts.filter((item) => {
    if (filterCategory !== "all" && item.category.toLowerCase() !== filterCategory.toLowerCase()) {
      return false;
    }
    if (filterSeverity !== "all" && item.severity.toLowerCase() !== filterSeverity.toLowerCase()) {
      return false;
    }
    return true;
  });

  const getSeverityBadge = (sev) => {
    switch (sev.toLowerCase()) {
      case "emergency":
      case "critical":
        return "bg-red-950/70 text-red-400 border-red-800/80 font-bold";
      case "high":
        return "bg-amber-950/70 text-amber-400 border-amber-800/80 font-bold";
      case "moderate":
        return "bg-yellow-950/60 text-yellow-400 border-yellow-800/70 font-semibold";
      default:
        return "bg-emerald-950/60 text-emerald-400 border-emerald-800/70 font-semibold";
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Center Header */}
      <div className="command-card p-6 border-l-4 border-l-amber-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-400">
              <Bell className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight text-white">Agronomic Alert & Advisory Center</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/80 text-amber-400 border border-amber-800">
                  {alerts.length - resolvedIds.length} Active Alerts
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Real-time actionable telemetry notifications for weather, irrigation, pest vector risks, and power infrastructure.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (resolvedIds.length === alerts.length) {
                  setResolvedIds([]);
                } else {
                  setResolvedIds(alerts.map(a => a.id));
                }
              }}
              className="btn btn-secondary text-xs"
            >
              {resolvedIds.length === alerts.length ? "Reset All" : "Mark All Acknowledged"}
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-400" /> Category:
          </span>
          {["all", "Weather", "Water", "Crop", "Disease", "Emergency"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat.toLowerCase())}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                filterCategory === cat.toLowerCase()
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Severity:</span>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Severities</option>
            <option value="emergency">Emergency / Critical</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="command-card p-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <div className="text-base font-bold text-white">No active alerts matching your filter</div>
            <p className="text-xs text-slate-400 mt-1">All agricultural systems and risk indicators are operating within normal parameters.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isResolved = resolvedIds.includes(alert.id);
            const isExpanded = expandedAlertId === alert.id;

            return (
              <div
                key={alert.id}
                className={`command-card transition-all ${
                  isResolved
                    ? "opacity-60 bg-slate-950/40 border-slate-800/40"
                    : alert.severity === "Emergency"
                    ? "border-red-800/80 bg-slate-900/90"
                    : "hover:border-slate-700"
                }`}
              >
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700 mt-0.5">
                        {alert.category === "Water" && <Droplets className="w-4 h-4 text-sky-400" />}
                        {alert.category === "Weather" && <CloudLightning className="w-4 h-4 text-amber-400" />}
                        {alert.category === "Disease" && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                        {alert.category === "Crop" && <Sprout className="w-4 h-4 text-emerald-400" />}
                        {alert.category === "Emergency" && <Flame className="w-4 h-4 text-red-500" />}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={`text-sm font-bold ${isResolved ? "line-through text-slate-400" : "text-white"}`}>
                            {alert.title}
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border ${getSeverityBadge(alert.severity)}`}>
                            {alert.severity}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                            {alert.category}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 mt-1.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" /> {alert.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> {alert.timestamp}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                          {alert.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          isResolved
                            ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                            : "bg-emerald-900/60 text-emerald-300 border-emerald-700 hover:bg-emerald-800"
                        }`}
                      >
                        {isResolved ? "Re-open" : "Acknowledge"}
                      </button>

                      <button
                        onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                        title={isExpanded ? "Collapse Details" : "View Details"}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Recommended Action Pill */}
                  <div className="mt-4 p-3 rounded-lg bg-slate-900/70 border border-slate-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[11px] uppercase font-bold text-emerald-400 mr-2">
                        Recommended Action:
                      </span>
                      <span className="text-xs text-slate-200">{alert.recommendedAction}</span>
                    </div>
                  </div>

                  {/* Collapsible Details */}
                  {isExpanded && alert.details && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs space-y-2 bg-slate-950/40 p-3 rounded-lg">
                      <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                        Technical Telemetry & Diagnostics
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {Object.entries(alert.details).map(([key, val]) => (
                          <div key={key} className="p-2 rounded bg-slate-900 border border-slate-800">
                            <div className="text-[10px] text-slate-400 capitalize font-medium">
                              {key.replace(/([A-Z])/g, " $1")}
                            </div>
                            <div className="text-xs font-semibold text-slate-200 mt-0.5">{val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
