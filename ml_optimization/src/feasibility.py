
from pathlib import Path

import pandas as pd


# ============================================================
# PROJECT PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]

VESSEL_FILE = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "vessels"
    / "vessel_enrichment_verified_subset.csv"
)

CARGO_COMPATIBILITY_FILE = (
    PROJECT_ROOT
    / "data"
    / "raw"
    / "cargo"
    / "cargo_vessel_compatibility.csv"
)

PARADIP_FILE = (
    PROJECT_ROOT
    / "data"
    / "raw"
    / "ports"
    / "official"
    / "paradip_berth_restrictions.csv"
)

VISAKHAPATNAM_FILE = (
    PROJECT_ROOT
    / "data"
    / "raw"
    / "ports"
    / "official"
    / "visakhapatnam_port_restrictions.csv"
)


# ============================================================
# DATA LOADING
# ============================================================

def load_data():
    """
    Load vessel, cargo compatibility and port restriction data.

    The verified vessel dataset contains:
        vessel_name
        matched_name
        imo_number
        deadweight_tonnage
        draft_m
        loa_m
        beam_m
        match_confidence
        source

    Since this dataset contains only bulk carriers, vessel_type
    is added as "bulk carrier".
    """

    vessels = pd.read_csv(VESSEL_FILE)

    # Rename verified vessel columns to the names expected
    # by the feasibility engine.
    vessels = vessels.rename(
        columns={
            "loa_m": "length",
            "beam_m": "beam",
            "draft_m": "draft",
        }
    )

    # All 68 vessels in this verified dataset are bulk carriers.
    vessels["vessel_type"] = "bulk carrier"

    cargo_compatibility = pd.read_csv(
        CARGO_COMPATIBILITY_FILE
    )

    paradip = pd.read_csv(
        PARADIP_FILE
    )

    visakhapatnam = pd.read_csv(
        VISAKHAPATNAM_FILE
    )

    return (
        vessels,
        cargo_compatibility,
        paradip,
        visakhapatnam,
    )


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def normalize_text(value):
    """
    Normalize text for reliable comparisons.
    """

    if pd.isna(value):
        return ""

    return (
        str(value)
        .strip()
        .lower()
        .replace("-", " ")
        .replace("_", " ")
    )


# ============================================================
# VESSEL LOOKUP
# ============================================================

def get_vessel(vessels, vessel_name):
    """
    Find a vessel by vessel name.
    """

    target = normalize_text(vessel_name)

    matches = vessels[
        vessels["vessel_name"]
        .apply(normalize_text)
        == target
    ]

    if matches.empty:
        return None

    return matches.iloc[0]


# ============================================================
# CARGO / VESSEL COMPATIBILITY
# ============================================================

def check_cargo_vessel_compatibility(
    vessel_type,
    cargo_type,
    cargo_compatibility,
):
    """
    Check whether the vessel type can carry the cargo type.
    """

    if vessel_type is None or cargo_type is None:
        return {
            "status": "UNKNOWN",
            "reason": (
                "Vessel type or cargo type is missing."
            ),
        }

    vessel_type_normalized = normalize_text(
        vessel_type
    )

    cargo_type_normalized = normalize_text(
        cargo_type
    )

    compatibility = cargo_compatibility.copy()

    if "compatible_vessel_type" not in compatibility.columns:
        return {
            "status": "UNKNOWN",
            "reason": (
                "Cargo compatibility dataset does not "
                "contain compatible_vessel_type."
            ),
        }

    if "cargo_type" not in compatibility.columns:
        return {
            "status": "UNKNOWN",
            "reason": (
                "Cargo compatibility dataset does not "
                "contain cargo_type."
            ),
        }

    if "compatibility" not in compatibility.columns:
        return {
            "status": "UNKNOWN",
            "reason": (
                "Cargo compatibility dataset does not "
                "contain compatibility status."
            ),
        }

    compatibility["_vessel_type"] = (
        compatibility["compatible_vessel_type"]
        .apply(normalize_text)
    )

    compatibility["_cargo_type"] = (
        compatibility["cargo_type"]
        .apply(normalize_text)
    )

    matches = compatibility[
        (
            compatibility["_vessel_type"]
            == vessel_type_normalized
        )
        &
        (
            compatibility["_cargo_type"]
            == cargo_type_normalized
        )
    ]

    if matches.empty:
        return {
            "status": "UNKNOWN",
            "reason": (
                "No cargo-vessel compatibility rule "
                "was found for this combination."
            ),
        }

    compatible_values = (
        matches["compatibility"]
        .astype(str)
        .str.strip()
        .str.lower()
    )

    if compatible_values.eq("compatible").any():
        return {
            "status": "PASS",
            "reason": (
                f"{vessel_type} is compatible with "
                f"{cargo_type}."
            ),
        }

    return {
        "status": "FAIL",
        "reason": (
            f"{vessel_type} is not compatible with "
            f"{cargo_type}."
        ),
    }


# ============================================================
# CARGO / BERTH COMPATIBILITY
# ============================================================

def check_cargo_berth_compatibility(
    cargo_type,
    berth_cargo_type,
):
    """
    Check whether the berth handles the requested cargo.

    Berth cargo fields may contain multiple cargo categories
    separated by semicolons.
    """

    if pd.isna(cargo_type) or pd.isna(berth_cargo_type):
        return {
            "status": "UNKNOWN",
            "reason": (
                "Cargo type information is missing."
            ),
        }

    cargo = normalize_text(cargo_type)

    berth_cargo_items = [
        normalize_text(item)
        for item in str(berth_cargo_type).split(";")
        if normalize_text(item)
    ]

    if cargo in berth_cargo_items:
        return {
            "status": "PASS",
            "reason": (
                "Cargo type matches one of the berth "
                "cargo categories."
            ),
        }

    coal_variants = {
        "thermal coal",
        "coking coal",
        "steam coal",
    }

    if cargo == "coal" and any(
        item in coal_variants
        for item in berth_cargo_items
    ):
        return {
            "status": "PASS",
            "reason": (
                "Generic coal cargo is compatible with "
                "the berth coal category."
            ),
        }

    if "coal" in berth_cargo_items and cargo in coal_variants:
        return {
            "status": "PASS",
            "reason": (
                "Specific coal cargo is compatible with "
                "the generic berth coal category."
            ),
        }

    return {
        "status": "FAIL",
        "reason": (
            f"Cargo '{cargo_type}' is not listed for "
            f"berth cargo type '{berth_cargo_type}'."
        ),
    }

# ============================================================
# GENERIC LIMIT CHECK
# ============================================================

def check_limit(
    actual_value,
    maximum_value,
    parameter_name,
):
    """
    Check whether a vessel parameter is within a port limit.
    """

    if pd.isna(actual_value):
        return {
            "status": "UNKNOWN",
            "reason": (
                f"Vessel {parameter_name} is missing."
            ),
        }

    if pd.isna(maximum_value):
        return {
            "status": "UNKNOWN",
            "reason": (
                f"Maximum allowed {parameter_name} "
                "is missing."
            ),
        }

    try:
        actual = float(actual_value)
        maximum = float(maximum_value)
    except (TypeError, ValueError):
        return {
            "status": "UNKNOWN",
            "reason": (
                f"Could not convert {parameter_name} "
                "to a numeric value."
            ),
        }

    if actual <= maximum:
        return {
            "status": "PASS",
            "reason": (
                f"Vessel {parameter_name} "
                f"({actual:.2f}) is within the "
                f"maximum limit ({maximum:.2f})."
            ),
        }

    return {
        "status": "FAIL",
        "reason": (
            f"Vessel {parameter_name} "
            f"({actual:.2f}) exceeds the "
            f"maximum limit ({maximum:.2f})."
        ),
    }


# ============================================================
# DWT CHECK
# ============================================================

def check_dwt(
    vessel_dwt,
    max_dwt,
    min_dwt,
):
    """
    Check vessel deadweight against berth limits.

    If a berth does not publish any DWT constraint, that is
    preserved as informational rather than a blocking failure.
    """

    if pd.isna(vessel_dwt):
        return {
            "status": "UNKNOWN",
            "reason": "Vessel DWT is missing.",
            "blocking": True,
        }

    if pd.isna(max_dwt) and pd.isna(min_dwt):
        return {
            "status": "UNKNOWN",
            "reason": (
                "Berth DWT limits are not published; "
                "no DWT restriction can be verified."
            ),
            "blocking": False,
        }

    try:
        dwt = float(vessel_dwt)
    except (TypeError, ValueError):
        return {
            "status": "UNKNOWN",
            "reason": (
                "Vessel DWT could not be converted "
                "to a numeric value."
            ),
        }

    if not pd.isna(min_dwt):
        try:
            minimum = float(min_dwt)

            if dwt < minimum:
                return {
                    "status": "FAIL",
                    "reason": (
                        f"Vessel DWT ({dwt:.0f}) is below "
                        f"minimum allowed DWT "
                        f"({minimum:.0f})."
                    ),
                }

        except (TypeError, ValueError):
            pass

    if not pd.isna(max_dwt):
        try:
            maximum = float(max_dwt)

            if dwt > maximum:
                return {
                    "status": "FAIL",
                    "reason": (
                        f"Vessel DWT ({dwt:.0f}) exceeds "
                        f"maximum allowed DWT "
                        f"({maximum:.0f})."
                    ),
                }

        except (TypeError, ValueError):
            pass

    return {
        "status": "PASS",
        "reason": (
            "Vessel DWT is within berth limits."
        ),
        "blocking": True,
    }


# ============================================================
# CARGO QUANTITY CHECK
# ============================================================

def check_draft(
    vessel_draft,
    max_draft,
):
    """
    Perform provisional draft screening only.

    The verified vessel draft values are not guaranteed to be
    standardized design/summer/max drafts, while berth draft
    limits are operational constraints that may depend on tide.
    Therefore draft is handled as a conditional screening check,
    not as an unquestionable hard PASS/FAIL feasibility gate.
    """

    if pd.isna(vessel_draft):
        return {
            "status": "UNKNOWN",
            "reason": (
                "Vessel draft is missing; draft feasibility "
                "cannot be screened."
            ),
            "blocking": True,
        }

    if pd.isna(max_draft):
        return {
            "status": "UNKNOWN",
            "reason": (
                "Berth draft limit is not published; "
                "draft feasibility cannot be screened."
            ),
            "blocking": True,
        }

    try:
        draft = float(vessel_draft)
        maximum = float(max_draft)
    except (TypeError, ValueError):
        return {
            "status": "UNKNOWN",
            "reason": (
                "Draft values could not be converted "
                "to numbers for screening."
            ),
            "blocking": True,
        }

    return {
        "status": "CONDITIONAL",
        "reason": (
            f"Provisional draft screening indicates vessel draft "
            f"({draft:.2f} m) versus berth max draft "
            f"({maximum:.2f} m). Verified LOA, beam and cargo "
            f"constraints pass; draft requires authoritative "
            f"vessel and port operational confirmation."
        ),
        "blocking": False,
    }


# ============================================================
# CARGO QUANTITY CHECK
# ============================================================

def check_cargo_quantity(
    cargo_quantity,
    vessel_dwt,
):
    """
    Basic cargo quantity feasibility check.

    This checks whether requested cargo quantity does not
    exceed vessel DWT.

    Actual cargo intake will later depend on draft,
    cargo density, stowage and operational constraints.
    """

    if pd.isna(cargo_quantity):
        return {
            "status": "UNKNOWN",
            "reason": "Cargo quantity is missing.",
        }

    if pd.isna(vessel_dwt):
        return {
            "status": "UNKNOWN",
            "reason": "Vessel DWT is missing.",
        }

    try:
        quantity = float(cargo_quantity)
        dwt = float(vessel_dwt)
    except (TypeError, ValueError):
        return {
            "status": "UNKNOWN",
            "reason": (
                "Cargo quantity or vessel DWT "
                "could not be converted to numbers."
            ),
        }

    if quantity <= dwt:
        return {
            "status": "PASS",
            "reason": (
                f"Cargo quantity ({quantity:.0f} tonnes) "
                f"does not exceed vessel DWT "
                f"({dwt:.0f} tonnes)."
            ),
        }

    return {
        "status": "FAIL",
        "reason": (
            f"Cargo quantity ({quantity:.0f} tonnes) "
            f"exceeds vessel DWT "
            f"({dwt:.0f} tonnes)."
        ),
    }


# ============================================================
# PORT BERTH LOOKUP
# ============================================================

def get_port_berths(
    port_name,
    paradip,
    visakhapatnam,
):
    """
    Return berth restrictions for the selected port.

    Currently supported:
        Paradip
        Visakhapatnam
        Vizag
    """

    if not port_name:
        return pd.DataFrame()

    port = normalize_text(port_name)

    if port == "paradip":
        return paradip.copy()

    if port in {
        "visakhapatnam",
        "vizag",
    }:
        return visakhapatnam.copy()

    return pd.DataFrame()


# ============================================================
# PORT FEASIBILITY SUMMARY
# ============================================================

def summarize_port_feasibility(checks):
    """
    Combine individual feasibility checks using the AI/ML-2
    status semantics.

    Priority:
        FAIL > UNKNOWN (blocking only) > CONDITIONAL > PASS

    A missing berth DWT limit is not treated as a blocking
    UNKNOWN because it is simply not published.
    """

    if not checks:
        return "UNKNOWN"

    if any(
        check.get("status") == "FAIL"
        for check in checks
    ):
        return "FAIL"

    blocking_unknown = any(
        check.get("status") == "UNKNOWN"
        and check.get("blocking", True) is True
        for check in checks
    )

    if blocking_unknown:
        return "UNKNOWN"

    if any(
        check.get("status") == "CONDITIONAL"
        for check in checks
    ):
        return "CONDITIONAL"

    return "PASS"


# ============================================================
# BERTH EVALUATION
# ============================================================

def evaluate_berth(
    vessel,
    cargo_type,
    berth,
    cargo_quantity=None,
):
    """
    Evaluate a vessel against one berth.
    """

    checks = {}

    # --------------------------------------------------------
    # Cargo / berth compatibility
    # --------------------------------------------------------

    berth_cargo_column = None

    for column in [
        "cargo_type",
        "berth_cargo_type",
        "cargo",
    ]:
        if column in berth.index:
            berth_cargo_column = column
            break

    if berth_cargo_column is None:

        checks["cargo_compatibility"] = {
            "status": "UNKNOWN",
            "reason": (
                "Berth cargo type column is not available."
            ),
        }

    else:

        checks["cargo_compatibility"] = (
            check_cargo_berth_compatibility(
                cargo_type,
                berth[berth_cargo_column],
            )
        )

    # --------------------------------------------------------
    # LOA
    # --------------------------------------------------------

    max_loa = (
        berth["max_loa_m"]
        if "max_loa_m" in berth.index
        else None
    )

    checks["loa"] = check_limit(
        vessel.get("length"),
        max_loa,
        "LOA",
    )

    # --------------------------------------------------------
    # Beam
    # --------------------------------------------------------

    max_beam = (
        berth["max_beam_m"]
        if "max_beam_m" in berth.index
        else None
    )

    checks["beam"] = check_limit(
        vessel.get("beam"),
        max_beam,
        "beam",
    )

    # --------------------------------------------------------
    # Draft
    # --------------------------------------------------------

    max_draft = (
        berth["max_draft_m"]
        if "max_draft_m" in berth.index
        else None
    )

    checks["draft"] = check_draft(
        vessel.get("draft"),
        max_draft,
    )

    # --------------------------------------------------------
    # DWT
    # --------------------------------------------------------

    max_dwt = (
        berth["max_dwt_mt"]
        if "max_dwt_mt" in berth.index
        else None
    )

    min_dwt = (
        berth["min_dwt_mt"]
        if "min_dwt_mt" in berth.index
        else None
    )

    checks["dwt"] = check_dwt(
        vessel.get("deadweight_tonnage"),
        max_dwt,
        min_dwt,
    )

    # --------------------------------------------------------
    # Cargo quantity
    # --------------------------------------------------------

    if cargo_quantity is not None:

        checks["cargo_quantity"] = (
            check_cargo_quantity(
                cargo_quantity,
                vessel.get(
                    "deadweight_tonnage"
                ),
            )
        )

    # --------------------------------------------------------
    # Overall feasibility
    # --------------------------------------------------------

    overall_status = summarize_port_feasibility(
        list(checks.values())
    )

    berth_name = berth.get(
        "berth_name",
        berth.get(
            "name",
            "Unknown berth",
        ),
    )

    berth_result = {
        "berth": berth_name,
        "status": overall_status,
        "checks": checks,
        "feasible": overall_status != "FAIL",
    }

    return berth_result


# ============================================================
# COMPLETE VESSEL FEASIBILITY
# ============================================================

def evaluate_vessel_feasibility(
    vessel_name,
    cargo_type,
    destination_port,
    berth_name=None,
    cargo_quantity=None,
):
    """
    Complete vessel-port feasibility evaluation.
    """

    (
        vessels,
        cargo_compatibility,
        paradip,
        visakhapatnam,
    ) = load_data()

    # --------------------------------------------------------
    # Find vessel
    # --------------------------------------------------------

    vessel = get_vessel(
        vessels,
        vessel_name,
    )

    if vessel is None:

        return {
            "status": "FAIL",
            "vessel": vessel_name,
            "reason": (
                "Vessel was not found in the verified "
                "vessel dataset."
            ),
        }

    # --------------------------------------------------------
    # Vessel information
    # --------------------------------------------------------

    vessel_type = vessel.get(
        "vessel_type",
        "bulk carrier",
    )

    # --------------------------------------------------------
    # Cargo-vessel compatibility
    # --------------------------------------------------------

    cargo_vessel_check = (
        check_cargo_vessel_compatibility(
            vessel_type,
            cargo_type,
            cargo_compatibility,
        )
    )

    # --------------------------------------------------------
    # Get port berths
    # --------------------------------------------------------

    berths = get_port_berths(
        destination_port,
        paradip,
        visakhapatnam,
    )

    if berths.empty:

        return {
            "status": "UNKNOWN",
            "overall_port_feasibility": "UNKNOWN",
            "overall_feasible": False,
            "vessel": vessel_name,
            "vessel_type": vessel_type,
            "destination_port": destination_port,
            "cargo_vessel_compatibility": (
                cargo_vessel_check
            ),
            "berths": [],
            "reason": (
                "No berth restriction data is available "
                "for this destination port."
            ),
        }

    # --------------------------------------------------------
    # Optional berth filter
    # --------------------------------------------------------

    if berth_name is not None:

        if "berth_name" in berths.columns:

            target_berth = normalize_text(
                berth_name
            )

            berths = berths[
                berths["berth_name"]
                .apply(normalize_text)
                == target_berth
            ]

        elif "name" in berths.columns:

            target_berth = normalize_text(
                berth_name
            )

            berths = berths[
                berths["name"]
                .apply(normalize_text)
                == target_berth
            ]

    if berths.empty:

        return {
            "status": "UNKNOWN",
            "overall_port_feasibility": "UNKNOWN",
            "overall_feasible": False,
            "vessel": vessel_name,
            "vessel_type": vessel_type,
            "destination_port": destination_port,
            "cargo_vessel_compatibility": (
                cargo_vessel_check
            ),
            "berths": [],
            "reason": (
                "The requested berth was not found."
            ),
        }

    # --------------------------------------------------------
    # Evaluate every berth
    # --------------------------------------------------------

    berth_results = []

    for _, berth in berths.iterrows():

        result = evaluate_berth(
            vessel,
            cargo_type,
            berth,
            cargo_quantity,
        )

        berth_results.append(result)

    # --------------------------------------------------------
    # Determine overall result
    # --------------------------------------------------------

    fully_feasible_berths = [
        result
        for result in berth_results
        if result["status"] == "PASS"
    ]

    conditional_berths = [
        result
        for result in berth_results
        if result["status"] == "CONDITIONAL"
    ]

    unknown_berths = [
        result
        for result in berth_results
        if result["status"] == "UNKNOWN"
    ]

    if cargo_vessel_check["status"] == "FAIL":

        overall_status = "FAIL"

    elif fully_feasible_berths:

        overall_status = "PASS"

    elif conditional_berths:

        overall_status = "CONDITIONAL"

    elif unknown_berths:

        overall_status = "UNKNOWN"

    else:

        overall_status = "FAIL"

    selected_berth = None

    if fully_feasible_berths:

        selected_berth = (
            fully_feasible_berths[0]["berth"]
        )

    elif conditional_berths:

        selected_berth = (
            conditional_berths[0]["berth"]
        )

    # --------------------------------------------------------
    # Return result
    # --------------------------------------------------------

    selected_berth_result = (
        fully_feasible_berths[0]
        if fully_feasible_berths
        else conditional_berths[0]
        if conditional_berths
        else None
    )

    selected_checks = (
        selected_berth_result.get(
            "checks",
            {}
        )
        if selected_berth_result
        else {}
    )

    return {
        "status": overall_status,
        "overall_port_feasibility": overall_status,
        "overall_feasible": overall_status == "PASS",
        "vessel": vessel_name,
        "vessel_type": vessel_type,
        "imo_number": vessel.get(
            "imo_number"
        ),
        "deadweight_tonnage": vessel.get(
            "deadweight_tonnage"
        ),
        "length": vessel.get("length"),
        "beam": vessel.get("beam"),
        "draft": vessel.get("draft"),
        "destination_port": destination_port,
        "cargo_type": cargo_type,
        "cargo_quantity": cargo_quantity,
        "cargo_vessel_compatibility": (
            cargo_vessel_check
        ),
        "cargo_compatibility_status": (
            cargo_vessel_check.get(
                "status",
                "UNKNOWN"
            )
        ),
        "loa_status": selected_checks.get(
            "loa",
            {}
        ).get(
            "status",
            "UNKNOWN"
        ),
        "beam_status": selected_checks.get(
            "beam",
            {}
        ).get(
            "status",
            "UNKNOWN"
        ),
        "draft_status": selected_checks.get(
            "draft",
            {}
        ).get(
            "status",
            "UNKNOWN"
        ),
        "dwt_status": selected_checks.get(
            "dwt",
            {}
        ).get(
            "status",
            "UNKNOWN"
        ),
        "selected_berth": selected_berth,
        "berths": berth_results,
    }


# ============================================================
# FIND FEASIBLE VESSELS
# ============================================================


def find_feasible_vessels(
    cargo_type,
    destination_port,
    cargo_quantity=None,
):
    """
    Evaluate all verified vessels for a given cargo and destination.

    Returns a summary dictionary containing counts plus details for
    each vessel grouped by feasible, infeasible and unknown status.
    """

    vessels, _, _, _ = load_data()

    total_vessels_checked = len(vessels)
    feasible_vessels = []
    infeasible_vessels = []
    unknown_vessels = []

    for _, vessel in vessels.iterrows():

        vessel_name = vessel.get("vessel_name")

        result = evaluate_vessel_feasibility(
            vessel_name=vessel_name,
            cargo_type=cargo_type,
            destination_port=destination_port,
            cargo_quantity=cargo_quantity,
        )

        vessel_summary = {
            "vessel_name": result.get("vessel"),
            "imo_number": result.get("imo_number"),
            "deadweight_tonnage": result.get(
                "deadweight_tonnage"
            ),
            "length": result.get("length"),
            "beam": result.get("beam"),
            "draft": result.get("draft"),
            "selected_berth": result.get(
                "selected_berth"
            ),
            "destination_port": result.get(
                "destination_port"
            ),
            "status": result.get("status", "UNKNOWN"),
        }

        if result.get("status") == "PASS":
            feasible_vessels.append(vessel_summary)
        elif result.get("status") == "FAIL":
            infeasible_vessels.append(vessel_summary)
        else:
            unknown_vessels.append(vessel_summary)

    return {
        "total_vessels_checked": total_vessels_checked,
        "feasible_vessels": feasible_vessels,
        "infeasible_vessels": infeasible_vessels,
        "unknown_vessels": unknown_vessels,
    }


# ============================================================
# SIMPLE TEST
# ============================================================

if __name__ == "__main__":

    print("=" * 70)
    print("VESSEL FEASIBILITY TEST")
    print("=" * 70)

    try:

        (
            vessels,
            cargo_compatibility,
            paradip,
            visakhapatnam,
        ) = load_data()

        print("\nData loaded successfully.")

        print(
            f"Verified vessels loaded: "
            f"{len(vessels)}"
        )

        print(
            f"Cargo compatibility rows: "
            f"{len(cargo_compatibility)}"
        )

        print(
            f"Paradip berth rows: "
            f"{len(paradip)}"
        )

        print(
            f"Visakhapatnam berth rows: "
            f"{len(visakhapatnam)}"
        )

        print(
            "\n" + "=" * 70
        )
        print("FEASIBLE VESSEL SEARCH")
        print("=" * 70)

        cargo = "Thermal Coal"
        destination = "Paradip"
        cargo_qty = 50000

        print(f"\nCargo: {cargo}")
        print(f"Destination: {destination}")
        print(
            f"Cargo quantity: {cargo_qty} tonnes"
        )

        results = find_feasible_vessels(
            cargo_type=cargo,
            destination_port=destination,
            cargo_quantity=cargo_qty,
        )

        print(
            f"\nTotal vessels checked: "
            f"{results['total_vessels_checked']}"
        )
        print(
            f"Feasible vessels: "
            f"{len(results['feasible_vessels'])}"
        )
        print(
            f"Infeasible vessels: "
            f"{len(results['infeasible_vessels'])}"
        )
        print(
            f"Unknown vessels: "
            f"{len(results['unknown_vessels'])}"
        )

        print("\nFEASIBLE VESSELS")
        print("-" * 70)
        print(
            "Vessel | IMO | DWT | LOA | Beam | Draft | Selected Berth"
        )

        if results["feasible_vessels"]:

            for vessel in results["feasible_vessels"]:

                print(
                    f"{vessel['vessel_name']} | "
                    f"{vessel['imo_number']} | "
                    f"{vessel['deadweight_tonnage']} | "
                    f"{vessel['length']} | "
                    f"{vessel['beam']} | "
                    f"{vessel['draft']} | "
                    f"{vessel['selected_berth']}"
                )

        else:

            print(
                "No fully feasible vessels found for this cargo and destination."
            )

        print(
            "\n" + "=" * 70
        )

        print(
            "TEST COMPLETED"
        )

        print(
            "=" * 70
        )

    except Exception as error:

        print("\nERROR")
        print("-" * 70)
        print(
            type(error).__name__
        )
        print(
            str(error)
        )

        raise

