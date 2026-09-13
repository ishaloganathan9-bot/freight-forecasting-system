import pandas as pd
from pathlib import Path


INPUT_FILE = Path(
    "ml_forecasting/data/raw/commodity/CMO-Historical-Data-Monthly.xlsx"
)

OUTPUT_FILE = Path(
    "ml_forecasting/data/interim/commodity_prices_cleaned.csv"
)


# Commodities selected as potentially relevant supporting features
SELECTED_COMMODITIES = [
    "Coal, Australian",
    "Coal, South African **",
    "Crude oil, Brent",
    "Natural gas, Europe",
    "Iron ore, cfr spot",
    "Aluminum",
    "Copper",
    "Wheat, US HRW",
    "Soybeans"
]


print("=" * 60)
print("COMMODITY DATA CLEANING")
print("=" * 60)


# Read workbook
excel = pd.ExcelFile(INPUT_FILE)

print("\nAvailable sheets:")
print(excel.sheet_names)


# Read Monthly Prices without assuming a normal header
raw = pd.read_excel(
    INPUT_FILE,
    sheet_name="Monthly Prices",
    header=None
)

print("\nRaw shape:")
print(raw.shape)


# Commodity names are in row 4
commodity_names = raw.iloc[4].tolist()

# Units are in row 5
units = raw.iloc[5].tolist()

print("\nNumber of commodity columns:")
print(len(commodity_names))


# Actual monthly data begins from row 6
data = raw.iloc[6:].copy()

# First column contains date
data = data.rename(
    columns={0: "Date"}
)


# Build mapping:
# column index -> commodity name
commodity_columns = {}

for i in range(1, len(commodity_names)):

    commodity = commodity_names[i]

    if pd.notna(commodity):

        commodity_columns[i] = str(commodity).strip()


print("\nSelected commodities:")

for commodity in SELECTED_COMMODITIES:
    print("-", commodity)


# Check whether all selected commodities exist
available = set(commodity_columns.values())

missing_commodities = [
    c for c in SELECTED_COMMODITIES
    if c not in available
]

if missing_commodities:

    print("\nWARNING - Commodities not found:")
    for c in missing_commodities:
        print("-", c)


# Keep only available selected commodities
selected_columns = [
    i
    for i, name in commodity_columns.items()
    if name in SELECTED_COMMODITIES
]


# Create clean dataframe
clean_parts = []


for column_index in selected_columns:

    commodity = commodity_columns[column_index]

    # Corresponding unit from row 5
    unit = units[column_index]

    temp = data[
        [data.columns[0], data.columns[column_index]]
    ].copy()

    temp.columns = [
        "Date",
        "Price"
    ]

    temp["Commodity"] = commodity
    temp["Unit"] = unit

    clean_parts.append(temp)


# Combine commodities
cleaned = pd.concat(
    clean_parts,
    ignore_index=True
)


# Clean date
cleaned["Date"] = cleaned["Date"].astype(str).str.strip()


# Convert dates such as 2011M01 → 2011-01-01
cleaned["Date"] = pd.to_datetime(
    cleaned["Date"].str.replace(
        "M",
        "-",
        regex=False
    ) + "-01",
    errors="coerce"
)


# Convert price to numeric
cleaned["Price"] = pd.to_numeric(
    cleaned["Price"],
    errors="coerce"
)


# Remove rows without valid date
cleaned = cleaned.dropna(
    subset=["Date"]
)


# Remove rows without price
cleaned = cleaned.dropna(
    subset=["Price"]
)


# Sort
cleaned = cleaned.sort_values(
    ["Date", "Commodity"]
).reset_index(drop=True)


print("\nCleaned shape:")
print(cleaned.shape)


print("\nMissing values:")
print(cleaned.isna().sum())


print("\nDuplicate rows:")
print(cleaned.duplicated().sum())


print("\nCommodity counts:")
print(cleaned["Commodity"].value_counts())


print("\nDate range:")
print(
    cleaned["Date"].min(),
    "to",
    cleaned["Date"].max()
)


print("\nUnits:")
print(
    cleaned[
        ["Commodity", "Unit"]
    ].drop_duplicates().to_string(index=False)
)


print("\nFirst 15 cleaned rows:")
print(cleaned.head(15))


print("\nLast 15 cleaned rows:")
print(cleaned.tail(15))


# Save
cleaned.to_csv(
    OUTPUT_FILE,
    index=False
)


print("\nSaved cleaned commodity data to:")
print(OUTPUT_FILE)


print("\n" + "=" * 60)
print("COMMODITY CLEANING COMPLETED")
print("=" * 60)