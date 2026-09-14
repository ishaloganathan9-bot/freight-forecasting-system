import sys
from pathlib import Path

import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from feasibility import (
    check_cargo_quantity,
    check_cargo_vessel_compatibility,
    evaluate_berth,
    evaluate_vessel_feasibility,
    load_data,
)


def test_cargo_vessel_compatibility_passes_for_supported_pair():
    _, cargo_compatibility, _, _ = load_data()

    result = check_cargo_vessel_compatibility(
        "Bulk Carrier",
        "Thermal Coal",
        cargo_compatibility,
    )

    assert result["status"] == "PASS"
    assert "compatible" in result["reason"].lower()


def test_cargo_vessel_compatibility_fails_for_unknown_pair():
    _, cargo_compatibility, _, _ = load_data()

    result = check_cargo_vessel_compatibility(
        "Container Ship",
        "Thermal Coal",
        cargo_compatibility,
    )

    assert result["status"] == "UNKNOWN"
    assert "cargo-vessel compatibility rule" in result["reason"].lower()


def test_cargo_quantity_check_handles_capacity_and_overage():
    result = check_cargo_quantity(50000, 100000)
    assert result["status"] == "PASS"

    overflow = check_cargo_quantity(150000, 100000)
    assert overflow["status"] == "FAIL"


def test_check_limit_reports_loa_pass_and_fail():
    assert check_cargo_quantity(50000, 100000)["status"] == "PASS"

    berth = pd.Series(
        {
            "cargo_type": "Thermal Coal",
            "max_loa_m": 300,
            "max_draft_m": 14.5,
        }
    )

    vessel = {
        "length": 292,
        "beam": 45,
        "deadweight_tonnage": 180000,
    }

    loa_pass = evaluate_berth(
        vessel=vessel,
        cargo_type="Thermal Coal",
        berth=berth,
        cargo_quantity=150000,
    )

    assert loa_pass["checks"]["loa"]["status"] == "PASS"

    berth_failed = berth.copy()
    berth_failed["max_loa_m"] = 250

    loa_fail = evaluate_berth(
        vessel=vessel,
        cargo_type="Thermal Coal",
        berth=berth_failed,
        cargo_quantity=150000,
    )

    assert loa_fail["checks"]["loa"]["status"] == "FAIL"


def test_beam_and_draft_statuses_are_explicit():
    berth = pd.Series(
        {
            "cargo_type": "Thermal Coal",
            "max_loa_m": 300,
            "max_beam_m": 45,
            "max_draft_m": 14.5,
        }
    )

    vessel = {
        "length": 292,
        "beam": 45,
        "deadweight_tonnage": 180000,
    }

    beam_pass = evaluate_berth(
        vessel=vessel,
        cargo_type="Thermal Coal",
        berth=berth,
        cargo_quantity=150000,
    )
    assert beam_pass["checks"]["beam"]["status"] == "PASS"

    berth_beam_fail = berth.copy()
    berth_beam_fail["max_beam_m"] = 40

    beam_fail = evaluate_berth(
        vessel=vessel,
        cargo_type="Thermal Coal",
        berth=berth_beam_fail,
        cargo_quantity=150000,
    )
    assert beam_fail["checks"]["beam"]["status"] == "FAIL"

    vessel_with_draft = vessel.copy()
    vessel_with_draft["draft"] = 12

    draft_pass = evaluate_berth(
        vessel=vessel_with_draft,
        cargo_type="Thermal Coal",
        berth=berth,
        cargo_quantity=150000,
    )
    assert draft_pass["checks"]["draft"]["status"] == "CONDITIONAL"

    vessel_with_draft["draft"] = 18
    draft_fail = evaluate_berth(
        vessel=vessel_with_draft,
        cargo_type="Thermal Coal",
        berth=berth,
        cargo_quantity=150000,
    )
    assert draft_fail["checks"]["draft"]["status"] == "CONDITIONAL"

    vessel_without_draft = vessel.copy()
    draft_unknown = evaluate_berth(
        vessel=vessel_without_draft,
        cargo_type="Thermal Coal",
        berth=berth,
        cargo_quantity=150000,
    )
    assert draft_unknown["checks"]["draft"]["status"] == "UNKNOWN"


def test_dwt_and_cargo_compatibility_explicit_statuses():
    berth = pd.Series(
        {
            "cargo_type": "Thermal Coal",
            "max_loa_m": 300,
            "max_beam_m": 45,
            "max_draft_m": 14.5,
            "min_dwt_mt": 150000,
            "max_dwt_mt": 200000,
        }
    )

    vessel = {
        "length": 292,
        "beam": 45,
        "deadweight_tonnage": 180000,
    }

    dwt_pass = evaluate_berth(
        vessel=vessel,
        cargo_type="Thermal Coal",
        berth=berth,
        cargo_quantity=150000,
    )
    assert dwt_pass["checks"]["dwt"]["status"] == "PASS"

    berth_dwt_fail = berth.copy()
    berth_dwt_fail["max_dwt_mt"] = 150000

    dwt_fail = evaluate_berth(
        vessel=vessel,
        cargo_type="Thermal Coal",
        berth=berth_dwt_fail,
        cargo_quantity=150000,
    )
    assert dwt_fail["checks"]["dwt"]["status"] == "FAIL"

    cargo_compatibility = evaluate_berth(
        vessel=vessel,
        cargo_type="Thermal Coal",
        berth=berth,
        cargo_quantity=150000,
    )
    assert cargo_compatibility["checks"]["cargo_compatibility"]["status"] == "PASS"

    berth_cargo_fail = berth.copy()
    berth_cargo_fail["cargo_type"] = "Iron Ore"

    cargo_fail = evaluate_berth(
        vessel=vessel,
        cargo_type="Thermal Coal",
        berth=berth_cargo_fail,
        cargo_quantity=150000,
    )
    assert cargo_fail["checks"]["cargo_compatibility"]["status"] == "FAIL"


def test_evaluate_berth_reports_unknown_for_missing_beam_limit():
    berth = pd.Series(
        {
            "cargo_type": "Thermal Coal",
            "max_loa_m": 300,
            "max_draft_m": 14.5,
        }
    )

    vessel = {
        "length": 292,
        "beam": 45,
        "deadweight_tonnage": 180000,
    }

    result = evaluate_berth(
        vessel=vessel,
        cargo_type="Thermal Coal",
        berth=berth,
        cargo_quantity=150000,
    )

    assert result["feasible"] is True
    assert result["checks"]["beam"]["status"] == "UNKNOWN"
    assert result["checks"]["draft"]["status"] == "UNKNOWN"


def test_unsupported_destination_port_returns_unknown_status():
    result = evaluate_vessel_feasibility(
        vessel_name="ORE SHENZHEN",
        cargo_type="Thermal Coal",
        destination_port="Gangavaram",
        cargo_quantity=50000,
    )

    assert result["overall_port_feasibility"] == "UNKNOWN"
    assert result["overall_feasible"] is False
    assert result["berths"] == []


def test_infeasible_vessel_name_returns_structured_fail_result():
    result = evaluate_vessel_feasibility(
        vessel_name="No Such Vessel",
        cargo_type="Thermal Coal",
        destination_port="Paradip",
        cargo_quantity=50000,
    )

    assert result["status"] == "FAIL"
    assert result["vessel"] == "No Such Vessel"
    assert "not found" in result["reason"].lower()
