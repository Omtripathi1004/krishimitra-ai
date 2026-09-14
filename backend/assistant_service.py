"""
Context-Aware Krishi AI Assistant & Agricultural Knowledge Retrieval Service.
Uses verified agronomic practices (ICAR, KVK, State Agricultural Universities)
and injects active farm, soil, weather, and crop context into every response.
Supports English & Hindi.
"""

AGRONOMIC_KNOWLEDGE_BASE = [
    {
        "topics": ["fertilizer", "urea", "dap", "npk", "nutrition", "खाद", "यूरिया"],
        "crops": ["Wheat", "गेहूं"],
        "en": "For Wheat, the recommended NPK ratio is 120:60:40 kg/ha. Apply 1/3 Nitrogen and full P & K as basal dose at sowing. Top dress remaining Nitrogen in two equal splits: 1st at Crown Root Initiation (CRI, 21-25 days) and 2nd at first flowering / jointing.",
        "hi": "गेहूं के लिए अनुशंसित NPK अनुपात 120:60:40 किग्रा/हेक्टेयर है। बुवाई के समय 1/3 नाइट्रोजन और पूरी फास्फोरस व पोटाश बेसल खुराक के रूप में दें। शेष नाइट्रोजन को दो बराबर भागों में दें: पहला सीआरआई अवस्था (21-25 दिन) पर और दूसरा कल्ले फूटते समय।"
    },
    {
        "topics": ["fertilizer", "urea", "dap", "npk", "खाद", "धान"],
        "crops": ["Rice (Paddy)", "धान"],
        "en": "For Rice, standard NPK is 100-120:50:50 kg/ha. Apply zinc sulphate (25 kg/ha) basally to prevent Khaira disease. Top-dress Urea in three splits: 1/3 basal, 1/3 tillering, and 1/3 panicle initiation.",
        "hi": "धान के लिए मानक NPK 100-120:50:50 किग्रा/हेक्टेयर है। खैरा रोग से बचाव के लिए 25 किग्रा जिंक सल्फेट बुवाई/रोपाई पर दें। यूरिया को तीन भागों में दें: 1/3 रोपाई पर, 1/3 कल्ले निकलते समय, और 1/3 बाली बनते समय।"
    },
    {
        "topics": ["pest", "disease", "rust", "yellow rust", "कीट", "रोग", "पीला रतुआ"],
        "crops": ["Wheat", "गेहूं"],
        "en": "For Yellow Rust in Wheat (stripe rust), inspect for yellow powdery pustules on leaves. If observed, spray Propiconazole 25% EC (Tilt) @ 1 ml per liter of water (200 ml/acre in 200L water) during calm morning hours.",
        "hi": "गेहूं में पीला रतुआ (येलो रस्ट) दिखने पर पत्तियों पर पीली धारियां बनती हैं। लक्षण दिखते ही प्रोपिकोनाज़ोल 25% ईसी (टिल्ट) @ 1 मिली प्रति लीटर पानी (200 मिली प्रति एकड़ 200 लीटर पानी में) सुबह के समय छिड़कें।"
    },
    {
        "topics": ["pest", "bollworm", "pink bollworm", "कीट", "गुलाबी सुंडी", "कपास"],
        "crops": ["Cotton", "कपास"],
        "en": "For Pink Bollworm in Cotton, install pheromone traps @ 5 traps/acre for monitoring. If catch exceeds 8 moths/trap/night for 3 consecutive days, spray Emamectin Benzoate 5% SG @ 5g/10L water or Profenofos 50% EC @ 2ml/L.",
        "hi": "कपास में गुलाबी सुंडी की निगरानी के लिए 5 फेरोमोन ट्रैप प्रति एकड़ लगाएं। यदि लगातार 3 दिन प्रति ट्रैप 8 से अधिक पतंगे आएं, तो एमामेक्टिन बेंजोएट 5% एसजी 5 ग्राम प्रति 10 लीटर पानी या प्रोफेनोफॉस 50% ईसी 2 मिली/लीटर का छिड़काव करें।"
    },
    {
        "topics": ["irrigation", "water", "सिंचाई", "पानी"],
        "crops": ["All", "Wheat", "Rice (Paddy)", "Maize", "Mustard"],
        "en": "Critical irrigation stages: For Wheat, Crown Root Initiation (21 days) is most crucial; skipping it causes up to 30% yield loss. For Mustard, irrigate at flowering (30-35 DAS) and siliqua formation (55-60 DAS). Avoid flood irrigation during windy periods to prevent lodging.",
        "hi": "महत्वपूर्ण सिंचाई अवस्थाएं: गेहूं में पहली सिंचाई क्राउन रूट इनिशिएशन (21-25 दिन) पर सबसे जरूरी है, इसे छोड़ने से 30% तक पैदावार घट सकती है। सरसों में फूल आते समय (30-35 दिन) व फलियां बनते समय पानी दें।"
    },
    {
        "topics": ["scheme", "pm-kisan", "subsidies", "सरकारी योजना", "पीएम किसान", "सब्सिडी"],
        "crops": ["All"],
        "en": "PM-KISAN provides ₹6,000/year directly into farmer bank accounts in 3 installments of ₹2,000. Ensure your e-KYC is linked with Aadhaar on pmkisan.gov.in. For drip/sprinkler subsidies (up to 55%), apply via State Horticulture portal under PMKSY.",
        "hi": "पीएम-किसान योजना के तहत ₹6,000 प्रति वर्ष 3 किस्तों में सीधे बैंक खाते में मिलते हैं। pmkisan.gov.in पर ई-केवाईसी पूर्ण रखें। ड्रिप या स्प्रिंकलर सिंचाई पर 55% तक सब्सिडी के लिए राज्य के उद्यानिकी पोर्टल पर पीएमकेएसवाई में आवेदन करें।"
    },
    {
        "topics": ["weed", "herbicide", "खरपतवार", "खरपतवारनाशी"],
        "crops": ["Wheat", "गेहूं"],
        "en": "For broad-leaf weeds in wheat, apply 2,4-D amine salt (58% WSC) @ 400 ml/acre or Metsulfuron Methyl 20% WP @ 8 g/acre at 30-35 DAS. For Phalaris minor (Gulli Danda), spray Clodinafop-propargyl 15% WP @ 160 g/acre in 150L water.",
        "hi": "गेहूं में चौड़ी पत्ती वाले खरपतवार के लिए बुवाई के 30-35 दिन बाद 2,4-डी एमाइन साल्ट 400 मिली/एकड़ या मेटसल्फ्यूरॉन मिथाइल 8 ग्राम/एकड़ छिड़कें। गुल्ली डंडा (मन्दूसी) के लिए क्लोडिनाफॉप-प्रोपार्गिल 15% डब्ल्यूपी 160 ग्राम/एकड़ का छिड़काव करें।"
    }
]

def generate_assistant_response(user_query: str, farm_context: dict, language: str = "en") -> dict:
    """
    Context-aware Agronomic Assistant answering user inquiries in English or Hindi,
    fused with active farm parameters (crop, stage, soil, weather).
    """
    query_lower = user_query.lower()
    crop = farm_context.get("current_crop", "Wheat")
    soil = farm_context.get("soil_type", "Alluvial / Loam")
    weather_temp = farm_context.get("temperature", 26.0)
    weather_rain = farm_context.get("rainfall_forecast_24h", 0.0)
    location = farm_context.get("location", "Farm")

    # Match best knowledge article
    best_match = None
    best_score = 0
    for entry in AGRONOMIC_KNOWLEDGE_BASE:
        score = 0
        for topic in entry["topics"]:
            if topic in query_lower:
                score += 2
        for c in entry["crops"]:
            if c.lower() in query_lower or c.lower() == crop.lower():
                score += 1.5
        if score > best_score:
            best_score = score
            best_match = entry

    # Determine response text
    if best_match and best_score >= 1.5:
        base_text = best_match["hi"] if language == "hi" else best_match["en"]
    else:
        # Graceful fallback when domain knowledge is not explicitly indexed
        if language == "hi":
            base_text = (
                f"आपके खेत संदर्भ ({crop}, मिट्टी: {soil}, स्थान: {location}) के आधार पर: "
                "कृपया विशिष्ट कृषि सलाह जैसे खाद का अनुपात (NPK), सिंचाई का समय, खरपतवार नियंत्रण, या कीट रोग की रोकथाम के बारे में पूछें।"
            )
        else:
            base_text = (
                f"Based on your farm context ({crop}, Soil: {soil}, Location: {location}): "
                "I specialize in ICAR-verified crop nutrition (NPK), pest/disease management, irrigation timing, and official government schemes. "
                "Could you specify the exact pest, crop stage, or operation you need guidance on?"
            )

    # Add real-time contextual weather notice if temperature or rain is extreme
    context_alert = ""
    if weather_rain > 3.0:
        if language == "hi":
            context_alert = f"\n\n⚠️ मौसम चेतावनी: अगले 24 घंटों में {weather_rain} मिमी बारिश का अनुमान है। कीटनाशक छिड़काव और सिंचाई स्थगित रखें।"
        else:
            context_alert = f"\n\n⚠️ Weather Notice: {weather_rain} mm rain forecast in the next 24h. Postpone chemical spraying and top-dress fertilizers."
    elif weather_temp > 35.0:
        if language == "hi":
            context_alert = f"\n\n☀️ तापमान चेतावनी: वर्तमान तापमान {weather_temp}°C है। पौधों को गर्मी से बचाने के लिए सुबह या शाम को हल्की सिंचाई करें।"
        else:
            context_alert = f"\n\n☀️ Temperature Notice: Local temperature is {weather_temp}°C. Schedule critical operations in early morning hours to avoid heat stress."

    final_answer = base_text + context_alert

    return {
        "reply": final_answer,
        "language": language,
        "context_applied": {
            "crop": crop,
            "soil": soil,
            "location": location,
            "temperature": f"{weather_temp}°C",
            "rain_24h": f"{weather_rain} mm"
        },
        "source": "ICAR / Krishi Vigyan Kendra (KVK) Agronomy Standards"
    }
