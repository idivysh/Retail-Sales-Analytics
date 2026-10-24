
from pathlib import Path

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Retail Sales Analytics API",
    description="Backend API for retail sales and customer insights",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://retail-sales-analytics-neon.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).resolve().parent / "data" / "processed"


def load_csv(filename: str) -> pd.DataFrame:
    file_path = DATA_DIR / filename

    if not file_path.exists():
        raise HTTPException(
            status_code=500,
            detail=f"Data file not found: {filename}",
        )

    return pd.read_csv(file_path)


@app.get("/")
def home():
    return {
        "message": "Retail Sales Analytics API is running",
        "docs": "/docs",
    }


@app.get("/api/kpis")
def get_kpis():
    df = load_csv("kpi_summary.csv")
    return df.to_dict(orient="records")


@app.get("/api/monthly-sales")
def get_monthly_sales():
    df = load_csv("monthly_sales.csv")
    return df.to_dict(orient="records")


@app.get("/api/country-sales")
def get_country_sales():
    df = load_csv("country_sales.csv")
    return df.head(10).to_dict(orient="records")


@app.get("/api/customer-segmentation")
def get_customer_segmentation():
    df = load_csv("customer_segmentation.csv")
    return df.to_dict(orient="records")


@app.get("/api/customer-summary")
def get_customer_summary():
    df = load_csv("customer_summary.csv")
    return df.head(100).to_dict(orient="records")
