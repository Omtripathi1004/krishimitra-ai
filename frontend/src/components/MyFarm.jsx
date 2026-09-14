import React, { useState, useEffect } from "react";
import {
  Sprout,
  MapPin,
  Layers,
  Droplets,
  Save,
  CheckCircle2,
  Sparkles,
  Compass
} from "lucide-react";

export default function MyFarm({ farm, onUpdateFarm, t }) {
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
        farm_name: farm.farm_name || "Kisan Kalyan Demo Farm",
        farmer_name: farm.farmer_name || "Sardar Gurpreet Singh",
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
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save farm details:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Quick Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-[var(--border-cyan)]">
        <div>
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-[var(--color-harvest)]" />
            <h1 className="text-2xl font-heading font-extrabold text-[var(--text-primary)]">{t.myFarm.title}</h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{t.myFarm.subtitle}</p>
        </div>

        {/* Quick Agro-Climatic Presets */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="text-[10px] font-heading font-bold text-[var(--color-harvest)] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            {t.myFarm.presets}:
          </span>
          <div className="flex flex-wrap gap-1.5 font-mono">
            <button
              type="button"
              onClick={() => applyPreset("punjab")}
              className="badge badge-amber cursor-pointer hover:brightness-125 transition-all"
            >
              Punjab
            </button>
            <button
              type="button"
              onClick={() => applyPreset("mp")}
              className="badge badge-sky cursor-pointer hover:brightness-125 transition-all"
            >
              Madhya Pradesh
            </button>
            <button
              type="button"
              onClick={() => applyPreset("mh")}
              className="badge badge-orange cursor-pointer hover:brightness-125 transition-all"
            >
              Maharashtra
            </button>
            <button
              type="button"
              onClick={() => applyPreset("up")}
              className="badge badge-emerald cursor-pointer hover:brightness-125 transition-all"
            >
              Uttar Pradesh
            </button>
          </div>
        </div>
      </div>

      {/* Main Farm Setup Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: General Profile */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-[var(--color-rain-glow)] font-heading font-bold text-xs border-b border-[var(--border-subtle)] pb-3 uppercase tracking-wider">
            <MapPin className="h-4 w-4" />
            <span>General Farm Profile</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-sans font-medium">{t.myFarm.farmName}</label>
              <input
                type="text"
                name="farm_name"
                value={formData.farm_name}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-[#183A2D] border border-[var(--border-subtle)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-rain-glow)]"
                required
              />
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-sans font-medium">{t.myFarm.farmerName}</label>
              <input
                type="text"
                name="farmer_name"
                value={formData.farmer_name}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-[#183A2D] border border-[var(--border-subtle)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-rain-glow)]"
                required
              />
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-sans font-medium">{t.myFarm.locationName}</label>
              <input
                type="text"
                name="location_name"
                value={formData.location_name}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-[#183A2D] border border-[var(--border-subtle)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-rain-glow)]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-sans font-medium">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className="w-full rounded-lg bg-[#183A2D] border border-[var(--border-subtle)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-rain-glow)]"
                />
              </div>
              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-sans font-medium">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  className="w-full rounded-lg bg-[#183A2D] border border-[var(--border-subtle)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-rain-glow)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-sans font-medium">{t.myFarm.areaAcres}</label>
              <input
                type="number"
                step="0.1"
                name="area_acres"
                value={formData.area_acres}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-[#183A2D] border border-[var(--border-subtle)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-rain-glow)]"
                required
              />
            </div>
          </div>
        </div>

        {/* Center: Soil Parameters */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-[var(--color-harvest)] font-heading font-bold text-xs border-b border-[var(--border-subtle)] pb-3 uppercase tracking-wider">
            <Layers className="h-4 w-4" />
            <span>Soil Fertility Metrics</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-sans font-medium">{t.myFarm.soilType}</label>
              <select
                name="soil_type"
                value={formData.soil_type}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-[#183A2D] border border-[var(--border-subtle)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-rain-glow)]"
              >
                <option value="Alluvial / Loam">Alluvial / Loam</option>
                <option value="Clay / Black Cotton">Clay / Black Cotton (Vertisols)</option>
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Red Soil">Red Soil</option>
                <option value="Saline / Alkaline">Saline / Alkaline</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[var(--text-secondary)] mb-1 font-semibold">
                <span>{t.myFarm.nitrogen}</span>
                <span className="text-[var(--color-harvest)]">{formData.nitrogen}</span>
              </div>
              <input
                type="range"
                min="0"
                max="140"
                name="nitrogen"
                value={formData.nitrogen}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-[var(--text-secondary)] mb-1 font-semibold">
                <span>{t.myFarm.phosphorus}</span>
                <span className="text-[var(--color-rain-glow)]">{formData.phosphorus}</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                name="phosphorus"
                value={formData.phosphorus}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-[var(--text-secondary)] mb-1 font-semibold">
                <span>{t.myFarm.potassium}</span>
                <span className="text-[var(--color-soil)]">{formData.potassium}</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                name="potassium"
                value={formData.potassium}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-[var(--text-secondary)] mb-1 font-semibold">
                <span>{t.myFarm.soilPh}</span>
                <span className="text-[#6EE7B7]">{formData.soil_ph}</span>
              </div>
              <input
                type="number"
                step="0.1"
                min="4.0"
                max="9.5"
                name="soil_ph"
                value={formData.soil_ph}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-[#183A2D] border border-[var(--border-subtle)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-rain-glow)]"
              />
            </div>
          </div>
        </div>

        {/* Right: Active Crop & Irrigation */}
        <div className="glass-card p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#C4B5FD] font-heading font-bold text-xs border-b border-[var(--border-subtle)] pb-3 uppercase tracking-wider">
              <Droplets className="h-4 w-4" />
              <span>Crop & Irrigation Infrastructure</span>
            </div>

            <div className="space-y-3 text-xs mt-3 font-mono">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-sans font-medium">{t.myFarm.currentCrop}</label>
                <select
                  name="current_crop"
                  value={formData.current_crop}
                  onChange={handleInputChange}
                  className="w-full rounded-lg bg-[#183A2D] border border-[var(--border-subtle)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-rain-glow)]"
                >
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Rice (Paddy)">Rice / Paddy (धान)</option>
                  <option value="Maize">Maize (मक्का)</option>
                  <option value="Cotton">Cotton (कपास)</option>
                  <option value="Chickpea (Gram)">Chickpea / Gram (चना)</option>
                  <option value="Mustard">Mustard (सरसों)</option>
                  <option value="Sugarcane">Sugarcane (गन्ना)</option>
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Lentil (Masoor)">Lentil / Masoor (मसूर)</option>
                  <option value="Potato">Potato (आलू)</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-sans font-medium">{t.myFarm.cropStage}</label>
                <select
                  name="crop_stage"
                  value={formData.crop_stage}
                  onChange={handleInputChange}
                  className="w-full rounded-lg bg-[#183A2D] border border-[var(--border-subtle)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-rain-glow)]"
                >
                  <option value="Initial / Sowing">Initial / Sowing (बुवाई)</option>
                  <option value="Vegetative">Vegetative (वनस्पतिक वृद्धि)</option>
                  <option value="Flowering / Heading">Flowering / Heading (फूल / बाली आना)</option>
                  <option value="Yield Formation / Grain Filling">Yield Formation / Grain Filling (दाना भरना)</option>
                  <option value="Ripening / Maturity">Ripening / Maturity (पकाव अवस्था)</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-sans font-medium">{t.myFarm.irrigationMethod}</label>
                <select
                  name="irrigation_method"
                  value={formData.irrigation_method}
                  onChange={handleInputChange}
                  className="w-full rounded-lg bg-[#183A2D] border border-[var(--border-subtle)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-rain-glow)]"
                >
                  <option value="Drip Irrigation">Drip Irrigation (90-95% efficiency)</option>
                  <option value="Sprinkler">Sprinkler Irrigation (75-80% efficiency)</option>
                  <option value="Furrow / Ridge">Furrow / Ridge (60-70% efficiency)</option>
                  <option value="Flood / Basin">Flood / Basin (50-60% efficiency)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)]">
            {savedSuccess && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-[#183A2D] p-2.5 text-xs text-[var(--color-rain-glow)] border border-[var(--border-cyan)]">
                <CheckCircle2 className="h-4 w-4" />
                <span>Farm profile successfully updated in database!</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary w-full justify-center py-2.5 text-xs"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? t.myFarm.saving : t.myFarm.saveChanges}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
