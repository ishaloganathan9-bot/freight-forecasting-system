import pandas as pd
from pathlib import Path


INPUT_FILE = Path(
    "ml_forecasting/data/raw/trade/US_SeaborneTrade.csv"
)

OUTPUT_FILE = Path(
    "ml_forecasting/data/interim/trade_cleaned.csv"
)


print("=" * 60)
print("TRADE DATA CLEANING")
print("=" * 60)


# Read raw dataset
df = pd.read_csv(INPUT_FILE)

print("\nRaw shape:")
print(df.shape)


# ---------------------------------------------------------
# 1. Keep only useful columns
# ---------------------------------------------------------

columns_to_keep = [
    "Year",
    "Economy",
    "Economy Label",
    "CargoType",
    "CargoType Label",
    "Metric tons in thousands"
]

df = df[columns_to_keep].copy()


# ---------------------------------------------------------
# 2. Convert numeric columns
# ---------------------------------------------------------

df["Year"] = pd.to_numeric(
    df["Year"],
    errors="coerce"
)

df["Economy"] = pd.to_numeric(
    df["Economy"],
    errors="coerce"
)

df["CargoType"] = pd.to_numeric(
    df["CargoType"],
    errors="coerce"
)

df["Metric tons in thousands"] = pd.to_numeric(
    df["Metric tons in thousands"],
    errors="coerce"
)


# ---------------------------------------------------------
# 3. Remove rows without required identifiers
# ---------------------------------------------------------

df = df.dropna(
    subset=[
        "Year",
        "Economy",
        "CargoType"
    ]
)


# Convert identifiers to integer
df["Year"] = df["Year"].astype(int)
df["Economy"] = df["Economy"].astype(int)
df["CargoType"] = df["CargoType"].astype(int)


# ---------------------------------------------------------
# 4. Inspect missing trade values
# ---------------------------------------------------------

print("\nMissing trade values:")
print(
    df["Metric tons in thousands"].isna().sum()
)


# We do NOT fill missing trade values with 0.
# Missing means the source did not provide a usable
# numerical value, so we remove those observations
# from the cleaned numerical dataset.


df = df.dropna(
    subset=["Metric tons in thousands"]
)


# ---------------------------------------------------------
# 5. Remove duplicate rows
# ---------------------------------------------------------

duplicates = df.duplicated().sum()

print("\nDuplicate rows before removal:")
print(duplicates)

df = df.drop_duplicates()


# ---------------------------------------------------------
# 6. Sort data
# ---------------------------------------------------------

df = df.sort_values(
    [
        "Year",
        "Economy",
        "CargoType"
    ]
).reset_index(drop=True)


# ---------------------------------------------------------
# 7. Basic validation
# ---------------------------------------------------------

print("\nCleaned shape:")
print(df.shape)

print("\nMissing values:")
print(df.isna().sum())

print("\nDuplicate rows:")
print(df.duplicated().sum())

print("\nYear range:")
print(
    df["Year"].min(),
    "to",
    df["Year"].max()
)

print("\nCargo types:")
print(
    df[
        ["CargoType", "CargoType Label"]
    ].drop_duplicates().to_string(index=False)
)

print("\nNumber of economies:")
print(
    df["Economy Label"].nunique()
)

print("\nFirst 10 cleaned rows:")
print(df.head(10))

print("\nLast 10 cleaned rows:")
print(df.tail(10))


# ---------------------------------------------------------
# 8. Save cleaned dataset
# ---------------------------------------------------------

df.to_csv(
    OUTPUT_FILE,
    index=False
)


print("\nSaved cleaned trade data to:")
print(OUTPUT_FILE)

print("\n" + "=" * 60)
print("TRADE CLEANING COMPLETED")
print("=" * 60)