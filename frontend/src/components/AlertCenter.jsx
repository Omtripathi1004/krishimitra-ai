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
import { toHindiDigits } from "../translations";

export default function AlertCenter({ farm, weather, smartIrrigation, t, language, isHindi: propIsHindi }) {
  const isHindi = propIsHindi || language === "hi" || Boolean(t?.liveTelemetry?.includes("सजीव"));
  const num = (v) => (isHindi ? toHindiDigits(v) : String(v));

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlertForDetails, setSelectedAlertForDetails] = useState(null);
  const [resolvedIds, setResolvedIds] = useState([]);

  const alerts = isHindi
    ? [
        {
          id: "alt-1",
          category: "Water",
          categoryLabel: "सिंचाई",
          title: "सिंचाई चक्र स्थगित करने की सलाह",
          severity: "Moderate",
          severityLabel: "मध्यम जोखिम",
          location: `${farm?.farm_name || "खेत सं. १"} — सेक्टर ३`,
          timestamp: "आज, सुबह ०८:३०",
          description: "जड़-क्षेत्र में मृदा नमी अभी ६८% है और आगामी ४८ घंटों में १४.५ मिमी वर्षा का पूर्वानुमान है। इस समय सिंचाई करने से जड़ों में ऑक्सीजन की कमी और नाइट्रोजन का रिसाव होगा।",
          recommendedAction: "अगले २४-३६ घंटों के लिए निर्धारित ड्रिप सिंचाई रोकें। वर्षा के बाद ही नमी की पुनः जांच करें।",
          details: {
            "मृदा नमी (VWC)": "६८% (लक्ष्य सीमा: ५५-७५%)",
            "मौसम पूर्वानुमान": "IMD / Open-Meteo उच्च रेज़ोल्यूशन NWP मॉडल",
            "संभावित जल बचत": "३२० घनमीटर (₹८५० डीजल/बिजली बचत)",
            mitigationSteps: [
              "खेत की जल निकास नालियों से कचरा साफ करें।",
              "ड्रिप स्वचालित टाइमर को अस्थायी रूप से रोकें।",
              "शाम १८:०० बजे मिट्टी की नमी का पुनः अवलोकन करें।"
            ]
          }
        },
        {
          id: "alt-2",
          category: "Weather",
          categoryLabel: "मौसम",
          title: "तेज हवाएं एवं बादलों का पूर्व-अलर्ट",
          severity: "Moderate",
          severityLabel: "मध्यम जोखिम",
          location: `${farm?.location_name || "क्षेत्रीय ब्लॉक"}`,
          timestamp: "आज, सुबह ०६:१५",
          description: "दोपहर ०२:०० से ०५:०० के बीच २८ किमी/घंटा तक तेज हवा के झोंकों का अनुमान है। तेज हवा में कीटनाशक या पोषक छिड़काव व्यर्थ चला जाता है।",
          recommendedAction: "पर्ण छिड़काव सुबह ११:३० बजे से पहले पूरा कर लें या कल सुबह तक टाल दें।",
          details: {
            "सुरक्षित हवा सीमा": "अधिकतम १५ किमी/घंटा (पूर्वानुमान: २८ किमी/घंटा)",
            "छिड़काव दक्षता प्रभाव": "तेज हवा में -४५% रसायन बर्बाद होता है",
            "वैकल्पिक छिड़काव समय": "कल सुबह ०६:०० - ०९:३० (हवा < ८ किमी/घंटा)",
            mitigationSteps: [
              "पॉलीहाउस व नर्सरी की जाली को सुरक्षित बांधें।",
              "यदि सुबह छिड़काव करें तो नोजल का दबाव सही रखें।"
            ]
          }
        },
        {
          id: "alt-3",
          category: "Disease",
          categoryLabel: "रोग",
          title: "पीला रतुआ रोग के प्रति सतर्कता सलाह",
          severity: "Low",
          severityLabel: "सामान्य जोखिम",
          location: `${farm?.farm_name || "मुख्य खेत"} — उत्तरी सीमा`,
          timestamp: "कल, शाम ०५:४५",
          description: "हवा में आर्द्रता १४ घंटे तक ६५% से अधिक रहने और रात का तापमान १६°C होने से रतुआ फफूंद के अनुकूल सूक्ष्म-मौसम बन सकता है।",
          recommendedAction: "खेत की उत्तरी मेड़ पर निचली पत्तियों की जांच करें कि कहीं पीले रंग के धब्बे तो नहीं हैं।",
          details: {
            "संवेदनशील किस्में": "PBW-343, HD-2967 (यदि अप्रमाणित बीज बोया गया हो)",
            "निवारक दवा": "लक्षण दिखने पर प्रोपिकोनाज़ोल २५% ईसी (१ मिली/लीटर पानी)",
            "कृषि हेल्पलाइन": "KVK क्षेत्रीय सहायता नंबर: 1800-180-1551",
            mitigationSteps: [
              "खेत के ५ अलग-अलग कोनों में २० पत्तियों की जांच करें।",
              "संदेह होने पर पत्ती की फोटो कृषि सहायक AI को भेजें।"
            ]
          }
        },
        {
          id: "alt-4",
          category: "Crop",
          categoryLabel: "फसल",
          title: "रबी बुवाई के लिए आदर्श तापमान समय",
          severity: "Low",
          severityLabel: "सामान्य जोखिम",
          location: "खेत नियोजन इकाई",
          timestamp: "२ दिन पहले",
          description: "मिट्टी का तापमान (०-१० सेमी) २०°C - २४°C के आदर्श स्तर पर पहुंच गया है, जो गेहूं और सरसों की बुवाई के लिए सबसे उपयुक्त है।",
          recommendedAction: "खेत की तैयारी, NPK की आधार खुराक (१२०:६०:४०) और प्रमाणित बीज की व्यवस्था समय पर करें।",
          details: {
            "सर्वोत्तम बुवाई अवधि": "२५ अक्टूबर से १५ नवंबर",
            "उपज लाभ": "देर से बुवाई की तुलना में +१२% अधिक पैदावार",
            "बीज उपचार": "कार्बेन्डाजिम + थीरम (२:१) @ २.५ ग्राम/किग्रा बीज",
            mitigationSteps: [
              "सीड ड्रिल की गहराई ४-५ सेमी पर सेट करें।",
              "केवल प्रमाणित बीज टैग की जांच करके ही बुवाई करें।"
            ]
          }
        },
        {
          id: "alt-5",
          category: "Emergency",
          categoryLabel: "आपातकालीन",
          title: "ग्रामीण विद्युत फीडर में निर्धारित मेंटेनेंस शटडाउन",
          severity: "Emergency",
          severityLabel: "आपातकालीन",
          location: "ग्रामीण विद्युत सब-स्टेशन सं. ४",
          timestamp: "आज, सुबह ०७:००",
          description: "ट्रांसमिशन लाइन के रखरखाव हेतु फीडर सं. ४ पर सुबह ११:०० से दोपहर ०३:०० बजे तक बिजली आपूर्ति बंद रहेगी। ट्यूबवेल पंप बंद रहेंगे।",
          recommendedAction: "नर्सरी के लिए सोलर डीसी ड्रिप पंप का उपयोग करें या सुबह १०:३० बजे से पहले पानी का भंडारण कर लें।",
          details: {
            "विद्युत एजेंसी": "राज्य ग्रामीण विद्युत वितरण निगम",
            "सोलर बैकअप स्थिति": "५.२ किलोवाट सोलर सिस्टम सक्रिय और चालू",
            "प्रभावित उपकरण": "मुख्य ७.५ एचपी सबमर्सिबल ट्यूबवेल",
            mitigationSteps: [
              "सुबह १०:३० बजे से पहले पानी की टंकियां भर लें।",
              "सुनिश्चित करें कि सोलर इन्वर्टर ऑटो-मोड पर सेट है।"
            ]
          }
        }
      ]
    : [
        {
          id: "alt-1",
          category: "Water",
          categoryLabel: "Water",
          title: "Optimized Irrigation Deferral Advised",
          severity: "Moderate",
          severityLabel: "Moderate Risk",
          location: `${farm?.farm_name || "Plot A"} — Sub-district Sector 3`,
          timestamp: "Today, 08:30 AM",
          description: "Root zone volumetric water content is currently 68%, combined with 14.5mm forecast precipitation over the next 48 hours. Excessive irrigation now will cause root hypoxia and nitrogen leaching.",
          recommendedAction: "Defer scheduled 36-hour drip cycle. Re-evaluate probe metrics after convective rain window passes.",
          details: {
            "Soil Moisture (VWC)": "68% (Target: 55-70%)",
            "Forecast Source": "IMD / Open-Meteo High Resolution NWP Model",
            "Estimated Water Saved": "320 Cubic Meters (₹850 pumping diesel savings)",
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
          categoryLabel: "Weather",
          title: "Gusty Winds & Convective Cloud Pre-Alert",
          severity: "Moderate",
          severityLabel: "Moderate Risk",
          location: `${farm?.location_name || "Regional Block"}`,
          timestamp: "Today, 06:15 AM",
          description: "Forecast indicates localized convective cloud buildup with wind gusts up to 28 km/h between 02:00 PM and 05:00 PM. High droplet drift makes chemical spraying ineffective.",
          recommendedAction: "Complete micronutrient or pesticide foliar spray before 11:30 AM or postpone to tomorrow morning.",
          details: {
            "Wind Cutoff": "15 km/h safe limit (Forecast: 28 km/h gusts)",
            "Spray Efficiency Loss": "-45% chemical adherence if sprayed during gusts",
            "Alternate Window": "Tomorrow 06:00 AM - 09:30 AM (Wind < 8 km/h)",
            mitigationSteps: [
              "Secure greenhouse netting and nursery shade tunnels.",
              "Check tractor spray nozzle pressure if early morning application is attempted."
            ]
          }
        },
        {
          id: "alt-3",
          category: "Disease",
          categoryLabel: "Disease",
          title: "Favorable Microclimate Corridor for Yellow Rust Surveillance",
          severity: "Low",
          severityLabel: "Low Risk",
          location: `${farm?.farm_name || "Main Holding"} — Northern Furrow`,
          timestamp: "Yesterday, 05:45 PM",
          description: "Relative humidity sustained above 65% for 14 hours with night temperatures around 16°C creates initial incubation conditions for Puccinia striiformis (Yellow Rust) in susceptible cereal cultivars.",
          recommendedAction: "Conduct random transect walk across north-facing field boundary; inspect lower canopy for yellow spore pustules.",
          details: {
            "Susceptible Varieties": "PBW-343, HD-2967 (if uncertified seed stock was sown)",
            "Prophylactic Measure": "Propiconazole 25% EC (1ml / Liter water) only if active lesions are observed.",
            "Expert Helpline": "KVK Regional Agronomy Support: 1800-180-1551",
            mitigationSteps: [
              "Inspect 20 random flag leaves across 5 field sample quadrants.",
              "Photograph suspicious leaf symptoms for Krishi Assistant AI diagnosis."
            ]
          }
        },
        {
          id: "alt-4",
          category: "Crop",
          categoryLabel: "Crop",
          title: "Optimal Sowing Window Thermal Alignment",
          severity: "Low",
          severityLabel: "Low Risk",
          location: "Farm Planning Unit",
          timestamp: "2 days ago",
          description: "Topsoil temperatures (0-10cm) have reached the ideal 20°C - 24°C bracket for high-yielding Rabi Wheat and Mustard companion cultivation.",
          recommendedAction: "Finalize land preparation, basal dose NPK application (120:60:40), and certified seed procurement before mid-month.",
          details: {
            "Optimum Window": "October 25 - November 15",
            "Yield Bonus": "+12% yield retention compared to late December sowing",
            "Seed Treatment": "Carbendazim + Thiram (2:1) @ 2.5g/kg seed",
            mitigationSteps: [
              "Calibrate seed drill depth to 4-5 cm.",
              "Ensure certified seed tag verification."
            ]
          }
        },
        {
          id: "alt-5",
          category: "Emergency",
          categoryLabel: "Emergency",
          title: "Rural High Voltage Feeder Maintenance Interruption",
          severity: "Emergency",
          severityLabel: "Emergency",
          location: "Rural Feeder Substation #4",
          timestamp: "Today, 07:00 AM",
          description: "Rural electricity transmission grid maintenance will interrupt power on Feeder #4 between 11:00 AM and 03:00 PM. Electric borewell pumps will be non-operational.",
          recommendedAction: "Rely on solar DC drip pumping system for nursery beds or pre-fill farm storage ponds prior to 10:30 AM.",
          details: {
            "Feeder Agency": "State Rural Power Distribution Division",
            "Solar Backup Status": "5.2 kWh Solar Array active and online",
            "Affected Equipment": "Primary 7.5 HP Submersible Borewell",
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

  const categoryFilterList = [
    { id: "all", label: isHindi ? "सभी" : "All" },
    { id: "weather", label: isHindi ? "मौसम" : "Weather" },
    { id: "water", label: isHindi ? "सिंचाई" : "Water" },
    { id: "crop", label: isHindi ? "फसल" : "Crop" },
    { id: "disease", label: isHindi ? "रोग" : "Disease" },
    { id: "emergency", label: isHindi ? "आपातकालीन" : "Emergency" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card card-gold p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-[var(--c-gold-neon)] border border-amber-400/30">
              <Bell className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 font-display flex-wrap">
                {isHindi ? "कृषि चेतावनी एवं सलाह केंद्र" : (t?.alerts?.title || "Agronomic Alert & Advisory Center")}
                <span className="badge badge-gold text-xs font-tech">
                  {num(activeCount)} {isHindi ? "सक्रिय चेतावनियां" : "Active Advisories"}
                </span>
              </h1>
              <p className="text-xs text-amber-200/80 mt-0.5 font-sans">
                {isHindi
                  ? "मौसम, सिंचाई, पादप रोग और बिजली आपूर्ति स्थिरता के लिए स्वचालित निगरानी"
                  : "Automated multi-hazard surveillance for weather, irrigation, plant pathology, and energy grid stability"}
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
            className="btn btn-secondary text-xs font-tech"
          >
            {resolvedIds.length === alerts.length
              ? (isHindi ? "सभी रीसेट करें" : "Reset All")
              : (isHindi ? "सभी को स्वीकार करें" : "Acknowledge All")}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-tech">
          <span className="text-[var(--text-muted)] font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[var(--c-leaf-neon)]" /> {isHindi ? "श्रेणी:" : "Category:"}
          </span>
          {categoryFilterList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterCategory === cat.id
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-white bg-[var(--surface)] border border-[var(--border-subtle)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Severity Selector & Search */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder={isHindi ? "सलाह खोजें..." : "Search advisories..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs text-white focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-[var(--surface)] border border-[var(--border)] text-xs text-white rounded-lg px-2.5 py-1 focus:outline-none focus:border-[var(--primary)] font-tech"
          >
            <option value="all">{isHindi ? "सभी गंभीरता स्तर" : "All Severities"}</option>
            <option value="emergency">{isHindi ? "आपातकालीन / गंभीर" : "Emergency / Critical"}</option>
            <option value="moderate">{isHindi ? "मध्यम" : "Moderate"}</option>
            <option value="low">{isHindi ? "सामान्य / कम" : "Low"}</option>
          </select>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="card p-12 text-center text-xs text-[var(--text-muted)]">
            {isHindi ? "वर्तमान फ़िल्टर के अनुसार कोई सक्रिय चेतावनी नहीं मिली।" : "No active alerts found matching current filters."}
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isResolved = resolvedIds.includes(alert.id);
            const cardTheme =
              alert.severity.toLowerCase() === "emergency" || alert.category.toLowerCase() === "disease"
                ? "card-pink"
                : alert.category.toLowerCase() === "water"
                ? "card-sky"
                : alert.category.toLowerCase() === "weather"
                ? "card-indigo"
                : alert.severity.toLowerCase() === "moderate"
                ? "card-gold"
                : "card-leaf";

            return (
              <div
                key={alert.id}
                className={`card ${cardTheme} p-5 transition-all ${
                  isResolved ? "opacity-50" : ""
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="p-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border-subtle)]">
                        {getCategoryIcon(alert.category)}
                      </span>
                      <span className={`badge text-xs font-tech ${getSeverityBadge(alert.severity)}`}>
                        {alert.severityLabel || `${alert.severity} Risk`}
                      </span>
                      <span className="badge badge-secondary text-xs font-tech">
                        {alert.categoryLabel || alert.category}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {alert.timestamp}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[var(--c-leaf-neon)]" /> {alert.location}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-white font-display">
                      {alert.title}
                    </h2>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                      {alert.description}
                    </p>

                    {/* Recommended Action Pill */}
                    <div className="p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs space-y-1">
                      <span className="text-[11px] font-bold text-[var(--c-gold-neon)] uppercase tracking-wider font-tech">
                        {isHindi ? "अनुशंसित कार्रवाई:" : "Recommended Action:"}
                      </span>
                      <p className="text-white font-medium">
                        {alert.recommendedAction}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 flex-shrink-0 pt-1">
                    <button
                      onClick={() => setSelectedAlertForDetails(alert)}
                      className="btn btn-secondary text-xs flex items-center gap-1.5 font-tech"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-[var(--c-sky-neon)]" />
                      <span>{isHindi ? "विवरण देखें" : "View Details"}</span>
                    </button>

                    <button
                      onClick={() => handleToggleResolve(alert.id)}
                      className={`btn text-xs flex items-center gap-1.5 font-tech ${
                        isResolved
                          ? "bg-[var(--surface-2)] text-[var(--text-secondary)] border border-[var(--border)]"
                          : "btn-primary"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {isResolved
                          ? (isHindi ? "स्वीकृत" : "Resolved")
                          : (isHindi ? "स्वीकार करें" : "Acknowledge")}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* View Details Modal */}
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
                  {isHindi ? "विवरण एवं सेंसर संदर्भ" : "Description & Sensor Context"}
                </span>
                <p className="text-[var(--text-secondary)] leading-relaxed bg-[var(--surface-2)] p-3 rounded-xl border border-[var(--border-subtle)]">
                  {selectedAlertForDetails.description}
                </p>
              </div>

              {selectedAlertForDetails.details && (
                <div className="space-y-2">
                  <span className="text-[var(--text-muted)] font-semibold uppercase tracking-wider text-[10px]">
                    {isHindi ? "तकनीकी टेलीमेट्री डेटा" : "Technical Telemetry Data"}
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
                    {isHindi ? "अनुशंसित कृषि निवारण कदम:" : "Recommended Agronomic Mitigation Steps:"}
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
                {isHindi ? "बंद करें" : "Close"}
              </button>
              <button
                onClick={() => {
                  handleToggleResolve(selectedAlertForDetails.id);
                  setSelectedAlertForDetails(null);
                }}
                className="btn btn-primary text-xs"
              >
                {isHindi ? "सलाह स्वीकार करें" : "Acknowledge Advisory"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
