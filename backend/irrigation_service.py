def compute_smart_irrigation(
    crop: str,
    crop_stage: str,
    soil_type: str,
    irrigation_method: str,
    temperature: float,
    humidity: float,
    rainfall_24h: float,
    rainfall_7d: float
):
    """
    Computes decision-support irrigation advice based on FAO-56 Penman-Monteith approximations,
    soil water retention coefficient, and 24h/7d precipitation forecast.
    """
    # Crop water factor by crop type
    crop_coefficients = {
        "Wheat": 0.85,
        "Rice (Paddy)": 1.35,
        "Maize": 0.90,
        "Cotton": 1.05,
        "Chickpea (Gram)": 0.65,
        "Mustard": 0.70,
        "Sugarcane": 1.25,
        "Soybean": 0.80,
        "Lentil (Masoor)": 0.60,
        "Potato": 0.95
    }
    kc = crop_coefficients.get(crop, 0.85)

    # Growth stage multiplier
    stage_multipliers = {
        "Initial / Sowing": 0.5,
        "Vegetative": 0.8,
        "Flowering / Heading": 1.15,
        "Yield Formation / Grain Filling": 1.0,
        "Ripening / Maturity": 0.4
    }
    k_stage = stage_multipliers.get(crop_stage, 0.8)

    # Simplified Reference Evapotranspiration (ET0) estimation (Hargreaves style)
    # High temp + low humidity = high evaporative demand
    et0 = max(2.0, (0.0023 * (temperature + 17.8) * ((35.0 - (humidity * 0.2)) ** 0.5)))
    etc = round(et0 * kc * k_stage, 2)  # Crop water requirement in mm/day

    # Soil retention capacity index
    soil_water_capacities = {
        "Clay / Black Cotton": {"retention": "High (Stores moisture longer)", "drainage": "Slow", "depletion_days": 6},
        "Alluvial / Loam": {"retention": "Optimal (Balanced aeration & water)", "drainage": "Moderate", "depletion_days": 4},
        "Sandy Loam": {"retention": "Moderate-Low", "drainage": "Fast", "depletion_days": 3},
        "Red Soil": {"retention": "Moderate", "drainage": "Good", "depletion_days": 4},
        "Saline / Alkaline": {"retention": "Requires leaching", "drainage": "Variable", "depletion_days": 3}
    }
    soil_info = soil_water_capacities.get(soil_type, {"retention": "Standard", "drainage": "Normal", "depletion_days": 4})

    # Irrigation system efficiency
    method_efficiencies = {
        "Drip Irrigation": {"efficiency": "90-95%", "advice": "Operate drip emitters for targeted root-zone delivery with minimal losses."},
        "Sprinkler": {"efficiency": "75-80%", "advice": "Run sprinkler in early morning to prevent evaporative wind drift."},
        "Furrow / Ridge": {"efficiency": "60-70%", "advice": "Control furrow inflow to prevent tailwater ponding and leaching."},
        "Flood / Basin": {"efficiency": "50-60%", "advice": "Avoid over-flooding; prioritize transitioning to micro-irrigation to conserve water."}
    }
    system_profile = method_efficiencies.get(irrigation_method, {"efficiency": "70%", "advice": "Apply water evenly across active root depth."})

    # Decision logic
    if rainfall_24h >= 4.0 or rainfall_7d >= 20.0:
        status = "Wait"
        urgency = "Low"
        summary = f"Imminent rainfall predicted ({rainfall_24h}mm in 24h, {rainfall_7d}mm across 7 days). Postpone irrigation to prevent waterlogging and fertilizer leaching."
        action = f"Hold all irrigation. Monitor field drainage channels for upcoming rainfall ({rainfall_7d}mm expected)."
    elif etc > 5.0 and rainfall_24h < 1.0 and rainfall_7d < 5.0:
        if crop_stage in ["Flowering / Heading", "Yield Formation / Grain Filling"]:
            status = "Irrigate Now"
            urgency = "High"
            summary = f"Crop is at critical moisture-sensitive stage ({crop_stage}) with elevated evapotranspiration ({etc} mm/day) and zero rain forecasted."
            action = f"Apply immediate {irrigation_method.lower()} cycle of ~25-30 mm during early morning hours to safeguard yield."
        else:
            status = "Recommended"
            urgency = "Medium-High"
            summary = f"Evaporative loss ({etc} mm/day) is outpacing natural soil replenishment."
            action = f"Schedule {irrigation_method.lower()} within next 24 to 36 hours. Best window: 6:00 AM - 9:00 AM."
    elif etc > 3.0 and rainfall_24h < 2.0:
        status = "Moderate"
        urgency = "Medium"
        summary = f"Soil moisture reserves declining at steady rate ({etc} mm/day). No immediate rain forecasted."
        action = f"Check root zone moisture depth (5-10 cm). Prepare {irrigation_method.lower()} if surface feels dry."
    else:
        status = "Wait"
        urgency = "Low"
        summary = f"Low crop water requirement ({etc} mm/day) and mild atmospheric conditions."
        action = "Maintain regular monitoring. No immediate water application required."

    return {
        "status": status,
        "urgency": urgency,
        "crop_water_requirement_mm_day": etc,
        "reference_evapotranspiration": round(et0, 2),
        "soil_retention_profile": soil_info["retention"],
        "system_efficiency": system_profile["efficiency"],
        "system_advice": system_profile["advice"],
        "summary": summary,
        "action": action,
        "rainfall_context_24h": f"{rainfall_24h} mm",
        "rainfall_context_7d": f"{rainfall_7d} mm",
        "sensor_note": "Decision support based on meteorological models and agronomic coefficients. No connected soil sensor assumed."
    }
