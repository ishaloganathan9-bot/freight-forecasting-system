"""
Risk Assessment Module

Evaluates operational and schedule-related risks for a voyage.

Risk factors:
1. Feasibility risk
2. Schedule risk
3. Waiting/idle risk
4. Operational risk

This module does not invent weather or congestion data.
Those factors can be added later when real data becomes available.
"""

from config_loader import load_configuration


CONFIGURATION = load_configuration()
RISK_CONFIG = CONFIGURATION["risk"]


def assess_feasibility_risk(feasible):
    """
    Assess risk based on overall vessel/port feasibility.

    Returns:
        dict: feasibility risk result
    """

    if feasible is True:
        return {
            "score": RISK_CONFIG["feasibility"]["pass_score"],
            "category": "Low",
            "reason": "Vessel and port feasibility checks passed."
        }

    return {
        "score": RISK_CONFIG["feasibility"]["fail_score"],
        "category": "High",
        "reason": "One or more vessel/port feasibility checks failed."
    }


def assess_schedule_risk(voyage_days, available_days):
    """
    Assess schedule risk by comparing voyage duration
    with the available delivery time.

    Args:
        voyage_days (float): Estimated sailing duration.
        available_days (float): Available time before delivery.

    Returns:
        dict: schedule risk result
    """

    if available_days <= 0:
        return {
            "score": RISK_CONFIG["schedule"]["unavailable_days_score"],
            "category": "High",
            "reason": "No valid delivery time is available."
        }

    schedule_ratio = voyage_days / available_days
    low_ratio_threshold = RISK_CONFIG["schedule"]["low_ratio_threshold"]
    medium_ratio_threshold = RISK_CONFIG["schedule"]["medium_ratio_threshold"]

    if schedule_ratio <= low_ratio_threshold:
        return {
            "score": RISK_CONFIG["schedule"]["low_score"],
            "category": "Low",
            "reason": "Sufficient schedule buffer is available."
        }

    if schedule_ratio <= medium_ratio_threshold:
        return {
            "score": RISK_CONFIG["schedule"]["medium_score"],
            "category": "Medium",
            "reason": "Limited schedule buffer is available."
        }

    return {
        "score": RISK_CONFIG["schedule"]["high_score"],
        "category": "High",
        "reason": "Voyage duration is close to or exceeds the available delivery time."
    }


def assess_waiting_risk(waiting_hours):
    """
    Assess risk caused by expected waiting or idle time.

    Args:
        waiting_hours (float): Expected waiting time in hours.

    Returns:
        dict: waiting risk result
    """

    if waiting_hours < 0:
        raise ValueError("waiting_hours cannot be negative.")

    low_hours_threshold = RISK_CONFIG["waiting"]["low_hours_threshold"]
    medium_hours_threshold = RISK_CONFIG["waiting"]["medium_hours_threshold"]

    if waiting_hours <= low_hours_threshold:
        return {
            "score": RISK_CONFIG["waiting"]["low_score"],
            "category": "Low",
            "reason": "Expected waiting time is low."
        }

    if waiting_hours <= medium_hours_threshold:
        return {
            "score": RISK_CONFIG["waiting"]["medium_score"],
            "category": "Medium",
            "reason": "Moderate waiting time is expected."
        }

    return {
        "score": RISK_CONFIG["waiting"]["high_score"],
        "category": "High",
        "reason": "High waiting time is expected."
    }


def assess_operational_risk(feasibility_checks):
    """
    Assess operational risk from detailed feasibility checks.

    Args:
        feasibility_checks (list): List of check results.

    Returns:
        dict: operational risk result
    """

    if not feasibility_checks:
        return {
            "score": RISK_CONFIG["operational"]["default_score"],
            "category": "Unknown",
            "reason": "Detailed operational checks are unavailable."
        }

    failed_checks = 0
    unknown_checks = 0

    for check in feasibility_checks:

        status = str(check.get("status", "")).upper()

        if status == "FAIL":
            failed_checks += 1

        elif status == "UNKNOWN":
            unknown_checks += 1

    if failed_checks > 0:
        return {
            "score": RISK_CONFIG["operational"]["failed_checks_score"],
            "category": "High",
            "reason": f"{failed_checks} operational feasibility check(s) failed."
        }

    if unknown_checks > 0:
        return {
            "score": RISK_CONFIG["operational"]["unknown_checks_score"],
            "category": "Medium",
            "reason": f"{unknown_checks} operational check(s) have unknown status."
        }

    return {
        "score": RISK_CONFIG["operational"]["pass_score"],
        "category": "Low",
        "reason": "Operational feasibility checks passed."
    }


def calculate_overall_risk(
    feasibility_risk,
    schedule_risk,
    waiting_risk,
    operational_risk
):
    """
    Calculate the overall voyage risk score.

    Maximum theoretical score:
        40 + 30 + 20 + 20 = 110

    Returns:
        dict: overall risk result
    """

    total_score = (
        feasibility_risk["score"]
        + schedule_risk["score"]
        + waiting_risk["score"]
        + operational_risk["score"]
    )

    low_threshold = RISK_CONFIG["overall"]["low_threshold"]
    medium_threshold = RISK_CONFIG["overall"]["medium_threshold"]

    if total_score <= low_threshold:
        category = "Low"

    elif total_score <= medium_threshold:
        category = "Medium"

    else:
        category = "High"

    return {
        "score": total_score,
        "category": category
    }


def assess_voyage_risk(
    feasible,
    voyage_days,
    available_days,
    waiting_hours,
    feasibility_checks=None
):
    """
    Complete voyage risk assessment.

    Returns:
        dict: Complete risk assessment.
    """

    if feasibility_checks is None:
        feasibility_checks = []

    feasibility_risk = assess_feasibility_risk(feasible)

    schedule_risk = assess_schedule_risk(
        voyage_days,
        available_days
    )

    waiting_risk = assess_waiting_risk(
        waiting_hours
    )

    operational_risk = assess_operational_risk(
        feasibility_checks
    )

    overall_risk = calculate_overall_risk(
        feasibility_risk,
        schedule_risk,
        waiting_risk,
        operational_risk
    )

    return {
        "feasibility_risk": feasibility_risk,
        "schedule_risk": schedule_risk,
        "waiting_risk": waiting_risk,
        "operational_risk": operational_risk,
        "overall_risk": overall_risk
    }


# ------------------------------------------------------------
# SMOKE TEST
# ------------------------------------------------------------

if __name__ == "__main__":

    # DEMO / TEST INPUTS ONLY.
    # These sample values are for local smoke testing and are not
    # intended to represent production data.
    demo_risk_inputs = {
        "voyage_days": 16.18,
        "available_days": 25,
        "waiting_hours": 24,
    }

    print("=" * 60)
    print("RISK ASSESSMENT TEST")
    print("=" * 60)

    result = assess_voyage_risk(
        feasible=True,
        voyage_days=demo_risk_inputs["voyage_days"],
        available_days=demo_risk_inputs["available_days"],
        waiting_hours=demo_risk_inputs["waiting_hours"],
        feasibility_checks=[
            {"check": "cargo_vessel", "status": "PASS"},
            {"check": "cargo_berth", "status": "PASS"},
            {"check": "loa", "status": "PASS"},
            {"check": "beam", "status": "PASS"},
            {"check": "draft", "status": "UNKNOWN"},
            {"check": "dwt", "status": "PASS"}
        ]
    )

    print(f"Feasibility Risk : {result['feasibility_risk']['category']}")
    print(f"Schedule Risk    : {result['schedule_risk']['category']}")
    print(f"Waiting Risk     : {result['waiting_risk']['category']}")
    print(f"Operational Risk : {result['operational_risk']['category']}")
    print("-" * 60)
    print(f"Overall Score    : {result['overall_risk']['score']}")
    print(f"Overall Risk     : {result['overall_risk']['category']}")
    print("=" * 60)
    print("TEST COMPLETED")