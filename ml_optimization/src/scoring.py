"""
Scoring & Evaluation Module

Converts voyage performance factors into normalized scores
for comparing vessel/voyage options.

Higher final score = better option.

Factors:
- Feasibility
- Cost
- Risk
- Fuel consumption
- CO2 emissions
"""

from config_loader import load_configuration


CONFIGURATION = load_configuration()
SCORING_WEIGHTS = CONFIGURATION["scoring"]

def normalize_cost(cost, min_cost, max_cost):
    """
    Convert cost into a 0-100 score.
    Lower cost receives a higher score.
    """

    if max_cost == min_cost:
        return 100.0

    score = 100 * (max_cost - cost) / (max_cost - min_cost)

    return max(0.0, min(100.0, score))


def normalize_risk(risk_score):
    """
    Convert risk score into a 0-100 score.
    Lower risk receives a higher score.
    """

    score = 100 - risk_score

    return max(0.0, min(100.0, score))


def normalize_fuel(fuel_consumption, min_fuel, max_fuel):
    """
    Convert fuel consumption into a 0-100 score.
    Lower fuel consumption receives a higher score.
    """

    if max_fuel == min_fuel:
        return 100.0

    score = 100 * (max_fuel - fuel_consumption) / (
        max_fuel - min_fuel
    )

    return max(0.0, min(100.0, score))


def normalize_co2(co2_emission, min_co2, max_co2):
    """
    Convert CO2 emissions into a 0-100 score.
    Lower emissions receive a higher score.
    """

    if max_co2 == min_co2:
        return 100.0

    score = 100 * (max_co2 - co2_emission) / (
        max_co2 - min_co2
    )

    return max(0.0, min(100.0, score))


def calculate_weighted_score(
    feasibility_score,
    cost_score,
    risk_score,
    fuel_score,
    co2_score
):
    """
    Calculate the final weighted option score.

    Current weights:
    Feasibility : 30%
    Cost        : 30%
    Risk        : 20%
    Fuel        : 10%
    CO2         : 10%
    """

    weights = SCORING_WEIGHTS

    final_score = (
        feasibility_score * weights["feasibility"]
        + cost_score * weights["cost"]
        + risk_score * weights["risk"]
        + fuel_score * weights["fuel"]
        + co2_score * weights["co2"]
    )

    return round(final_score, 2)


def evaluate_option(
    feasible,
    total_cost,
    risk_score,
    fuel_consumption,
    co2_emission,
    min_cost,
    max_cost,
    min_fuel,
    max_fuel,
    min_co2,
    max_co2
):
    """
    Evaluate one vessel/voyage option.

    Returns:
        dict containing individual scores and final score.
    """

    # Feasibility is a hard operational condition.
    if feasible:
        feasibility_score = 100.0
    else:
        feasibility_score = 0.0

    cost_score = normalize_cost(
        total_cost,
        min_cost,
        max_cost
    )

    risk_score_normalized = normalize_risk(
        risk_score
    )

    fuel_score = normalize_fuel(
        fuel_consumption,
        min_fuel,
        max_fuel
    )

    co2_score = normalize_co2(
        co2_emission,
        min_co2,
        max_co2
    )

    final_score = calculate_weighted_score(
        feasibility_score,
        cost_score,
        risk_score_normalized,
        fuel_score,
        co2_score
    )

    return {
        "feasibility_score": round(feasibility_score, 2),
        "cost_score": round(cost_score, 2),
        "risk_score": round(risk_score_normalized, 2),
        "fuel_score": round(fuel_score, 2),
        "co2_score": round(co2_score, 2),
        "final_score": final_score
    }


def classify_score(final_score):
    """
    Convert final score into a simple evaluation category.
    """

    if final_score >= 80:
        return "Excellent"

    if final_score >= 65:
        return "Good"

    if final_score >= 50:
        return "Moderate"

    return "Poor"


# ------------------------------------------------------------
# SMOKE TEST
# ------------------------------------------------------------

if __name__ == "__main__":

    print("=" * 60)
    print("SCORING & EVALUATION TEST")
    print("=" * 60)

    result = evaluate_option(
        feasible=True,
        total_cost=1_871_204,
        risk_score=20,
        fuel_consumption=985.34,
        co2_emission=865652.00,

        # Comparison range for test options
        min_cost=1_500_000,
        max_cost=2_500_000,

        min_fuel=800,
        max_fuel=1200,

        min_co2=700000,
        max_co2=1000000
    )

    print(f"Feasibility Score : {result['feasibility_score']}")
    print(f"Cost Score        : {result['cost_score']}")
    print(f"Risk Score        : {result['risk_score']}")
    print(f"Fuel Score        : {result['fuel_score']}")
    print(f"CO2 Score         : {result['co2_score']}")
    print("-" * 60)
    print(f"Final Score       : {result['final_score']}")
    print(f"Evaluation        : {classify_score(result['final_score'])}")
    print("=" * 60)
    print("TEST COMPLETED")