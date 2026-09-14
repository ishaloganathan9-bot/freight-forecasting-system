import pandas as pd
import matplotlib.pyplot as plt

# Load final integrated dataset
df = pd.read_csv(
    "ml_forecasting/data/processed/freight_forecasting_dataset.csv"
)

# Convert Date
df["Date"] = pd.to_datetime(df["Date"])

# Basic information
print("========================================")
print("PHASE 7 - EXPLORATORY DATA ANALYSIS")
print("========================================")

print("\nDataset Shape:")
print(df.shape)

print("\nDate Range:")
print(df["Date"].min(), "to", df["Date"].max())

print("\nColumns:")
print(df.columns.tolist())

print("\nMissing Values:")
print(df.isnull().sum())

print("\nFirst 5 Rows:")
print(df.head())


# ----------------------------------------
# Freight Index Trend
# ----------------------------------------

plt.figure(figsize=(12, 5))

plt.plot(
    df["Date"],
    df["Freight_Index"]
)

plt.title("Freight Index Over Time")
plt.xlabel("Date")
plt.ylabel("Freight Index")
plt.xticks(rotation=45)
plt.tight_layout()

plt.show()