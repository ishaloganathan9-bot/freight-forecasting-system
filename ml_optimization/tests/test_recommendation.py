import sys
from pathlib import Path

sys.path.insert(
    0,
    str(
        Path(__file__).resolve().parents[1] / "src"
    )
)

from optimizer import (
    build_optimization_options,
    get_demo_inputs,
    load_data,
    optimize_vessel_options,
    rank_vessel_options,
    generate_recommendation,
    build_full_explanation,
    run_what_if_analysis,
)

from what_if import build_what_if_result


def test_recommendation_is_produced_when_baseline_is_conditional_only():
    demo = get_demo_inputs()
    vessels, _, _, _ = load_data()

    options = build_optimization_options(
        vessels=vessels,
        cargo_type=demo["cargo_type"],
        cargo_quantity=demo["cargo_quantity"],
        origin_port=demo["origin_port"],
        destination_port=demo["destination_port"],
        speed_knots=demo["speed_knots"],
        available_days=demo["available_days"],
        freight_rate=demo["freight_rate"],
        fuel_price=demo["fuel_price"],
        waiting_hours=demo["waiting_hours"],
        daily_waiting_cost=demo["daily_waiting_cost"],
        other_cost=demo["other_cost"],
    )

    ranked = rank_vessel_options(options)
    selected = optimize_vessel_options(ranked)

    recommendation = generate_recommendation(selected)

    assert selected is not None
    assert selected["status"] == "CONDITIONAL"
    assert recommendation["status"] == "Recommended"
    assert recommendation["recommended_vessel"] == selected["vessel_name"]
    assert recommendation["reason"]
    assert "confirmation is required" in recommendation["reason"].lower()


def test_what_if_output_reports_completed_comparison_when_options_exist():
    demo = get_demo_inputs()
    vessels, _, _, _ = load_data()

    result = run_what_if_analysis(
        vessels=vessels,
        cargo_type=demo["cargo_type"],
        cargo_quantity=demo["cargo_quantity"],
        origin_port=demo["origin_port"],
        destination_port=demo["destination_port"],
        speed_knots=demo["speed_knots"],
        available_days=demo["available_days"],
        freight_rate=demo["freight_rate"],
        fuel_price=demo["fuel_price"],
        waiting_hours=demo["waiting_hours"],
        daily_waiting_cost=demo["daily_waiting_cost"],
        other_cost=demo["other_cost"],
        what_if_cargo_quantity=demo["what_if_cargo_quantity"],
    )

    assert result["status"] == "COMPLETED"
    assert result["baseline"] is not None
    assert result["what_if"] is not None
    assert result["comparison"] is None


def test_infeasible_what_if_scenario_is_handled_correctly():
    demo = get_demo_inputs()
    vessels, _, _, _ = load_data()

    result = run_what_if_analysis(
        vessels=vessels,
        cargo_type=demo["cargo_type"],
        cargo_quantity=demo["cargo_quantity"],
        origin_port=demo["origin_port"],
        destination_port=demo["destination_port"],
        speed_knots=demo["speed_knots"],
        available_days=demo["available_days"],
        freight_rate=demo["freight_rate"],
        fuel_price=demo["fuel_price"],
        waiting_hours=demo["waiting_hours"],
        daily_waiting_cost=demo["daily_waiting_cost"],
        other_cost=demo["other_cost"],
        what_if_available_days=1,
    )

    assert result["status"] == "SCENARIO_INFEASIBLE"
    assert result["baseline"] is not None
    assert result["scenario"] is None
    assert result["changes"] == {}


def test_build_what_if_result_compares_two_feasible_options():
    baseline = {
        "vessel_name": "BASELINE VESSEL",
        "strategy": "charter_now",
        "required_voyages": 2,
        "total_cost": 1000000.0,
        "waiting_hours": 24.0,
        "fuel_consumption": 5000.0,
        "co2_emission": 15000.0,
        "total_operational_days": 20.0,
        "final_score": 70.0,
    }

    scenario = {
        "vessel_name": "SCENARIO VESSEL",
        "strategy": "short_term_multi_voyage",
        "required_voyages": 2,
        "total_cost": 900000.0,
        "waiting_hours": 12.0,
        "fuel_consumption": 4500.0,
        "co2_emission": 13500.0,
        "total_operational_days": 18.0,
        "final_score": 80.0,
    }

    result = build_what_if_result(
        baseline_option=baseline,
        scenario_option=scenario,
    )

    assert result["status"] == "COMPLETED"
    assert result["baseline"] == baseline
    assert result["scenario"] == scenario

    assert result["changes"]["total_cost"] == -100000.0
    assert result["changes"]["waiting_hours"] == -12.0
    assert result["changes"]["fuel_consumption"] == -500.0
    assert result["changes"]["co2_emission"] == -1500.0
    assert result["changes"]["required_voyages"] == 0
    assert result["changes"]["total_operational_days"] == -2.0
    assert result["changes"]["final_score"] == 10.0


def test_build_what_if_result_handles_missing_baseline():
    scenario = {
        "vessel_name": "SCENARIO VESSEL",
        "total_cost": 900000.0,
    }

    result = build_what_if_result(
        baseline_option=None,
        scenario_option=scenario,
    )

    assert result["status"] == "BASELINE_INFEASIBLE"
    assert result["baseline"] is None
    assert result["scenario"] == scenario
    assert result["changes"] == {}


def test_build_what_if_result_handles_missing_scenario():
    baseline = {
        "vessel_name": "BASELINE VESSEL",
        "total_cost": 1000000.0,
    }

    result = build_what_if_result(
        baseline_option=baseline,
        scenario_option=None,
    )

    assert result["status"] == "SCENARIO_INFEASIBLE"
    assert result["baseline"] == baseline
    assert result["scenario"] is None
    assert result["changes"] == {}


def test_build_full_explanation_returns_recommendation_and_explanation():
    selected_option = {
        "status": "PASS",
        "optimization_status": "OPTIMAL",
        "vessel_name": "TEST VESSEL",
        "vessel_type": "Panamax",
        "strategy": "short_term_multi_voyage",
        "contract_strategy": "Single short-term contract across all voyages",
        "required_voyages": 2,
        "cargo_per_voyage": [50000.0, 50000.0],
        "effective_freight_rate": 24.0,
        "total_cost": 2400000.0,
        "cost_per_tonne": 24.0,
        "waiting_hours": 8.0,
        "total_operational_days": 20.0,
        "fuel_consumption": 5000.0,
        "co2_emission": 15000.0,
        "overall_risk": 10.0,
        "risk_level": "LOW",
        "final_score": 85.0,
        "deadline_feasible": True,
    }

    result = build_full_explanation(
        selected_option
    )

    assert result["recommendation"]["status"] == "RECOMMENDED"
    assert (
        result["recommendation"]["recommendation"]
        ["vessel_name"]
        == "TEST VESSEL"
    )

    assert result["explanation"]["status"] == "EXPLAINED"
    assert result["explanation"]["reasons"]
    assert "TEST VESSEL" in result["explanation"]["summary"]