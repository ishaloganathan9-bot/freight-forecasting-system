import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from optimizer import (
    build_chartering_strategies,
    build_optimization_options,
    get_demo_inputs,
    load_data,
)


def test_build_chartering_strategies_returns_all_required_strategy_types():
    strategies = build_chartering_strategies(freight_rate=25.0, waiting_hours=24.0)

    assert len(strategies) == 5

    strategy_names = {strategy["strategy"] for strategy in strategies}

    assert strategy_names == {
        "charter_now",
        "wait",
        "multiple_spot",
        "short_term_multi_voyage",
        "medium_term_multi_voyage",
    }

    assert all("contract_strategy" in strategy for strategy in strategies)
    assert all("strategy_assumption" in strategy for strategy in strategies)
    assert all("forecast_available" in strategy for strategy in strategies)


def test_strategy_metadata_is_preserved_in_option_output():
    demo = get_demo_inputs()
    vessels, _, _, _ = load_data()

    options = build_optimization_options(
        vessels=vessels,
        cargo_type=demo["cargo_type"],
        cargo_quantity=50000,
        origin_port=demo["origin_port"],
        destination_port="Paradip",
        speed_knots=demo["speed_knots"],
        available_days=40,
        freight_rate=demo["freight_rate"],
        fuel_price=demo["fuel_price"],
        waiting_hours=demo["waiting_hours"],
        daily_waiting_cost=demo["daily_waiting_cost"],
        other_cost=demo["other_cost"],
    )

    assert options
    assert {option["strategy"] for option in options} == {
        "charter_now",
        "wait",
        "multiple_spot",
        "short_term_multi_voyage",
        "medium_term_multi_voyage",
    }
    assert all("contract_strategy" in option for option in options)
    assert all("strategy_assumption" in option for option in options)
    assert all("forecast_available" in option for option in options)
