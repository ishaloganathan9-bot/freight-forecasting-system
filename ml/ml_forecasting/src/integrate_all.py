import pandas as pd
from pathlib import Path


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[1]

INTERIM_DIR = BASE_DIR / "data" / "interim"
PROCESSED_DIR = BASE_DIR / "data" / "processed"

PROCESSED_DIR.mkdir(parents=True, exist_ok=True)


# --------------------------------------------------
# Load existing integrated datasets
# --------------------------------------------------

print("Loading freight + trade + port dataset...")

main = pd.read_csv(
    INTERIM_DIR / "freight_trade_port_integrated.csv"
)

print("Main dataset shape:", main.shape)


print("\nLoading cleaned commodity dataset...")

commodity = pd.read_csv(
    INTERIM_DIR / "commodity_prices_cleaned.csv"
)

print("Commodity dataset shape:", commodity.shape)


# --------------------------------------------------
# Convert dates
# --------------------------------------------------

main["Date"] = pd.to_datetime(main["Date"])
commodity["Date"] = pd.to_datetime(commodity["Date"])


# --------------------------------------------------
# Convert commodity long format to wide format
# --------------------------------------------------

print("\nConverting commodity data to wide format...")

commodity_wide = commodity.pivot(
    index="Date",
    columns="Commodity",
    values="Price"
).reset_index()


# Remove column index name
commodity_wide.columns.name = None

print("Commodity wide shape:", commodity_wide.shape)


# --------------------------------------------------
# Merge commodity data with main dataset
# --------------------------------------------------

print("\nMerging commodity data...")

final_df = main.merge(
    commodity_wide,
    on="Date",
    how="left"
)


# --------------------------------------------------
# Sort by date
# --------------------------------------------------

final_df = final_df.sort_values("Date").reset_index(drop=True)


# --------------------------------------------------
# Check duplicates
# --------------------------------------------------

duplicate_dates = final_df["Date"].duplicated().sum()


# --------------------------------------------------
# Check missing values
# --------------------------------------------------

missing_values = final_df.isna().sum()


# --------------------------------------------------
# Save final integrated dataset
# --------------------------------------------------

output_file = PROCESSED_DIR / "freight_forecasting_dataset.csv"

final_df.to_csv(output_file, index=False)


# --------------------------------------------------
# Print results
# --------------------------------------------------

print("\n========================================")
print("FINAL DATA INTEGRATION COMPLETED")
print("========================================")

print("Final shape:", final_df.shape)

print("\nColumns:")
print(final_df.columns.tolist())

print("\nDuplicate dates:", duplicate_dates)

print("\nMissing values:")
print(missing_values)

print("\nDate range:")
print(final_df["Date"].min(), "to", final_df["Date"].max())

print("\nFirst 5 rows:")
print(final_df.head())

print("\nSaved to:")
print(output_file)