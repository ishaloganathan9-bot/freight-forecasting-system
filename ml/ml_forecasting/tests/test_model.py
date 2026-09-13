import os
import joblib
import pandas as pd


MODEL_PATH = "ml_forecasting/models/xgboost_v1.0.joblib"
DATA_PATH = "ml_forecasting/data/processed/freight_forecasting_features.csv"


print("=== MODEL VERIFICATION ===\n")


# 1. Check model file
print("1. Checking model file...")
assert os.path.exists(MODEL_PATH), "Model file not found"
print("   PASS - Model file exists")


# 2. Load model
print("\n2. Loading model...")
model = joblib.load(MODEL_PATH)
print("   PASS - Model loaded successfully")


# 3. Load dataset
print("\n3. Loading feature dataset...")
df = pd.read_csv(DATA_PATH)
print(f"   PASS - Dataset loaded: {df.shape}")


# 4. Features used by the model
feature_columns = [
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
    "Year"
]


# 5. Check all required columns
print("\n4. Checking required feature columns...")

missing_columns = [
    column for column in feature_columns
    if column not in df.columns
]

assert not missing_columns, f"Missing columns: {missing_columns}"

print(f"   PASS - All {len(feature_columns)} feature columns found")


# 6. Prepare feature matrix
X = df[feature_columns]


# 7. Generate predictions
print("\n5. Generating predictions...")
predictions = model.predict(X)

print(f"   PASS - Generated {len(predictions)} predictions")


# 8. Validate predictions
print("\n6. Checking prediction values...")

assert len(predictions) == len(X), "Prediction count mismatch"
assert all(pd.notna(predictions)), "Missing prediction values"
assert all(predictions >= 0), "Negative freight predictions found"

print("   PASS - Predictions are valid")


# 9. Display sample predictions
print("\n7. Sample predictions:")

for i in range(5):
    print(
        f"   {df.iloc[i]['Date']} -> "
        f"{predictions[i]:.2f}"
    )


print("\n==============================")
print("ALL MODEL TESTS PASSED")
print("==============================")