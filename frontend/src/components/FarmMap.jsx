import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Navigation as CompassIcon,
  Layers,
  CheckCircle2,
  AlertCircle,
  Eye,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Sprout,
  Droplets,
  CloudRain,
  Activity,
  Sun,
  Crosshair,
  Search,
  Sparkles
} from "lucide-react";
import { INDIA_STATES_DATA, findNearestIndianDistrict } from "../data/indiaLocations";
import { toHindiDigits, localizeTerm } from "../translations";

export default function FarmMap({ farm, onUpdateCoordinates, t, language, isHindi: propIsHindi }) {
  const isHindi = propIsHindi || language === "hi" || Boolean(t?.liveTelemetry?.includes("सजीव"));
  const num = (v) => (isHindi ? toHindiDigits(v) : String(v));

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const layersRef = useRef({});
  const polygonRef = useRef(null);
  const zonesRef = useRef([]);

  const [coords, setCoords] = useState({
    lat: farm?.latitude || 30.9010,
    lon: farm?.longitude || 75.8573
  });

  // State & District Selection Dropdowns
  const [selectedState, setSelectedState] = useState(() => {
    const loc = farm?.location_name || "";
    const matchedState = INDIA_STATES_DATA.find((s) => loc.includes(s.state));
    return matchedState ? matchedState.state : "Punjab";
  });

  const currentDistricts =
    INDIA_STATES_DATA.find((s) => s.state === selectedState)?.districts || [];

  const [selectedDistrict, setSelectedDistrict] = useState(() => {
    const loc = farm?.location_name || "";
    const matchedDistrict = currentDistricts.find((d) => loc.includes(d.name));
    return matchedDistrict ? matchedDistrict.name : currentDistricts[0]?.name || "Ludhiana";
  });

  const [activeBaseLayer, setActiveBaseLayer] = useState("satellite");
  const [showBoundary, setShowBoundary] = useState(true);
  const [showNdvi, setShowNdvi] = useState(true);
  const [showSoilOverlay, setShowSoilOverlay] = useState(false);
  const [showRainOverlay, setShowRainOverlay] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("");
  const [zoomLevel, setZoomLevel] = useState(14);

  // Sync coords when farm prop changes from outside
  useEffect(() => {
    if (farm?.latitude && farm?.longitude) {
      if (
        Math.abs(farm.latitude - coords.lat) > 0.0001 ||
        Math.abs(farm.longitude - coords.lon) > 0.0001
      ) {
        setCoords({ lat: farm.latitude, lon: farm.longitude });
      }
    }
  }, [farm?.latitude, farm?.longitude]);

  // Update district when state changes
  const handleStateChange = (newState) => {
    setSelectedState(newState);
    const stateObj = INDIA_STATES_DATA.find((s) => s.state === newState);
    if (stateObj && stateObj.districts.length > 0) {
      const firstDistrict = stateObj.districts[0];
      setSelectedDistrict(firstDistrict.name);
      handleSelectLocation(firstDistrict.lat, firstDistrict.lon, `${firstDistrict.name}, ${newState}, India`, firstDistrict.soil);
    }
  };

  // Update when district dropdown changes
  const handleDistrictChange = (newDistrictName) => {
    setSelectedDistrict(newDistrictName);
    const districtObj = currentDistricts.find((d) => d.name === newDistrictName);
    if (districtObj) {
      handleSelectLocation(districtObj.lat, districtObj.lon, `${districtObj.name}, ${selectedState}, India`, districtObj.soil);
    }
  };

  // Central location updater
  const handleSelectLocation = (newLat, newLon, locName, soilType) => {
    setCoords({ lat: newLat, lon: newLon });
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([newLat, newLon], 14, { duration: 1.2 });
      if (markerRef.current) {
        markerRef.current.setLatLng([newLat, newLon]);
      }
    }
    if (onUpdateCoordinates) {
      onUpdateCoordinates(newLat, newLon, locName, soilType);
    }
  };

  // Re-center on Current Pointer
  const handleCenterPointer = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([coords.lat, coords.lon], 15, { duration: 1.0 });
    }
  };

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [coords.lat, coords.lon],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Base Layers
      const satellite = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19 }
      );
      const topo = L.tileLayer(
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        { maxZoom: 17 }
      );
      const osm = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { maxZoom: 19 }
      );

      satellite.addTo(map);
      layersRef.current = { satellite, topo, osm };

      // Custom pulsing emerald farmer marker
      const pinHtml = `
        <div style="position:relative; width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; width:36px; height:36px; border-radius:50%; background:rgba(34,197,94,0.35); animation: ping 1.8s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="position:relative; width:22px; height:22px; border-radius:50%; background:#22C55E; border:3px solid #FFFFFF; box-shadow:0 0 12px rgba(34,197,94,0.8); display:flex; align-items:center; justify-content:center;">
            <div style="width:6px; height:6px; border-radius:50%; background:#FFFFFF;"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: "custom-farm-pin",
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([coords.lat, coords.lon], {
        icon: customIcon,
        draggable: true
      }).addTo(map);

      marker.on("dragend", (e) => {
        const p = e.target.getLatLng();
        setCoords({ lat: p.lat, lon: p.lng });
        if (onUpdateCoordinates) {
          onUpdateCoordinates(p.lat, p.lng, `GPS Pin (${p.lat.toFixed(4)}, ${p.lng.toFixed(4)})`, farm?.soil_type);
        }
      });

      markerRef.current = marker;

      // Click to place marker
      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        setCoords({ lat, lon: lng });
        marker.setLatLng([lat, lng]);
        if (onUpdateCoordinates) {
          onUpdateCoordinates(lat, lng, `Field Coord (${lat.toFixed(4)}, ${lng.toFixed(4)})`, farm?.soil_type);
        }
      });

      map.on("zoomend", () => {
        setZoomLevel(map.getZoom());
      });

      mapInstanceRef.current = map;
    }

    return () => {
      // Keep instance intact across renders
    };
  }, []);

  // Update Base Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !layersRef.current.satellite) return;
    const map = mapInstanceRef.current;
    Object.values(layersRef.current).forEach((l) => map.removeLayer(l));
    if (layersRef.current[activeBaseLayer]) {
      layersRef.current[activeBaseLayer].addTo(map);
    }
  }, [activeBaseLayer]);

  // Update Farm Boundary Polygon & NDVI Zones around marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (polygonRef.current) {
      map.removeLayer(polygonRef.current);
      polygonRef.current = null;
    }
    zonesRef.current.forEach((z) => map.removeLayer(z));
    zonesRef.current = [];

    const d = 0.0035; // ~350-400m field parcel
    const lat = coords.lat;
    const lon = coords.lon;

    if (showBoundary) {
      const boundaryCoords = [
        [lat + d * 0.9, lon - d * 0.8],
        [lat + d * 1.1, lon + d * 0.7],
        [lat - d * 0.8, lon + d * 1.0],
        [lat - d * 1.0, lon - d * 0.6]
      ];

      const poly = L.polygon(boundaryCoords, {
        color: "#22C55E",
        weight: 2.5,
        fillColor: "#22C55E",
        fillOpacity: showNdvi ? 0.15 : 0.05,
        dashArray: "6, 6"
      }).addTo(map);

      polygonRef.current = poly;

      // Simulated NDVI sub-zones
      if (showNdvi) {
        const zoneA = L.polygon([
          [lat + d * 0.9, lon - d * 0.8],
          [lat + d * 1.1, lon + d * 0.7],
          [lat + d * 0.1, lon + d * 0.6],
          [lat + d * 0.1, lon - d * 0.7]
        ], {
          color: "#16a34a",
          weight: 0,
          fillColor: "#16a34a",
          fillOpacity: 0.35
        }).addTo(map).bindTooltip(isHindi ? "ज़ोन १: NDVI ०.८१ (सघन हरापन)" : "Zone 1: NDVI 0.81 (Vigorous Canopy)");

        const zoneB = L.polygon([
          [lat + d * 0.1, lon - d * 0.7],
          [lat + d * 0.1, lon + d * 0.6],
          [lat - d * 1.0, lon + d * 0.2],
          [lat - d * 1.0, lon - d * 0.6]
        ], {
          color: "#84cc16",
          weight: 0,
          fillColor: "#84cc16",
          fillOpacity: 0.30
        }).addTo(map).bindTooltip(isHindi ? "ज़ोन २: NDVI ०.६८ (सामान्य वानस्पतिक)" : "Zone 2: NDVI 0.68 (Normal Vegetative)");

        zonesRef.current.push(zoneA, zoneB);
      }
    }
  }, [coords, showBoundary, showNdvi, isHindi]);

  // Improved Live GPS Detection with Nearest District Auto-Match
  const handleDetectGps = () => {
    setGpsStatus("");
    setGpsLoading(true);

    if (!navigator.geolocation) {
      setGpsStatus(isHindi ? "ब्राउज़र में GPS की सुविधा उपलब्ध नहीं है।" : "Geolocation is not supported by your browser.");
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = pos.coords.latitude;
        const newLon = pos.coords.longitude;
        const nearest = findNearestIndianDistrict(newLat, newLon);

        setCoords({ lat: newLat, lon: newLon });
        setSelectedState(nearest.state);
        setSelectedDistrict(nearest.name);

        const resolvedName = `${nearest.name}, ${nearest.state}, India (GPS Fix)`;
        setGpsStatus(
          isHindi
            ? `✅ GPS स्थिति: ${localizeTerm(nearest.name, true)}, ${localizeTerm(nearest.state, true)} (~${num(nearest.distanceKm)} किमी)`
            : `✅ GPS Fix: Located near ${nearest.name}, ${nearest.state} (~${nearest.distanceKm} km)`
        );

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([newLat, newLon], 15, { duration: 1.5 });
          if (markerRef.current) {
            markerRef.current.setLatLng([newLat, newLon]);
          }
        }

        if (onUpdateCoordinates) {
          onUpdateCoordinates(newLat, newLon, resolvedName, nearest.soil);
        }
        setGpsLoading(false);
      },
      (err) => {
        console.warn("GPS Geolocation error:", err);
        const currentDistObj = currentDistricts.find((d) => d.name === selectedDistrict);
        if (currentDistObj) {
          setGpsStatus(
            isHindi
              ? `⚠️ GPS अनुमति अस्वीकृत। चयनित जिला: ${localizeTerm(currentDistObj.name, true)}, ${localizeTerm(selectedState, true)} उपयोग हो रहा है।`
              : `⚠️ Browser GPS permission denied. Using selected district: ${currentDistObj.name}, ${selectedState}.`
          );
          handleSelectLocation(currentDistObj.lat, currentDistObj.lon, `${currentDistObj.name}, ${selectedState}, India`, currentDistObj.soil);
        } else {
          setGpsStatus(isHindi ? "⚠️ स्थान अनुमति अनुपलब्ध। कृपया नीचे राज्य व जिला चुनें।" : "⚠️ Location permission denied or unavailable. Please select your State & District below.");
        }
        setGpsLoading(false);
      },
      { timeout: 9000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-5">
      {/* Geospatial Map Header */}
      <div className="card card-sky p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/15 text-[var(--c-sky-neon)] border border-sky-400/30 shadow-sm">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 font-display flex-wrap">
                {isHindi ? "कृषि भू-स्थानिक एवं भूमि मानचित्रण कमान" : (t?.farmMap?.title || "Agricultural Geospatial Command")}
                <span className="badge badge-sky text-xs font-tech">
                  {isHindi ? "सेंटिनल-२ उपग्रह तैयार" : "Sentinel-2 Ready"}
                </span>
              </h1>
              <p className="text-xs text-sky-200/80 mt-0.5 font-sans">
                {isHindi
                  ? "मल्टी-स्पेक्ट्रल उपग्रह डेटा, खेत सीमा बाड़बंदी और सटीक पिन ट्रैकिंग"
                  : "Multi-spectral parcel intelligence, boundary geofencing, and precision pointer tracking"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Re-center Pointer Button */}
          <button
            onClick={handleCenterPointer}
            className="btn btn-secondary text-xs"
            title={isHindi ? "नक्शे को वर्तमान पॉइंटर पर लाएं" : "Center map on Current Location Pointer"}
          >
            <Crosshair className="w-4 h-4 text-emerald-400" />
            <span>{isHindi ? "पॉइंटर केंद्रित करें" : "Center Pointer"}</span>
          </button>

          {/* Detect Live GPS Button */}
          <button
            onClick={handleDetectGps}
            disabled={gpsLoading}
            className="btn btn-primary text-xs"
          >
            <CompassIcon className={`w-4 h-4 ${gpsLoading ? "animate-spin" : ""}`} />
            {gpsLoading
              ? (isHindi ? "GPS खोजा जा रहा है..." : "Acquiring GPS...")
              : (isHindi ? "सजीव GPS पहचानें" : (t?.farmMap?.gpsButton || "Detect Live GPS"))}
          </button>
        </div>
      </div>

      {/* STATE & DISTRICT SELECTION BAR */}
      <div className="card p-4 bg-[var(--bg-card)] border border-[var(--border-1)] shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{isHindi ? "खेत स्थान चयनकर्ता (अखिल भारतीय):" : "Farm Parcel Location Selector (All India):"}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-1 max-w-2xl">
            {/* State Dropdown */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                {isHindi ? "राज्य चुनें" : "Select State"}
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-white text-xs font-bold focus:border-emerald-500 focus:outline-none"
              >
                {INDIA_STATES_DATA.map((s) => (
                  <option key={s.state} value={s.state} className="bg-slate-900 text-white">
                    {localizeTerm(s.state, isHindi)} ({num(s.districts.length)} {isHindi ? "जिले" : "Districts"})
                  </option>
                ))}
              </select>
            </div>

            {/* District Dropdown */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                {isHindi ? "जिला / कृषि-क्षेत्र चुनें" : "Select District / Agro-Zone"}
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-white text-xs font-bold focus:border-emerald-500 focus:outline-none"
              >
                {currentDistricts.map((d) => (
                  <option key={d.name} value={d.name} className="bg-slate-900 text-white">
                    {d.name} — {localizeTerm(d.crop, isHindi)} ({d.zone})
                  </option>
                ))}
              </select>
            </div>

            {/* Active Pointer Badge */}
            <div className="hidden sm:flex flex-col justify-end">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                {isHindi ? "सक्रिय पिन निर्देशांक" : "Active Pointer Pin"}
              </span>
              <div className="px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{num(coords.lat.toFixed(4))}°N, {num(coords.lon.toFixed(4))}°E</span>
              </div>
            </div>
          </div>
        </div>

        {gpsStatus && (
          <div className="mt-3 p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{gpsStatus}</span>
          </div>
        )}
      </div>

      {/* Main Map Frame */}
      <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface-2)] shadow-2xl">
        {/* Floating Top Control Bar */}
        <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Base Layer Switcher */}
          <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-xl bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] shadow-lg">
            <button
              onClick={() => setActiveBaseLayer("satellite")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeBaseLayer === "satellite"
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-white"
              }`}
            >
              {isHindi ? "उपग्रह चित्र" : "Satellite Imagery"}
            </button>
            <button
              onClick={() => setActiveBaseLayer("topo")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeBaseLayer === "topo"
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-white"
              }`}
            >
              {isHindi ? "स्थलाकृति" : "Topography"}
            </button>
            <button
              onClick={() => setActiveBaseLayer("osm")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeBaseLayer === "osm"
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-white"
              }`}
            >
              {isHindi ? "सड़क नक्शा" : "Road Map"}
            </button>
          </div>

          {/* Overlays Toggle Strip */}
          <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] shadow-lg text-xs">
            <button
              onClick={() => setShowBoundary(!showBoundary)}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                showBoundary
                  ? "bg-[var(--primary)]/20 text-[var(--leaf)] border border-[var(--primary)]/40"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              {isHindi ? "खेत सीमा" : "Boundary"}
            </button>

            <button
              onClick={() => setShowNdvi(!showNdvi)}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                showNdvi
                  ? "bg-[var(--primary)]/20 text-[var(--leaf)] border border-[var(--primary)]/40"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              {isHindi ? "NDVI हरापन" : "NDVI Vigour"}
            </button>

            <button
              onClick={() => setShowSoilOverlay(!showSoilOverlay)}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                showSoilOverlay
                  ? "bg-[var(--sky)]/20 text-[var(--sky)] border border-[var(--sky)]/40"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              {isHindi ? "मृदा नमी" : "Soil Moisture"}
            </button>

            <button
              onClick={() => setShowRainOverlay(!showRainOverlay)}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                showRainOverlay
                  ? "bg-[var(--warning)]/20 text-[var(--warning)] border border-[var(--warning)]/40"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              {isHindi ? "वर्षा रडार" : "Rain Radar"}
            </button>
          </div>
        </div>

        {/* The Leaflet Map Canvas */}
        <div ref={mapContainerRef} className="h-[520px] w-full" />

        {/* Floating Bottom Left: Current Pointer Precision HUD */}
        <div className="absolute bottom-3 left-3 z-[1000] p-3.5 rounded-xl bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] shadow-xl text-xs font-mono max-w-sm">
          <div className="flex items-center justify-between text-[11px] text-[var(--leaf)] font-bold mb-1.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{isHindi ? "सक्रिय पॉइंटर HUD" : "CURRENT POINTER HUD"}</span>
            </span>
            <span className="text-[var(--text-muted)] font-normal">{isHindi ? "ज़ूम" : "Zoom"} {num(zoomLevel)}x</span>
          </div>

          <div className="text-white font-bold text-xs mb-1 truncate">
            📍 {farm?.location_name || `${selectedDistrict}, ${localizeTerm(selectedState, isHindi)}`}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[var(--text-secondary)]">
            <div>{isHindi ? "अक्षांश:" : "Lat:"} <span className="text-emerald-400 font-bold">{num(coords.lat.toFixed(4))}°N</span></div>
            <div>{isHindi ? "देशांतर:" : "Lon:"} <span className="text-emerald-400 font-bold">{num(coords.lon.toFixed(4))}°E</span></div>
            <div>{isHindi ? "रकबा:" : "Area:"} <span className="text-white font-bold">{num(farm?.area_acres || 5.0)} {isHindi ? "एकड़" : "Acres"}</span></div>
            <div>{isHindi ? "डेटम:" : "Datum:"} <span className="text-white font-bold">WGS {isHindi ? "८४" : "84"}</span></div>
          </div>

          <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] flex items-center justify-between">
            <span className="text-emerald-300">
              {isHindi ? "सुझाव: नक्शे पर कहीं भी क्लिक करें" : "Tip: Click map or drag pointer to move"}
            </span>
            <button
              onClick={handleCenterPointer}
              className="text-emerald-400 hover:underline font-bold"
            >
              {isHindi ? "पिन पर लाएं" : "Focus Pin"}
            </button>
          </div>
        </div>

        {/* Floating Bottom Center/Right: Map Legend */}
        {showNdvi && (
          <div className="absolute bottom-3 right-16 z-[1000] p-2.5 rounded-xl bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] shadow-xl text-[11px] hidden sm:block">
            <div className="font-bold text-white mb-1.5 flex items-center gap-1">
              <Activity className="w-3 h-3 text-[var(--leaf)]" />{" "}
              {isHindi ? "NDVI फसल स्वास्थ्य पैमाना" : "NDVI Crop Vigour Scale"}
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#16a34a]" /> {isHindi ? ">०.७ सघन हरा" : ">0.7 Dense"}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#84cc16]" /> {isHindi ? "०.५-०.७ सामान्य" : "0.5-0.7 Normal"}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#d97706]" /> {isHindi ? "<०.५ तनाव" : "<0.5 Stress"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Geospatial Insights Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card card-leaf p-4 space-y-1">
          <span className="text-xs font-bold text-[var(--c-leaf-neon)] uppercase tracking-wider font-tech">
            {isHindi ? "धरातलीय ढलान" : "Topographic Gradient"}
          </span>
          <div className="text-base font-bold text-white flex items-center justify-between font-display">
            <span>{isHindi ? "ढलान < १.५% (समतल)" : "Slope < 1.5% (Flat)"}</span>
            <span className="badge badge-leaf text-xs font-tech">
              {isHindi ? "न्यूनतम जल बहाव" : "Low Runoff"}
            </span>
          </div>
          <p className="text-[11px] text-emerald-200/80 font-sans">
            {isHindi
              ? "मृदा कटाव का न्यूनतम खतरा; आधुनिक कृषि यंत्रों एवं क्यारी बुवाई के लिए उपयुक्त।"
              : "Minimal erosion hazard; suitable for mechanized broad-furrow cultivation."}
          </p>
        </div>

        <div className="card card-sky p-4 space-y-1">
          <span className="text-xs font-bold text-[var(--c-sky-neon)] uppercase tracking-wider font-tech">
            {isHindi ? "भू-स्थानिक मृदा क्षेत्र" : "Geospatial Soil Zone"}
          </span>
          <div className="text-base font-bold text-white flex items-center justify-between font-display">
            <span>{localizeTerm(farm?.soil_type || "Alluvial / Loam", isHindi)}</span>
            <span className="badge badge-sky text-xs font-tech">
              {isHindi ? "उच्च जलधारण" : "High CEC"}
            </span>
          </div>
          <p className="text-[11px] text-sky-200/80 font-sans">
            {isHindi
              ? "उत्कृष्ट जल धारण क्षमता, मिट्टी की गहराई १८० सेमी से अधिक।"
              : "Excellent water retention with depth-to-bedrock exceeding 180 cm."}
          </p>
        </div>

        <div className="card card-indigo p-4 space-y-1">
          <span className="text-xs font-bold text-[var(--c-indigo-neon)] uppercase tracking-wider font-tech">
            {isHindi ? "फसल छतरी आवरण सूचकांक" : "Canopy Cover Index"}
          </span>
          <div className="text-base font-bold text-white flex items-center justify-between font-display">
            <span>{isHindi ? "०.७२ आंशिक आवरण" : "0.72 Fractional Cover"}</span>
            <span className="badge badge-indigo text-xs font-tech">
              {isHindi ? "स्वस्थ" : "Healthy"}
            </span>
          </div>
          <p className="text-[11px] text-indigo-200/80 font-sans">
            {isHindi
              ? "उपग्रह परावर्तन मजबूत पत्ती क्षेत्र सूचकांक (LAI ३.४) दर्शाता है।"
              : "Multi-spectral reflectance indicates robust leaf area index (LAI 3.4)."}
          </p>
        </div>
      </div>
    </div>
  );
}
