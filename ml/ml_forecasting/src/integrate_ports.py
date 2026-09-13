import pandas as pd
from pathlib import Path


# ============================================================
# FILE PATHS
# ============================================================

FREIGHT_FILE = Path(
    "ml_forecasting/data/interim/freight_trade_integrated.csv"
)

PORT_FILE = Path(
    "ml_forecasting/data/interim/port_traffic_cleaned.csv"
)

OUTPUT_FILE = Path(
    "ml_forecasting/data/interim/freight_trade_port_integrated.csv"
)


print("=" * 60)
print("FREIGHT + TRADE + PORT INTEGRATION")
print("=" * 60)


# ============================================================
# 1. LOAD DATA
# ============================================================

freight = pd.read_csv(
    FREIGHT_FILE,
    parse_dates=["Date"]
)

ports = pd.read_csv(PORT_FILE)


print("\nFreight + trade shape:")
print(freight.shape)

print("\nPort shape:")
print(ports.shape)


# ============================================================
# 2. CONVERT FINANCIAL YEAR TO START YEAR
# ============================================================

ports["FY_Start"] = (
    ports["Year"]
    .astype(str)
    .str[:4]
    .astype(int)
)


# ============================================================
# 3. KEEP REQUIRED PORT COLUMNS
# ============================================================

ports = ports[
    [
        "Port",
        "FY_Start",
        "Total Traffic"
    ]
].copy()


# ============================================================
# 4. CREATE PORT-WIDE DATASET
# ============================================================

port_wide = ports.pivot(
    index="FY_Start",
    columns="Port",
    values="Total Traffic"
).reset_index()


# Rename columns

port_wide = port_wide.rename(
    columns={
        "Chennai":
            "Chennai_Total_Traffic",

        "Kamarajar":
            "Kamarajar_Total_Traffic",

        "Paradip":
            "Paradip_Total_Traffic",

        "SMP Kolkata/Haldia":
            "SMP_Kolkata_Haldia_Total_Traffic",

        "Visakhapatnam":
            "Visakhapatnam_Total_Traffic"
    }
)


print("\nPort wide shape:")
print(port_wide.shape)

print("\nPort wide columns:")
print(port_wide.columns.tolist())


# ============================================================
# 5. CREATE LEAKAGE-SAFE FINANCIAL-YEAR MAPPING
# ============================================================
#
# A financial year FY_Start -> FY_Start+1
#
# Example:
#
# FY 2011-12
# starts April 2011
# ends March 2012
#
# It becomes fully known only after March 2012.
#
# Therefore:
#
# Jan-Mar 2012 -> use FY 2010-11
# Apr-Dec 2012 -> use FY 2011-12
#
# ============================================================


freight["Calendar_Year"] = freight["Date"].dt.year
freight["Month"] = freight["Date"].dt.month


# Financial year whose data was already completed
#
# Jan-Mar:
#   use FY beginning two years earlier
#
# Apr-Dec:
#   use FY beginning previous calendar year

freight["Port_FY_Start"] = freight["Calendar_Year"]

freight.loc[
    freight["Month"] <= 3,
    "Port_FY_Start"
] = freight["Calendar_Year"] - 2

freight.loc[
    freight["Month"] >= 4,
    "Port_FY_Start"
] = freight["Calendar_Year"] - 1


# ============================================================
# 6. MERGE PORT DATA
# ============================================================

merged = freight.merge(
    port_wide,
    left_on="Port_FY_Start",
    right_on="FY_Start",
    how="left"
)


# ============================================================
# 7. REMOVE HELPER COLUMNS
# ============================================================

merged = merged.drop(
    columns=[
        "Calendar_Year",
        "Month",
        "Port_FY_Start",
        "FY_Start"
    ]
)


# ============================================================
# 8. CHECK RESULTS
# ============================================================

port_columns = [
    "Chennai_Total_Traffic",
    "Kamarajar_Total_Traffic",
    "Paradip_Total_Traffic",
    "SMP_Kolkata_Haldia_Total_Traffic",
    "Visakhapatnam_Total_Traffic"
]


print("\nFinal integrated shape:")
print(merged.shape)


print("\nFinal columns:")
print(merged.columns.tolist())


print("\nMissing values in port features:")
print(
    merged[port_columns].isna().sum()
)


print("\nFirst 15 rows:")
print(
    merged[
        ["Date"] + port_columns
    ].head(15).to_string(index=False)
)


print("\nLast 15 rows:")
print(
    merged[
        ["Date"] + port_columns
    ].tail(15).to_string(index=False)
)


# ============================================================
# 9. CHECK PORT COVERAGE
# ============================================================

print("\nPort feature coverage:")

for column in port_columns:
    available = merged[column].notna().sum()
    missing = merged[column].isna().sum()

    print(
        f"{column}: "
        f"{available} available, "
        f"{missing} missing"
    )


# ============================================================
# 10. SAVE
# ============================================================

merged.to_csv(
    OUTPUT_FILE,
    index=False
)


print("\nSaved to:")
print(OUTPUT_FILE)


print("\n" + "=" * 60)
print("FREIGHT + TRADE + PORT INTEGRATION COMPLETED")
print("=" * 60)