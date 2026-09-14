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
  Clock,
  HelpCircle,
  X
} from "lucide-react";

export default function AlertCenter({ farm, weather, smartIrrigation, t }) {
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlertForDetails, setSelectedAlertForDetails] = useState(null);
  const [resolvedIds, setResolvedIds] = useState([]);

  const alerts = [
    {
      id: "alt-1",
      category: "Water",
      title: "Optimized Irrigation Deferral Advised",
      severity: "Moderate",
      location: `${farm?.farm_name || "Plot A"} — Sub-district Sector 3`,
      timestamp: "Today, 08:30 AM",
      description: "Root zone volumetric water content is currently 68%, combined with 14.5mm forecast precipitation over the next 48 hours. Excessive irrigation now will cause root hypoxia and nitrogen leaching.",
      recommendedAction: "Defer scheduled 36-hour drip cycle. Re-evaluate probe metrics after convective rain window passes.",
      details: {
        sensorReading: "Volumetric Water Content: 68% (Target: 55-70%)",
        forecastSource: "IMD / Open-Meteo High Resolution NWP Model",
        estimatedWaterSaved: "320 Cubic Meters (₹850 pumping diesel savings)",
        mitigationSteps: [
          "Ensure secondary drain sluices are free of debris.",
          "Pause automated timer for Zone 2 drip solenoid valves.",
          "Log soil tensiometer readings at 18:00 hrs."
        ]
      }
    },
    {
      id: "alt-2",
      category: "Weather",
      title: "Gusty Winds & Convective Cloud Pre-Alert",
      severity: "Moderate",
      location: `${farm?.location_name || "Regional Block"}`,
      timestamp: "Today, 06:15 AM",
      description: "Forecast indicates localized convective cloud buildup with wind gusts up to 28 km/h between 02:00 PM and 05:00 PM. High droplet drift makes chemical spraying ineffective.",
      recommendedAction: "Complete micronutrient or pesticide foliar spray before 11:30 AM or postpone to tomorrow morning.",
      details: {
        windThreshold: "Spray safety cutoff: 15 km/h (Forecast: 28 km/h gusts)",
        sprayEfficiencyImpact: "-45% chemical adherence if sprayed during gust window",
        alternateWindow: "Tomorrow 06:00 AM - 09:30 AM (Wind < 8 km/h)",
        mitigationSteps: [
          "Secure greenhouse netting and nursery shade tunnels.",
          "Check tractor spray nozzle pressure if early morning application is attempted."
        ]
      }
    },
    {
      id: "alt-3",
      category: "Disease",
      title: "Favorable Microclimate Corridor for Yellow Rust Surveillance",
      severity: "Low",
      location: `${farm?.farm_name || "Main Holding"} — Northern Furrow`,
      timestamp: "Yesterday, 05:45 PM",
      description: "Relative humidity sustained above 65% for 14 hours with night temperatures around 16°C creates initial incubation conditions for Puccinia striiformis (Yellow Rust) in susceptible cereal cultivars.",
      recommendedAction: "Conduct random transect walk across north-facing field boundary; inspect lower canopy for yellow spore pustules.",
      details: {
        susceptibleVarieties: "PBW-343, HD-2967 (if uncertified seed stock was sown)",
        prophylacticMeasure: "Propiconazole 25% EC (1ml / Liter water) only if active lesions are observed.",
        expertHelpline: "KVK Regional Agronomy Support: 1800-180-1551",
        mitigationSteps: [
          "Inspect 20 random flag leaves across 5 field sample quadrants.",
          "Photograph suspicious leaf symptoms for Krishi Assistant AI diagnosis."
        ]
      }
    },
    {
      id: "alt-4",
      category: "Crop",
      title: "Optimal Sowing Window Thermal Alignment",
      severity: "Low",
      location: "Farm Planning Unit",
      timestamp: "2 days ago",
      description: "Topsoil temperatures (0-10cm) have reached the ideal 20°C - 24°C bracket for high-yielding Rabi Wheat and Mustard companion cultivation.",
      recommendedAction: "Finalize land preparation, basal dose NPK application (120:60:40), and certified seed procurement before mid-month.",
      details: {
        optimumSowingWindow: "October 25 - November 15",
        expectedYieldBonus: "+12% yield retention compared to late December sowing",
        seedTreatment: "Carbendazim + Thiram (2:1) @ 2.5g/kg seed",
        mitigationSteps: [
          "Calibrate seed drill depth to 4-5 cm.",
          "Ensure certified seed tag verification."
        ]
      }
    },
    {
      id: "alt-5",
      category: "Emergency",
      title: "Rural High Voltage Feeder Maintenance Interruption",
      severity: "Emergency",
      location: "Rural Feeder Substation #4",
      timestamp: "Today, 07:00 AM",
      description: "Rural electricity transmission grid maintenance will interrupt power on Feeder #4 between 11:00 AM and 03:00 PM. Electric borewell pumps will be non-operational.",
      recommendedAction: "Rely on solar DC drip pumping system for nursery beds or pre-fill farm storage ponds prior to 10:30 AM.",
      details: {
        feederAgency: "State Rural Power Distribution Division",
        solarBackupStatus: "5.2 kWh Solar Array active and online",
        affectedEquipment: "Primary 7.5 HP Submersible Borewell",
        mitigationSteps: [
          "Fill elevated storage cisterns before 10:30 AM.",
          "Ensure solar inverter battery bank is on auto-transfer mode."
        ]
      }
    }
  ];

  const handleToggleResolve = (id) => {
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
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSeverityBadge = (sev) => {
    switch (sev.toLowerCase()) {
      case "emergency":
      case "critical":
        return "badge-critical";
      case "high":
        return "badge-warning";
      case "moderate":
        return "badge-warning";
      default:
        return "badge-emerald";
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat.toLowerCase()) {
      case "water":
        return <Droplets className="w-4 h-4 text-[var(--sky)]" />;
      case "weather":
        return <CloudLightning className="w-4 h-4 text-[var(--warning)]" />;
      case "disease":
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case "crop":
        return <Sprout className="w-4 h-4 text-[var(--leaf)]" />;
      case "emergency":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-[var(--leaf)]" />;
    }
  };

  const activeCount = alerts.length - resolvedIds.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-5 sm:p-6 border-l-4 border-l-[var(--warning)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--warning)]/15 text-[var(--warning)] border border-[var(--warning)]/30">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                {t?.alerts?.title || "Agronomic Alert & Advisory Center"}
                <span className="badge badge-warning text-xs">
                  {activeCount} Active Advisories
                </span>
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Automated multi-hazard surveillance for weather, irrigation, plant pathology, and energy grid stability
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (resolvedIds.length === alerts.length) {
                setResolvedIds([]);
              } else {
                setResolvedIds(alerts.map((a) => a.id));
              }
            }}
            className="btn btn-secondary text-xs"
          >
            {resolvedIds.length === alerts.length ? "Reset All" : "Acknowledge All"}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[var(--text-muted)] font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[var(--leaf)]" /> Category:
          </span>
          {["all", "Weather", "Water", "Crop", "Disease", "Emergency"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat.toLowerCase())}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterCategory === cat.toLowerCase()
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-white bg-[var(--surface)] border border-[var(--border-subtle)]"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Severity Selector & Search */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search advisories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs text-white focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-[var(--surface)] border border-[var(--border)] text-xs text-white rounded-lg px-2.5 py-1 focus:outline-none focus:border-[var(--primary)]"
          >
            <option value="all">All Severities</option>
            <option value="emergency">Emergency / Critical</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="card p-12 text-center text-xs text-[var(--text-muted)]">
            No active alerts found matching current filters.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isResolved = resolvedIds.includes(alert.id);
            return (
              <div
                key={alert.id}
                className={`card p-5 transition-all border ${
                  isResolved
                    ? "opacity-60 border-[var(--border-subtle)] bg-[var(--surface-2)]/50"
                    : alert.severity.toLowerCase() === "emergency"
                    ? "border-red-900/50 bg-red-950/10 shadow-md"
                    : alert.severity.toLowerCase() === "moderate"
                    ? "border-[var(--warning)]/30 bg-[var(--surface)]"
                    : "border-[var(--border)] bg-[var(--surface)]"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="p-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border-subtle)]">
                        {getCategoryIcon(alert.category)}
                      </span>
                      <span className={`badge text-xs ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity} Risk
                      </span>
                      <span className="badge badge-secondary text-xs">
                        {alert.category}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {alert.timestamp}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[var(--leaf)]" /> {alert.location}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-white">
                      {alert.title}
                    </h2>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {alert.description}
                    </p>

                    {/* Recommended Action Pill */}
                    <div className="p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs space-y-1">
                      <span className="text-[11px] font-bold text-[var(--leaf)] uppercase tracking-wider">
                        Recommended Action:
                      </span>
                      <p className="text-white font-medium">
                        {alert.recommendedAction}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 flex-shrink-0 pt-1">
                    <button
                      onClick={() => setSelectedAlertForDetails(alert)}
                      className="btn btn-secondary text-xs flex items-center gap-1.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-[var(--sky)]" />
                      <span>View Details</span>
                    </button>

                    <button
                      onClick={() => handleToggleResolve(alert.id)}
                      className={`btn text-xs flex items-center gap-1.5 ${
                        isResolved
                          ? "bg-[var(--surface-2)] text-[var(--text-secondary)] border border-[var(--border)]"
                          : "btn-primary"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isResolved ? "Resolved" : "Acknowledge"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* View Details Modal (Section 16 Prompt requirement) */}
      {selectedAlertForDetails && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card max-w-xl w-full p-6 space-y-5 border border-[var(--border)] bg-[var(--surface)] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[var(--surface-2)]">
                  {getCategoryIcon(selectedAlertForDetails.category)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedAlertForDetails.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono mt-0.5">
                    <span>{selectedAlertForDetails.location}</span>
                    <span>•</span>
                    <span>{selectedAlertForDetails.timestamp}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedAlertForDetails(null)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-2)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-[var(--text-muted)] font-semibold uppercase tracking-wider text-[10px]">
                  Description & Sensor Context
                </span>
                <p className="text-[var(--text-secondary)] leading-relaxed bg-[var(--surface-2)] p-3 rounded-xl border border-[var(--border-subtle)]">
                  {selectedAlertForDetails.description}
                </p>
              </div>

              {selectedAlertForDetails.details && (
                <div className="space-y-2">
                  <span className="text-[var(--text-muted)] font-semibold uppercase tracking-wider text-[10px]">
                    Technical Telemetry Data
                  </span>
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] space-y-1.5 font-mono">
                    {Object.entries(selectedAlertForDetails.details)
                      .filter(([key]) => key !== "mitigationSteps")
                      .map(([key, val], i) => (
                        <div key={i} className="flex justify-between text-[11px]">
                          <span className="text-[var(--text-muted)] capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                          <span className="text-white font-semibold text-right">{val}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {selectedAlertForDetails.details?.mitigationSteps && (
                <div className="space-y-2">
                  <span className="text-[var(--leaf)] font-bold uppercase tracking-wider text-[10px]">
                    Recommended Agronomic Mitigation Steps:
                  </span>
                  <ul className="list-disc list-inside space-y-1.5 text-[var(--text-secondary)] bg-[var(--primary)]/10 p-3 rounded-xl border border-[var(--primary)]/30">
                    {selectedAlertForDetails.details.mitigationSteps.map((step, sIdx) => (
                      <li key={sIdx} className="text-white font-medium">{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
              <button
                onClick={() => setSelectedAlertForDetails(null)}
                className="btn btn-secondary text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleToggleResolve(selectedAlertForDetails.id);
                  setSelectedAlertForDetails(null);
                }}
                className="btn btn-primary text-xs"
              >
                Acknowledge Advisory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
