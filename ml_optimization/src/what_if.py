"""
What-If Analysis Module
"""

def build_what_if_result(baseline_option, scenario_option):

    if baseline_option is None:
        return {
            "status": "BASELINE_INFEASIBLE",
            "baseline": None,
            "scenario": scenario_option,
            "changes": {},
        }

    if scenario_option is None:
        return {
            "status": "SCENARIO_INFEASIBLE",
            "baseline": baseline_option,
            "scenario": None,
            "changes": {},
        }

    baseline_score = float(
        baseline_option.get("final_score", 0.0)
    )

    scenario_score = float(
        scenario_option.get("final_score", 0.0)
    )

    baseline_cost = float(
        baseline_option.get("total_cost", 0.0)
    )

    scenario_cost = float(
        scenario_option.get("total_cost", 0.0)
    )

    baseline_risk = float(
        baseline_option.get("overall_risk", 0.0)
    )

    scenario_risk = float(
        scenario_option.get("overall_risk", 0.0)
    )

    baseline_fuel = float(
        baseline_option.get("fuel_consumption", 0.0)
    )

    scenario_fuel = float(
        scenario_option.get("fuel_consumption", 0.0)
    )

    baseline_co2 = float(
        baseline_option.get("co2_emission", 0.0)
    )

    scenario_co2 = float(
        scenario_option.get("co2_emission", 0.0)
    )

    baseline_waiting = float(
        baseline_option.get("waiting_hours", 0.0)
    )

    scenario_waiting = float(
        scenario_option.get("waiting_hours", 0.0)
    )

    baseline_voyages = int(
        baseline_option.get("required_voyages", 0)
    )

    scenario_voyages = int(
        scenario_option.get("required_voyages", 0)
    )

    baseline_days = float(
        baseline_option.get("total_operational_days", 0.0)
    )

    scenario_days = float(
        scenario_option.get("total_operational_days", 0.0)
    )

    return {
        "status": "COMPLETED",
        "baseline": baseline_option,
        "scenario": scenario_option,
        "changes": {
            "total_cost": round(
                scenario_cost - baseline_cost,
                2,
            ),
            "waiting_hours": round(
                scenario_waiting - baseline_waiting,
                2,
            ),
            "fuel_consumption": round(
                scenario_fuel - baseline_fuel,
                2,
            ),
            "co2_emission": round(
                scenario_co2 - baseline_co2,
                2,
            ),
            "required_voyages": (
                scenario_voyages - baseline_voyages
            ),
            "total_operational_days": round(
                scenario_days - baseline_days,
                2,
            ),
            "final_score": round(
                scenario_score - baseline_score,
                2,
            ),
            "risk": round(
                scenario_risk - baseline_risk,
                2,
            ),
        },
    }