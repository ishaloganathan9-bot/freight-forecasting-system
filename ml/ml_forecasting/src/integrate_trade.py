import pandas as pd
from pathlib import Path


# ============================================================
# FILE PATHS
# ============================================================

FREIGHT_FILE = Path(
    "ml_forecasting/data/interim/freight_cleaned.csv"
)

TRADE_FILE = Path(
    "ml_forecasting/data/interim/trade_cleaned.csv"
)

OUTPUT_FILE = Path(
    "ml_forecasting/data/interim/freight_trade_integrated.csv"
)


print("=" * 60)
print("FREIGHT + INDIA TRADE INTEGRATION")
print("=" * 60)


# ============================================================
# 1. LOAD DATA
# ============================================================

freight = pd.read_csv(
    FREIGHT_FILE,
    parse_dates=["Date"]
)

trade = pd.read_csv(TRADE_FILE)


print("\nFreight shape:")
print(freight.shape)

print("\nTrade shape:")
print(trade.shape)


# ============================================================
# 2. SELECT INDIA
# ============================================================

india_trade = trade[
    trade["Economy Label"] == "India"
].copy()


print("\nIndia trade rows:")
print(india_trade.shape)


# ============================================================
# 3. SELECT DRY CARGO
# ============================================================

india_trade = india_trade[
    india_trade["CargoType"].isin([13, 23])
].copy()


print("\nSelected cargo types:")
print(
    india_trade[
        ["CargoType", "CargoType Label"]
    ].drop_duplicates()
)


# ============================================================
# 4. KEEP REQUIRED COLUMNS
# ============================================================

india_trade = india_trade[
    [
        "Year",
        "CargoType",
        "CargoType Label",
        "Metric tons in thousands"
    ]
].copy()


# ============================================================
# 5. PIVOT CARGO TYPES
# ============================================================

trade_wide = india_trade.pivot(
    index="Year",
    columns="CargoType Label",
    values="Metric tons in thousands"
).reset_index()


# Rename columns

trade_wide = trade_wide.rename(
    columns={
        "Dry cargo loaded":
            "India_Dry_Cargo_Loaded",
        "Dry cargo discharged":
            "India_Dry_Cargo_Discharged"
    }
)


print("\nTrade wide shape:")
print(trade_wide.shape)

print("\nTrade wide columns:")
print(trade_wide.columns.tolist())


# ============================================================
# 6. CREATE ONE-YEAR LAG
# ============================================================

trade_wide["Trade_Year"] = trade_wide["Year"]

trade_wide["Year"] = trade_wide["Year"] + 1


trade_wide = trade_wide.rename(
    columns={
        "Year": "Freight_Year"
    }
)


print("\nLeakage-safe trade mapping:")
print(
    trade_wide[
        [
            "Freight_Year",
            "Trade_Year",
            "India_Dry_Cargo_Loaded",
            "India_Dry_Cargo_Discharged"
        ]
    ].tail(10)
)


# ============================================================
# 7. CREATE FREIGHT YEAR
# ============================================================

freight["Freight_Year"] = freight["Date"].dt.year


# ============================================================
# 8. MERGE
# ============================================================

merged = freight.merge(
    trade_wide[
        [
            "Freight_Year",
            "India_Dry_Cargo_Loaded",
            "India_Dry_Cargo_Discharged"
        ]
    ],
    on="Freight_Year",
    how="left"
)


# ============================================================
# 9. REMOVE HELPER COLUMN
# ============================================================

merged = merged.drop(
    columns=["Freight_Year"]
)


# ============================================================
# 10. CHECK RESULTS
# ============================================================

print("\nFinal integrated shape:")
print(merged.shape)

print("\nColumns:")
print(merged.columns.tolist())


print("\nMissing values:")
print(
    merged[
        [
            "India_Dry_Cargo_Loaded",
            "India_Dry_Cargo_Discharged"
        ]
    ].isna().sum()
)


print("\nSample:")
print(
    merged.head(15).to_string(index=False)
)


print("\nLast rows:")
print(
    merged.tail(15).to_string(index=False)
)


# ============================================================
# 11. SAVE
# ============================================================

merged.to_csv(
    OUTPUT_FILE,
    index=False
)


print("\nSaved to:")
print(OUTPUT_FILE)


print("\n" + "=" * 60)
print("FREIGHT + INDIA TRADE INTEGRATION COMPLETED")
print("=" * 60)