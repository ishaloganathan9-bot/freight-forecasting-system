def build_explanation(recommendation):
    """
    Build a human-readable explanation for the selected
    recommendation using the calculated optimization results.
    """

    if not recommendation:
        return {
            "status": "NO_EXPLANATION",
            "reasons": [],
            "summary": (
                "No recommendation is available to explain."
            ),
        }

    reasons = []

    # --------------------------------------------------------
    # VESSEL + PORT FEASIBILITY
    # --------------------------------------------------------

    if recommendation.get("status") == "PASS":

        reasons.append(
            "The selected vessel passed the required "
            "vessel and port feasibility checks."
        )

    # --------------------------------------------------------
    # CONTRACT STRATEGY
    # --------------------------------------------------------

    contract_strategy = recommendation.get(
        "contract_strategy"
    )

    if contract_strategy:

        reasons.append(
            f"The selected chartering strategy is "
            f"{contract_strategy}."
        )

    # --------------------------------------------------------
    # VOYAGES
    # --------------------------------------------------------

    required_voyages = recommendation.get(
        "required_voyages"
    )

    if required_voyages is not None:

        reasons.append(
            f"The cargo requirement is planned across "
            f"{required_voyages} voyage(s)."
        )

    # --------------------------------------------------------
    # DEADLINE
    # --------------------------------------------------------

    if recommendation.get(
        "deadline_feasible"
    ) is True:

        reasons.append(
            "The selected plan satisfies the available "
            "schedule requirement."
        )

    # --------------------------------------------------------
    # WAITING
    # --------------------------------------------------------

    waiting_hours = recommendation.get(
        "waiting_hours"
    )

    if waiting_hours is not None:

        reasons.append(
            f"Expected total waiting time is "
            f"{waiting_hours:.2f} hours."
        )

    # --------------------------------------------------------
    # COST
    # --------------------------------------------------------

    total_cost = recommendation.get(
        "total_cost"
    )

    if total_cost is not None:

        reasons.append(
            f"Calculated total cost is "
            f"{total_cost:.2f}."
        )

    # --------------------------------------------------------
    # FUEL
    # --------------------------------------------------------

    fuel_consumption = recommendation.get(
        "fuel_consumption"
    )

    if fuel_consumption is not None:

        reasons.append(
            f"Estimated fuel consumption is "
            f"{fuel_consumption:.2f}."
        )

    # --------------------------------------------------------
    # CO2
    # --------------------------------------------------------

    co2_emission = recommendation.get(
        "co2_emission"
    )

    if co2_emission is not None:

        reasons.append(
            f"Estimated CO2 emission is "
            f"{co2_emission:.2f}."
        )

    # --------------------------------------------------------
    # RISK
    # --------------------------------------------------------

    risk_level = recommendation.get(
        "risk_level"
    )

    if risk_level:

        reasons.append(
            f"The assessed overall risk level is "
            f"{risk_level}."
        )

    # --------------------------------------------------------
    # SCORE
    # --------------------------------------------------------

    final_score = recommendation.get(
        "final_score"
    )

    if final_score is not None:

        reasons.append(
            f"The final optimization score is "
            f"{final_score:.2f}."
        )

    # --------------------------------------------------------
    # SUMMARY
    # --------------------------------------------------------

    vessel_name = recommendation.get(
        "vessel_name",
        "the selected vessel"
    )

    summary = (
        f"{vessel_name} was selected because it provides "
        "a feasible chartering option based on the calculated "
        "cost, operational, risk and sustainability metrics."
    )

    return {
        "status": "EXPLAINED",
        "summary": summary,
        "reasons": reasons,
    }