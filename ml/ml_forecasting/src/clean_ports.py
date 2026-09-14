import pandas as pd
from pathlib import Path
import xlrd


INPUT_FOLDER = Path("/Users/isha/Downloads")

OUTPUT_FILE = Path(
    "ml_forecasting/data/interim/port_traffic_cleaned.csv"
)


PORT_FILES = {
    "datafile chennai .xls": "Chennai",
    "datafile kamarajar.xls": "Kamarajar",
    "datafile kolkata,haldia.xls": "SMP Kolkata/Haldia",
    "datafile paradip.xls": "Paradip",
    "datafile vishakhapatnam.xls": "Visakhapatnam"
}


COLUMNS = [
    "Year",
    "Port",
    "Overseas Unloaded",
    "Overseas Loaded",
    "Overseas Total",
    "Coastal Unloaded",
    "Coastal Loaded",
    "Coastal Total",
    "Total Unloaded",
    "Total Loaded",
    "Total Traffic"
]


print("=" * 60)
print("PORT DATA CLEANING")
print("=" * 60)


all_data = []


for filename, port_name in PORT_FILES.items():

    print(f"\nProcessing: {port_name}")

    file_path = INPUT_FOLDER / filename

    # Read Excel file using xlrd
    workbook = xlrd.open_workbook(
        filename=str(file_path),
        ignore_workbook_corruption=True
    )

    sheet = workbook.sheet_by_index(0)

    # Convert sheet to DataFrame
    rows = [
        sheet.row_values(row)
        for row in range(sheet.nrows)
    ]

    df = pd.DataFrame(rows)

    print("Raw shape:", df.shape)

    # First row contains column names
    df = df.iloc[1:].copy()

    # Keep first 10 columns
    df = df.iloc[:, :10]

    # Assign column names
    df.columns = [
        "Year",
        "Overseas Unloaded",
        "Overseas Loaded",
        "Overseas Total",
        "Coastal Unloaded",
        "Coastal Loaded",
        "Coastal Total",
        "Total Unloaded",
        "Total Loaded",
        "Total Traffic"
    ]

    # Add port name
    df.insert(1, "Port", port_name)

    # Convert NA-like values to missing values
    df = df.replace(
        ["NA", "N.A.", "na", "n.a.", "", "-"],
        pd.NA
    )

    # Clean Year column
    df["Year"] = df["Year"].astype(str).str.strip()

    # Remove completely empty rows
    df = df.dropna(
        how="all"
    )

    # Convert traffic columns to numeric
    numeric_columns = [
        "Overseas Unloaded",
        "Overseas Loaded",
        "Overseas Total",
        "Coastal Unloaded",
        "Coastal Loaded",
        "Coastal Total",
        "Total Unloaded",
        "Total Loaded",
        "Total Traffic"
    ]

    for column in numeric_columns:
        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )

    # Remove rows without a year
    df = df.dropna(
        subset=["Year"]
    )

    print("Cleaned shape:", df.shape)

    print("Missing values:")
    print(df.isna().sum())

    print("Duplicate rows:", df.duplicated().sum())

    all_data.append(df)


# Combine all ports
combined = pd.concat(
    all_data,
    ignore_index=True
)


# Sort by port and year
combined = combined.sort_values(
    ["Port", "Year"]
).reset_index(drop=True)


print("\n" + "=" * 60)
print("COMBINED PORT DATA")
print("=" * 60)

print("\nFinal shape:")
print(combined.shape)

print("\nPorts:")
print(combined["Port"].unique())

print("\nRows per port:")
print(combined["Port"].value_counts())

print("\nMissing values:")
print(combined.isna().sum())

print("\nDuplicate rows:")
print(combined.duplicated().sum())

print("\nFirst 10 rows:")
print(combined.head(10))

print("\nLast 10 rows:")
print(combined.tail(10))


# Save cleaned data
combined.to_csv(
    OUTPUT_FILE,
    index=False
)

print("\nSaved cleaned port data to:")
print(OUTPUT_FILE)

print("\n" + "=" * 60)
print("PORT CLEANING COMPLETED")
print("=" * 60)