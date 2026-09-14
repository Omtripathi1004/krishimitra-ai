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

export default function FarmMap({ farm, onUpdateCoordinates, t }) {
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

  // State & District Selection Dropdowns (NovaVarsha AI Style)
  const [selectedState, setSelectedState] = useState(() => {
    // Try to guess from farm location_name
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

  const [activeBaseLayer, setActiveBaseLayer] = useState("satellite"); // "satellite" | "osm" | "topo"
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
      // 1. Create Leaflet map instance
      const map = L.map(mapContainerRef.current, {
        center: [coords.lat, coords.lon],
        zoom: 14,
        zoomControl: false
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Base layers definition
      const satellite = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Esri, Maxar, Earthstar Geographics",
          maxZoom: 18
        }
      );

      const osm = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19
        }
      );

      const topo = L.tileLayer(
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        {
          attribution: "Map data: &copy; OpenStreetMap, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)",
          maxZoom: 17
        }
      );

      layersRef.current = { satellite, osm, topo };

      if (activeBaseLayer === "satellite") satellite.addTo(map);
      else if (activeBaseLayer === "osm") osm.addTo(map);
      else topo.addTo(map);

      // High-Contrast Animated Current Location Pointer Marker
      const pointerIcon = L.divIcon({
        className: "current-location-marker",
        html: `
          <div class="current-location-radar"></div>
          <div class="current-location-radar-2"></div>
          <div class="current-location-pin" title="Current Farm Pointer (Drag to relocate)">
            <span class="current-location-icon">🌾</span>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 36],
        popupAnchor: [0, -36]
      });

      const marker = L.marker([coords.lat, coords.lon], {
        draggable: true,
        icon: pointerIcon
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 200px; padding: 6px;">
          <div style="font-weight: 800; font-size: 14px; color: #0f172a; display: flex; align-items: center; gap: 4px;">
            <span>📍 Current Farm Pointer</span>
          </div>
          <div style="font-size: 12px; color: #15803d; font-weight: 700; margin-top: 2px;">
            ${farm?.location_name || `${selectedDistrict}, ${selectedState}`}
          </div>
          <div style="margin-top: 6px; font-size: 11px; font-family: monospace; color: #475569;">
            Lat: ${coords.lat.toFixed(4)}°N • Lon: ${coords.lon.toFixed(4)}°E
          </div>
          <div style="margin-top: 4px; font-size: 11px; color: #0284c7; font-weight: 600;">
            Area: ${farm?.area_acres || 5.0} Acres • Soil: ${farm?.soil_type || "Alluvial"}
          </div>
          <div style="margin-top: 6px; font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 4px;">
            Tip: Drag pointer or click map to relocate parcel
          </div>
        </div>
      `);

      marker.on("dragend", (e) => {
        const { lat, lng } = e.target.getLatLng();
        const nearest = findNearestIndianDistrict(lat, lng);
        setCoords({ lat, lon: lng });
        setSelectedState(nearest.state);
        setSelectedDistrict(nearest.name);
        const resolvedName = `${nearest.name}, ${nearest.state}, India`;
        if (onUpdateCoordinates) {
          onUpdateCoordinates(lat, lng, resolvedName, nearest.soil);
        }
      });

      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        const nearest = findNearestIndianDistrict(lat, lng);
        setCoords({ lat, lon: lng });
        setSelectedState(nearest.state);
        setSelectedDistrict(nearest.name);
        const resolvedName = `${nearest.name}, ${nearest.state}, India`;
        if (onUpdateCoordinates) {
          onUpdateCoordinates(lat, lng, resolvedName, nearest.soil);
        }
      });

      map.on("zoomend", () => {
        setZoomLevel(map.getZoom());
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    } else {
      mapInstanceRef.current.setView([coords.lat, coords.lon]);
      if (markerRef.current) {
        markerRef.current.setLatLng([coords.lat, coords.lon]);
      }
    }

    updateMapPolygons(coords.lat, coords.lon);
  }, [coords.lat, coords.lon]);

  // Handle Base Layer Switching
  useEffect(() => {
    if (!mapInstanceRef.current || !layersRef.current.satellite) return;
    const map = mapInstanceRef.current;
    const { satellite, osm, topo } = layersRef.current;

    [satellite, osm, topo].forEach((l) => {
      if (map.hasLayer(l)) map.removeLayer(l);
    });

    if (activeBaseLayer === "satellite") satellite.addTo(map);
    else if (activeBaseLayer === "osm") osm.addTo(map);
    else if (activeBaseLayer === "topo") topo.addTo(map);
  }, [activeBaseLayer]);

  // Handle Polygon & Overlay Visibility
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    updateMapPolygons(coords.lat, coords.lon);
  }, [showBoundary, showNdvi, showSoilOverlay, showRainOverlay]);

  const updateMapPolygons = (centerLat, centerLon) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (polygonRef.current) {
      map.removeLayer(polygonRef.current);
      polygonRef.current = null;
    }
    zonesRef.current.forEach((z) => map.removeLayer(z));
    zonesRef.current = [];

    const dLat = 0.0022;
    const dLon = 0.0028;

    const farmBoundaryCoords = [
      [centerLat + dLat, centerLon - dLon],
      [centerLat + dLat * 1.05, centerLon + dLon * 0.9],
      [centerLat - dLat * 0.9, centerLon + dLon * 1.05],
      [centerLat - dLat * 1.05, centerLon - dLon * 0.85]
    ];

    // 1. Boundary Polygon
    if (showBoundary) {
      const boundaryPolygon = L.polygon(farmBoundaryCoords, {
        color: "#22c55e",
        weight: 3,
        dashArray: "6, 6",
        fillColor: "transparent",
        opacity: 0.9
      }).addTo(map);

      boundaryPolygon.bindTooltip(
        `<strong>${farm?.farm_name || "Farm Parcel"}</strong><br/>Geofenced Area: ${farm?.area_acres || 5.0} Acres`,
        { sticky: true }
      );
      polygonRef.current = boundaryPolygon;
    }

    // 2. NDVI Crop Health Zones
    if (showNdvi) {
      const q1 = L.polygon(
        [
          [centerLat + dLat * 0.95, centerLon - dLon * 0.9],
          [centerLat + dLat, centerLon],
          [centerLat, centerLon],
          [centerLat, centerLon - dLon * 0.9]
        ],
        { color: "#16a34a", fillColor: "#22c55e", fillOpacity: 0.45, weight: 1 }
      ).addTo(map);
      q1.bindTooltip("Zone A: High Vigour (NDVI: 0.78)", { sticky: true });
      zonesRef.current.push(q1);

      const q2 = L.polygon(
        [
          [centerLat + dLat, centerLon],
          [centerLat + dLat * 1.02, centerLon + dLon * 0.85],
          [centerLat, centerLon + dLon * 0.9],
          [centerLat, centerLon]
        ],
        { color: "#84cc16", fillColor: "#a3e635", fillOpacity: 0.4, weight: 1 }
      ).addTo(map);
      q2.bindTooltip("Zone B: Healthy Vegetative (NDVI: 0.65)", { sticky: true });
      zonesRef.current.push(q2);

      const q3 = L.polygon(
        [
          [centerLat, centerLon - dLon * 0.9],
          [centerLat, centerLon],
          [centerLat - dLat * 0.95, centerLon],
          [centerLat - dLat * 0.98, centerLon - dLon * 0.8]
        ],
        { color: "#d97706", fillColor: "#f59e0b", fillOpacity: 0.4, weight: 1 }
      ).addTo(map);
      q3.bindTooltip("Zone C: Moisture Deficit (NDVI: 0.48)", { sticky: true });
      zonesRef.current.push(q3);

      const q4 = L.polygon(
        [
          [centerLat, centerLon],
          [centerLat, centerLon + dLon * 0.9],
          [centerLat - dLat * 0.85, centerLon + dLon * 0.95],
          [centerLat - dLat * 0.95, centerLon]
        ],
        { color: "#15803d", fillColor: "#16a34a", fillOpacity: 0.45, weight: 1 }
      ).addTo(map);
      q4.bindTooltip("Zone D: Optimal Canopy (NDVI: 0.74)", { sticky: true });
      zonesRef.current.push(q4);
    }

    // 3. Soil Moisture Gradient Overlay
    if (showSoilOverlay) {
      const soilCircle = L.circle([centerLat, centerLon], {
        radius: 350,
        color: "#0284c7",
        fillColor: "#38bdf8",
        fillOpacity: 0.3,
        weight: 1.5,
        dashArray: "4, 4"
      }).addTo(map);
      soilCircle.bindTooltip("Soil Moisture: 68% (Adequate Root Storage)", { sticky: true });
      zonesRef.current.push(soilCircle);
    }

    // 4. Rain Radar Precipitation Halo
    if (showRainOverlay) {
      const rainHalo = L.circle([centerLat + 0.004, centerLon + 0.003], {
        radius: 650,
        color: "#6366f1",
        fillColor: "#818cf8",
        fillOpacity: 0.25,
        weight: 1
      }).addTo(map);
      rainHalo.bindTooltip("NWP Radar: Approaching Precipitation Front (12-15mm)", { sticky: true });
      zonesRef.current.push(rainHalo);
    }
  };

  // Improved Live GPS Detection with Nearest District Auto-Match
  const handleDetectGps = () => {
    setGpsStatus("");
    setGpsLoading(true);

    if (!navigator.geolocation) {
      setGpsStatus("Geolocation is not supported by your browser.");
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
        setGpsStatus(`✅ GPS Fix: Located near ${nearest.name}, ${nearest.state} (~${nearest.distanceKm} km)`);

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
        // Fallback: pick current selected district coordinates cleanly without breaking
        const currentDistObj = currentDistricts.find((d) => d.name === selectedDistrict);
        if (currentDistObj) {
          setGpsStatus(`⚠️ Browser GPS permission denied. Using selected district: ${currentDistObj.name}, ${selectedState}.`);
          handleSelectLocation(currentDistObj.lat, currentDistObj.lon, `${currentDistObj.name}, ${selectedState}, India`, currentDistObj.soil);
        } else {
          setGpsStatus("⚠️ Location permission denied or unavailable. Please select your State & District below.");
        }
        setGpsLoading(false);
      },
      { timeout: 9000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-5">
      {/* Geospatial Map Header (Sky Theme) */}
      <div className="card card-sky p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/15 text-[var(--c-sky-neon)] border border-sky-400/30 shadow-sm">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 font-display">
                {t?.farmMap?.title || "Agricultural Geospatial Command"}
                <span className="badge badge-sky text-xs font-tech">Sentinel-2 Ready</span>
              </h1>
              <p className="text-xs text-sky-200/80 mt-0.5 font-sans">
                Multi-spectral parcel intelligence, boundary geofencing, and precision pointer tracking
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Re-center Pointer Button */}
          <button
            onClick={handleCenterPointer}
            className="btn btn-secondary text-xs"
            title="Center map on Current Location Pointer"
          >
            <Crosshair className="w-4 h-4 text-emerald-400" />
            <span>Center Pointer</span>
          </button>

          {/* Detect Live GPS Button */}
          <button
            onClick={handleDetectGps}
            disabled={gpsLoading}
            className="btn btn-primary text-xs"
          >
            <CompassIcon className={`w-4 h-4 ${gpsLoading ? "animate-spin" : ""}`} />
            {gpsLoading ? "Acquiring GPS..." : t?.farmMap?.gpsButton || "Detect Live GPS"}
          </button>
        </div>
      </div>

      {/* NOVA-VARSHA AI STYLE STATE & DISTRICT SELECTION BAR */}
      <div className="card p-4 bg-[var(--bg-card)] border border-[var(--border-1)] shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Farm Parcel Location Selector (All India):</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-1 max-w-2xl">
            {/* State Dropdown */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                Select State
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-white text-xs font-bold focus:border-emerald-500 focus:outline-none"
              >
                {INDIA_STATES_DATA.map((s) => (
                  <option key={s.state} value={s.state} className="bg-slate-900 text-white">
                    {s.state} ({s.districts.length} Districts)
                  </option>
                ))}
              </select>
            </div>

            {/* District Dropdown */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                Select District / Agro-Zone
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-white text-xs font-bold focus:border-emerald-500 focus:outline-none"
              >
                {currentDistricts.map((d) => (
                  <option key={d.name} value={d.name} className="bg-slate-900 text-white">
                    {d.name} — {d.crop} ({d.zone})
                  </option>
                ))}
              </select>
            </div>

            {/* Active Pointer Badge */}
            <div className="hidden sm:flex flex-col justify-end">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                Active Pointer Pin
              </span>
              <div className="px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{coords.lat.toFixed(4)}°N, {coords.lon.toFixed(4)}°E</span>
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

      {/* Main Map Frame with Precision Layers and Pointer Controls */}
      <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface-2)] shadow-2xl">
        {/* Floating Top Control Bar (Layers & Intelligence Overlays) */}
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
              Satellite Imagery
            </button>
            <button
              onClick={() => setActiveBaseLayer("topo")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeBaseLayer === "topo"
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-white"
              }`}
            >
              Topography
            </button>
            <button
              onClick={() => setActiveBaseLayer("osm")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeBaseLayer === "osm"
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-white"
              }`}
            >
              Road Map
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
              Boundary
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
              NDVI Vigour
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
              Soil Moisture
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
              Rain Radar
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
              <span>CURRENT POINTER HUD</span>
            </span>
            <span className="text-[var(--text-muted)] font-normal">Zoom {zoomLevel}x</span>
          </div>

          <div className="text-white font-bold text-xs mb-1 truncate">
            📍 {farm?.location_name || `${selectedDistrict}, ${selectedState}`}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[var(--text-secondary)]">
            <div>Lat: <span className="text-emerald-400 font-bold">{coords.lat.toFixed(4)}°N</span></div>
            <div>Lon: <span className="text-emerald-400 font-bold">{coords.lon.toFixed(4)}°E</span></div>
            <div>Area: <span className="text-white font-bold">{farm?.area_acres || 5.0} Acres</span></div>
            <div>Datum: <span className="text-white font-bold">WGS 84</span></div>
          </div>

          <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] flex items-center justify-between">
            <span className="text-emerald-300">Tip: Click map or drag pointer to move</span>
            <button
              onClick={handleCenterPointer}
              className="text-emerald-400 hover:underline font-bold"
            >
              Focus Pin
            </button>
          </div>
        </div>

        {/* Floating Bottom Center/Right: Map Legend */}
        {showNdvi && (
          <div className="absolute bottom-3 right-16 z-[1000] p-2.5 rounded-xl bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] shadow-xl text-[11px] hidden sm:block">
            <div className="font-bold text-white mb-1.5 flex items-center gap-1">
              <Activity className="w-3 h-3 text-[var(--leaf)]" /> NDVI Crop Vigour Scale
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#16a34a]" /> &gt;0.7 Dense
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#84cc16]" /> 0.5-0.7 Normal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#d97706]" /> &lt;0.5 Stress
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Geospatial Insights Strip (Multi-Color Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card card-leaf p-4 space-y-1">
          <span className="text-xs font-bold text-[var(--c-leaf-neon)] uppercase tracking-wider font-tech">Topographic Gradient</span>
          <div className="text-base font-bold text-white flex items-center justify-between font-display">
            <span>Slope &lt; 1.5% (Flat)</span>
            <span className="badge badge-leaf text-xs font-tech">Low Runoff</span>
          </div>
          <p className="text-[11px] text-emerald-200/80 font-sans">Minimal erosion hazard; suitable for mechanized broad-furrow cultivation.</p>
        </div>

        <div className="card card-sky p-4 space-y-1">
          <span className="text-xs font-bold text-[var(--c-sky-neon)] uppercase tracking-wider font-tech">Geospatial Soil Zone</span>
          <div className="text-base font-bold text-white flex items-center justify-between font-display">
            <span>{farm?.soil_type || "Alluvial Loam"}</span>
            <span className="badge badge-sky text-xs font-tech">High CEC</span>
          </div>
          <p className="text-[11px] text-sky-200/80 font-sans">Excellent water retention with depth-to-bedrock exceeding 180 cm.</p>
        </div>

        <div className="card card-indigo p-4 space-y-1">
          <span className="text-xs font-bold text-[var(--c-indigo-neon)] uppercase tracking-wider font-tech">Canopy Cover Index</span>
          <div className="text-base font-bold text-white flex items-center justify-between font-display">
            <span>0.72 Fractional Cover</span>
            <span className="badge badge-indigo text-xs font-tech">Healthy</span>
          </div>
          <p className="text-[11px] text-indigo-200/80 font-sans">Multi-spectral reflectance indicates robust leaf area index (LAI 3.4).</p>
        </div>
      </div>
    </div>
  );
}
