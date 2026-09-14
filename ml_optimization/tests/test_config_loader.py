import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from config_loader import load_configuration


def test_load_configuration_returns_expected_default_values():
    config = load_configuration()

    assert set(config) == {"scoring", "risk"}
    assert config["scoring"] == {
        "feasibility": 0.30,
        "cost": 0.30,
        "risk": 0.20,
        "fuel": 0.10,
        "co2": 0.10,
    }
    assert config["risk"]["feasibility"] == {
        "pass_score": 0.0,
        "fail_score": 40.0,
    }
    assert config["risk"]["schedule"]["low_ratio_threshold"] == 0.70
    assert config["risk"]["waiting"]["medium_hours_threshold"] == 48.0
    assert config["risk"]["operational"]["pass_score"] == 0.0
    assert config["risk"]["overall"] == {
        "low_threshold": 20.0,
        "medium_threshold": 50.0,
    }


def test_load_configuration_rejects_missing_required_scoring_values(tmp_path):
    config_path = tmp_path / "invalid.yaml"
    config_path.write_text(
        """
scoring:
  feasibility: 0.30
  cost: 0.30
  risk: 0.20

risk:
  feasibility:
    pass_score: 0
    fail_score: 40
  schedule:
    unavailable_days_score: 30
    low_ratio_threshold: 0.70
    medium_ratio_threshold: 0.90
    low_score: 0
    medium_score: 15
    high_score: 30
  waiting:
    low_hours_threshold: 12
    medium_hours_threshold: 48
    low_score: 0
    medium_score: 10
    high_score: 20
  operational:
    default_score: 10
    failed_checks_score: 20
    unknown_checks_score: 10
  overall:
    low_threshold: 20
    medium_threshold: 50
""".strip(),
        encoding="utf-8",
    )

    with pytest.raises(ValueError, match="Missing required scoring configuration"):
        load_configuration(config_path)


def test_load_configuration_rejects_invalid_total_weight(tmp_path):
    config_path = tmp_path / "invalid_weight.yaml"
    config_path.write_text(
        """
scoring:
  feasibility: 0.50
  cost: 0.30
  risk: 0.20
  fuel: 0.10
  co2: 0.10

risk:
  feasibility:
    pass_score: 0
    fail_score: 40
  schedule:
    unavailable_days_score: 30
    low_ratio_threshold: 0.70
    medium_ratio_threshold: 0.90
    low_score: 0
    medium_score: 15
    high_score: 30
  waiting:
    low_hours_threshold: 12
    medium_hours_threshold: 48
    low_score: 0
    medium_score: 10
    high_score: 20
  operational:
    default_score: 10
    failed_checks_score: 20
    unknown_checks_score: 10
    pass_score: 0
  overall:
    low_threshold: 20
    medium_threshold: 50
""".strip(),
        encoding="utf-8",
    )

    with pytest.raises(ValueError, match="Scoring weights must sum to 1.0"):
        load_configuration(config_path)
