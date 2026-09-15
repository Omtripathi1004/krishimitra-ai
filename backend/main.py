from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session

from backend.database import engine, Base, get_db
from backend.models import Farm, PlannerTask
from backend.ml_model import predict_crop_suitability, train_or_load_model, get_model_evaluation_metrics
from backend.weather_service import get_live_weather
from backend.irrigation_service import compute_smart_irrigation
from backend.assistant_service import generate_assistant_response
from backend.viksit_bharat_service import get_viksit_bharat_data

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize ML model
train_or_load_model()

app = FastAPI(
    title="KrishiMitra AI API",
    description="Precision Agricultural Decision Support Engine & Explainable AI",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def init_default_farm(db: Session):
    farm = db.query(Farm).first()
    if not farm:
        farm = Farm(
            farm_name="Kisan Kalyan Demo Farm",
            farmer_name="Sardar Gurpreet Singh",
            location_name="Ludhiana, Punjab",
            latitude=30.9010,
            longitude=75.8573,
            area_acres=5.0,
            soil_type="Alluvial / Loam",
            nitrogen=90.0,
            phosphorus=48.0,
            potassium=42.0,
            soil_ph=6.8,
            irrigation_method="Drip Irrigation",
            current_crop="Wheat",
            crop_stage="Vegetative"
        )
        db.add(farm)
        db.commit()
        db.refresh(farm)

        # Seed initial realistic crop tasks
        tasks = [
            PlannerTask(farm_id=farm.id, title="Inspect wheat leaf tips for fungal yellow rust signs", category="pest_control", due_date="Today", priority="high", status="pending"),
            PlannerTask(farm_id=farm.id, title="Top-dress 25 kg Urea per acre at Crown Root stage", category="fertilizer", due_date="Tomorrow", priority="medium", status="pending"),
            PlannerTask(farm_id=farm.id, title="Flush drip filter mesh and check line pressure (1.2 bar)", category="irrigation", due_date="In 3 days", priority="medium", status="completed"),
            PlannerTask(farm_id=farm.id, title="Record soil moisture reading across block A & B", category="general", due_date="In 5 days", priority="low", status="pending")
        ]
        db.add_all(tasks)
        db.commit()
    return farm

def farm_to_dict(farm: Farm):
    return {
        "id": farm.id,
        "farm_name": farm.farm_name,
        "farmer_name": farm.farmer_name,
        "location_name": farm.location_name,
        "latitude": farm.latitude,
        "longitude": farm.longitude,
        "area_acres": farm.area_acres,
        "soil_type": farm.soil_type,
        "nitrogen": farm.nitrogen,
        "phosphorus": farm.phosphorus,
        "potassium": farm.potassium,
        "soil_ph": farm.soil_ph,
        "irrigation_method": farm.irrigation_method,
        "current_crop": farm.current_crop,
        "crop_stage": farm.crop_stage
    }

def task_to_dict(t: PlannerTask):
    return {
        "id": t.id,
        "farm_id": t.farm_id,
        "title": t.title,
        "category": t.category,
        "due_date": t.due_date,
        "status": t.status,
        "priority": t.priority,
        "notes": t.notes or ""
    }

# Pydantic Schemas
class FarmUpdateSchema(BaseModel):
    farm_name: Optional[str] = None
    farmer_name: Optional[str] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    area_acres: Optional[float] = None
    soil_type: Optional[str] = None
    nitrogen: Optional[float] = None
    phosphorus: Optional[float] = None
    potassium: Optional[float] = None
    soil_ph: Optional[float] = None
    irrigation_method: Optional[str] = None
    current_crop: Optional[str] = None
    crop_stage: Optional[str] = None

class CropPredictRequest(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class TaskCreateSchema(BaseModel):
    title: str
    category: str = "general"
    due_date: str = "Today"
    priority: str = "medium"
    notes: Optional[str] = ""

class AssistantQueryRequest(BaseModel):
    message: str
    language: Optional[str] = "en"  # "en" or "hi"

# --- API ROUTES ---

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "KrishiMitra AI Core Engine", "version": "1.0.0"}

@app.get("/api/farm")
def get_farm(db: Session = Depends(get_db)):
    farm = init_default_farm(db)
    return farm_to_dict(farm)

@app.put("/api/farm")
def update_farm(payload: FarmUpdateSchema, db: Session = Depends(get_db)):
    farm = init_default_farm(db)
    data = payload.dict(exclude_unset=True)
    for key, value in data.items():
        if value is not None:
            setattr(farm, key, value)
    db.commit()
    db.refresh(farm)
    return farm_to_dict(farm)

@app.get("/api/weather")
def get_weather(lat: Optional[float] = None, lon: Optional[float] = None, location: Optional[str] = None, db: Session = Depends(get_db)):
    farm = init_default_farm(db)
    target_lat = lat if lat is not None else farm.latitude
    target_lon = lon if lon is not None else farm.longitude
    target_loc = location if location is not None else farm.location_name
    return get_live_weather(target_lat, target_lon, target_loc)

@app.post("/api/recommend-crop")
def recommend_crop(payload: CropPredictRequest):
    return predict_crop_suitability(
        n=payload.nitrogen,
        p=payload.phosphorus,
        k=payload.potassium,
        temp=payload.temperature,
        humidity=payload.humidity,
        ph=payload.ph,
        rainfall=payload.rainfall
    )

@app.get("/api/smart-irrigation")
def get_smart_irrigation(db: Session = Depends(get_db)):
    farm = init_default_farm(db)
    weather = get_live_weather(farm.latitude, farm.longitude, farm.location_name)
    
    irrigation_data = compute_smart_irrigation(
        crop=farm.current_crop,
        crop_stage=farm.crop_stage,
        soil_type=farm.soil_type,
        irrigation_method=farm.irrigation_method,
        temperature=weather["temperature"],
        humidity=weather["humidity"],
        rainfall_24h=weather["rainfall_forecast_24h"],
        rainfall_7d=weather["rainfall_forecast_7d"]
    )
    
    # Bundle "Today's Farm Action" required format
    today_farm_action = {
        "irrigation": irrigation_data["status"],
        "rain_expectation": f"{weather['rainfall_forecast_24h']} mm today ({weather['rainfall_forecast_7d']} mm in 7-day forecast)",
        "crop_condition": weather["crop_condition"],
        "next_action": irrigation_data["action"]
    }
    
    return {
        "irrigation_data": irrigation_data,
        "today_farm_action": today_farm_action,
        "weather_snapshot": {
            "temperature": weather["temperature"],
            "humidity": weather["humidity"],
            "condition": weather["condition"],
            "spray_suitability": weather["spray_suitability"]
        }
    }

@app.get("/api/tasks")
def get_tasks(db: Session = Depends(get_db)):
    init_default_farm(db)
    tasks = db.query(PlannerTask).order_by(PlannerTask.id.desc()).all()
    return [task_to_dict(t) for t in tasks]

@app.post("/api/tasks")
def create_task(payload: TaskCreateSchema, db: Session = Depends(get_db)):
    task = PlannerTask(
        title=payload.title,
        category=payload.category,
        due_date=payload.due_date,
        priority=payload.priority,
        notes=payload.notes or "",
        status="pending"
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task_to_dict(task)

@app.patch("/api/tasks/{task_id}/toggle")
def toggle_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(PlannerTask).filter(PlannerTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.status = "completed" if task.status == "pending" else "pending"
    db.commit()
    db.refresh(task)
    return task_to_dict(task)

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(PlannerTask).filter(PlannerTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}

@app.post("/api/assistant/chat")
def assistant_chat(payload: AssistantQueryRequest, db: Session = Depends(get_db)):
    farm = init_default_farm(db)
    weather = get_live_weather(farm.latitude, farm.longitude, farm.location_name)
    farm_context = {
        "current_crop": farm.current_crop,
        "crop_stage": farm.crop_stage,
        "soil_type": farm.soil_type,
        "location": farm.location_name,
        "temperature": weather["temperature"],
        "rainfall_forecast_24h": weather["rainfall_forecast_24h"]
    }
    return generate_assistant_response(payload.message, farm_context, payload.language or "en")

@app.get("/api/viksit-bharat")
def viksit_bharat():
    return get_viksit_bharat_data()

@app.get("/api/analytics")
def get_farm_analytics(db: Session = Depends(get_db)):
    farm = init_default_farm(db)
    
    # Soil nutrient health radar values (ideal vs actual)
    soil_health = {
        "metrics": [
            {"name": "Nitrogen", "actual": farm.nitrogen, "ideal": 100, "status": "Good" if 70 <= farm.nitrogen <= 120 else "Attention"},
            {"name": "Phosphorus", "actual": farm.phosphorus, "ideal": 50, "status": "Optimal" if 40 <= farm.phosphorus <= 60 else "Attention"},
            {"name": "Potassium", "actual": farm.potassium, "ideal": 50, "status": "Moderate" if 35 <= farm.potassium <= 65 else "Attention"},
            {"name": "pH Balance", "actual": farm.soil_ph, "ideal": 6.5, "status": "Optimal" if 6.0 <= farm.soil_ph <= 7.5 else "Sub-optimal"},
            {"name": "Organic Carbon %", "actual": 0.62, "ideal": 0.75, "status": "Moderate"},
            {"name": "Moisture Index", "actual": 74, "ideal": 80, "status": "Adequate"}
        ],
        "overall_score": 88
    }

    # Historical yield performance (Quintals / Acre)
    yield_history = [
        {"season": "Kharif 2023 (Rice)", "yield_qtl_acre": 24.5, "benchmark": 21.0},
        {"season": "Rabi 2023-24 (Wheat)", "yield_qtl_acre": 21.8, "benchmark": 19.5},
        {"season": "Zaid 2024 (Moong)", "yield_qtl_acre": 6.2, "benchmark": 5.5},
        {"season": "Kharif 2024 (Rice)", "yield_qtl_acre": 25.8, "benchmark": 21.5},
        {"season": "Rabi 2024-25 (Projected)", "yield_qtl_acre": 23.2, "benchmark": 20.0}
    ]

    # Water efficiency index (m3 per quintal produced)
    water_efficiency = [
        {"method": "Flood / Basin", "water_used_m3": 1400, "efficiency": "48%"},
        {"method": "Furrow", "water_used_m3": 1150, "efficiency": "65%"},
        {"method": "Sprinkler", "water_used_m3": 920, "efficiency": "78%"},
        {"method": "Drip Irrigation (Active)", "water_used_m3": 680, "efficiency": "93%"}
    ]

    return {
        "soil_health": soil_health,
        "yield_history": yield_history,
        "water_efficiency": water_efficiency,
        "farm_area_acres": farm.area_acres,
        "irrigation_savings_pct": 38
    }

@app.get("/api/model-evaluation")
def get_model_evaluation():
    return get_model_evaluation_metrics()

