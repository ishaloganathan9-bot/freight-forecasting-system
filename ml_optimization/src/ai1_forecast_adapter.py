"""
AI/ML 1 Freight Forecast Adapter

Loads the trained AI/ML 1 XGBoost model and converts its
forecast into a clean market-signal dictionary for AI/ML 2.

Important:
The model forecasts the Baltic Dry Index (BDI), not a
route-specific freight rate. Therefore this module does not
convert BDI directly into a freight rate.
"""

from pathlib import Path

import joblib
import pandas as pd


# ------------------------------------------------------------
# PATHS
# ------------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[2]

MODEL_PATH = (
    PROJECT_ROOT
    / "ml"
    / "ml_forecasting"
    / "models"
    / "xgboost_v1.0.joblib"
)

DATA_PATH = (
    PROJECT_ROOT
    / "ml"
    / "ml_forecasting"
    / "data"
    / "processed"
    / "freight_forecasting_features.csv"
)


# ------------------------------------------------------------
# MODEL FEATURES
# ------------------------------------------------------------

MODEL_FEATURES = [
    "Freight_Index",
    "Freight_Lag_1",
    "Freight_Lag_3",
    "Freight_Lag_6",
    "Freight_Lag_12",
    "Freight_Rolling_Mean_3",
    "Freight_Rolling_Mean_6",
    "Freight_Rolling_Mean_12",
    "Aluminum_Lag_1",
    "Coal, Australian_Lag_1",
    "Coal, South African **_Lag_1",
    "Copper_Lag_1",
    "Crude oil, Brent_Lag_1",
    "Iron ore, cfr spot_Lag_1",
    "Natural gas, Europe_Lag_1",
    "Soybeans_Lag_1",
    "Wheat, US HRW_Lag_1",
    "India_Dry_Cargo_Loaded_Lag_1",
    "India_Dry_Cargo_Discharged_Lag_1",
    "Month",
    "Quarter",
    "Year",
]


# ------------------------------------------------------------
# FORECAST
# ------------------------------------------------------------

def load_ai1_model():
    """Load the trained AI/ML 1 XGBoost model."""

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"AI/ML 1 model not found: {MODEL_PATH}"
        )

    return joblib.load(MODEL_PATH)


def load_latest_features():
    """Load the latest forecasting feature row."""

    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"AI/ML 1 feature dataset not found: {DATA_PATH}"
        )

    dataframe = pd.read_csv(DATA_PATH)

    missing_features = [
        feature
        for feature in MODEL_FEATURES
        if feature not in dataframe.columns
    ]

    if missing_features:
        raise ValueError(
            "AI/ML 1 dataset is missing required features: "
            + ", ".join(missing_features)
        )

    if dataframe.empty:
        raise ValueError(
            "AI/ML 1 feature dataset is empty."
        )

    latest_row = dataframe.iloc[[-1]].copy()

    return latest_row


def forecast_market_signal():
    """
    Generate the latest AI/ML 1 market forecast.

    Returns:
        dict: Current BDI, forecast BDI, percentage change,
        and market trend.
    """

    model = load_ai1_model()
    latest_row = load_latest_features()

    features = latest_row[MODEL_FEATURES]

    forecast_bdi = float(
        model.predict(features)[0]
    )

    current_bdi = float(
        latest_row["Freight_Index"].iloc[0]
    )

    if current_bdi == 0:
        forecast_change_pct = 0.0
    else:
        forecast_change_pct = (
            (forecast_bdi - current_bdi)
            / current_bdi
        ) * 100.0

    if forecast_change_pct > 2.0:
        trend = "increasing"
    elif forecast_change_pct < -2.0:
        trend = "decreasing"
    else:
        trend = "stable"

    return {
        "current_bdi": round(
            current_bdi,
            2
        ),
        "forecast_bdi": round(
            forecast_bdi,
            2
        ),
        "forecast_change_pct": round(
            forecast_change_pct,
            2
        ),
        "trend": trend,
        "forecast_horizon": "1 month",
        "model": "xgboost_v1.0",
        "source_date": str(
            latest_row["Date"].iloc[0]
        ),
    }


# ------------------------------------------------------------
# SMOKE TEST
# ------------------------------------------------------------

if __name__ == "__main__":

    print("=" * 60)
    print("AI/ML 1 FORECAST ADAPTER TEST")
    print("=" * 60)

    result = forecast_market_signal()

    for key, value in result.items():
        print(f"{key}: {value}")

    print("=" * 60)
    print("TEST COMPLETED")