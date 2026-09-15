import React, { useState, useEffect } from "react";
import {
  Sprout,
  MapPin,
  Layers,
  Droplets,
  Save,
  CheckCircle2,
  Sparkles,
  Compass,
  Gauge,
  Sliders,
  ShieldCheck,
  Award
} from "lucide-react";
import { toHindiDigits, localizeTerm } from "../translations";

export default function MyFarm({ farm, onUpdateFarm, t, language, isHindi: propIsHindi }) {
  const isHindi = propIsHindi || language === "hi" || Boolean(t?.liveTelemetry?.includes("सजीव"));
  const num = (v) => (isHindi ? toHindiDigits(v) : String(v));
  const [formData, setFormData] = useState({
    farm_name: "",
    farmer_name: "",
    location_name: "",
    latitude: 30.9010,
    longitude: 75.8573,
    area_acres: 5.0,
    soil_type: "Alluvial / Loam",
    nitrogen: 85.0,
    phosphorus: 45.0,
    potassium: 40.0,
    soil_ph: 6.8,
    irrigation_method: "Drip Irrigation",
    current_crop: "Wheat",
    crop_stage: "Vegetative"
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (farm) {
      setFormData({
        farm_name: farm.farm_name || "Majha Agro Holding",
        farmer_name: farm.farmer_name || "Gurpreet Singh",
        location_name: farm.location_name || "Ludhiana, Punjab",
        latitude: farm.latitude || 30.9010,
        longitude: farm.longitude || 75.8573,
        area_acres: farm.area_acres || 5.0,
        soil_type: farm.soil_type || "Alluvial / Loam",
        nitrogen: farm.nitrogen || 85.0,
        phosphorus: farm.phosphorus || 45.0,
        potassium: farm.potassium || 40.0,
        soil_ph: farm.soil_ph || 6.8,
        irrigation_method: farm.irrigation_method || "Drip Irrigation",
        current_crop: farm.current_crop || "Wheat",
        crop_stage: farm.crop_stage || "Vegetative"
      });
    }
  }, [farm]);

  const applyPreset = (presetName) => {
    if (presetName === "punjab") {
      setFormData((prev) => ({
        ...prev,
        farm_name: "Majha Agro Fields",
        farmer_name: "Gurpreet Singh",
        location_name: "Ludhiana, Punjab",
        latitude: 30.9010,
        longitude: 75.8573,
        soil_type: "Alluvial / Loam",
        nitrogen: 92.0,
        phosphorus: 48.0,
        potassium: 42.0,
        soil_ph: 7.1,
        irrigation_method: "Drip Irrigation",
        current_crop: "Wheat",
        crop_stage: "Vegetative"
      }));
    } else if (presetName === "mp") {
      setFormData((prev) => ({
        ...prev,
        farm_name: "Malwa Krishi Kendra",
        farmer_name: "Rajesh Patidar",
        location_name: "Indore, Madhya Pradesh",
        latitude: 22.7196,
        longitude: 75.8577,
        soil_type: "Clay / Black Cotton",
        nitrogen: 45.0,
        phosphorus: 65.0,
        potassium: 55.0,
        soil_ph: 7.6,
        irrigation_method: "Sprinkler",
        current_crop: "Soybean",
        crop_stage: "Flowering / Heading"
      }));
    } else if (presetName === "mh") {
      setFormData((prev) => ({
        ...prev,
        farm_name: "Godavari Valley Farm",
        farmer_name: "Sunil Deshmukh",
        location_name: "Nashik, Maharashtra",
        latitude: 19.9975,
        longitude: 73.7898,
        soil_type: "Clay / Black Cotton",
        nitrogen: 110.0,
        phosphorus: 55.0,
        potassium: 60.0,
        soil_ph: 7.2,
        irrigation_method: "Drip Irrigation",
        current_crop: "Cotton",
        crop_stage: "Vegetative"
      }));
    } else if (presetName === "up") {
      setFormData((prev) => ({
        ...prev,
        farm_name: "Ganga Terai Organic Farm",
        farmer_name: "Rameshwar Yadav",
        location_name: "Varanasi, Uttar Pradesh",
        latitude: 25.3176,
        longitude: 82.9739,
        soil_type: "Alluvial / Loam",
        nitrogen: 78.0,
        phosphorus: 42.0,
        potassium: 35.0,
        soil_ph: 6.9,
        irrigation_method: "Furrow / Ridge",
        current_crop: "Mustard",
        crop_stage: "Initial / Sowing"
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["area_acres", "nitrogen", "phosphorus", "potassium", "soil_ph", "latitude", "longitude"].includes(name)
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateFarm(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error("Failed to save farm details:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Compute live fertility index based on NPK and pH
  const nScore = Math.min(100, (formData.nitrogen / 100) * 100);
  const pScore = Math.min(100, (formData.phosphorus / 50) * 100);
  const kScore = Math.min(100, (formData.potassium / 50) * 100);
  const soilHealthIndex = Math.round((nScore * 0.35 + pScore * 0.35 + kScore * 0.3));

  return (
    <div className="space-y-6">
      {/* Header with Agro-Climatic Presets (Leaf Neon Card) */}
      <div className="card card-leaf p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-[var(--c-leaf-neon)] border border-emerald-400/30">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 font-display">
                {isHindi ? "खेत ज्ञान व मृदा प्रोफ़ाइल" : (t?.myFarm?.title || "Farm Intelligence Profile")}
                <span className="badge badge-leaf text-xs font-tech">{isHindi ? "सक्रिय भूखंड" : "Active Parcel"}</span>
              </h1>
              <p className="text-xs text-emerald-200/80 mt-0.5 font-sans">
                {isHindi
                  ? "मृदा रासायनिक विशेषताएं, भू-निर्देशांक एवं कृषि आधारभूत विन्यास"
                  : "Soil chemical characteristics, geofence coordinates, and agronomic baseline configuration"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Regional Agro-Climatic Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-[var(--harvest)]" />
            {isHindi ? "क्षेत्रीय प्रीसेट" : (t?.myFarm?.presets || "Zone Presets")}:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => applyPreset("punjab")}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--surface-2)] text-white hover:bg-[var(--primary)] hover:text-white border border-[var(--border)] transition-all"
            >
              {isHindi ? "पंजाब (जलोढ़)" : "Punjab (Alluvial)"}
            </button>
            <button
              type="button"
              onClick={() => applyPreset("mp")}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--surface-2)] text-white hover:bg-[var(--primary)] hover:text-white border border-[var(--border)] transition-all"
            >
              {isHindi ? "मध्य प्रदेश (काली मिट्टी)" : "MP (Black Cotton)"}
            </button>
            <button
              type="button"
              onClick={() => applyPreset("mh")}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--surface-2)] text-white hover:bg-[var(--primary)] hover:text-white border border-[var(--border)] transition-all"
            >
              {isHindi ? "महाराष्ट्र (दक्कन)" : "Maharashtra (Deccan)"}
            </button>
            <button
              type="button"
              onClick={() => applyPreset("up")}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--surface-2)] text-white hover:bg-[var(--primary)] hover:text-white border border-[var(--border)] transition-all"
            >
              {isHindi ? "उत्तर प्रदेश (गंगा मैदान)" : "UP (Indo-Gangetic)"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Farm Configuration Form (3 Multi-Color Columns) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: General Geofence Profile (Sky Neon Card) */}
        <div className="card card-sky p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--c-sky-neon)] uppercase tracking-wider border-b border-sky-400/20 pb-3 font-tech">
            <MapPin className="w-4 h-4" />
            <span>{isHindi ? "भू-स्थानिक जोत पहचान" : "Geospatial Holding Identity"}</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-medium">
                {isHindi ? "खेत / फार्म का नाम" : (t?.myFarm?.farmName || "Holding / Farm Name")}
              </label>
              <input
                type="text"
                name="farm_name"
                value={formData.farm_name}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-2 text-white focus:outline-none focus:border-[var(--primary)] text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-medium">
                {isHindi ? "पंजीकृत किसान का नाम" : (t?.myFarm?.farmerName || "Registered Farmer Name")}
              </label>
              <input
                type="text"
                name="farmer_name"
                value={formData.farmer_name}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-2 text-white focus:outline-none focus:border-[var(--primary)] text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-medium">
                {isHindi ? "गांव / ज़िला / राज्य" : (t?.myFarm?.locationName || "Village / District / State")}
              </label>
              <input
                type="text"
                name="location_name"
                value={formData.location_name}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-2 text-white focus:outline-none focus:border-[var(--primary)] text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-medium">{isHindi ? "अक्षांश (Latitude)" : "Latitude"}</label>
                <input
                  type="number"
                  step="0.0001"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-white font-mono focus:outline-none focus:border-[var(--primary)] text-xs"
                />
              </div>
              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-medium">{isHindi ? "देशांतर (Longitude)" : "Longitude"}</label>
                <input
                  type="number"
                  step="0.0001"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-white font-mono focus:outline-none focus:border-[var(--primary)] text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-medium">
                {isHindi ? "कुल कृषि योग्य क्षेत्र (एकड़)" : (t?.myFarm?.areaAcres || "Total Cultivated Area (Acres)")}
              </label>
              <input
                type="number"
                step="0.1"
                name="area_acres"
                value={formData.area_acres}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-2 text-white font-mono focus:outline-none focus:border-[var(--primary)] text-xs"
                required
              />
            </div>
          </div>
        </div>

        {/* Center Column: Soil Chemistry & Testing Parameters (Gold Neon Card) */}
        <div className="card card-gold p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-amber-400/20 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--c-gold-neon)] uppercase tracking-wider font-tech">
              <Layers className="w-4 h-4" />
              <span>{isHindi ? "मृदा रसायन एवं पोषक तत्व" : "Soil Chemistry & Nutrients"}</span>
            </div>
            <span className="badge badge-gold text-[10px] font-tech">{isHindi ? "ICAR संरेखित" : "ICAR Aligned"}</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-medium">
                {isHindi ? "मृदा वर्गीकरण" : (t?.myFarm?.soilType || "Soil Classification")}
              </label>
              <select
                name="soil_type"
                value={formData.soil_type}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-2 text-white focus:outline-none focus:border-[var(--primary)] text-xs"
              >
                <option value="Alluvial / Loam">{isHindi ? "जलोढ़ / दोमट मिट्टी (सिंधु-गंगा मैदान)" : "Alluvial / Loam (Indo-Gangetic)"}</option>
                <option value="Clay / Black Cotton">{isHindi ? "काली कपास मिट्टी (रेगुर)" : "Clay / Black Cotton (Vertisols)"}</option>
                <option value="Sandy Loam">{isHindi ? "बलुई दोमट मिट्टी (शुष्क क्षेत्र)" : "Sandy Loam (Arid / Semi-Arid)"}</option>
                <option value="Red Soil">{isHindi ? "लाल मिट्टी (प्रायद्वीपीय)" : "Red Soil (Peninsular)"}</option>
                <option value="Saline / Alkaline">{isHindi ? "लवणीय / क्षारीय मिट्टी" : "Saline / Alkaline"}</option>
              </select>
            </div>

            {/* Nitrogen Slider */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span className="text-[var(--text-secondary)]">{isHindi ? "उपलब्ध नाइट्रोजन (N)" : "Available Nitrogen (N)"}</span>
                <span className="font-bold text-[var(--leaf)]">{num(formData.nitrogen)} {isHindi ? "किग्रा/हे." : "kg/ha"}</span>
              </div>
              <input
                type="range"
                min="0"
                max="140"
                name="nitrogen"
                value={formData.nitrogen}
                onChange={handleInputChange}
                className="w-full accent-[var(--primary)]"
              />
            </div>

            {/* Phosphorus Slider */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span className="text-[var(--text-secondary)]">{isHindi ? "उपलब्ध फास्फोरस (P)" : "Available Phosphorus (P)"}</span>
                <span className="font-bold text-[var(--sky)]">{num(formData.phosphorus)} {isHindi ? "किग्रा/हे." : "kg/ha"}</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                name="phosphorus"
                value={formData.phosphorus}
                onChange={handleInputChange}
                className="w-full accent-[var(--sky)]"
              />
            </div>

            {/* Potassium Slider */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span className="text-[var(--text-secondary)]">{isHindi ? "उपलब्ध पोटाश (K)" : "Available Potassium (K)"}</span>
                <span className="font-bold text-[var(--harvest)]">{num(formData.potassium)} {isHindi ? "किग्रा/हे." : "kg/ha"}</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                name="potassium"
                value={formData.potassium}
                onChange={handleInputChange}
                className="w-full accent-[var(--harvest)]"
              />
            </div>

            {/* Soil pH */}
            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-[var(--text-secondary)]">{isHindi ? "मृदा pH मान" : "Soil pH Level"}</span>
                <span className="font-bold text-white">{num(formData.soil_ph)}</span>
              </div>
              <input
                type="number"
                step="0.1"
                min="4.0"
                max="9.5"
                name="soil_ph"
                value={formData.soil_ph}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-white font-mono focus:outline-none focus:border-[var(--primary)] text-xs"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Crop Stand & Infrastructure (Deep Indigo Card) */}
        <div className="card card-indigo p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--c-indigo-neon)] uppercase tracking-wider border-b border-indigo-400/20 pb-3 font-tech">
              <Droplets className="w-4 h-4" />
              <span>{isHindi ? "कृषि अवसंरचना एवं फसल स्थिति" : "Agronomic Infrastructure"}</span>
            </div>

            <div className="space-y-3.5 mt-3 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-medium">
                  {isHindi ? "वर्तमान खड़ी फसल" : (t?.myFarm?.currentCrop || "Standing Crop Cultivar")}
                </label>
                <select
                  name="current_crop"
                  value={formData.current_crop}
                  onChange={handleInputChange}
                  className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-2 text-white focus:outline-none focus:border-[var(--primary)] text-xs"
                >
                  <option value="Wheat">{isHindi ? "गेहूं (Wheat)" : "Wheat (गेहूं)"}</option>
                  <option value="Rice (Paddy)">{isHindi ? "धान / चावल (Rice)" : "Rice / Paddy (धान)"}</option>
                  <option value="Maize">{isHindi ? "मक्का (Maize)" : "Maize (मक्का)"}</option>
                  <option value="Cotton">{isHindi ? "कपास (Cotton)" : "Cotton (कपास)"}</option>
                  <option value="Chickpea (Gram)">{isHindi ? "चना (Gram)" : "Chickpea / Gram (चना)"}</option>
                  <option value="Mustard">{isHindi ? "सरसों (Mustard)" : "Mustard (सरसों)"}</option>
                  <option value="Sugarcane">{isHindi ? "गन्ना (Sugarcane)" : "Sugarcane (गन्ना)"}</option>
                  <option value="Soybean">{isHindi ? "सोयाबीन (Soybean)" : "Soybean (सोयाबीन)"}</option>
                  <option value="Lentil (Masoor)">{isHindi ? "मसूर (Masoor)" : "Lentil / Masoor (मसूर)"}</option>
                  <option value="Potato">{isHindi ? "आलू (Potato)" : "Potato (आलू)"}</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-medium">
                  {isHindi ? "फसल वृद्धि अवस्था" : (t?.myFarm?.cropStage || "Phenological Growth Stage")}
                </label>
                <select
                  name="crop_stage"
                  value={formData.crop_stage}
                  onChange={handleInputChange}
                  className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-2 text-white focus:outline-none focus:border-[var(--primary)] text-xs"
                >
                  <option value="Initial / Sowing">{isHindi ? "प्रारंभिक / बुवाई अवस्था" : "Initial / Sowing (बुवाई)"}</option>
                  <option value="Vegetative">{isHindi ? "वानस्पतिक वृद्धि / कल्ले फूटना" : "Vegetative (वनस्पतिक वृद्धि)"}</option>
                  <option value="Flowering / Heading">{isHindi ? "फूल आना / बाली निकलना" : "Flowering / Heading (फूल / बाली आना)"}</option>
                  <option value="Yield Formation / Grain Filling">{isHindi ? "दाना भरना / दुग्ध अवस्था" : "Yield Formation / Grain Filling (दाना भरना)"}</option>
                  <option value="Ripening / Maturity">{isHindi ? "पकाव / कटाई अवस्था" : "Ripening / Maturity (पकाव अवस्था)"}</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-medium">
                  {isHindi ? "सिंचाई की प्राथमिक विधि" : (t?.myFarm?.irrigationMethod || "Primary Irrigation Methodology")}
                </label>
                <select
                  name="irrigation_method"
                  value={formData.irrigation_method}
                  onChange={handleInputChange}
                  className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-2 text-white focus:outline-none focus:border-[var(--primary)] text-xs"
                >
                  <option value="Drip Irrigation">{isHindi ? "ड्रिप / टपक सिंचाई (९०–९५% जल दक्षता)" : "Drip Micro-Emitter (90-95% efficiency)"}</option>
                  <option value="Sprinkler">{isHindi ? "फव्वारा / स्प्रिंकलर (७५–८०% जल दक्षता)" : "Overhead Sprinkler (75-80% efficiency)"}</option>
                  <option value="Furrow / Ridge">{isHindi ? "नाली / मेड़ विधि (६०–७०% जल दक्षता)" : "Furrow / Ridge (60-70% efficiency)"}</option>
                  <option value="Flood / Basin">{isHindi ? "पारंपरिक बहाव / थाला विधि (५०% जल दक्षता)" : "Traditional Flood / Basin (50% efficiency)"}</option>
                </select>
              </div>

              {/* Dynamic Soil Health Synthesis Score */}
              <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase">{isHindi ? "आकलित मृदा स्वास्थ्य" : "Calculated Soil Health"}</span>
                  <span className="text-sm font-bold font-mono text-[var(--leaf)]">{num(soilHealthIndex)} / {num(100)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--surface)] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--leaf)] rounded-full transition-all duration-500"
                    style={{ width: `${soilHealthIndex}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border)] space-y-3">
            {savedSuccess && (
              <div className="p-3 rounded-xl bg-[var(--primary)]/20 border border-[var(--primary)] text-xs text-[var(--leaf)] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{isHindi ? "खेत विवरण डेटाबेस में सफलतापूर्वक सुरक्षित कर लिया गया!" : "Farm holding parameters updated successfully in database!"}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary w-full justify-center text-xs py-2.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? (isHindi ? "सहेज रहे हैं..." : (t?.myFarm?.saving || "Committing...")) : (isHindi ? "फार्म प्रोफ़ाइल सहेजें" : (t?.myFarm?.saveChanges || "Save Holding Profile"))}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
