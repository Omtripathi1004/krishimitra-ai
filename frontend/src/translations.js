/**
 * KrishiMitra AI — Universal Bilingual Agronomic Localization Dictionary
 * Supports comprehensive English and Hindi (हिन्दी) translations with Devanagari numerals
 */

export const HINDI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

/**
 * Converts western Arabic digits (0-9) to Devanagari Hindi digits (०-९)
 */
export function toHindiDigits(strOrNum) {
  if (strOrNum === null || strOrNum === undefined) return "";
  return String(strOrNum).replace(/[0-9]/g, (d) => HINDI_DIGITS[d]);
}

/**
 * Localizes a number/metric string based on active language
 */
export function formatLocalizedVal(val, lang = "en") {
  if (val === null || val === undefined) return "";
  if (lang === "hi") {
    return toHindiDigits(val);
  }
  return String(val);
}

/**
 * Agronomic crop name translations
 */
export const CROP_TRANSLATIONS = {
  en: {
    "Wheat": "Wheat",
    "Rice (Paddy)": "Rice (Paddy)",
    "Rice": "Rice",
    "Maize": "Maize",
    "Cotton": "Cotton",
    "Chickpea (Gram)": "Chickpea (Gram)",
    "Chickpea": "Chickpea",
    "Mustard": "Mustard",
    "Sugarcane": "Sugarcane",
    "Soybean": "Soybean",
    "Lentil (Masoor)": "Lentil (Masoor)",
    "Lentil": "Lentil",
    "Potato": "Potato"
  },
  hi: {
    "Wheat": "गेहूं",
    "Rice (Paddy)": "धान (चावल)",
    "Rice": "धान",
    "Maize": "मक्का",
    "Cotton": "कपास",
    "Chickpea (Gram)": "चना",
    "Chickpea": "चना",
    "Mustard": "सरसों",
    "Sugarcane": "गन्ना",
    "Soybean": "सोयाबीन",
    "Lentil (Masoor)": "मसूर दाल",
    "Lentil": "मसूर दाल",
    "Potato": "आलू"
  }
};

export const AGRO_TERMS_HI = {
  // Crops
  "Wheat": "गेहूं",
  "Rice": "धान",
  "Rice (Paddy)": "धान (चावल)",
  "Maize": "मक्का",
  "Cotton": "कपास",
  "Chickpea": "चना",
  "Chickpea (Gram)": "चना (दाल)",
  "Mustard": "सरसों",
  "Sugarcane": "गन्ना",
  "Soybean": "सोयाबीन",
  "Lentil": "मसूर दाल",
  "Lentil (Masoor)": "मसूर दाल",
  "Potato": "आलू",
  "Grapes": "अंगूर",
  "Groundnut": "मूंगफली",
  "Chilli": "मिर्च",
  "Paddy": "धान",

  // Soil Types
  "Alluvial / Loam": "जलोढ़ / दोमट मिट्टी",
  "Alluvial Loam": "जलोढ़ दोमट मिट्टी",
  "Clay / Black Cotton": "चिकनी / काली कपास मिट्टी",
  "Black Soil (Regur)": "काली मिट्टी (रेगुर)",
  "Medium Black Soil": "मध्यम काली मिट्टी",
  "Red Sandy Loam": "लाल रेतीली दोमट मिट्टी",
  "Laterite Soil": "लैटेराइट मिट्टी",
  "Sandy Loam": "बलुई दोमट मिट्टी",

  // Irrigation Methods
  "Drip Irrigation": "ड्रिप (टपक) सिंचाई",
  "Micro-Sprinkler": "माइक्रो-स्प्रिंकलर",
  "Sprinkler": "स्प्रिंकलर (फुहारा)",
  "Sprinkler Irrigation": "स्प्रिंकलर सिंचाई",
  "Furrow & Basin": "थाला एवं नाली सिंचाई",
  "Furrow / Border Strip": "नाली / क्यारी सिंचाई",
  "Flood Irrigation (Traditional)": "पारंपरिक बाढ़ सिंचाई",
  "Canal Gravity": "नहर सिंचाई",

  // Crop Stages
  "Vegetative": "वानस्पतिक अवस्था",
  "Vegetative / Tillering": "वानस्पतिक / कल्ले फूटने की अवस्था",
  "Tillering": "कल्ले फूटने की अवस्था",
  "Flowering / Heading": "फूल आना / बाली निकलना",
  "Flowering & Grain Fill": "फूल आना एवं दाना भराव अवस्था",
  "Pod Development": "फली विकास अवस्था",
  "Berry Development": "फल/बेरी विकास अवस्था",
  "Germination & Seedling": "अंकुरण एवं नवजात पौधा",
  "Ripening / Maturity": "पकाव / परिपक्वता अवस्था",
  "Harvest Ready": "कटाई योग्य",
  "Harvest": "कटाई",

  // States
  "Punjab": "पंजाब",
  "Maharashtra": "महाराष्ट्र",
  "Uttar Pradesh": "उत्तर प्रदेश",
  "Gujarat": "गुजरात",
  "Andhra Pradesh": "आंध्र प्रदेश",
  "Madhya Pradesh": "मध्य प्रदेश",
  "Haryana": "हरियाणा",
  "Rajasthan": "राजस्थान",
  "Bihar": "बिहार",
  "Karnataka": "कर्नाटक",
  "Tamil Nadu": "तमिलनाडु",
  "Telangana": "तेलंगाना",
  "West Bengal": "पश्चिम बंगाल",
  "Odisha": "ओडिशा",

  // Weather Conditions
  "Clear": "साफ मौसम",
  "Sunny": "धूप",
  "Mainly Clear": "मुख्यतः साफ",
  "Partly Cloudy": "आंशिक रूप से बादल",
  "Passing Clouds": "हल्के बादल",
  "Isolated Cloud": "छिटपुट बादल",
  "Rain Inbound": "वर्षा का अनुमान",
  "Showers": "बारिश की फुहारें",
  "Clear Sunset": "साफ सूर्यास्त",
  "Clear Night": "साफ रात",
  "Cool Breeze": "ठंडी हवा",
  "Dew Formation": "ओस गिरना"
};

/**
 * Localizes common agricultural terms to Hindi
 */
export function localizeTerm(term, isHindi = false) {
  if (!term) return "";
  if (!isHindi) return term;
  return AGRO_TERMS_HI[term] || term;
}

export const translations = {
  en: {
    appName: "KrishiMitra AI",
    tagline: "Precision Farming Decision Support",
    corePromise: "Farm + Location + Weather + Soil + Crop Context → AI Recommendation → Action",
    liveTelemetry: "LIVE TELEMETRY",
    territory: "Territory",
    temp: "Temp",
    rh: "RH",
    soilMoisture: "Soil Moisture",
    irrigationDirective: "Irrigation Directive",
    watchAd: "Play Ad (1m 30s)",
    detectGps: "Detect My Current GPS",
    chooseDistrict: "-- Choose District --",
    state: "State",
    district: "District / Agro-Zone",
    farmer: "Farmer",
    logout: "Sign Out",

    tabs: {
      dashboard: "Dashboard",
      farmIntelligence: "Farm Intelligence",
      weather: "Weather Intelligence",
      smartIrrigation: "Smart Irrigation",
      cropIntelligence: "Crop Advisor",
      diseaseRisk: "Risk Center",
      planner: "Work Planner",
      assistant: "AI Copilot",
      analytics: "Farm Analytics",
      explainableAi: "Explainable AI (XAI)",
      alerts: "Alerts",
      viksitBharat: "Govt Datasets",
      maps: "Farm Map",
      settings: "Profile & Settings"
    },

    todayFarmAction: {
      title: "Today's Farm Action",
      irrigation: "Irrigation Decision",
      rainExpectation: "Rain Expectation",
      cropCondition: "Crop Condition",
      nextAction: "Recommended Action",
      liveVerified: "Live Context Evaluated",
      wait: "Wait / Hold",
      moderate: "Moderate Attention",
      recommended: "Recommended",
      irrigateNow: "Irrigate Now"
    },

    dashboard: {
      quickActionTitle: "60-Second Farm Advisor",
      quickActionSub: "One click calculates crop suitability, weather risk, and today's priority action.",
      runAiAnalysis: "Run AI Farm Analysis",
      analyzing: "Running Scikit-learn Model...",
      liveWeatherBadge: "Live Open-Meteo Feed",
      farmSummary: "Active Farm Profile",
      cropStatus: "Crop Growth Status",
      soilHealthScore: "Soil Health Index",
      waterSaved: "Irrigation Water Saved",
      activeCrops: "Active Crop",
      stage: "Stage",
      area: "Area",
      location: "Location",
      sprayAdvisor: "Spray Window",
      kpiMicroclimate: "MICROCLIMATE TEMP",
      kpiRainfall: "7-DAY PRECIPITATION",
      kpiRootMoisture: "ROOT-ZONE MOISTURE",
      kpiCanopyVigour: "CANOPY VIGOUR INDEX",
      kpiCompoundRisk: "COMPOUND PEST RISK",
      kpiEt0: "REFERENCE ET0 RATE",
      directiveTitle: "CRITICAL AI DIRECTIVE",
      directiveSubtitle: "Autonomous agronomic assessment based on live soil & numerical weather modeling",
      inspectMatrix: "Inspect Detailed Scientific Matrix →"
    },

    myFarm: {
      title: "Farm Information & Soil Profiling",
      subtitle: "Manage your land records, soil fertility metrics, and irrigation infrastructure.",
      editFarm: "Edit Farm Details",
      presets: "Quick Agro-Climatic Presets",
      presetPunjab: "Punjab (Wheat / Paddy)",
      presetMP: "Madhya Pradesh (Soybean / Gram)",
      presetMH: "Maharashtra (Cotton / Sugarcane)",
      presetUP: "Uttar Pradesh (Wheat / Mustard)",
      farmName: "Farm Name",
      farmerName: "Farmer Name",
      locationName: "Location / District",
      areaAcres: "Farm Area (Acres)",
      soilType: "Soil Type",
      nitrogen: "Nitrogen (N) kg/ha",
      phosphorus: "Phosphorus (P) kg/ha",
      potassium: "Potassium (K) kg/ha",
      soilPh: "Soil pH",
      irrigationMethod: "Irrigation Method",
      currentCrop: "Current Crop",
      cropStage: "Growth Stage",
      saveChanges: "Save Farm Profile",
      saving: "Saving..."
    },

    recommendation: {
      title: "AI Crop Suitability & Recommendation",
      subtitle: "Random Forest Classifier with Explainable AI feature attribution.",
      paramsHeader: "Environmental & Soil Parameters",
      useLiveContext: "Auto-Fill Live Weather & Farm Data",
      calculate: "Compute Crop Suitability",
      computing: "Evaluating Agronomic Compatibility...",
      recommendedCrop: "Recommended Crop",
      suitabilityScore: "Suitability Score",
      validationAccuracy: "Measured Test Accuracy",
      season: "Optimal Season",
      primaryReason: "Primary Agronomic Reason",
      explainableFactors: "Explainable AI Factor Analysis",
      factor: "Parameter",
      idealRange: "Agronomic Range",
      actualValue: "Farm Value",
      status: "Fitness Status",
      alternatives: "Viable Alternative Crops",
      favorable: "Favorable",
      neutral: "Moderate",
      warning: "Attention Required"
    },

    weather: {
      title: "Weather Intelligence for Agriculture",
      subtitle: "Hyperlocal conditions, 7-day forecast, and agronomic implications.",
      currentConditions: "Current Meteorological State",
      humidity: "Humidity",
      windSpeed: "Wind Velocity",
      rainfall24h: "Expected Rain (24h)",
      rainfall7d: "7-Day Cumulative Rain",
      spraySuitability: "Chemical Spray Suitability",
      cropStress: "Crop Heat Stress Level",
      forecast7Days: "7-Day Agro-Meteorological Forecast",
      liveApiTag: "Live Open-Meteo API",
      fallbackTag: "Verified Agromet Climatology"
    },

    irrigation: {
      title: "Smart Irrigation & Soil Hydrology",
      subtitle: "Evapotranspiration-driven decision support for water and electricity conservation.",
      statusCard: "Irrigation Advisory Status",
      et0: "Reference Evapotranspiration (ET0)",
      etc: "Crop Water Requirement (ETc)",
      soilProfile: "Root-Zone Water Depletion",
      efficiency: "Application Efficiency",
      irrigationAction: "Recommended Valve Action",
      timeline: "3-Day Soil Moisture Trajectory"
    },

    planner: {
      title: "Farm Milestone & Work Planner",
      subtitle: "Schedule sowing, fertigation, pest scouting, and harvesting operations.",
      addTask: "Add Farm Task",
      taskTitle: "Task Title",
      category: "Category",
      dueDate: "Due Date",
      priority: "Priority",
      filterAll: "All Tasks",
      pending: "Pending",
      completed: "Completed"
    },

    assistant: {
      title: "Krishi Copilot AI Assistant",
      subtitle: "Bilingual expert advisory powered by ICAR agronomic corpus.",
      placeholder: "Ask about fertilizers, pest management, spray timing, or govt schemes...",
      send: "Send Query",
      farmContextBanner: "Krishi Copilot is synced with your farm telemetry & live weather context",
      suggestions: [
        "What is the ideal NPK balance for Wheat tillering?",
        "How to detect and prevent yellow rust fungal disease?",
        "Should I irrigate today based on 48h rain forecast?",
        "Which Viksit Bharat scheme subsidizes solar pumps?"
      ]
    },

    analytics: {
      title: "Farm Performance Analytics",
      subtitle: "Actionable agronomic trends, soil balance radar, and irrigation resource efficiency.",
      soilRadar: "Soil Nutrient Health Index",
      yieldHistory: "Yield Benchmark vs District Average",
      waterEfficiency: "Water Application Efficiency by System",
      overallHealth: "Overall Agronomic Rating"
    },

    explainableAi: {
      title: "Explainable AI (XAI) & Model Evaluation Center",
      subtitle: "Comprehensive scientific validation, quantitative metrics, SHAP feature attributions, and trust architecture.",
      badge: "SCIENTIFIC BENCHMARKING",
      f1Score: "F1-Score (Weighted)",
      f1Macro: "F1-Score (Macro Avg)",
      r2Score: "R² Coefficient of Determination",
      maeScore: "Mean Absolute Error (MAE)",
      rmseScore: "Root Mean Square Error (RMSE)",
      accuracyScore: "Overall Model Accuracy",
      evalDataset: "Validation Dataset",
      evalDatasetValue: "1,600 Verified ICAR Observations",
      confusionMatrixTitle: "Multi-Class Confusion Matrix & Per-Crop F1 Performance",
      confusionMatrixSub: "Evaluates classification sensitivity and precision across 10 distinct Indian crop profiles.",
      shapTitle: "Global Feature Importance & Attribution (SHAP-Style)",
      shapSub: "Percentage contribution of environmental and soil chemical vectors in model inference.",
      whyConfidentTitle: "Why We Are Confident (Scientific Governance Framework)",
      whyConfidentSub: "How KrishiMitra AI prevents algorithmic hallucination and guarantees field safety.",
      simulatorTitle: "Interactive Live What-If Inference Explainer",
      simulatorSub: "Adjust soil nutrients and weather inputs to observe real-time model decision attribution.",
      actualVsPred: "Actual vs Predicted",
      precision: "Precision",
      recall: "Recall",
      support: "Support Samples",
      runLiveInference: "Run Live XAI Inference"
    },

    viksitBharat: {
      title: "Viksit Bharat Ag Intelligence",
      subtitle: "Verified public datasets directly from Government of India official releases. Zero fabricated statistics.",
      mspTitle: "Minimum Support Prices (MSP) 2024-25",
      mspSub: "Cabinet Committee on Economic Affairs (CCEA) approved procurement rates with cost of production and margin.",
      productionTitle: "State-wise Production Leadership (2023-24)",
      productionSub: "DES Ministry of Agriculture & Farmers Welfare advance estimates.",
      schemesTitle: "Verified Central Government Schemes",
      sourceAttribution: "Official Source Attribution",
      officialPortal: "Visit Official Portal"
    },

    farmMap: {
      title: "Farm Geolocation & Land Mapping",
      subtitle: "Clean OpenStreetMap visualization showing your farm location marker.",
      gpsButton: "Detect My GPS Location",
      latLon: "Coordinates",
      zoomNote: "Click anywhere on the map to update farm coordinates."
    },

    login: {
      missionBadge: "National Smart Farming Portal",
      missionSub: "Digital Agriculture Mission • ICAR Precision Agronomy Engine",
      welcomeTitle: "Welcome to KrishiMitra AI",
      welcomeSub: "Sign in to access real-time satellite parcel telemetry, AI crop health diagnostics, and precision hydrology guidance.",
      tabQuickDemo: "1-Click Demo Farmers",
      tabMobile: "Mobile OTP Login",
      tabRegister: "Register New Farm",
      selectProfileToLaunch: "Select a State Agro-Profile to Launch:",
      instantAccess: "Instant Access (No Password Required)",
      farmerMobile: "Farmer Mobile Number",
      otpSentTo: "OTP sent to",
      change: "Change",
      enterOtp: "Enter 4-Digit OTP",
      sendOtp: "Send Verification OTP",
      verifyOtp: "Verify OTP & Enter KrishiMitra",
      oneClickAutofill: "⚡ One-Click Auto-Fill (1004)",
      resendIn: "Resend in 30s",
      fullName: "Farmer Full Name",
      farmName: "Holding / Farm Name",
      landSize: "Land Size (Acres)",
      primaryCrop: "Primary Crop Sown",
      soilType: "Soil Type",
      irrigationMethod: "Irrigation Method",
      registerBtn: "Complete Farm Registration & Enter",
      watchAdBtn: "🎬 Watch Ad (1m 30s)"
    }
  },

  hi: {
    appName: "कृषि-मित्र AI",
    tagline: "सटीक कृषि निर्णय समर्थन प्रणाली",
    corePromise: "खेत + स्थान + मौसम + मिट्टी + फसल संदर्भ → AI सिफ़ारिश → स्पष्ट कार्रवाई",
    liveTelemetry: "सजीव टेलीमेट्री (LIVE)",
    territory: "खेत क्षेत्र",
    temp: "तापमान",
    rh: "नमी",
    soilMoisture: "मृदा नमी",
    irrigationDirective: "सिंचाई निर्देश",
    watchAd: "विज्ञापन देखें (१ मि ३० से)",
    detectGps: "मेरा वर्तमान GPS पहचानें",
    chooseDistrict: "-- जिला चुनें --",
    state: "राज्य",
    district: "जिला / कृषि-जलवायु क्षेत्र",
    farmer: "किसान",
    logout: "लॉग आउट",

    tabs: {
      dashboard: "डैशबोर्ड",
      farmIntelligence: "खेत ज्ञान व मृदा",
      weather: "मौसम बुद्धिमत्ता",
      smartIrrigation: "स्मार्ट सिंचाई",
      cropIntelligence: "फसल सलाहकार",
      diseaseRisk: "जोखिम केंद्र",
      planner: "कार्य योजनाकार",
      assistant: "कृषि सहायक AI",
      analytics: "फार्म एनालिटिक्स",
      explainableAi: "व्याख्यात्मक AI (XAI)",
      alerts: "चेतावनी व अलर्ट",
      viksitBharat: "सरकारी योजनाएं व MSP",
      maps: "खेत का नक्शा",
      settings: "प्रोफ़ाइल एवं सेटिंग्स"
    },

    todayFarmAction: {
      title: "आज का मुख्य कृषि कार्य",
      irrigation: "सिंचाई निर्णय",
      rainExpectation: "बारिश का अनुमान",
      cropCondition: "फसल की स्थिति",
      nextAction: "अनुशंसित कार्रवाई",
      liveVerified: "सजीव संदर्भ मूल्यांकित",
      wait: "प्रतीक्षा करें / रोकें",
      moderate: "सामान्य निगरानी",
      recommended: "सिंचाई अनुशंसित",
      irrigateNow: "तुरंत सिंचाई करें"
    },

    dashboard: {
      quickActionTitle: "६०-सेकंड त्वरित कृषि सलाहकार",
      quickActionSub: "एक क्लिक में उपयुक्त फसल, मौसम जोखिम और आज का प्राथमिक कार्य जानें।",
      runAiAnalysis: "AI कृषि विश्लेषण चलाएं",
      analyzing: "मशीन लर्निंग मॉडल विश्लेषण कर रहा है...",
      liveWeatherBadge: "सजीव मौसम फीड",
      farmSummary: "सक्रिय खेत प्रोफ़ाइल",
      cropStatus: "फसल विकास स्थिति",
      soilHealthScore: "मृदा स्वास्थ्य सूचकांक",
      waterSaved: "बचाया गया सिंचाई जल",
      activeCrops: "सक्रिय फसल",
      stage: "अवस्था",
      area: "क्षेत्रफल",
      location: "स्थान",
      sprayAdvisor: "कीटनाशक छिड़काव समय",
      kpiMicroclimate: "सूक्ष्म जलवायु तापमान",
      kpiRainfall: "७-दिवसीय वर्षा पूर्वानुमान",
      kpiRootMoisture: "जड़-क्षेत्र मृदा नमी",
      kpiCanopyVigour: "फसल हरापन सूचकांक (NDVI)",
      kpiCompoundRisk: "संयुक्त कीट व रोग जोखिम",
      kpiEt0: "दैनिक वाष्पीकरण दर (ET0)",
      directiveTitle: "महत्वपूर्ण AI कृषि निर्देश",
      directiveSubtitle: "मृदा नमी और मौसम विज्ञान मॉडल पर आधारित स्वायत्त कृषि सलाह",
      inspectMatrix: "विस्तृत वैज्ञानिक विश्लेषण देखें →"
    },

    myFarm: {
      title: "खेत की जानकारी एवं मृदा परीक्षण",
      subtitle: "अपनी भूमि का विवरण, मिट्टी के पोषक तत्व और सिंचाई विधि प्रबंधित करें।",
      editFarm: "खेत का विवरण बदलें",
      presets: "त्वरित कृषि क्षेत्र चयन",
      presetPunjab: "पंजाब (गेहूं / धान)",
      presetMP: "मध्य प्रदेश (सोयाबीन / चना)",
      presetMH: "महाराष्ट्र (कपास / गन्ना)",
      presetUP: "उत्तर प्रदेश (गेहूं / सरसों)",
      farmName: "खेत का नाम",
      farmerName: "किसान का नाम",
      locationName: "स्थान / जिला",
      areaAcres: "खेत का रकबा (एकड़)",
      soilType: "मिट्टी का प्रकार",
      nitrogen: "नाइट्रोजन (N) किग्रा/हेक्टेयर",
      phosphorus: "फास्फोरस (P) किग्रा/हेक्टेयर",
      potassium: "पोटाश (K) किग्रा/हेक्टेयर",
      soilPh: "मृदा पीएच (pH)",
      irrigationMethod: "सिंचाई की विधि",
      currentCrop: "वर्तमान फसल",
      cropStage: "फसल की अवस्था",
      saveChanges: "प्रोफ़ाइल सहेजें",
      saving: "सहेजा जा रहा है..."
    },

    recommendation: {
      title: "AI फसल उपयुक्तता एवं सिफ़ारिश",
      subtitle: "रैंडम फ़ॉरेस्ट क्लासिफायर और व्याख्यात्मक AI (Explainable AI) कारक विश्लेषण।",
      paramsHeader: "पर्यावरणीय एवं मृदा मापदंड",
      useLiveContext: "लाइव मौसम व खेत डेटा स्वतः भरें",
      calculate: "फसल उपयुक्तता निकालें",
      computing: "कृषि अनुकूलता की गणना हो रही है...",
      recommendedCrop: "अनुशंसित फसल",
      suitabilityScore: "उपयुक्तता स्कोर",
      validationAccuracy: "प्रमाणित मॉडल सटीकता",
      season: "उपयुक्त मौसम",
      primaryReason: "मुख्य कृषि कारण",
      explainableFactors: "व्याख्यात्मक AI कारक विश्लेषण",
      factor: "मापदंड",
      idealRange: "आदर्श सीमा",
      actualValue: "खेत का मान",
      status: "स्थिति",
      alternatives: "अन्य व्यवहार्य फसलें",
      favorable: "अनुकूल",
      neutral: "मध्यम",
      warning: "ध्यान दें"
    },

    weather: {
      title: "कृषि मौसम बुद्धिमत्ता",
      subtitle: "स्थानीय मौसम, ७ दिनों का पूर्वानुमान और खेती से जुड़ी सलाह।",
      currentConditions: "वर्तमान मौसम स्थिति",
      humidity: "आर्द्रता (नमी)",
      windSpeed: "हवा की गति",
      rainfall24h: "२४ घंटे में संभावित बारिश",
      rainfall7d: "७ दिनों की कुल बारिश",
      spraySuitability: "छिड़काव के लिए अनुकूलता",
      cropStress: "फसल ताप तनाव स्तर",
      forecast7Days: "७-दिवसीय कृषि पूर्वानुमान",
      liveApiTag: "लाइव मौसम API",
      fallbackTag: "प्रमाणित कृषि बैकअप डेटा"
    },

    irrigation: {
      title: "स्मार्ट सिंचाई सलाह व जल संरक्षण",
      subtitle: "वाष्पीकरण-उत्सर्जन आधारित निर्णय समर्थन। बिजली और भूजल की अधिकतम बचत।",
      statusCard: "सिंचाई सलाह स्थिति",
      et0: "संदर्भ वाष्पीकरण (ET0)",
      etc: "फसल जल आवश्यकता (ETc)",
      soilProfile: "मृदा जल धारण क्षमता",
      efficiency: "सिंचाई प्रणाली दक्षता",
      irrigationAction: "अनुशंसित वॉल्व कार्रवाई",
      timeline: "३-दिवसीय नमी दृष्टिकोण"
    },

    planner: {
      title: "कृषि कार्य योजनाकार",
      subtitle: "मौसमी बुवाई, खाद, छिड़काव और कटाई के कार्यों को सुव्यवस्थित करें।",
      addTask: "नया कार्य जोड़ें",
      taskTitle: "कार्य का नाम",
      category: "श्रेणी",
      dueDate: "नियत तिथि",
      priority: "प्राथमिकता",
      filterAll: "सभी कार्य",
      pending: "लंबित",
      completed: "पूर्ण"
    },

    assistant: {
      title: "कृषि Copilot AI सहायक",
      subtitle: "ICAR और कृषि विज्ञान केंद्र (KVK) द्वारा सत्यापित कृषि ज्ञान भंडार।",
      placeholder: "खाद, कीट नियंत्रण, सिंचाई या सरकारी योजनाओं के बारे में पूछें...",
      send: "पूछें",
      farmContextBanner: "सहायक आपके खेत और मौसम की वर्तमान स्थिति से सीधे जुड़ा हुआ है",
      suggestions: [
        "गेहूं की कल्ले फूटने की अवस्था में सही खाद क्या है?",
        "पीला रतुआ फफूंद रोग की पहचान और रोकथाम कैसे करें?",
        "क्या अगले ४८ घंटों में वर्षा के अनुसार आज सिंचाई करनी चाहिए?",
        "पीएम-कुसुम योजना के तहत सोलर पंप पर कितनी सब्सिडी मिलती है?"
      ]
    },

    analytics: {
      title: "फार्म एनालिटिक्स एवं प्रदर्शन",
      subtitle: "मिट्टी के पोषक तत्व, पैदावार तुलना और जल उपयोग दक्षता के वास्तविक रुझान।",
      soilRadar: "मृदा पोषक संतुलन सूचकांक",
      yieldHistory: "ऐतिहासिक पैदावार बनाम जिला औसत",
      waterEfficiency: "सिंचाई विधियों की जल दक्षता",
      overallHealth: "समग्र कृषि रेटिंग"
    },

    explainableAi: {
      title: "व्याख्यात्मक AI (XAI) एवं मॉडल मूल्यांकन केंद्र",
      subtitle: "वैज्ञानिक विश्वसनीयता, F1-स्कोर, R² स्कोर, MAE त्रुटि विश्लेषण, SHAP प्रभाव कारक और पारदर्शी निर्णय प्रणाली।",
      badge: "वैज्ञानिक सत्यापन एवं मॉडल मेट्रिक्स",
      f1Score: "F1-स्कोर (वेटेड औसत)",
      f1Macro: "F1-स्कोर (मैक्रो औसत)",
      r2Score: "R² सहसंबंध गुणांक (R² Score)",
      maeScore: "औसत निरपेक्ष त्रुटि (MAE)",
      rmseScore: "वर्गमूल माध्य त्रुटि (RMSE)",
      accuracyScore: "समग्र मॉडल सटीकता",
      evalDataset: "मूल्यांकन डेटासेट",
      evalDatasetValue: "१,६०० सत्यापित ICAR कृषि अवलोकन",
      confusionMatrixTitle: "मल्टी-क्लास कन्फ्यूजन मैट्रिक्स एवं फसलवार F1 प्रदर्शन",
      confusionMatrixSub: "१० प्रमुख भारतीय फसलों के वर्गीकरण की संवेदनशीलता और सटीकता का सत्यापन।",
      shapTitle: "वैश्विक फीचर महत्व एवं प्रभाव विश्लेषण (SHAP Attribution)",
      shapSub: "मॉडल द्वारा फसल चयन में प्रत्येक मिट्टी और मौसम कारक का प्रतिशत योगदान।",
      whyConfidentTitle: "हम अपने मॉडल पर विश्वास क्यों करते हैं? (वैज्ञानिक सुरक्षा ढांचा)",
      whyConfidentSub: "कृषि-मित्र AI कैसे कृत्रिम भ्रम (Hallucination) को रोकता है और किसानों को सुरक्षित सलाह देता है।",
      simulatorTitle: "इंटरएक्टिव सजीव What-If निर्णय अनुकरणकर्ता",
      simulatorSub: "मिट्टी के पोषक तत्वों और मौसम को बदलकर वास्तविक समय में AI निर्णय की व्याख्या देखें।",
      actualVsPred: "वास्तविक बनाम अनुमानित",
      precision: "परिशुद्धता (Precision)",
      recall: "पुनःप्राप्ति (Recall)",
      support: "परीक्षण नमूने",
      runLiveInference: "सजीव XAI अनुमान चलाएं"
    },

    viksitBharat: {
      title: "विकसित भारत कृषि डेटा",
      subtitle: "भारत सरकार के आधिकारिक पोर्टल एवं गजट से प्रमाणित सार्वजनिक आंकड़े। शून्य बनावटी सांख्यिकी।",
      mspTitle: "न्यूनतम समर्थन मूल्य (MSP) २०२४-२५",
      mspSub: "सीसीईए (CCEA) द्वारा अनुमोदित दरें एवं लागत पर ५०% से अधिक लाभ।",
      productionTitle: "राज्यवार प्रमुख खाद्यान्न उत्पादन (२०२३-२४)",
      productionSub: "कृषि एवं किसान कल्याण मंत्रालय (DES) के अग्रिम अनुमान।",
      schemesTitle: "प्रमाणित केंद्रीय कृषि योजनाएं",
      sourceAttribution: "आधिकारिक स्रोत संदर्भ",
      officialPortal: "आधिकारिक पोर्टल पर जाएं"
    },

    farmMap: {
      title: "खेत का नक्शा एवं भौगोलिक स्थिति",
      subtitle: "ओपनस्ट्रीटमैप (OpenStreetMap) पर अपने खेत का स्थान देखें।",
      gpsButton: "मेरा GPS स्थान पहचानें",
      latLon: "निर्देशांक (Coordinates)",
      zoomNote: "खेत के निर्देशांक बदलने के लिए नक्शे पर कहीं भी क्लिक करें।"
    },

    login: {
      missionBadge: "राष्ट्रीय स्मार्ट कृषि पोर्टल",
      missionSub: "डिजिटल कृषि मिशन • ICAR सटीक कृषि विज्ञान इंजन",
      welcomeTitle: "कृषि-मित्र AI में आपका स्वागत है",
      welcomeSub: "सजीव उपग्रह टेलीमेट्री, AI फसल स्वास्थ्य निदान और सटीक जल विज्ञान मार्गदर्शन के लिए साइन इन करें।",
      tabQuickDemo: "१-क्लिक डेमो किसान",
      tabMobile: "मोबाइल OTP लॉगिन",
      tabRegister: "नया खेत पंजीकरण",
      selectProfileToLaunch: "प्रारंभ करने के लिए राज्यवार कृषि प्रोफ़ाइल चुनें:",
      instantAccess: "त्वरित प्रवेश (पासवर्ड की आवश्यकता नहीं)",
      farmerMobile: "किसान का मोबाइल नंबर",
      otpSentTo: "OTP भेजा गया",
      change: "बदलें",
      enterOtp: "४-अंकों का OTP दर्ज करें",
      sendOtp: "सत्यापन OTP भेजें",
      verifyOtp: "OTP सत्यापित करें और प्रवेश करें",
      oneClickAutofill: "⚡ एक-क्लिक स्वतः भरें (१००४)",
      resendIn: "३० सेकंड में पुनः भेजें",
      fullName: "किसान का पूरा नाम",
      farmName: "खेत / जोत का नाम",
      landSize: "खेत का रकबा (एकड़)",
      primaryCrop: "मुख्य बोई गई फसल",
      soilType: "मिट्टी का प्रकार",
      irrigationMethod: "सिंचाई की विधि",
      registerBtn: "खेत पंजीकरण पूर्ण करें और प्रवेश करें",
      watchAdBtn: "🎬 विज्ञापन देखें (१ मि ३० से)"
    }
  }
};
