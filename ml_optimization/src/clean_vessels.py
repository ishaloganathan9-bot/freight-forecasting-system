import pandas as pd
from pathlib import Path


# Project paths
BASE_DIR = Path(__file__).resolve().parent.parent

RAW_FILE = BASE_DIR / "data" / "raw" / "vessels" / "Cleaned_ships_data.csv"
PROCESSED_DIR = BASE_DIR / "data" / "processed" / "vessels"
OUTPUT_FILE = PROCESSED_DIR / "vessels_cleaned.csv"


def main():
    print("=" * 60)
    print("VESSEL DATA CLEANING")
    print("=" * 60)

    # Check that the raw file exists
    if not RAW_FILE.exists():
        raise FileNotFoundError(
            f"Raw vessel dataset not found:\n{RAW_FILE}"
        )

    # Create processed directory
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    # Read raw dataset
    df = pd.read_csv(RAW_FILE)

    print(f"\nRaw dataset shape: {df.shape}")

    # Keep the original raw dataset untouched.
    # Rename misleading column names based on our inspection.
    rename_map = {
        "Company_Name": "vessel_name",
        "ship_name": "vessel_type",
        "built_year": "built_year",
        "gt": "gross_tonnage",
        "dwt": "deadweight_tonnage",
        "length": "length",
        "width": "beam",
    }

    df = df.rename(columns=rename_map)

    # Remove accidental whitespace from text fields
    text_columns = ["vessel_name", "vessel_type"]

    for column in text_columns:
        if column in df.columns:
            df[column] = df[column].astype("string").str.strip()

    # Convert numeric fields explicitly
    numeric_columns = [
        "built_year",
        "gross_tonnage",
        "deadweight_tonnage",
        "length",
        "beam",
    ]

    for column in numeric_columns:
        if column in df.columns:
            df[column] = pd.to_numeric(df[column], errors="coerce")

    # Check duplicate rows
    duplicate_count = df.duplicated().sum()

    # Remove exact duplicate rows only
    if duplicate_count > 0:
        df = df.drop_duplicates().reset_index(drop=True)

    # Validate required fields
    required_columns = [
        "vessel_name",
        "vessel_type",
        "built_year",
        "gross_tonnage",
        "deadweight_tonnage",
        "length",
        "beam",
    ]

    missing_columns = [
        column for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Required columns missing after processing: {missing_columns}"
        )

    # Report missing values after conversion
    missing_values = df[required_columns].isnull().sum()

    # Basic validity checks.
    # We do NOT delete suspicious values automatically.
    current_year = pd.Timestamp.now().year

    invalid_year_count = (
        (df["built_year"] < 1900) |
        (df["built_year"] > current_year)
    ).sum()

    invalid_gt_count = (df["gross_tonnage"] <= 0).sum()
    invalid_dwt_count = (df["deadweight_tonnage"] <= 0).sum()
    invalid_length_count = (df["length"] <= 0).sum()
    invalid_beam_count = (df["beam"] <= 0).sum()

    # Save processed dataset
    df.to_csv(OUTPUT_FILE, index=False)

    print("\nCleaning completed.")
    print(f"Processed dataset shape: {df.shape}")
    print(f"Exact duplicate rows found: {duplicate_count}")
    print(f"Duplicate rows removed: {duplicate_count}")

    print("\nMissing values:")
    print(missing_values)

    print("\nValidity checks:")
    print(f"Invalid built_year values: {invalid_year_count}")
    print(f"Invalid gross_tonnage values: {invalid_gt_count}")
    print(f"Invalid deadweight_tonnage values: {invalid_dwt_count}")
    print(f"Invalid length values: {invalid_length_count}")
    print(f"Invalid beam values: {invalid_beam_count}")

    print("\nVessel types:")
    print(df["vessel_type"].value_counts().to_string())

    print("\nProcessed columns:")
    print(df.columns.tolist())

    print(f"\nSaved processed dataset to:")
    print(OUTPUT_FILE)

    print("\n" + "=" * 60)
    print("DONE")
    print("=" * 60)


if __name__ == "__main__":
    main()