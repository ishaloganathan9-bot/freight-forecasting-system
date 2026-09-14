import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from risk import (
    assess_schedule_risk,
    assess_voyage_risk,
    assess_waiting_risk,
)


@pytest.mark.parametrize(
    "waiting_hours,expected_category",
    [
        (0, "Low"),
        (12, "Low"),
        (24, "Medium"),
        (60, "High"),
    ],
)
def test_waiting_risk_classification(waiting_hours, expected_category):
    result = assess_waiting_risk(waiting_hours)

    assert result["category"] == expected_category


@pytest.mark.parametrize(
    "voyage_days,available_days,expected_category",
    [
        (5, 20, "Low"),
        (15, 20, "Medium"),
        (20, 20, "High"),
    ],
)
def test_schedule_risk_classification(voyage_days, available_days, expected_category):
    result = assess_schedule_risk(voyage_days, available_days)

    assert result["category"] == expected_category


def test_assess_voyage_risk_returns_complete_output():
    result = assess_voyage_risk(
        feasible=True,
        voyage_days=10,
        available_days=20,
        waiting_hours=24,
        feasibility_checks=[
            {"check": "cargo_vessel", "status": "PASS"},
            {"check": "draft", "status": "UNKNOWN"},
        ],
    )

    assert set(result.keys()) == {
        "feasibility_risk",
        "schedule_risk",
        "waiting_risk",
        "operational_risk",
        "overall_risk",
    }
    assert result["overall_risk"]["score"] >= 0
    assert result["overall_risk"]["category"] in {"Low", "Medium", "High"}


def test_invalid_waiting_hours_raises_value_error():
    with pytest.raises(ValueError, match="waiting_hours cannot be negative."):
        assess_waiting_risk(-1)
