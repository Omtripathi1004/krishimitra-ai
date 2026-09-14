import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import {
  MapPin,
  Navigation as CompassIcon,
  Layers,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function FarmMap({ farm, onUpdateCoordinates, t }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [coords, setCoords] = useState({
    lat: farm?.latitude || 30.9010,
    lon: farm?.longitude || 75.8573
  });

  const [mapType, setMapType] = useState("osm"); // osm or dark
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([coords.lat, coords.lon], 13);

      const osmLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      ).addTo(map);

      // Custom emerald farm pin icon
      const customIcon = L.divIcon({
        className: "custom-farm-pin",
        html: `<div style="background-color: #10b981; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px rgba(16, 185, 129, 0.7); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">🌾</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([coords.lat, coords.lon], {
        draggable: true,
        icon: customIcon
      }).addTo(map);

      marker.bindPopup(`<b>${farm?.farm_name || "Farm"}</b><br>${farm?.location_name || ""}`).openPopup();

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

      mapInstanceRef.current = map;
      markerRef.current = marker;
    } else {
      mapInstanceRef.current.setView([coords.lat, coords.lon], 13);
      if (markerRef.current) {
        markerRef.current.setLatLng([coords.lat, coords.lon]);
      }
    }

    return () => {
      // Keep instance alive while switching tabs if possible or cleanup
    };
  }, [coords.lat, coords.lon]);

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
          mapInstanceRef.current.setView([newLat, newLon], 14);
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
        setGpsError("Location permission denied or unavailable. Using manually selected coordinates.");
        setGpsLoading(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-emerald-500/25">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white font-display">
              {t.farmMap.title}
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">{t.farmMap.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDetectGps}
            disabled={gpsLoading}
            className="btn-primary text-xs"
          >
            <CompassIcon className={`h-4 w-4 ${gpsLoading ? "animate-spin" : ""}`} />
            {gpsLoading ? "Detecting GPS..." : t.farmMap.gpsButton}
          </button>
        </div>
      </div>

      {gpsError && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Map Container */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>{t.farmMap.latLon}: <strong className="text-emerald-400">{coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}</strong></span>
          <span className="italic">{t.farmMap.zoomNote}</span>
        </div>

        <div className="h-[480px] w-full rounded-xl overflow-hidden border border-white/10 shadow-inner">
          <div ref={mapContainerRef} className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
