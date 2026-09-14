from pathlib import Path
import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[1]


FILES = {
    "Vessels": BASE_DIR / "data/processed/vessels/vessels_cleaned.csv",
    "Port Locations": BASE_DIR / "data/processed/ports/port_locations_cleaned.csv",
    "Paradip Restrictions": BASE_DIR / "data/raw/ports/official/paradip_berth_restrictions.csv",
    "Visakhapatnam Restrictions": BASE_DIR / "data/raw/ports/official/visakhapatnam_port_restrictions.csv",
    "Cargo Compatibility": BASE_DIR / "data/raw/cargo/cargo_vessel_compatibility.csv",
    "Routes": BASE_DIR / "data/raw/routes/port_routes.csv",
    "IMO Fuel Reference": BASE_DIR / "data/raw/fuel/imo_bulk_carrier_fuel_reference.csv",
}


def validate_file(name, path):
    print("\n" + "=" * 60)
    print(name)
    print("=" * 60)

    if not path.exists():
        print("STATUS: FAIL")
        print(f"File not found: {path}")
        return False

    try:
        df = pd.read_csv(path)

        print(f"Shape: {df.shape}")
        print(f"Columns: {df.columns.tolist()}")
        print(f"Missing values: {int(df.isna().sum().sum())}")
        print(f"Duplicate rows: {int(df.duplicated().sum())}")

        if df.empty:
            print("STATUS: FAIL - dataset is empty")
            return False

        print("STATUS: PASS")
        return True

    except Exception as e:
        print("STATUS: FAIL")
        print(f"Error: {e}")
        return False


def main():
    print("AI/ML 2 - DATA VALIDATION")
    print("=" * 60)

    results = {}

    for name, path in FILES.items():
        results[name] = validate_file(name, path)

    print("\n" + "=" * 60)
    print("FINAL RESULT")
    print("=" * 60)

    for name, status in results.items():
        print(f"{name}: {'PASS' if status else 'FAIL'}")

    if all(results.values()):
        print("\nALL DATASETS PASSED BASIC VALIDATION")
    else:
        print("\nONE OR MORE DATASETS FAILED VALIDATION")


if __name__ == "__main__":
    main()