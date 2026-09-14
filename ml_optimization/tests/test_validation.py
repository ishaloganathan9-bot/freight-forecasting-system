import sys
from pathlib import Path

import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from optimizer import load_vessel_candidates
from validate_all_data import validate_file


BASE_DIR = Path(__file__).resolve().parents[1]


def test_validate_file_accepts_existing_dataset():
    vessel_file = BASE_DIR / "data" / "processed" / "vessels" / "vessels_cleaned.csv"

    assert validate_file("Vessels", vessel_file) is True


def test_validate_file_rejects_missing_file(tmp_path):
    missing_file = tmp_path / "missing.csv"

    assert validate_file("Missing", missing_file) is False


def test_validate_file_rejects_empty_csv(tmp_path):
    empty_file = tmp_path / "empty.csv"
    pd.DataFrame(columns=["vessel_name"]).to_csv(empty_file, index=False)

    assert validate_file("Empty", empty_file) is False


def test_load_vessel_candidates_requires_required_columns():
    vessels = pd.DataFrame(
        {
            "vessel_name": ["Test Vessel"],
            "deadweight_tonnage": [100000],
        }
    )

    with pytest.raises(ValueError, match="Required vessel column missing: vessel_type"):
        load_vessel_candidates(vessels, "Thermal Coal", 10000)
