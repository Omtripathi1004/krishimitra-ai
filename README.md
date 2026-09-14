# KrishiMitra AI — Precision Agriculture Command Platform

> **Live Production URL:** [frontend-xi-khaki-78.vercel.app](https://frontend-xi-khaki-78.vercel.app/)  
> **GitHub Repository:** [github.com/Omtripathi1004/krishimitra-ai](https://github.com/Omtripathi1004/krishimitra-ai)

KrishiMitra AI is an enterprise-grade precision-agriculture command center built for farmers, agronomists, and agricultural decision-makers. It integrates real-time hyperlocal numerical weather prediction (NWP), rhizosphere telemetry, machine learning crop intelligence, multi-vector farm risk monitoring, and official Government of India agricultural datasets (CCEA / Ministry of Agriculture).

---

## 🌾 Core Modules & Architecture

1. **Precision Dashboard**:
   - Immediate status overview: Location, current weather, active crop phenology, and farm-health score.
   - 6 Precision Environmental & Agronomic KPIs: Temperature, Rainfall (7d), Atmospheric Humidity, Soil Moisture (% VWC), Crop Health (NDVI equivalent), and Compound Risk Index.
   - Primary AI Autonomous Intelligence Banner with confidence metrics, agronomic justifications, and recommended actions.

2. **Farm Intelligence**:
   - Field parameters, NPK soil nutrient balance, solar-assisted micro-irrigation telemetry, and parcel management.

3. **Hyperlocal Weather Intelligence**:
   - Real-time temperature, feels-like, dew point, wind speed, spray condition advisories, and ET0 evapotranspiration models.

4. **Crop Intelligence & AI Explainability**:
   - Multi-objective ML recommendation cards (Wheat, Mustard, Chickpea, Lentil) featuring suitability ratings, water requirements, growth duration, and yield estimates.
   - Feature contribution horizontal bar attributions (Soil Nitrogen, Ambient Temperature, Precipitation, Soil pH, P:K ratio).
   - Detailed model architecture explanation (Random Forest Ensemble trained on ICAR observations).

5. **Farm Risk Command Center**:
   - Dedicated risk vectors: Meteorological, Agronomic/Thermal, Hydrological/Moisture, Phytosanitary/Pest, and Economic/Procurement.
   - 24-Hour, 3-Day, and 7-Day probabilistic risk horizon timeline.

6. **Geospatial Agricultural Map**:
   - Interactive Leaflet-powered field boundaries, GPS location detection, coordinate picking, and multi-layer satellite/terrain overlays.

7. **Krishi Copilot (AI Assistant)**:
   - Bilingual (English / Hindi) agricultural decision copilot with structured response blocks (Direct Answer, Field Telemetry, Recommendations, Warnings, and ICAR source citations).
   - 1-click suggested prompts:
     - *"Which crop should I plant?"*
     - *"Should I irrigate today?"*
     - *"Is heavy rain expected?"*
     - *"Why is my crop risk high?"*
     - *"What should I do this week?"*

8. **Agronomic Alert & Advisory Center**:
   - Real-time severity classification (Emergency, High, Moderate, Low) across Weather, Water, Crop, Disease, and Infrastructure vectors.
   - One-click acknowledgment and detailed diagnostics.

9. **Viksit Bharat Official Datasets**:
   - Cabinet Committee on Economic Affairs (CCEA) approved Minimum Support Prices (MSP) with cost-of-production profit margins.
   - State-wise national production leaderboards (DES estimates) and verified central welfare schemes (PM-KISAN, PMKSY).

---

## 🎨 Design System

- **Primary Colors**: Deep Agricultural Green (`#091912`, `#0F241B`, `#153226`)
- **Semantic Accents**: Leaf Green (`#22C55E`), Earth Brown (`#92400E`), Sky/Water Blue (`#0284C7`), Amber Warning (`#D97706`), Alert Red (`#DC2626`)
- **Typography**: Plus Jakarta Sans & Inter
- **Navigation Shell**: Collapsible sidebar with icon mode, compact status header with GPS detection, and responsive mobile drawer & bottom navigation.

---

## 💻 Running Locally

### Backend (FastAPI + Scikit-Learn)
```bash
# Install dependencies
pip install -r requirements.txt

# Start FastAPI server on port 8000
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Deployment
- **Frontend**: Automated static & SPA deployment via Vercel (`frontend/vercel.json` SPA rewrites).
- **Backend**: FastAPI ASGI service with RESTful agronomic endpoints.
