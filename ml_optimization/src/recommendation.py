def build_recommendation(selected_option):
    """
    Build a user-facing recommendation from the selected
    optimization option.

    The optimizer is responsible for selecting the best
    feasible option. This module formats that result and
    generates reasons from the actual calculated metrics.
    """

    if not selected_option:
        return {
            "status": "NO_RECOMMENDATION",
            "message": (
                "No fully verified feasible vessel or plan "
                "was found."
            ),
            "recommendation": None,
        }

    reasons = []

    # --------------------------------------------------------
    # FEASIBILITY
    # --------------------------------------------------------

    if selected_option.get("status") == "PASS":
        reasons.append(
            "The selected vessel passed the required "
            "vessel and port feasibility checks."
        )

    # --------------------------------------------------------
    # OPTIMIZATION
    # --------------------------------------------------------

    if selected_option.get(
        "optimization_status"
    ) == "OPTIMAL":

        reasons.append(
            "The plan was selected as the optimal option "
            "by the optimization model."
        )

    # --------------------------------------------------------
    # DEADLINE
    # --------------------------------------------------------

    if selected_option.get(
        "deadline_feasible"
    ) is True:

        reasons.append(
            "The selected plan satisfies the available "
            "schedule requirement."
        )

    # --------------------------------------------------------
    # WAITING
    # --------------------------------------------------------

    waiting_hours = selected_option.get(
        "waiting_hours"
    )

    if waiting_hours is not None:

        if waiting_hours <= 12:

            reasons.append(
                "Expected waiting time is low."
            )

        elif waiting_hours <= 48:

            reasons.append(
                "Expected waiting time is within a "
                "moderate range."
            )

        else:

            reasons.append(
                "Expected waiting time is relatively high "
                "and is included in the decision."
            )

    # --------------------------------------------------------
    # RISK
    # --------------------------------------------------------

    risk_level = selected_option.get(
        "risk_level"
    )

    if risk_level:

        reasons.append(
            f"The overall assessed risk level is "
            f"{risk_level}."
        )

    # --------------------------------------------------------
    # COST
    # --------------------------------------------------------

    total_cost = selected_option.get(
        "total_cost"
    )

    if total_cost is not None:

        reasons.append(
            "The recommendation considers the calculated "
            "total logistics cost."
        )

    # --------------------------------------------------------
    # FUEL + CO2
    # --------------------------------------------------------

    if selected_option.get(
        "fuel_consumption"
    ) is not None:

        reasons.append(
            "Fuel consumption is included in the "
            "multi-criteria decision."
        )

    if selected_option.get(
        "co2_emission"
    ) is not None:

        reasons.append(
            "Estimated CO2 emissions are included in "
            "the sustainability assessment."
        )

    # --------------------------------------------------------
    # FINAL RECOMMENDATION
    # --------------------------------------------------------

    recommendation = {

        "vessel_name": selected_option.get(
            "vessel_name"
        ),

        "vessel_type": selected_option.get(
            "vessel_type"
        ),

        "strategy": selected_option.get(
            "strategy"
        ),

        "contract_strategy": selected_option.get(
            "contract_strategy"
        ),

        "required_voyages": selected_option.get(
            "required_voyages"
        ),

        "cargo_per_voyage": selected_option.get(
            "cargo_per_voyage"
        ),

        "effective_freight_rate": selected_option.get(
            "effective_freight_rate"
        ),

        "total_cost": selected_option.get(
            "total_cost"
        ),

        "cost_per_tonne": selected_option.get(
            "cost_per_tonne"
        ),

        "waiting_hours": selected_option.get(
            "waiting_hours"
        ),

        "total_operational_days": selected_option.get(
            "total_operational_days"
        ),

        "fuel_consumption": selected_option.get(
            "fuel_consumption"
        ),

        "co2_emission": selected_option.get(
            "co2_emission"
        ),

        "overall_risk": selected_option.get(
            "overall_risk"
        ),

        "risk_level": selected_option.get(
            "risk_level"
        ),

        "final_score": selected_option.get(
            "final_score"
        ),

        "optimization_status": selected_option.get(
            "optimization_status"
        ),

        "reasons": reasons,
    }

    return {
        "status": "RECOMMENDED",
        "message": (
            "The optimization model selected the "
            "recommended vessel and chartering plan."
        ),
        "recommendation": recommendation,
    }