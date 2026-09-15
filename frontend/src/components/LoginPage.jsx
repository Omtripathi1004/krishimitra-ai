import React, { useState } from "react";
import {
  Sprout,
  ShieldCheck,
  Phone,
  KeyRound,
  ArrowRight,
  UserCheck,
  MapPin,
  CheckCircle2,
  Sparkles,
  Layers,
  Wheat,
  Globe,
  Film
} from "lucide-react";
import { INDIA_STATES_DATA } from "../data/indiaLocations";
import { translations, toHindiDigits, localizeTerm } from "../translations";

// Pre-configured real Indian demo farmer profiles
export const DEMO_FARMER_ACCOUNTS = [
  {
    id: "farmer_punjab",
    farmer_name: "Ramesh Patel",
    mobile: "9876543210",
    state: "Punjab",
    district: "Ludhiana",
    location_name: "Ludhiana, Punjab, India",
    latitude: 30.9010,
    longitude: 75.8573,
    farm_name: "Patel Green Bio-Farms",
    area_acres: 5.0,
    current_crop: "Wheat",
    crop_stage: "Vegetative / Tillering",
    soil_type: "Alluvial Loam",
    irrigation_method: "Drip Irrigation",
    avatar: "🌾"
  },
  {
    id: "farmer_maharashtra",
    farmer_name: "Suresh Deshmukh",
    mobile: "9823456781",
    state: "Maharashtra",
    district: "Nashik",
    location_name: "Nashik, Maharashtra, India",
    latitude: 19.9975,
    longitude: 73.7898,
    farm_name: "Sahyadri Vineyard & Agro",
    area_acres: 8.5,
    current_crop: "Grapes",
    crop_stage: "Berry Development",
    soil_type: "Black Soil (Regur)",
    irrigation_method: "Micro-Sprinkler",
    avatar: "🍇"
  },
  {
    id: "farmer_up",
    farmer_name: "Kishan Lal Verma",
    mobile: "9450123456",
    state: "Uttar Pradesh",
    district: "Varanasi",
    location_name: "Varanasi, Uttar Pradesh, India",
    latitude: 25.3176,
    longitude: 82.9739,
    farm_name: "Kashi Gangetic Agro Parcel",
    area_acres: 3.2,
    current_crop: "Rice",
    crop_stage: "Flowering & Grain Fill",
    soil_type: "Alluvial Loam",
    irrigation_method: "Furrow & Basin",
    avatar: "🌾"
  },
  {
    id: "farmer_gujarat",
    farmer_name: "Bhavesh Prajapati",
    mobile: "9898765432",
    state: "Gujarat",
    district: "Rajkot",
    location_name: "Rajkot, Gujarat, India",
    latitude: 22.3039,
    longitude: 70.8022,
    farm_name: "Saurashtra Golden Oilseeds",
    area_acres: 12.0,
    current_crop: "Groundnut",
    crop_stage: "Pod Development",
    soil_type: "Medium Black Soil",
    irrigation_method: "Drip Irrigation",
    avatar: "🥜"
  },
  {
    id: "farmer_ap",
    farmer_name: "Venkat Reddy",
    mobile: "9440123789",
    state: "Andhra Pradesh",
    district: "Guntur",
    location_name: "Guntur, Andhra Pradesh, India",
    latitude: 16.3067,
    longitude: 80.4365,
    farm_name: "Mirchi Smart AgTech",
    area_acres: 6.0,
    current_crop: "Chilli",
    crop_stage: "Fruiting",
    soil_type: "Black Cotton Soil",
    irrigation_method: "Drip Irrigation",
    avatar: "🌶️"
  }
];

export default function LoginPage({ onLogin, language, setLanguage, onWatchAd }) {
  const isHindi = language === "hi";
  const num = (v) => (isHindi ? toHindiDigits(v) : String(v));
  const tLog = translations[language]?.login || translations.en?.login || {};

  const [authTab, setAuthTab] = useState("quickDemo"); // "quickDemo" | "mobile" | "register"
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);

  // New Registration Form State
  const [regName, setRegName] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regState, setRegState] = useState("Punjab");
  const [regDistrict, setRegDistrict] = useState("Ludhiana");
  const [regArea, setRegArea] = useState("5.0");
  const [regCrop, setRegCrop] = useState("Wheat");

  const currentDistricts =
    INDIA_STATES_DATA.find((s) => s.state === regState)?.districts || [];

  // Handle Quick Demo Account Click
  const handleSelectDemoUser = (userProfile) => {
    setLoading(true);
    setTimeout(() => {
      onLogin(userProfile);
      setLoading(false);
    }, 400);
  };

  // Handle Sending OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (mobileNumber.length < 10) {
      setOtpError(isHindi ? "कृपया वैध १०-अंकों का भारतीय मोबाइल नंबर दर्ज करें।" : "Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    setOtpError("");
    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      // Auto-set helper sample OTP
      setOtpValue("1004");
    }, 600);
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otpValue || otpValue.length < 4) {
      setOtpError(isHindi ? "कृपया ४-अंकों का OTP दर्ज करें।" : "Please enter the 4-digit OTP.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const loggedUser = {
        id: `farmer_${mobileNumber}`,
        farmer_name: (isHindi ? "किसान " : "Farmer ") + mobileNumber.slice(-4),
        mobile: mobileNumber,
        state: "Punjab",
        district: "Ludhiana",
        location_name: "Ludhiana, Punjab, India",
        latitude: 30.9010,
        longitude: 75.8573,
        farm_name: isHindi ? "आदर्श कृषि प्रक्षेत्र" : "Krishi Farmer Parcel",
        area_acres: 5.0,
        current_crop: "Wheat",
        crop_stage: "Vegetative",
        soil_type: "Alluvial Loam",
        irrigation_method: "Drip Irrigation",
        avatar: "🌾"
      };
      onLogin(loggedUser);
      setLoading(false);
    }, 500);
  };

  // Handle New Registration
  const handleRegisterFarm = (e) => {
    e.preventDefault();
    if (!regName || !regMobile) {
      setOtpError(isHindi ? "कृपया किसान का नाम और मोबाइल नंबर भरें।" : "Please fill in farmer name and mobile.");
      return;
    }
    setLoading(true);
    const districtObj = currentDistricts.find((d) => d.name === regDistrict) || {
      lat: 30.901,
      lon: 75.857,
      soil: "Alluvial Loam"
    };

    const newUser = {
      id: `farmer_${Date.now()}`,
      farmer_name: regName,
      mobile: regMobile,
      state: regState,
      district: regDistrict,
      location_name: `${regDistrict}, ${regState}, India`,
      latitude: districtObj.lat,
      longitude: districtObj.lon,
      farm_name: isHindi ? `${regName} का खेत` : `${regName}'s Farm`,
      area_acres: parseFloat(regArea) || 5.0,
      current_crop: regCrop,
      crop_stage: "Germination & Seedling",
      soil_type: districtObj.soil || "Alluvial Loam",
      irrigation_method: "Drip Irrigation",
      avatar: "🌱"
    };

    setTimeout(() => {
      onLogin(newUser);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      {/* Top Agricultural Mission Bar */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-surface)]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-black font-extrabold shadow-lg shadow-emerald-500/20 text-lg">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white font-display">
                KrishiMitra AI
              </span>
              <span className="badge badge-emerald text-[10px]">v2.4 PRO</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              {tLog.missionSub || "Digital Agriculture Mission • ICAR Precision Agronomy Engine"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onWatchAd && (
            <button
              onClick={onWatchAd}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950 border border-emerald-400/50 cursor-pointer"
              title={isHindi ? "९०-सेकंड का कमर्शियल विज्ञापन देखें" : "Watch 90-Second Platform Commercial (Ad Showcase)"}
            >
              <Film className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{tLog.watchAdBtn || "🎬 Watch Ad (1m 30s)"}</span>
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs font-bold text-white hover:border-[var(--primary)] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === "en" ? "हिन्दी (HI)" : "English (EN)"}</span>
          </button>
        </div>
      </header>

      {/* Main Login Card / Hero Section */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-1)] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Heading */}
          <div className="text-center mb-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{tLog.missionBadge || "National Smart Farming Portal"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
              {tLog.welcomeTitle || "Welcome to KrishiMitra AI"}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 max-w-md mx-auto leading-relaxed">
              {tLog.welcomeSub || "Sign in to access real-time satellite parcel telemetry, AI crop health diagnostics, and precision hydrology guidance."}
            </p>
          </div>

          {/* Auth Navigation Tabs */}
          <div className="flex p-1 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border)] mb-6 text-xs font-bold">
            <button
              onClick={() => {
                setAuthTab("quickDemo");
                setOtpError("");
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authTab === "quickDemo"
                  ? "bg-emerald-600 text-white shadow-md font-extrabold"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>{tLog.tabQuickDemo || "1-Click Demo Farmers"}</span>
            </button>

            <button
              onClick={() => {
                setAuthTab("mobile");
                setOtpError("");
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authTab === "mobile"
                  ? "bg-emerald-600 text-white shadow-md font-extrabold"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>{tLog.tabMobile || "Mobile OTP Login"}</span>
            </button>

            <button
              onClick={() => {
                setAuthTab("register");
                setOtpError("");
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authTab === "register"
                  ? "bg-emerald-600 text-white shadow-md font-extrabold"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <Sprout className="w-4 h-4" />
              <span>{tLog.tabRegister || "Register New Farm"}</span>
            </button>
          </div>

          {/* TAB 1: QUICK DEMO PROFILES */}
          {authTab === "quickDemo" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  {tLog.selectProfileToLaunch || "Select a State Agro-Profile to Launch:"}
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  {tLog.instantAccess || "Instant Access (No Password Required)"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEMO_FARMER_ACCOUNTS.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => handleSelectDemoUser(account)}
                    disabled={loading}
                    className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-emerald-400/80 hover:bg-emerald-950/20 text-left transition-all group flex items-start gap-3 relative cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                      {account.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors truncate">
                          {account.farmer_name}
                        </span>
                        <span className="badge badge-emerald text-[10px]">
                          {localizeTerm(account.state, isHindi)}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span>{account.district} • {num(account.area_acres)} {isHindi ? "एकड़" : "Acres"}</span>
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
                        <span className="text-emerald-400 font-bold">{localizeTerm(account.current_crop, isHindi)}</span>
                        <span>•</span>
                        <span className="truncate">{localizeTerm(account.soil_type, isHindi)}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-emerald-400 group-hover:translate-x-1 transition-all self-center ml-1 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MOBILE OTP LOGIN */}
          {authTab === "mobile" && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">
                      {tLog.farmerMobile || "Farmer Mobile Number"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-400">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength="10"
                        placeholder="98765 43210"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                        className="w-full pl-14 pr-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1.5">
                      {isHindi ? "आपके मोबाइल फोन पर ४-अंकों का सत्यापन कोड भेजा जाएगा।" : "A 4-digit verification code will be sent to your mobile phone."}
                    </p>
                  </div>

                  {otpError && (
                    <p className="text-xs text-red-400 font-bold">{otpError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || mobileNumber.length < 10}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
                  >
                    {loading ? (isHindi ? "OTP भेजा जा रहा है..." : "Sending OTP...") : (tLog.sendOtp || "Send Verification OTP")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                    <span>{tLog.otpSentTo || "OTP sent to"} +91 {mobileNumber}</span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-white underline font-bold cursor-pointer"
                    >
                      {tLog.change || "Change"}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">
                      {tLog.enterOtp || "Enter 4-Digit OTP"}
                    </label>
                    <input
                      type="text"
                      maxLength="4"
                      placeholder="• • • •"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      className="w-full text-center tracking-[0.5em] py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-white font-mono text-xl font-bold focus:border-emerald-500 focus:outline-none"
                      required
                    />
                    <div className="flex items-center justify-between mt-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setOtpValue("1004")}
                        className="text-emerald-400 font-bold hover:underline cursor-pointer"
                      >
                        {tLog.oneClickAutofill || "⚡ One-Click Auto-Fill (1004)"}
                      </button>
                      <span className="text-[var(--text-muted)]">{tLog.resendIn || "Resend in 30s"}</span>
                    </div>
                  </div>

                  {otpError && (
                    <p className="text-xs text-red-400 font-bold">{otpError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || otpValue.length < 4}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
                  >
                    {loading ? (isHindi ? "सत्यापित हो रहा है..." : "Verifying...") : (tLog.verifyOtp || "Verify OTP & Enter KrishiMitra")}
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: REGISTER NEW FARM PARCEL */}
          {authTab === "register" && (
            <form onSubmit={handleRegisterFarm} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                    {tLog.fullName || "Farmer Full Name"}
                  </label>
                  <input
                    type="text"
                    placeholder={isHindi ? "उदा. गुरप्रीत सिंह" : "e.g. Gurpreet Singh"}
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                    {tLog.farmerMobile || "Mobile Number"}
                  </label>
                  <input
                    type="tel"
                    maxLength="10"
                    placeholder="98765 43210"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* State & District Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                    {isHindi ? "कृषि राज्य" : "Agricultural State"}
                  </label>
                  <select
                    value={regState}
                    onChange={(e) => {
                      setRegState(e.target.value);
                      const stateObj = INDIA_STATES_DATA.find((s) => s.state === e.target.value);
                      if (stateObj && stateObj.districts.length > 0) {
                        setRegDistrict(stateObj.districts[0].name);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                  >
                    {INDIA_STATES_DATA.map((s) => (
                      <option key={s.state} value={s.state} className="bg-slate-900 text-white">
                        {localizeTerm(s.state, isHindi)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                    {isHindi ? "जिला / तहसील" : "District / Tehsil"}
                  </label>
                  <select
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                  >
                    {currentDistricts.map((d) => (
                      <option key={d.name} value={d.name} className="bg-slate-900 text-white">
                        {d.name} ({localizeTerm(d.crop, isHindi)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                    {tLog.landSize || "Farm Parcel Area (Acres)"}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={regArea}
                    onChange={(e) => setRegArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                    {tLog.primaryCrop || "Primary Sown Crop"}
                  </label>
                  <select
                    value={regCrop}
                    onChange={(e) => setRegCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                  >
                    {["Wheat", "Rice", "Cotton", "Grapes", "Soybean", "Groundnut", "Mustard", "Sugarcane", "Maize", "Chilli"].map(
                      (c) => (
                        <option key={c} value={c} className="bg-slate-900 text-white">
                          {localizeTerm(c, isHindi)}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 mt-2 cursor-pointer"
              >
                {loading ? (isHindi ? "पंजीकरण जारी..." : "Registering Parcel...") : (tLog.registerBtn || "Create Account & Enter Platform")}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer Credentials */}
      <footer className="border-t border-[var(--border)] bg-[var(--bg-surface)]/80 py-3 text-center text-xs text-[var(--text-secondary)]">
        <span>{isHindi ? "१४ करोड़+ भारतीय किसान परिवारों के लिए समर्पित • ICAR प्रमाणित सटीक कृषि विज्ञान इंजन" : "Empowering 140M+ Indian Agrarian Households • Certified ICAR Agronomy Engine"}</span>
      </footer>
    </div>
  );
}
