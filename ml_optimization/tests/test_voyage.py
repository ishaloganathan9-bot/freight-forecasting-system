import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from voyage import calculate_sailing_time, calculate_voyage, find_route


def test_calculate_voyage_returns_expected_route_details():
    result = calculate_voyage(
        origin_port="Newcastle, Australia",
        destination_port="Paradip",
        speed_knots=12,
    )

    assert result["origin_port"] == "Newcastle, Australia"
    assert result["destination_port"] == "Paradip"
    assert result["distance_nm"] > 0
    assert result["speed_knots"] == pytest.approx(12)
    assert result["sailing_hours"] == pytest.approx(result["distance_nm"] / 12)
    assert result["sailing_days"] == pytest.approx(result["sailing_hours"] / 24)


def test_calculate_sailing_time_matches_distance_speed_relationship():
    sailing_hours, sailing_days = calculate_sailing_time(240, 12)

    assert sailing_hours == pytest.approx(20)
    assert sailing_days == pytest.approx(20 / 24)


def test_calculate_voyage_explicitly_tracks_port_and_waiting_time():
    result = calculate_voyage(
        origin_port="Newcastle, Australia",
        destination_port="Paradip",
        speed_knots=12,
        loading_handling_days=2,
        berthing_port_days=1,
        waiting_hours=36,
    )

    assert result["loading_handling_days"] == pytest.approx(2)
    assert result["berthing_port_days"] == pytest.approx(1)
    assert result["port_days"] == pytest.approx(3)
    assert result["waiting_hours"] == pytest.approx(36)
    assert result["waiting_days"] == pytest.approx(1.5)
    assert result["total_port_days"] == pytest.approx(3)
    assert result["total_voyage_days"] == pytest.approx(
        result["sailing_days"] + 3 + 1.5
    )


def test_invalid_or_zero_speed_raises_value_error():
    with pytest.raises(ValueError, match="Distance must be greater than zero."):
        calculate_sailing_time(0, 12)

    with pytest.raises(ValueError, match="Vessel speed must be greater than zero."):
        calculate_sailing_time(100, 0)

    with pytest.raises(ValueError, match="Vessel speed must be greater than zero."):
        calculate_voyage(
            origin_port="Newcastle, Australia",
            destination_port="Paradip",
            speed_knots=0,
        )


def test_find_route_raises_for_unknown_route():
    with pytest.raises(ValueError, match="No route found"):
        find_route("Unknown Port", "Paradip")
