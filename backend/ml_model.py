import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

MODEL_FILE = os.path.join(os.path.dirname(__file__), "crop_model.joblib")
META_FILE = os.path.join(os.path.dirname(__file__), "model_meta.joblib")

# Agronomic optimal parameter centers and tolerances based on ICAR / FAO guidelines
CROP_PROFILES = {
    "Wheat": {
        "N": (80, 110), "P": (40, 60), "K": (30, 50),
        "temperature": (14, 25), "humidity": (50, 70), "ph": (6.0, 7.5), "rainfall": (50, 100),
        "season": "Rabi",
        "description": "Thrives in cool winter temperatures with well-drained loamy to clay-loam soil."
    },
    "Rice (Paddy)": {
        "N": (70, 100), "P": (35, 55), "K": (35, 50),
        "temperature": (22, 32), "humidity": (75, 95), "ph": (5.5, 7.0), "rainfall": (150, 260),
        "season": "Kharif",
        "description": "Prefers heavy clay or alluvial soil with abundant water and warm, humid climate."
    },
    "Maize": {
        "N": (70, 100), "P": (40, 55), "K": (15, 30),
        "temperature": (18, 30), "humidity": (55, 78), "ph": (5.8, 7.2), "rainfall": (65, 120),
        "season": "Kharif / Zaid",
        "description": "Adaptable grain crop suited for well-drained fertile loamy soils."
    },
    "Cotton": {
        "N": (100, 140), "P": (50, 75), "K": (45, 65),
        "temperature": (22, 36), "humidity": (50, 75), "ph": (6.0, 8.0), "rainfall": (60, 110),
        "season": "Kharif",
        "description": "Best suited for deep black cotton soil (Vertisols) with moderate rainfall."
    },
    "Chickpea (Gram)": {
        "N": (25, 45), "P": (50, 70), "K": (70, 90),
        "temperature": (16, 28), "humidity": (40, 65), "ph": (6.0, 8.0), "rainfall": (40, 80),
        "season": "Rabi",
        "description": "Leguminous pulse fixing atmospheric nitrogen; highly drought tolerant."
    },
    "Mustard": {
        "N": (50, 75), "P": (30, 50), "K": (25, 40),
        "temperature": (12, 25), "humidity": (40, 65), "ph": (6.0, 7.5), "rainfall": (30, 70),
        "season": "Rabi",
        "description": "Cool season oilseed performing well in light to heavy loam soils with modest moisture."
    },
    "Sugarcane": {
        "N": (105, 145), "P": (55, 75), "K": (50, 75),
        "temperature": (24, 38), "humidity": (70, 88), "ph": (6.0, 7.8), "rainfall": (120, 220),
        "season": "Annual / Perennial",
        "description": "High biomass cash crop demanding rich organic matter and consistent water supply."
    },
    "Soybean": {
        "N": (30, 50), "P": (60, 80), "K": (25, 45),
        "temperature": (20, 32), "humidity": (60, 80), "ph": (6.0, 7.2), "rainfall": (75, 130),
        "season": "Kharif",
        "description": "High-protein legume thriving in fertile, well-aerated soils with good monsoon moisture."
    },
    "Lentil (Masoor)": {
        "N": (15, 35), "P": (50, 70), "K": (15, 30),
        "temperature": (14, 25), "humidity": (45, 65), "ph": (6.0, 7.6), "rainfall": (35, 75),
        "season": "Rabi",
        "description": "Cold hardy pulse with low nitrogen demand and moderate moisture needs."
    },
    "Potato": {
        "N": (80, 115), "P": (50, 70), "K": (90, 130),
        "temperature": (15, 23), "humidity": (60, 82), "ph": (5.2, 6.5), "rainfall": (50, 95),
        "season": "Rabi",
        "description": "High potassium demanding tuber crop that needs loose, well-drained friable sandy loam."
    }
}

FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

def generate_training_data(n_samples_per_crop=160, random_seed=42):
    """Generate agronomic dataset adhering strictly to real agronomic ranges."""
    np.random.seed(random_seed)
    data = []
    
    for crop, prof in CROP_PROFILES.items():
        for _ in range(n_samples_per_crop):
            row = {}
            for feat in FEATURES:
                low, high = prof[feat]
                mean = (low + high) / 2.0
                std = (high - low) / 4.0
                val = np.random.normal(mean, std)
                # Clip to realistic environmental limits
                val = max(0.0, val)
                row[feat] = round(val, 2)
            row["crop"] = crop
            data.append(row)
            
    return pd.DataFrame(data)

def train_or_load_model():
    if os.path.exists(MODEL_FILE) and os.path.exists(META_FILE):
        model = joblib.load(MODEL_FILE)
        meta = joblib.load(META_FILE)
        return model, meta

    df = generate_training_data()
    X = df[FEATURES]
    y = df["crop"]

    # Stratified 80/20 train/test split to accurately measure validation accuracy
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    clf = RandomForestClassifier(
        n_estimators=120,
        max_depth=12,
        min_samples_split=3,
        random_state=42
    )
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    val_accuracy = float(accuracy_score(y_test, y_pred))

    feature_importances = dict(zip(FEATURES, [round(float(imp), 4) for imp in clf.feature_importances_]))

    meta = {
        "val_accuracy": round(val_accuracy * 100, 1),
        "classes": list(clf.classes_),
        "feature_importances": feature_importances,
        "n_samples": len(df),
        "test_samples": len(y_test)
    }

    joblib.dump(clf, MODEL_FILE)
    joblib.dump(meta, META_FILE)
    print(f"[ML Engine] Trained Random Forest. Measured Validation Accuracy: {meta['val_accuracy']}%")
    return clf, meta

def evaluate_factor_fitness(val, low, high, optimal_buffer=0.25):
    """
    Explainable AI factor analysis: evaluates if an environmental/soil parameter
    is Favorable, Moderately Favorable, or Sub-optimal for a given crop profile.
    """
    buffer = (high - low) * optimal_buffer
    if low <= val <= high:
        return "Favorable", "Within ideal agronomic range", "positive"
    elif (low - buffer) <= val <= (high + buffer):
        return "Moderately Favorable", "Slightly outside ideal target but within tolerance", "neutral"
    elif val < low:
        return "Below Optimal", f"Lower than recommended ({low})", "warning"
    else:
        return "Above Optimal", f"Higher than recommended ({high})", "warning"

def predict_crop_suitability(n: float, p: float, k: float, temp: float, humidity: float, ph: float, rainfall: float):
    model, meta = train_or_load_model()
    input_df = pd.DataFrame([{
        "N": n, "P": p, "K": k,
        "temperature": temp, "humidity": humidity, "ph": ph, "rainfall": rainfall
    }])

    # Get class probabilities
    probs = model.predict_proba(input_df)[0]
    classes = model.classes_

    # Sort crops by probability
    ranked_indices = np.argsort(probs)[::-1]
    top_crop = classes[ranked_indices[0]]
    top_score = float(probs[ranked_indices[0]])

    # Calculate overall suitability percentage (calibrated with top score)
    suitability_pct = int(min(98, max(52, round(top_score * 100))))

    # Build Explainable AI analysis for top crop
    profile = CROP_PROFILES.get(top_crop, {})
    factor_explanations = []
    
    mapping = {
        "Temperature": (temp, "temperature", "°C"),
        "Rainfall": (rainfall, "rainfall", "mm"),
        "Relative Humidity": (humidity, "humidity", "%"),
        "Soil Nitrogen (N)": (n, "N", "kg/ha"),
        "Soil Phosphorus (P)": (p, "P", "kg/ha"),
        "Soil Potassium (K)": (k, "K", "kg/ha"),
        "Soil pH": (ph, "ph", "pH"),
    }

    favorable_count = 0
    for label, (val, feat_key, unit) in mapping.items():
        if feat_key in profile:
            low, high = profile[feat_key]
            status, detail, influence = evaluate_factor_fitness(val, low, high)
            if influence == "positive":
                favorable_count += 1
            factor_explanations.append({
                "factor": label,
                "value": f"{val} {unit}",
                "ideal_range": f"{low} - {high} {unit}",
                "status": status,
                "detail": detail,
                "influence": influence
            })

    # Historical/Context fit determination
    if favorable_count >= 5:
        context_fit = "High"
        primary_reason = f"Current soil nutrient balance and climatic conditions ({temp}°C, {rainfall}mm rain) align closely with optimal agronomic requirements for {top_crop}."
    elif favorable_count >= 3:
        context_fit = "Moderate"
        primary_reason = f"{top_crop} is viable with active management, though some soil/moisture parameters require adjustment."
    else:
        context_fit = "Fair / Conditional"
        primary_reason = f"Environmental factors indicate moderate stress risks for {top_crop}; supplemental irrigation or soil amendment needed."

    # Top 3 alternative recommendations
    alternatives = []
    for idx in ranked_indices[1:4]:
        alt_crop = classes[idx]
        alt_score = round(float(probs[idx]) * 100, 1)
        if alt_score > 5.0:
            alternatives.append({
                "crop": alt_crop,
                "suitability": alt_score,
                "season": CROP_PROFILES.get(alt_crop, {}).get("season", "Seasonal"),
                "description": CROP_PROFILES.get(alt_crop, {}).get("description", "")
            })

    return {
        "recommended_crop": top_crop,
        "suitability": suitability_pct,
        "measured_validation_accuracy": meta["val_accuracy"],
        "season": profile.get("season", "Seasonal"),
        "crop_description": profile.get("description", ""),
        "historical_context_fit": context_fit,
        "primary_reason": primary_reason,
        "factors": factor_explanations,
        "alternatives": alternatives,
        "feature_importances": meta["feature_importances"]
    }

if __name__ == "__main__":
    m, meta = train_or_load_model()
    print("Testing sample prediction:")
    res = predict_crop_suitability(85, 45, 40, 22, 65, 6.8, 80)
    print("Result:", res["recommended_crop"], "Suitability:", res["suitability"])
