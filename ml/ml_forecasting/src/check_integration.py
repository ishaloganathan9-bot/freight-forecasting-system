import pandas as pd
from pathlib import Path


FREIGHT_FILE = Path(
    "ml_forecasting/data/interim/freight_cleaned.csv"
)

COMMODITY_FILE = Path(
    "ml_forecasting/data/interim/commodity_prices_cleaned.csv"
)


print("=" * 60)
print("PHASE 6 - INTEGRATION CHECK")
print("=" * 60)


# ---------------------------------------------------------
# Load datasets
# ---------------------------------------------------------

freight = pd.read_csv(
    FREIGHT_FILE,
    parse_dates=["Date"]
)

commodity = pd.read_csv(
    COMMODITY_FILE,
    parse_dates=["Date"]
)


print("\nFreight:")
print(freight.shape)
print(
    freight["Date"].min(),
    "to",
    freight["Date"].max()
)


print("\nCommodity:")
print(commodity.shape)
print(
    commodity["Date"].min(),
    "to",
    commodity["Date"].max()
)


# ---------------------------------------------------------
# Find overlapping period
# ---------------------------------------------------------

start_date = max(
    freight["Date"].min(),
    commodity["Date"].min()
)

end_date = min(
    freight["Date"].max(),
    commodity["Date"].max()
)


print("\nOverlapping period:")
print(start_date, "to", end_date)


# ---------------------------------------------------------
# Filter commodity data to freight period
# ---------------------------------------------------------

commodity_overlap = commodity[
    (commodity["Date"] >= start_date) &
    (commodity["Date"] <= end_date)
].copy()


print("\nCommodity rows in freight period:")
print(commodity_overlap.shape)


# ---------------------------------------------------------
# Pivot commodities
# ---------------------------------------------------------

commodity_wide = commodity_overlap.pivot(
    index="Date",
    columns="Commodity",
    values="Price"
).reset_index()


print("\nCommodity wide shape:")
print(commodity_wide.shape)


print("\nCommodity wide columns:")
print(commodity_wide.columns.tolist())


# ---------------------------------------------------------
# Merge with freight
# ---------------------------------------------------------

merged = freight.merge(
    commodity_wide,
    on="Date",
    how="left"
)


print("\nMerged shape:")
print(merged.shape)


# ---------------------------------------------------------
# Check missing values
# ---------------------------------------------------------

print("\nMissing values after Freight + Commodity merge:")
print(
    merged.isna().sum()
)


# ---------------------------------------------------------
# Check dates
# ---------------------------------------------------------

print("\nNumber of freight dates:")
print(
    freight["Date"].nunique()
)

print("\nNumber of merged dates:")
print(
    merged["Date"].nunique()
)


# ---------------------------------------------------------
# Check duplicates
# ---------------------------------------------------------

print("\nDuplicate dates in merged dataset:")
print(
    merged["Date"].duplicated().sum()
)


# ---------------------------------------------------------
# Display sample
# ---------------------------------------------------------

print("\nFirst 10 rows:")
print(
    merged.head(10).to_string(index=False)
)


print("\nLast 10 rows:")
print(
    merged.tail(10).to_string(index=False)
)


print("\n" + "=" * 60)
print("INTEGRATION CHECK COMPLETED")
print("=" * 60)