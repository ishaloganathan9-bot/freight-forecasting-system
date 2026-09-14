import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from cost import (
    calculate_cost_per_tonne,
    calculate_freight_cost,
    calculate_fuel_cost,
    calculate_total_cost,
    calculate_voyage_cost,
    calculate_waiting_cost,
)


def test_total_cost_and_cost_per_tonne():
    result = calculate_voyage_cost(
        cargo_quantity=1000,
        freight_rate=5,
        fuel_consumption=10,
        fuel_price=2,
        waiting_hours=24,
        daily_waiting_cost=3,
        other_cost=4,
    )

    assert result["freight_cost"] == 5000
    assert result["fuel_cost"] == 20
    assert result["waiting_cost"] == 3
    assert result["total_cost"] == 5027
    assert result["cost_per_tonne"] == pytest.approx(5.027)


def test_fuel_and_waiting_cost_contributions():
    assert calculate_fuel_cost(100, 2.5) == 250
    assert calculate_waiting_cost(48, 10) == 20


@pytest.mark.parametrize(
    "func,args,match",
    [
        (calculate_fuel_cost, (-1, 2), "Fuel consumption cannot be negative."),
        (calculate_fuel_cost, (10, -1), "Fuel price cannot be negative."),
        (calculate_waiting_cost, (-1, 10), "Waiting hours cannot be negative."),
        (calculate_waiting_cost, (10, -1), "Daily waiting cost cannot be negative."),
        (calculate_total_cost, (-1, 10, 0, 0), "Cost values cannot be negative."),
        (calculate_cost_per_tonne, (-1, 100), "Total cost cannot be negative."),
    ],
)
def test_invalid_inputs_raises(func, args, match):
    with pytest.raises(ValueError, match=match):
        func(*args)


@pytest.mark.parametrize(
    "func,args,match",
    [
        (calculate_freight_cost, (0, 10), "Cargo quantity must be greater than zero."),
        (calculate_cost_per_tonne, (1000, 0), "Cargo quantity must be greater than zero."),
    ],
)
def test_invalid_inputs_for_cost_helpers(func, args, match):
    with pytest.raises(ValueError, match=match):
        func(*args)
