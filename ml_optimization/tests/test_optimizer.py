import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from optimizer import (
    build_optimization_options,
    build_voyage_plan,
    calculate_required_voyages,
    generate_recommendation,
    get_demo_inputs,
    load_data,
    load_vessel_candidates,
    optimize_vessel_options,
    rank_vessel_options,
)


BASE_DIR = Path(__file__).resolve().parents[1]


def test_load_data_returns_expected_components():
    loaded = load_data()

    assert len(loaded) == 4
    vessels, cargo_compatibility, paradip, visakhapatnam = loaded

    assert not vessels.empty
    assert not cargo_compatibility.empty
    assert not paradip.empty
    assert not visakhapatnam.empty

    assert {"vessel_name", "vessel_type", "deadweight_tonnage"}.issubset(vessels.columns)


def test_load_vessel_candidates_generates_bulk_carrier_candidates():
    vessels, _, _, _ = load_data()
    candidates = load_vessel_candidates(vessels, "Thermal Coal", 200000)

    assert not candidates.empty
    assert all(str(candidate["vessel_type"]).strip().lower() == "bulk carrier" for _, candidate in candidates.iterrows())


def test_calculate_required_voyages_and_plan_distribution():
    assert calculate_required_voyages(50000, 80000) == 1
    assert calculate_required_voyages(80000, 80000) == 1
    assert calculate_required_voyages(300000, 80000) == 4

    plan = build_voyage_plan(300000, 80000)

    assert plan["required_voyages"] == 4
    assert plan["cargo_per_voyage"] == [80000, 80000, 80000, 60000]
    assert plan["final_voyage_cargo"] == 60000


def test_build_optimization_options_handles_multi_voyage_plans():
    demo = get_demo_inputs()
    vessels, _, _, _ = load_data()

    options = build_optimization_options(
        vessels=vessels,
        cargo_type=demo["cargo_type"],
        cargo_quantity=300000,
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
    assert any(option["required_voyages"] > 1 for option in options)

    multi_voyage_option = next(option for option in options if option["required_voyages"] > 1)

    assert len(multi_voyage_option["cargo_per_voyage"]) == multi_voyage_option["required_voyages"]
    assert sum(multi_voyage_option["cargo_per_voyage"]) == 300000
    assert multi_voyage_option["final_voyage_cargo"] > 0
    assert multi_voyage_option["loading_handling_days_per_voyage"] >= 0
    assert multi_voyage_option["berthing_port_days_per_voyage"] >= 0
    assert multi_voyage_option["port_days_per_voyage"] >= 0
    assert multi_voyage_option["total_port_days"] >= 0
    assert multi_voyage_option["waiting_hours_per_voyage"] >= 0
    assert multi_voyage_option["total_waiting_hours"] >= 0
    assert multi_voyage_option["total_operational_days"] >= multi_voyage_option["total_sailing_days"]


def test_build_optimization_options_generates_conditional_options_for_current_demo_data():
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
    assert all(option["status"] == "CONDITIONAL" for option in options)
    assert all(option["conditional"] is True for option in options)
    assert all(option["feasibility"] is False for option in options)


def test_optimize_vessel_options_returns_none_when_only_conditional_candidates_exist():
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

    ranked = rank_vessel_options(options)
    selected = optimize_vessel_options(ranked)

    assert selected is None
    assert all(option["status"] == "CONDITIONAL" for option in options)


def test_end_to_end_pipeline_returns_no_recommendation_when_only_conditional_candidates_exist():
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
    assert all(option["status"] == "CONDITIONAL" for option in options)

    ranked = rank_vessel_options(options)
    selected = optimize_vessel_options(ranked)

    assert selected is None

    recommendation = generate_recommendation(selected)

    assert recommendation["status"] == "Not Recommended"
    assert recommendation["recommended_vessel"] is None
    assert recommendation["reason"]


def test_multi_voyage_end_to_end_pipeline_works():
    demo = get_demo_inputs()
    vessels, _, _, _ = load_data()

    cargo_quantity = 300000

    options = build_optimization_options(
        vessels=vessels,
        cargo_type=demo["cargo_type"],
        cargo_quantity=cargo_quantity,
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
    assert any(option["required_voyages"] > 1 for option in options)
    assert all(option["status"] == "CONDITIONAL" for option in options)

    ranked = rank_vessel_options(options)
    selected = optimize_vessel_options(ranked)

    assert selected is None


def test_destination_change_recalculates_route_and_port_results():
    demo = get_demo_inputs()
    vessels, _, _, _ = load_data()

    paradip_options = build_optimization_options(
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

    vizag_options = build_optimization_options(
        vessels=vessels,
        cargo_type=demo["cargo_type"],
        cargo_quantity=demo["cargo_quantity"],
        origin_port=demo["origin_port"],
        destination_port="Visakhapatnam",
        speed_knots=demo["speed_knots"],
        available_days=demo["available_days"],
        freight_rate=demo["freight_rate"],
        fuel_price=demo["fuel_price"],
        waiting_hours=demo["waiting_hours"],
        daily_waiting_cost=demo["daily_waiting_cost"],
        other_cost=demo["other_cost"],
    )

    assert paradip_options
    assert vizag_options == []
    assert paradip_options[0]["destination_port"] == "Paradip"
    assert paradip_options[0]["distance_nm"] > 0
