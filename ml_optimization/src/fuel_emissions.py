from pathlib import Path
import pandas as pd


# ---------------------------------------------------------
# PROJECT PATH
# ---------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[1]

FUEL_FILE = (
    PROJECT_ROOT
    / "data"
    / "raw"
    / "fuel"
    / "imo_bulk_carrier_fuel_reference.csv"
)


# ---------------------------------------------------------
# LOAD IMO FUEL REFERENCE
# ---------------------------------------------------------

def load_fuel_reference():
    """Load the IMO bulk-carrier fleet reference data."""

    if not FUEL_FILE.exists():
        raise FileNotFoundError(
            f"IMO fuel reference not found: {FUEL_FILE}"
        )

    return pd.read_csv(FUEL_FILE)


# ---------------------------------------------------------
# FIND SIZE CATEGORY
# ---------------------------------------------------------

def find_size_category(dwt):
    """
    Identify the IMO bulk-carrier size category
    from vessel deadweight tonnage.
    """

    if dwt < 10000:
        return "0-9999"

    if dwt < 35000:
        return "10000-34999"

    if dwt < 60000:
        return "35000-59999"

    if dwt < 100000:
        return "60000-99999"

    if dwt < 200000:
        return "100000-199999"

    return "200000-+"


# ---------------------------------------------------------
# GET REFERENCE ROW
# ---------------------------------------------------------

def get_fuel_reference(dwt):
    """Return the IMO reference row for the vessel size."""

    reference = load_fuel_reference()

    size_category = find_size_category(dwt)

    matches = reference[
        reference["size_category"] == size_category
    ]

    if matches.empty:
        raise ValueError(
            f"No IMO fuel reference found for "
            f"size category {size_category}."
        )

    return matches.iloc[0]


# ---------------------------------------------------------
# ESTIMATE VOYAGE FUEL
# ---------------------------------------------------------

def estimate_voyage_fuel(
    dwt,
    voyage_days,
):
    """
    Estimate voyage fuel using the IMO annual fleet reference.

    The annual reference is converted to a daily average and
    multiplied by the voyage duration.

    This is a fleet-reference estimate, not an
    engine-specific vessel calculation.
    """

    if dwt <= 0:
        raise ValueError(
            "DWT must be greater than zero."
        )

    if voyage_days <= 0:
        raise ValueError(
            "Voyage duration must be greater than zero."
        )

    reference = get_fuel_reference(dwt)

    annual_fuel = float(
        reference["annual_average_total_fuel_consumption"]
    )

    average_at_sea_days = float(
        reference["average_at_sea_days_per_year"]
    )

    if average_at_sea_days <= 0:
        raise ValueError(
            "Average at-sea days must be greater than zero."
        )

    daily_fuel = (
        annual_fuel / average_at_sea_days
    )

    voyage_fuel = (
        daily_fuel * voyage_days
    )

    return {
        "size_category": reference["size_category"],
        "annual_reference_fuel": annual_fuel,
        "average_at_sea_days_per_year": average_at_sea_days,
        "estimated_daily_fuel": daily_fuel,
        "voyage_days": voyage_days,
        "estimated_voyage_fuel": voyage_fuel,
        "estimate_type": "IMO_fleet_reference",
    }


# ---------------------------------------------------------
# ESTIMATE CO2
# ---------------------------------------------------------

def estimate_voyage_co2(
    dwt,
    voyage_days,
):
    """
    Estimate voyage CO2 using the IMO annual fleet reference.

    The annual reference CO2 value is converted to a daily
    average using the same average at-sea days reference.
    """

    if dwt <= 0:
        raise ValueError(
            "DWT must be greater than zero."
        )

    if voyage_days <= 0:
        raise ValueError(
            "Voyage duration must be greater than zero."
        )

    reference = get_fuel_reference(dwt)

    annual_co2 = float(
        reference["average_annual_co2_emission"]
    )

    average_at_sea_days = float(
        reference["average_at_sea_days_per_year"]
    )

    if average_at_sea_days <= 0:
        raise ValueError(
            "Average at-sea days must be greater than zero."
        )

    daily_co2 = (
        annual_co2 / average_at_sea_days
    )

    voyage_co2 = (
        daily_co2 * voyage_days
    )

    return {
        "size_category": reference["size_category"],
        "annual_reference_co2": annual_co2,
        "average_at_sea_days_per_year": average_at_sea_days,
        "estimated_daily_co2": daily_co2,
        "voyage_days": voyage_days,
        "estimated_voyage_co2": voyage_co2,
        "estimate_type": "IMO_fleet_reference",
    }


# ---------------------------------------------------------
# COMBINED FUEL + CO2 CALCULATION
# ---------------------------------------------------------

def calculate_fuel_and_co2(
    dwt,
    voyage_days,
):
    """Calculate both estimated voyage fuel and CO2."""

    fuel = estimate_voyage_fuel(
        dwt,
        voyage_days,
    )

    co2 = estimate_voyage_co2(
        dwt,
        voyage_days,
    )

    return {
        "dwt": dwt,
        "size_category": fuel["size_category"],
        "voyage_days": voyage_days,
        "estimated_voyage_fuel": fuel[
            "estimated_voyage_fuel"
        ],
        "estimated_voyage_co2": co2[
            "estimated_voyage_co2"
        ],
        "estimate_type": "IMO_fleet_reference",
    }


# ---------------------------------------------------------
# TEST
# ---------------------------------------------------------

if __name__ == "__main__":

    # ORE SHENZHEN dimensions verified earlier:
    # DWT = 398,997
    # Voyage duration from our voyage test = 16.18 days

    dwt = 398997
    voyage_days = 16.18

    result = calculate_fuel_and_co2(
        dwt=dwt,
        voyage_days=voyage_days,
    )

    print("\n" + "=" * 60)
    print("FUEL & CO2 CALCULATION TEST")
    print("=" * 60)

    print(
        f"DWT              : "
        f"{result['dwt']}"
    )

    print(
        f"IMO Size Category: "
        f"{result['size_category']}"
    )

    print(
        f"Voyage Duration  : "
        f"{result['voyage_days']} days"
    )

    print(
        f"Estimated Fuel   : "
        f"{result['estimated_voyage_fuel']:.2f}"
    )

    print(
        f"Estimated CO2    : "
        f"{result['estimated_voyage_co2']:.2f}"
    )

    print(
        f"Estimate Type    : "
        f"{result['estimate_type']}"
    )

    print("=" * 60)
    print("TEST COMPLETED")
    print("=" * 60)