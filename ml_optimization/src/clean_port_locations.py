import pandas as pd
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent

RAW_FILE = BASE_DIR / "data" / "raw" / "ports" / "port_locations.csv"
PROCESSED_DIR = BASE_DIR / "data" / "processed" / "ports"
OUTPUT_FILE = PROCESSED_DIR / "port_locations_cleaned.csv"


def main():
    print("=" * 60)
    print("PORT LOCATIONS DATA CLEANING")
    print("=" * 60)

    if not RAW_FILE.exists():
        raise FileNotFoundError(
            f"Raw port locations dataset not found:\n{RAW_FILE}"
        )

    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(RAW_FILE)

    print(f"\nRaw dataset shape: {df.shape}")

    # Standardize column names
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    # Remove unnecessary whitespace from text values
    text_columns = ["country", "port_name", "locode"]

    for column in text_columns:
        if column in df.columns:
            df[column] = df[column].astype("string").str.strip()

    # Check duplicates before removing them
    duplicate_count = df.duplicated().sum()

    # Remove exact duplicate rows
    df = df.drop_duplicates().reset_index(drop=True)

    # Validate required columns
    required_columns = ["country", "port_name", "locode"]

    missing_columns = [
        column for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Required columns missing: {missing_columns}"
        )

    # Check missing values
    missing_values = df[required_columns].isnull().sum()

    # Check empty strings
    empty_values = {}

    for column in required_columns:
        empty_values[column] = (
            df[column].fillna("").astype(str).str.strip().eq("").sum()
        )

    # Check duplicate LOCODEs after cleaning
    duplicate_locodes = df["locode"].duplicated().sum()

    # Save processed dataset
    df.to_csv(OUTPUT_FILE, index=False)

    print("\nCleaning completed.")
    print(f"Processed dataset shape: {df.shape}")

    print(f"\nExact duplicate rows found: {duplicate_count}")
    print(f"Duplicate rows removed: {duplicate_count}")

    print("\nMissing values:")
    print(missing_values)

    print("\nEmpty values:")
    print(empty_values)

    print(f"\nDuplicate LOCODEs after cleaning: {duplicate_locodes}")

    print("\nSample cleaned rows:")
    print(df.head(10).to_string(index=False))

    print("\nUnique countries:", df["country"].nunique())
    print("Unique ports:", df["port_name"].nunique())
    print("Unique LOCODEs:", df["locode"].nunique())

    print("\nSaved processed dataset to:")
    print(OUTPUT_FILE)

    print("\n" + "=" * 60)
    print("DONE")
    print("=" * 60)


if __name__ == "__main__":
    main()