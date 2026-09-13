import pandas as pd
from pathlib import Path

INPUT_FILE = Path(
    "ml_forecasting/data/raw/freight/SJ102_20260911-162316.xlsx"
)

OUTPUT_FILE = Path(
    "ml_forecasting/data/interim/freight_cleaned.csv"
)

print("=" * 60)
print("FREIGHT DATA CLEANING")
print("=" * 60)

# Read raw Excel sheet
raw = pd.read_excel(
    INPUT_FILE,
    sheet_name="SJ102",
    header=None
)

print("\nRaw shape:", raw.shape)

# The actual monthly table starts from row 2
# Row 2 contains the month names
# Column 0 contains the year

header = raw.iloc[2].tolist()

print("\nDetected header:")
print(header)

# Keep the actual monthly data area
data = raw.iloc[3:].copy()

# First column = Year
data = data.rename(columns={0: "Year"})

# Keep only Year + Jan-Dec columns
month_columns = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

# Rename columns using detected header
rename_map = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
}

data = data.rename(columns=rename_map)

# Keep only required columns
data = data[["Year"] + month_columns]

# Convert Year to numeric
data["Year"] = pd.to_numeric(
    data["Year"],
    errors="coerce"
)

# Remove metadata / blank rows
data = data.dropna(subset=["Year"])

# Convert Year to integer
data["Year"] = data["Year"].astype(int)

# Convert monthly values to numeric
for month in month_columns:
    data[month] = pd.to_numeric(
        data[month],
        errors="coerce"
    )

print("\nCleaned wide shape:", data.shape)

print("\nMissing values:")
print(data.isna().sum())

# Convert wide format to long format
long_data = data.melt(
    id_vars=["Year"],
    value_vars=month_columns,
    var_name="Month",
    value_name="Freight_Index"
)

# Convert month names to month numbers
month_numbers = {
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12
}

long_data["Month_Number"] = long_data["Month"].map(
    month_numbers
)

# Create proper date
long_data["Date"] = pd.to_datetime(
    dict(
        year=long_data["Year"],
        month=long_data["Month_Number"],
        day=1
    )
)

# Remove rows where freight value is missing
long_data = long_data.dropna(
    subset=["Freight_Index"]
)

# Sort chronologically
long_data = long_data.sort_values(
    "Date"
).reset_index(drop=True)

# Keep final columns
long_data = long_data[
    ["Date", "Freight_Index"]
]

# Check duplicates
duplicates = long_data.duplicated().sum()

print("\nDuplicate rows after cleaning:", duplicates)

print("\nDate range:")
print(
    long_data["Date"].min(),
    "to",
    long_data["Date"].max()
)

print("\nFinal shape:")
print(long_data.shape)

print("\nFirst 10 cleaned rows:")
print(long_data.head(10))

print("\nLast 10 cleaned rows:")
print(long_data.tail(10))

# Save cleaned data
long_data.to_csv(
    OUTPUT_FILE,
    index=False
)

print("\nSaved cleaned freight data to:")
print(OUTPUT_FILE)

print("\n" + "=" * 60)
print("FREIGHT CLEANING COMPLETED")
print("=" * 60)