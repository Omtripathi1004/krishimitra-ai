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
  Sun
} from "lucide-react";

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

  const [activeBaseLayer, setActiveBaseLayer] = useState("satellite"); // "satellite" | "osm" | "topo"
  const [showBoundary, setShowBoundary] = useState(true);
  const [showNdvi, setShowNdvi] = useState(true);
  const [showSoilOverlay, setShowSoilOverlay] = useState(false);
  const [showRainOverlay, setShowRainOverlay] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [zoomLevel, setZoomLevel] = useState(14);

  // Sync coords when farm prop changes
  useEffect(() => {
    if (farm?.latitude && farm?.longitude) {
      if (Math.abs(farm.latitude - coords.lat) > 0.0001 || Math.abs(farm.longitude - coords.lon) > 0.0001) {
        setCoords({ lat: farm.latitude, lon: farm.longitude });
      }
    }
  }, [farm?.latitude, farm?.longitude]);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // 1. Create Leaflet map instance
      const map = L.map(mapContainerRef.current, {
        center: [coords.lat, coords.lon],
        zoom: 14,
        zoomControl: false // We use custom or positioned controls
      });

      // Add zoom control at bottom-right to prevent overlap
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

      // Set initial base layer
      if (activeBaseLayer === "satellite") satellite.addTo(map);
      else if (activeBaseLayer === "osm") osm.addTo(map);
      else topo.addTo(map);

      // Custom Farm Marker Icon
      const customIcon = L.divIcon({
        className: "custom-farm-pin",
        html: `<div style="background: linear-gradient(135deg, #15803d, #22c55e); width: 34px; height: 34px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 18px rgba(34, 197, 94, 0.8); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px;">🌾</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([coords.lat, coords.lon], {
        draggable: true,
        icon: customIcon
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 170px; padding: 4px;">
          <div style="font-weight: bold; font-size: 14px; color: #0f172a;">${farm?.farm_name || "Krishi Farm Parcel"}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${farm?.location_name || "Active Geofence"}</div>
          <div style="margin-top: 6px; font-size: 11px; font-family: monospace; color: #15803d; font-weight: 600;">
            Area: ${farm?.area_acres || 5.0} Acres • Soil: ${farm?.soil_type || "Alluvial"}
          </div>
        </div>
      `);

      marker.on("dragend", (e) => {
        const { lat, lng } = e.target.getLatLng();
        setCoords({ lat, lon: lng });
        if (onUpdateCoordinates) {
          onUpdateCoordinates(lat, lng);
        }
      });

      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setCoords({ lat, lon: lng });
        if (onUpdateCoordinates) {
          onUpdateCoordinates(lat, lng);
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

    // Draw / update Farm Boundary Polygon and NDVI Zones around coords
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

    // Clean up existing polygons
    if (polygonRef.current) {
      map.removeLayer(polygonRef.current);
      polygonRef.current = null;
    }
    zonesRef.current.forEach((z) => map.removeLayer(z));
    zonesRef.current = [];

    // Calculate approximate polygon offsets for a ~5 acre parcel (0.002 deg lat ~ 220m)
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

    // 2. NDVI Crop Health Zones (Subdivided parcel quadrats)
    if (showNdvi) {
      // Quad 1: High Vigour (Vibrant Green)
      const q1 = L.polygon(
        [
          [centerLat + dLat * 0.95, centerLon - dLon * 0.9],
          [centerLat + dLat, centerLon],
          [centerLat, centerLon],
          [centerLat, centerLon - dLon * 0.9]
        ],
        { color: "#16a34a", fillColor: "#22c55e", fillOpacity: 0.45, weight: 1 }
      ).addTo(map);
      q1.bindTooltip("Zone A: High Biomass (NDVI: 0.78)", { sticky: true });
      zonesRef.current.push(q1);

      // Quad 2: Moderate Vigour (Light Green)
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

      // Quad 3: Mild Water Stress (Amber)
      const q3 = L.polygon(
        [
          [centerLat, centerLon - dLon * 0.9],
          [centerLat, centerLon],
          [centerLat - dLat * 0.95, centerLon],
          [centerLat - dLat * 0.98, centerLon - dLon * 0.8]
        ],
        { color: "#d97706", fillColor: "#f59e0b", fillOpacity: 0.4, weight: 1 }
      ).addTo(map);
      q3.bindTooltip("Zone C: Mild Moisture Deficit (NDVI: 0.48)", { sticky: true });
      zonesRef.current.push(q3);

      // Quad 4: Optimal Canopy
      const q4 = L.polygon(
        [
          [centerLat, centerLon],
          [centerLat, centerLon + dLon * 0.9],
          [centerLat - dLat * 0.85, centerLon + dLon * 0.95],
          [centerLat - dLat * 0.95, centerLon]
        ],
        { color: "#15803d", fillColor: "#16a34a", fillOpacity: 0.45, weight: 1 }
      ).addTo(map);
      q4.bindTooltip("Zone D: Optimal Crop Stand (NDVI: 0.74)", { sticky: true });
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

  const handleDetectGps = () => {
    setGpsError("");
    setGpsLoading(true);
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = pos.coords.latitude;
        const newLon = pos.coords.longitude;
        setCoords({ lat: newLat, lon: newLon });
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([newLat, newLon], 15);
          if (markerRef.current) {
            markerRef.current.setLatLng([newLat, newLon]);
          }
        }
        if (onUpdateCoordinates) {
          onUpdateCoordinates(newLat, newLon);
        }
        setGpsLoading(false);
      },
      (err) => {
        console.warn("GPS Geolocation error:", err);
        setGpsError("Location permission denied or unavailable. Using selected coordinates.");
        setGpsLoading(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="space-y-6">
      {/* Geospatial Map Header */}
      <div className="card p-5 sm:p-6 border-l-4 border-l-[var(--leaf)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--primary)]/20 text-[var(--leaf)] border border-[var(--primary)]/30">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                {t?.farmMap?.title || "Agricultural Geospatial Command"}
                <span className="badge badge-emerald text-xs">High Resolution</span>
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Multi-spectral parcel intelligence, boundary geofencing, and remote sensing telemetry
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDetectGps}
            disabled={gpsLoading}
            className="btn btn-primary text-xs"
          >
            <CompassIcon className={`w-4 h-4 ${gpsLoading ? "animate-spin" : ""}`} />
            {gpsLoading ? "Acquiring Fix..." : t?.farmMap?.gpsButton || "Detect Live GPS"}
          </button>
        </div>
      </div>

      {gpsError && (
        <div className="p-3 rounded-xl border border-[var(--warning)]/30 bg-[var(--warning)]/10 text-xs text-[var(--warning)] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Main Map Frame with Floating Precision Controls */}
      <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface-2)] shadow-xl">
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

        {/* Floating Bottom Left: Precision HUD & Telemetry */}
        <div className="absolute bottom-3 left-3 z-[1000] p-3 rounded-xl bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] shadow-xl text-xs font-mono max-w-sm">
          <div className="flex items-center justify-between text-[11px] text-[var(--leaf)] font-bold mb-1.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> GEO-TELEMETRY HUD
            </span>
            <span className="text-[var(--text-muted)]">Zoom {zoomLevel}x</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[var(--text-secondary)]">
            <div>Lat: <span className="text-white font-bold">{coords.lat.toFixed(4)}°N</span></div>
            <div>Lon: <span className="text-white font-bold">{coords.lon.toFixed(4)}°E</span></div>
            <div>Area: <span className="text-[var(--leaf)] font-bold">{farm?.area_acres || 5.0} Acres</span></div>
            <div>Datum: <span className="text-white font-bold">WGS 84</span></div>
          </div>
          <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] flex items-center justify-between">
            <span>Click or drag pin to re-anchor farm</span>
            <span className="text-[var(--leaf)]">Sentinel-2 Ready</span>
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

      {/* Geospatial Insights Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 space-y-1">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Topographic Gradient</span>
          <div className="text-base font-bold text-white flex items-center justify-between">
            <span>Slope &lt; 1.5% (Flat)</span>
            <span className="badge badge-emerald text-xs">Low Runoff</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">Minimal erosion hazard; suitable for mechanized broad-furrow cultivation.</p>
        </div>

        <div className="card p-4 space-y-1">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Geospatial Soil Zone</span>
          <div className="text-base font-bold text-white flex items-center justify-between">
            <span>{farm?.soil_type || "Alluvial Loam"}</span>
            <span className="badge badge-sky text-xs">High CEC</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">Excellent water retention with depth-to-bedrock exceeding 180 cm.</p>
        </div>

        <div className="card p-4 space-y-1">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Canopy Cover Index</span>
          <div className="text-base font-bold text-white flex items-center justify-between">
            <span>0.72 Fractional Cover</span>
            <span className="badge badge-emerald text-xs">Healthy</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">Multi-spectral reflectance indicates robust leaf area index (LAI 3.4).</p>
        </div>
      </div>
    </div>
  );
}
