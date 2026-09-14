export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

export const DEFAULT_FALLBACK_FARM = {
  id: 1,
  farmer_name: "Rameshwar Singh Patel",
  farm_name: "Kisan Adarsh Farm",
  village: "Varanasi Sub-district",
  district: "Varanasi",
  state: "Uttar Pradesh",
  total_area_acres: 4.5,
  soil_type: "Alluvial Clay Loam",
  soil_ph: 6.8,
  nitrogen: 85,
  phosphorus: 48,
  potassium: 42,
  organic_carbon_pct: 0.72,
  primary_water_source: "Tube Well (Solar Drip Integrated)",
  elevation_meters: 82,
  latitude: 25.3176,
  longitude: 82.9739,
  irrigation_infrastructure: "Drip & Micro-Sprinkler",
  primary_crops: ["Wheat", "Mustard", "Paddy", "Lentil"]
};

export const DEFAULT_FALLBACK_WEATHER = {
  city: "Varanasi",
  state: "Uttar Pradesh",
  latitude: 25.3176,
  longitude: 82.9739,
  temperature: 28.4,
  apparent_temperature: 30.1,
  humidity: 62,
  precipitation: 0.0,
  surface_pressure: 1012,
  wind_speed: 9.8,
  weather_code: 1,
  weather_desc: "Mainly clear sky",
  et0_daily_mm: 4.2,
  rainfall_forecast_7d: 14.5,
  soil_moisture_estimate_pct: 68,
  heat_stress_index: "Low",
  optimal_spray_conditions: true
};

export const DEFAULT_FALLBACK_IRRIGATION = {
  status: "Optimal",
  action_needed: "No immediate irrigation needed today. Schedule next drip cycle in 36 hours.",
  soil_moisture_pct: 68,
  evapotranspiration_mm: 4.2,
  water_saved_m3: 1420,
  water_savings_pct: 34,
  efficiency_rating: "94% (High Efficiency)",
  solar_pumping_status: "Active (5.2 kWh generated today)"
};

export const DEFAULT_FALLBACK_TASKS = [
  { id: 1, title: "Apply micronutrient spray (Zinc + Ferrous)", due: "Tomorrow, 7:00 AM", priority: "High", category: "Nutrition", completed: false },
  { id: 2, title: "Inspect soil moisture sensor probe in Block B", due: "16 Sep 2026", priority: "Medium", category: "Irrigation", completed: false },
  { id: 3, title: "Weeding and inter-culture in Mustard plot", due: "18 Sep 2026", priority: "Low", category: "Crop Care", completed: true },
  { id: 4, title: "PM-KISAN e-KYC status verification", due: "20 Sep 2026", priority: "Medium", category: "Govt Schemes", completed: true }
];

export const DEFAULT_FALLBACK_ANALYTICS = {
  yield_estimate_q_per_acre: 18.4,
  projected_gross_income: 184500,
  fertilizer_savings_inr: 8400,
  carbon_sequestration_kg: 320,
  soil_health_score: 84,
  sustainability_index: "A+ Top 5% in District"
};

export const DEFAULT_FALLBACK_RECOMMENDATION = {
  top_crop: "Wheat (HD-2967 / PBW-502)",
  confidence: 94.8,
  secondary_crop: "Mustard (Pusa Bold)",
  secondary_confidence: 88.2,
  expected_yield: "19 - 22 Quintals/Acre",
  recommended_npk_ratio: "120:60:40 kg/ha",
  sowing_window: "Late October to Mid-November",
  market_demand_rating: "Very High (Government MSP Procurement Assured)",
  justification: "Soil pH 6.8 with adequate Alluvial loamy composition, moderate humidity, and low monsoon runoff risks create prime agro-climatic conditions for High Yield Wheat varieties with Mustard inter-cropping."
};

export const DEFAULT_FALLBACK_VIKSIT = {
  metadata: {
    title: "Viksit Bharat Agricultural Insights & Official Datasets",
    curator: "Government of India Official Ag Statistics & CCEA Release",
    last_verified: "2024-2025 Crop Year",
    disclaimer: "All figures reflect official Government of India Gazette releases, CCEA MSP notifications, and DES advance estimates."
  },
  msp_rates_2024_25: {
    title: "Cabinet Approved Minimum Support Prices (MSP) for 2024-25 Season",
    source: "Cabinet Committee on Economic Affairs (CCEA) & PIB",
    source_url: "https://pib.gov.in/PressReleasePage.aspx?PRID=2026526",
    unit: "INR (₹) per Quintal",
    crops: [
      { crop: "Wheat", season: "Rabi", msp_2023_24: 2125, msp_2024_25: 2275, absolute_increase: 150, cost_of_production: 1128, margin_over_cost_pct: 102 },
      { crop: "Paddy (Common)", season: "Kharif", msp_2023_24: 2183, msp_2024_25: 2300, absolute_increase: 117, cost_of_production: 1533, margin_over_cost_pct: 50 },
      { crop: "Cotton (Medium)", season: "Kharif", msp_2023_24: 6620, msp_2024_25: 7121, absolute_increase: 501, cost_of_production: 4747, margin_over_cost_pct: 50 },
      { crop: "Mustard & Rapeseed", season: "Rabi", msp_2023_24: 5450, msp_2024_25: 5650, absolute_increase: 200, cost_of_production: 2855, margin_over_cost_pct: 98 },
      { crop: "Gram (Chickpea)", season: "Rabi", msp_2023_24: 5335, msp_2024_25: 5440, absolute_increase: 105, cost_of_production: 3400, margin_over_cost_pct: 60 },
      { crop: "Maize", season: "Kharif", msp_2023_24: 2090, msp_2024_25: 2225, absolute_increase: 135, cost_of_production: 1483, margin_over_cost_pct: 50 }
    ]
  },
  state_production_stats: {
    title: "State-wise Production Leadership (2023-24 Advance Estimates)",
    source: "Directorate of Economics and Statistics (DES), Ministry of Agriculture & Farmers Welfare",
    source_url: "https://agricoop.gov.in",
    datasets: [
      {
        commodity: "Wheat Production (Million Tonnes)",
        year: "2023-24",
        national_total_mt: 113.29,
        top_states: [
          { state: "Uttar Pradesh", production_mt: 35.4, share_pct: 31.2 },
          { state: "Madhya Pradesh", production_mt: 22.8, share_pct: 20.1 },
          { state: "Punjab", production_mt: 17.5, share_pct: 15.4 },
          { state: "Haryana", production_mt: 11.8, share_pct: 10.4 }
        ]
      },
      {
        commodity: "Rice Production (Million Tonnes)",
        year: "2023-24",
        national_total_mt: 136.7,
        top_states: [
          { state: "West Bengal", production_mt: 16.8, share_pct: 12.3 },
          { state: "Uttar Pradesh", production_mt: 15.6, share_pct: 11.4 },
          { state: "Punjab", production_mt: 13.1, share_pct: 9.6 }
        ]
      }
    ]
  },
  verified_schemes: [
    {
      scheme_name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
      ministry: "Ministry of Agriculture & Farmers Welfare",
      benefit: "₹6,000 direct income support per year in 3 four-monthly installments",
      eligibility: "Landholding farmer families with bank accounts linked to Aadhaar",
      official_portal: "https://pmkisan.gov.in",
      helpline: "155261 / 011-24300606"
    },
    {
      scheme_name: "PM Krishi Sinchayee Yojana (Per Drop More Crop)",
      ministry: "Department of Agriculture and Farmers Welfare",
      benefit: "Up to 55% subsidy for small/marginal farmers on micro-irrigation systems",
      eligibility: "All farmers with assured water source & cultivated land",
      official_portal: "https://pmksy.gov.in",
      helpline: "1800-180-1551"
    }
  ]
};

