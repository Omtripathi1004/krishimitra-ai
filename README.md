# KrishiMitra AI - Next-Gen Agronomic Intelligence Platform

A high-performance agricultural intelligence dashboard and decision support system for Indian farmers, powered by machine learning, real-time meteorological data, and verified Government of India agricultural datasets (CCEA / Ministry of Agriculture).

## Features
- **Smart Farm Dashboard**: Real-time NPK soil balance, weather telemetry, smart irrigation recommendations.
- **AI Crop Recommendation**: Multi-factor machine learning model providing verified crop selections with confidence ratings.
- **Microclimate Weather Intelligence**: ET0 evapotranspiration calculations, spray condition alerts, and 7-day rainfall forecasts.
- **Smart Solar Irrigation**: Water conservation metrics and automated irrigation scheduling.
- **Krishi Assistant**: Bilingual (English / Hindi) agronomic AI assistant for instant advisory.
- **Viksit Bharat Verified Datasets**: Government MSP 2024-25 benchmarks and national state-wise crop production statistics.

## Tech Stack
- **Frontend**: React 19, Vite, Lucide Icons, Canvas Confetti, Modern CSS3 Glassmorphism System
- **Backend**: FastAPI, Uvicorn, Scikit-Learn, Joblib, SQLite, Open-Meteo API
- **Deployment**: Vercel (Frontend), GitHub

## Running Locally

### Backend
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
