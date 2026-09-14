from sqlalchemy import Column, Integer, Float, String, Text, Boolean, DateTime
from datetime import datetime
from backend.database import Base

class Farm(Base):
    __tablename__ = "farms"

    id = Column(Integer, primary_key=True, index=True)
    farm_name = Column(String(100), default="Shanti Agro Farm")
    farmer_name = Column(String(100), default="Ramesh Kumar")
    location_name = Column(String(120), default="Ludhiana, Punjab")
    latitude = Column(Float, default=30.9010)
    longitude = Column(Float, default=75.8573)
    area_acres = Column(Float, default=4.5)
    soil_type = Column(String(60), default="Alluvial / Loam")
    nitrogen = Column(Float, default=85.0)
    phosphorus = Column(Float, default=45.0)
    potassium = Column(Float, default=40.0)
    soil_ph = Column(Float, default=6.8)
    irrigation_method = Column(String(60), default="Drip Irrigation")
    current_crop = Column(String(60), default="Wheat")
    crop_stage = Column(String(60), default="Vegetative")
    created_at = Column(DateTime, default=datetime.utcnow)

class PlannerTask(Base):
    __tablename__ = "planner_tasks"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, default=1)
    title = Column(String(200), nullable=False)
    category = Column(String(50), default="general")  # irrigation, fertilizer, pest_control, sowing, harvest
    due_date = Column(String(50), default="2026-09-18")
    status = Column(String(30), default="pending")    # pending, completed
    priority = Column(String(20), default="medium")   # high, medium, low
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
