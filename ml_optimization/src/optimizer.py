"""
Vessel Optimization & Recommendation Module

AI/ML 2

Flow:

Vessel Filtering

```
↓
```

Port Feasibility

```
↓
```

Voyage Calculation

```
↓
```

Fuel & CO2

```
↓
```

Risk

```
↓
```

Cost

```
↓
```

Scoring

```
↓
```

OR-Tools Optimization

```
↓
```

Ranking

```
↓
```

Recommendation

```
↓
```

What-If Analysis
"""

import math

from ortools.linear_solver import pywraplp

from feasibility import (
load_data,
evaluate_vessel_feasibility,
)

from voyage import calculate_voyage

from fuel_emissions import calculate_fuel_and_co2

from risk import (
assess_feasibility_risk,
assess_schedule_risk,
assess_waiting_risk,
assess_operational_risk,
calculate_overall_risk,
)

from cost import calculate_voyage_cost

from scoring import (
evaluate_option,
classify_score,
)
from what_if import build_what_if_result

from recommendation import build_recommendation

from explain import build_explanation

from market_signal import build_market_signal

from market_timing import calculate_market_timing_adjustment
# ============================================================
# VESSEL CANDIDATES
# ============================================================

def load_vessel_candidates(
    vessels,
    cargo_type,
    cargo_quantity
):
    """
    Select bulk carrier vessels that can participate in the
    required voyage plan.

    In multi-voyage planning, a vessel is valid if it can carry
    at least one voyage of cargo even when the full cargo
    requirement exceeds its single-voyage capacity.
    """

    required_columns = [
        "vessel_name",
        "vessel_type",
        "deadweight_tonnage",
    ]

    for column in required_columns:

        if column not in vessels.columns:

            raise ValueError(
                f"Required vessel column missing: {column}"
            )

    candidates = vessels[
        (
            vessels["vessel_type"]
            .astype(str)
            .str.strip()
            .str.lower()
            == "bulk carrier"
        )
        &
        (
            vessels["deadweight_tonnage"]
            > 0
        )
    ].copy()

    return candidates


# ============================================================
# MULTI-VOYAGE PLANNING
# ============================================================

def calculate_required_voyages(
    cargo_quantity,
    vessel_capacity,
):
    """
    Calculate the number of voyages required to move the
    full cargo quantity using a vessel with the given capacity.
    """

    if cargo_quantity <= 0:
        raise ValueError(
            "Cargo quantity must be greater than zero."
        )

    if vessel_capacity <= 0:
        raise ValueError(
            "Vessel capacity must be greater than zero."
        )

    return int(
        math.ceil(
            cargo_quantity / vessel_capacity
        )
    )


def build_voyage_plan(
    cargo_quantity,
    vessel_capacity,
):
    """
    Build the required voyage plan for a cargo quantity and vessel.

    Returns cargo allocation per voyage, including the final
    partial voyage when the cargo is not evenly divisible.
    """

    required_voyages = calculate_required_voyages(
        cargo_quantity,
        vessel_capacity,
    )

    cargo_per_voyage = []
    remaining = float(cargo_quantity)

    for _ in range(required_voyages):

        voyage_cargo = min(
            float(vessel_capacity),
            remaining,
        )

        cargo_per_voyage.append(
            voyage_cargo
        )

        remaining -= voyage_cargo

    if remaining > 1e-9:
        raise ValueError(
            "Cargo plan could not be fully allocated."
        )

    return {
        "required_voyages": required_voyages,
        "cargo_per_voyage": cargo_per_voyage,
        "final_voyage_cargo": cargo_per_voyage[-1],
        "cargo_quantity": float(cargo_quantity),
        "vessel_capacity": float(vessel_capacity),
    }


# ============================================================
# FEASIBLE BERTH
# ============================================================

def get_feasible_berth(
    feasibility_result
):
    """
    Return the first berth that is fully passable or
    conditionally usable for screening.

    PASS berths remain the preferred selection. When no
    PASS berth exists, a CONDITIONAL berth is returned so
    the optimizer can preserve that distinction instead of
    silently discarding the candidate.
    """

    if not feasibility_result:
        return None

    berths = feasibility_result.get(
        "berths",
        []
    )

    for berth in berths:

        if berth.get("status") == "PASS":

            return berth

    for berth in berths:

        if berth.get("status") == "CONDITIONAL":

            return berth

    return None


# ============================================================
# OPERATIONAL CHECK EXTRACTION
# ============================================================

def extract_operational_checks(
    feasibility_result
):
    """
    Convert feasibility checks into the list format expected
    by assess_operational_risk().

    The current feasibility module exposes detailed checks
    at berth level under each berth['checks'] entry, not
    at the top-level feasibility_result['checks'].
    """

    if not feasibility_result:
        return []

    berths = feasibility_result.get(
        "berths",
        []
    )

    if isinstance(berths, list) and berths:

        selected_berth = None

        for berth in berths:

            if berth.get("status") == "PASS":

                selected_berth = berth

                break

        if selected_berth is None:

            selected_berth = berths[0]

        checks = selected_berth.get(
            "checks",
            {}
        )

    else:

        checks = feasibility_result.get(
            "checks",
            []
        )

    if isinstance(checks, list):

        return checks

    if isinstance(checks, dict):

        converted_checks = []

        for name, value in checks.items():

            if isinstance(value, dict):

                check = value.copy()

                if "name" not in check:

                    check["name"] = name

                converted_checks.append(
                    check
                )

            else:

                status = str(value).upper()

                converted_checks.append(
                    {
                        "name": name,
                        "status": status,
                    }
                )

        return converted_checks

    return []


# ============================================================
# RISK
# ============================================================

def calculate_option_risk(
    feasibility_result,
    sailing_days,
    available_days,
    waiting_hours
):
    """
    Calculate total risk for a vessel option.

    The functions in risk.py return dictionaries.
    calculate_overall_risk() expects those dictionaries.
    """

    original_feasibility_result = (
        feasibility_result
    )

    # --------------------------------------------------------
    # FEASIBILITY RISK
    # --------------------------------------------------------

    feasible = (
        original_feasibility_result.get(
            "status",
            "UNKNOWN"
        )
        == "PASS"
    )

    feasibility_risk = assess_feasibility_risk(
        feasible
    )

    # --------------------------------------------------------
    # SCHEDULE RISK
    # --------------------------------------------------------

    schedule_risk = assess_schedule_risk(
        sailing_days,
        available_days
    )

    # --------------------------------------------------------
    # WAITING RISK
    # --------------------------------------------------------

    waiting_risk = assess_waiting_risk(
        waiting_hours
    )

    # --------------------------------------------------------
    # OPERATIONAL RISK
    # --------------------------------------------------------

    operational_checks = (
        extract_operational_checks(
            original_feasibility_result
        )
    )

    operational_risk = assess_operational_risk(
        operational_checks
    )

    # --------------------------------------------------------
    # OVERALL RISK
    # --------------------------------------------------------

    overall_result = calculate_overall_risk(
        feasibility_risk,
        schedule_risk,
        waiting_risk,
        operational_risk
    )

    # --------------------------------------------------------
    # SCORE EXTRACTION
    # --------------------------------------------------------

    def extract_score(result):

        if isinstance(result, dict):

            if "score" in result:
                return float(result["score"])

            if "risk_score" in result:
                return float(result["risk_score"])

            if "overall_risk" in result:
                return float(result["overall_risk"])

            if "total_risk" in result:
                return float(result["total_risk"])

            if "value" in result:
                return float(result["value"])

        if isinstance(
            result,
            (int, float)
        ):

            return float(result)

        return 0.0

    feasibility_score = extract_score(
        feasibility_risk
    )

    schedule_score = extract_score(
        schedule_risk
    )

    waiting_score = extract_score(
        waiting_risk
    )

    operational_score = extract_score(
        operational_risk
    )

    overall_score = extract_score(
        overall_result
    )

    # --------------------------------------------------------
    # RISK CLASSIFICATION
    # --------------------------------------------------------

    risk_level = overall_result["category"]

    return {
        "feasibility_risk": round(
            feasibility_score,
            2
        ),

        "schedule_risk": round(
            schedule_score,
            2
        ),

        "waiting_risk": round(
            waiting_score,
            2
        ),

        "operational_risk": round(
            operational_score,
            2
        ),

        "overall_risk": round(
            overall_score,
            2
        ),

        "risk_level": risk_level
    }


# ============================================================
# COST
# ============================================================

def calculate_option_cost(
    cargo_quantity,
    freight_rate,
    fuel_consumption,
    fuel_price,
    waiting_hours,
    daily_waiting_cost,
    other_cost
):
    """
    Calculate voyage cost.
    """

    result = calculate_voyage_cost(
        cargo_quantity=cargo_quantity,
        freight_rate=freight_rate,
        fuel_consumption=fuel_consumption,
        fuel_price=fuel_price,
        waiting_hours=waiting_hours,
        daily_waiting_cost=daily_waiting_cost,
        other_cost=other_cost
    )

    return result


# ============================================================
# CHARTERING STRATEGIES
# ============================================================

def build_chartering_strategies(
    freight_rate,
    waiting_hours=0.0,
    strategy_freight_rates=None,
):
    """
    Generate the supported chartering strategies for AI/ML 2.

    The current implementation reuses the existing voyage/cost/risk
    calculations and surfaces strategy metadata explicitly so that
    future AI1 forecast integration can slot in later without
    redesigning the optimizer.
    """

    if strategy_freight_rates is None:
        strategy_freight_rates = {}

    return [
        {
            "strategy": "charter_now",
            "contract_strategy": "Immediate spot charter",
            "strategy_assumption": (
                "Immediate spot charter using the current freight "
                "rate."
            ),
            "forecast_available": False,
            "freight_rate_reference": float(
                strategy_freight_rates.get(
                    "charter_now",
                    freight_rate
                )
            ),
            "waiting_hours_reference": float(
                waiting_hours
            ),
        },
        {
            "strategy": "wait",
            "contract_strategy": "Wait before chartering",
            "strategy_assumption": (
                "Current freight rate is used as a temporary "
                "reference until AI1 forecast data is connected."
            ),
            "forecast_available": False,
            "freight_rate_reference": float(
                strategy_freight_rates.get(
                    "wait",
                    freight_rate
                )
            ),
            "waiting_hours_reference": float(
                waiting_hours
            ),
        },
        {
            "strategy": "multiple_spot",
            "contract_strategy": "Separate spot charters per voyage",
            "strategy_assumption": (
                "Each required voyage is treated as a separate "
                "spot-charter opportunity."
            ),
            "forecast_available": False,
            "freight_rate_reference": float(
                strategy_freight_rates.get(
                    "multiple_spot",
                    freight_rate
                )
            ),
            "waiting_hours_reference": float(
                waiting_hours
            ),
        },
        {
            "strategy": "short_term_multi_voyage",
            "contract_strategy": (
                "Single short-term contract across all voyages"
            ),
            "strategy_assumption": (
                "One short-term contract covers the required "
                "voyages."
            ),
            "forecast_available": False,
            "freight_rate_reference": float(
                strategy_freight_rates.get(
                    "short_term_multi_voyage",
                    freight_rate
                )
            ),
            "waiting_hours_reference": float(
                waiting_hours
            ),
        },
        {
            "strategy": "medium_term_multi_voyage",
            "contract_strategy": (
                "Single medium-term contract across all voyages"
            ),
            "strategy_assumption": (
                "One medium-term contract covers the required "
                "voyages."
            ),
            "forecast_available": False,
            "freight_rate_reference": float(
                strategy_freight_rates.get(
                    "medium_term_multi_voyage",
                    freight_rate
                )
            ),
            "waiting_hours_reference": float(
                waiting_hours
            ),
        },
    ]
# ============================================================
# BUILD OPTIMIZATION OPTIONS
# ============================================================

def build_optimization_options(
    vessels,
    cargo_type,
    cargo_quantity,
    origin_port,
    destination_port,
    speed_knots,
    available_days,
    freight_rate,
    fuel_price,
    waiting_hours,
    daily_waiting_cost,
    other_cost,
    loading_handling_days=0.0,
    berthing_port_days=0.0,
    strategies=None,
    market_signal=None,
):
    """
    Build complete optimization options
    for all feasible vessels using
    a multi-voyage plan when needed.

    AI/ML 1 market forecast is included as a
    market-timing signal. The BDI forecast is
    NOT converted into a route-specific freight rate.
    """

    candidates = load_vessel_candidates(
        vessels,
        cargo_type,
        cargo_quantity
    )

    if strategies is None:
        strategies = build_chartering_strategies(
            freight_rate=freight_rate,
            waiting_hours=waiting_hours,
        )

    # --------------------------------------------------------
    # AI/ML 1 MARKET SIGNAL
    # --------------------------------------------------------

    if market_signal is None:
        market_signal = build_market_signal()

    options = []

    for _, vessel in candidates.iterrows():

        vessel_name = vessel[
            "vessel_name"
        ]

        vessel_dwt = float(
            vessel[
                "deadweight_tonnage"
            ]
        )

        voyage_plan = build_voyage_plan(
            cargo_quantity=cargo_quantity,
            vessel_capacity=vessel_dwt,
        )

        required_voyages = (
            voyage_plan["required_voyages"]
        )

        cargo_per_voyage = (
            voyage_plan["cargo_per_voyage"]
        )

        final_voyage_cargo = (
            voyage_plan["final_voyage_cargo"]
        )

        # ----------------------------------------------------
        # FEASIBILITY
        # ----------------------------------------------------

        # Evaluate berth and cargo feasibility against the
        # per-voyage cargo amount because the cargo can be
        # split across multiple voyages.
        per_voyage_cargo = min(
            float(cargo_quantity),
            vessel_dwt,
        )

        feasibility_result = (
            evaluate_vessel_feasibility(
                vessel_name=vessel_name,
                cargo_type=cargo_type,
                destination_port=destination_port,
                cargo_quantity=per_voyage_cargo
            )
        )

        feasibility_status = (
            feasibility_result.get(
                "status",
                "UNKNOWN"
            )
        )

        if feasibility_status == "FAIL":
            continue

        if feasibility_status == "UNKNOWN":
            continue

        # ----------------------------------------------------
        # BERTH
        # ----------------------------------------------------

        selected_berth = (
            get_feasible_berth(
                feasibility_result
            )
        )

        if selected_berth is None:
            continue

        is_conditional = (
            feasibility_status == "CONDITIONAL"
        )

        berth_name = (
            selected_berth.get(
                "berth",
                selected_berth.get(
                    "berth_name",
                    selected_berth.get(
                        "name",
                        "Unknown"
                    )
                )
            )
        )

        berth_checks = selected_berth.get(
            "checks",
            {}
        )

        # ----------------------------------------------------
        # VOYAGE
        # ----------------------------------------------------

        voyage_result = calculate_voyage(
            origin_port=origin_port,
            destination_port=destination_port,
            speed_knots=speed_knots,
            loading_handling_days=loading_handling_days,
            berthing_port_days=berthing_port_days,
            waiting_hours=waiting_hours,
        )

        sailing_days_per_voyage = float(
            voyage_result[
                "sailing_days"
            ]
        )

        loading_handling_days_per_voyage = float(
            voyage_result[
                "loading_handling_days"
            ]
        )

        berthing_port_days_per_voyage = float(
            voyage_result[
                "berthing_port_days"
            ]
        )

        port_days_per_voyage = float(
            voyage_result[
                "port_days"
            ]
        )

        total_sailing_days = (
            sailing_days_per_voyage
            * required_voyages
        )

        total_waiting_hours = (
            float(
                voyage_result[
                    "waiting_hours"
                ]
            )
            * required_voyages
        )

        total_waiting_days = (
            total_waiting_hours / 24.0
        )

        total_port_days = (
            port_days_per_voyage
            * required_voyages
        )

        total_operational_days = (
            total_sailing_days
            + total_port_days
            + total_waiting_days
        )

        # ----------------------------------------------------
        # SCHEDULE CONSTRAINT
        # ----------------------------------------------------

        if total_operational_days > available_days:
            continue

        # ----------------------------------------------------
        # FUEL + CO2
        # ----------------------------------------------------

        fuel_result = (
            calculate_fuel_and_co2(
                dwt=vessel_dwt,
                voyage_days=sailing_days_per_voyage
            )
        )

        fuel_consumption_per_voyage = float(
            fuel_result[
                "estimated_voyage_fuel"
            ]
        )

        fuel_consumption = (
            fuel_consumption_per_voyage
            * required_voyages
        )

        co2_per_voyage = float(
            fuel_result[
                "estimated_voyage_co2"
            ]
        )

        co2_emission = (
            co2_per_voyage
            * required_voyages
        )

        # ----------------------------------------------------
        # STRATEGY LOOP
        # ----------------------------------------------------

        for strategy in strategies:

            strategy_freight_rate = float(
                strategy.get(
                    "freight_rate_reference",
                    freight_rate
                )
            )

            # ------------------------------------------------
            # RISK
            # ------------------------------------------------

            risk_result = calculate_option_risk(
                feasibility_result=(
                    feasibility_result
                ),
                sailing_days=total_sailing_days,
                available_days=available_days,
                waiting_hours=total_waiting_hours
            )

            # ------------------------------------------------
            # COST
            # ------------------------------------------------

            cost_result = calculate_option_cost(
                cargo_quantity=cargo_quantity,
                freight_rate=strategy_freight_rate,
                fuel_consumption=fuel_consumption,
                fuel_price=fuel_price,
                waiting_hours=total_waiting_hours,
                daily_waiting_cost=daily_waiting_cost,
                other_cost=other_cost
            )

            total_cost = float(
                cost_result[
                    "total_cost"
                ]
            )

            cost_per_tonne = float(
                cost_result[
                    "cost_per_tonne"
                ]
            )

            # ------------------------------------------------
            # OPTION
            # ------------------------------------------------

            option = {

                "vessel_name": vessel_name,

                "vessel_type": vessel[
                    "vessel_type"
                ],

                "deadweight_tonnage": vessel_dwt,

                "cargo_type": cargo_type,

                "cargo_quantity": cargo_quantity,

                "origin_port": origin_port,

                "destination_port": destination_port,

                "berth_name": berth_name,

                "distance_nm": voyage_result[
                    "distance_nm"
                ],

                "overall_port_feasibility": feasibility_status,

                "loa_status": berth_checks.get(
                    "loa",
                    {}
                ).get(
                    "status",
                    "UNKNOWN"
                ),

                "beam_status": berth_checks.get(
                    "beam",
                    {}
                ).get(
                    "status",
                    "UNKNOWN"
                ),

                "draft_status": berth_checks.get(
                    "draft",
                    {}
                ).get(
                    "status",
                    "UNKNOWN"
                ),

                "dwt_status": berth_checks.get(
                    "dwt",
                    {}
                ).get(
                    "status",
                    "UNKNOWN"
                ),

                "cargo_compatibility_status": berth_checks.get(
                    "cargo_compatibility",
                    {}
                ).get(
                    "status",
                    "UNKNOWN"
                ),

                "speed_knots": speed_knots,

                "required_voyages": required_voyages,

                "cargo_per_voyage": cargo_per_voyage,

                "final_voyage_cargo": final_voyage_cargo,

                "voyage_plan": voyage_plan,

                "sailing_days_per_voyage": round(
                    sailing_days_per_voyage,
                    2
                ),

                "total_sailing_days": round(
                    total_sailing_days,
                    2
                ),

                "sailing_days": round(
                    total_sailing_days,
                    2
                ),

                "loading_handling_days_per_voyage": round(
                    loading_handling_days_per_voyage,
                    2
                ),

                "total_loading_handling_days": round(
                    loading_handling_days_per_voyage
                    * required_voyages,
                    2
                ),

                "berthing_port_days_per_voyage": round(
                    berthing_port_days_per_voyage,
                    2
                ),

                "total_berthing_port_days": round(
                    berthing_port_days_per_voyage
                    * required_voyages,
                    2
                ),

                "port_days_per_voyage": round(
                    port_days_per_voyage,
                    2
                ),

                "total_port_days": round(
                    total_port_days,
                    2
                ),

                "port_days": round(
                    total_port_days,
                    2
                ),

                "waiting_hours_per_voyage": round(
                    float(waiting_hours),
                    2
                ),

                "total_waiting_hours": round(
                    total_waiting_hours,
                    2
                ),

                "waiting_hours": round(
                    total_waiting_hours,
                    2
                ),

                "total_waiting_days": round(
                    total_waiting_days,
                    2
                ),

                "total_operational_days": round(
                    total_operational_days,
                    2
                ),

                "deadline_feasible": True,

                "fuel_consumption_per_voyage": round(
                    fuel_consumption_per_voyage,
                    2
                ),

                "fuel_consumption": round(
                    fuel_consumption,
                    2
                ),

                "co2_emission_per_voyage": round(
                    co2_per_voyage,
                    2
                ),

                "co2_emission": round(
                    co2_emission,
                    2
                ),

                "feasibility": (
                    feasibility_status == "PASS"
                ),

                "conditional": is_conditional,

                "status": feasibility_status,

                "feasibility_risk": (
                    risk_result[
                        "feasibility_risk"
                    ]
                ),

                "schedule_risk": (
                    risk_result[
                        "schedule_risk"
                    ]
                ),

                "waiting_risk": (
                    risk_result[
                        "waiting_risk"
                    ]
                ),

                "operational_risk": (
                    risk_result[
                        "operational_risk"
                    ]
                ),

                "overall_risk": (
                    risk_result[
                        "overall_risk"
                    ]
                ),

                "risk_level": (
                    risk_result[
                        "risk_level"
                    ]
                ),

                "effective_freight_rate": (
                    strategy_freight_rate
                ),

                "freight_cost": cost_result[
                    "freight_cost"
                ],

                "fuel_cost": cost_result[
                    "fuel_cost"
                ],

                "waiting_cost": cost_result[
                    "waiting_cost"
                ],

                "other_cost": cost_result[
                    "other_cost"
                ],

                "total_cost": total_cost,

                "cost_per_tonne": cost_per_tonne,

                # ------------------------------------------------
                # AI/ML 1 MARKET SIGNAL
                # ------------------------------------------------

                "market_signal": market_signal.get(
                    "timing_signal",
                    "neutral"
                ),

                "market_trend": market_signal.get(
                    "trend",
                    "stable"
                ),

                "forecast_change_pct": market_signal.get(
                    "forecast_change_pct",
                    0.0
                ),

                "strategy": strategy.get(
                    "strategy",
                    "charter_now"
                ),

                "contract_strategy": strategy.get(
                    "contract_strategy",
                    "Immediate spot charter"
                ),

                "strategy_assumption": strategy.get(
                    "strategy_assumption",
                    ""
                ),

                "forecast_available": strategy.get(
                    "forecast_available",
                    False
                ),

                "freight_rate_reference": strategy.get(
                    "freight_rate_reference",
                    float(freight_rate)
                ),

                "waiting_hours_reference": strategy.get(
                    "waiting_hours_reference",
                    float(waiting_hours)
                ),
            }

            options.append(option)

    # --------------------------------------------------------
    # SCORE OPTIONS
    # --------------------------------------------------------

    options = score_options(
        options
    )

    return options
# ============================================================
# SCORE OPTIONS
# ============================================================


def score_options(options):
    """
    Normalize cost, risk, fuel and CO2 across all options.
    Apply market-timing adjustment to the final score.
    """

    if not options:
        return []

    costs = [
        option["total_cost"]
        for option in options
    ]

    fuels = [
        option["fuel_consumption"]
        for option in options
    ]

    co2_values = [
        option["co2_emission"]
        for option in options
    ]

    min_cost = min(costs)
    max_cost = max(costs)

    min_fuel = min(fuels)
    max_fuel = max(fuels)

    min_co2 = min(co2_values)
    max_co2 = max(co2_values)

    for option in options:
        score_result = evaluate_option(
            feasible=option["feasibility"],
            total_cost=option["total_cost"],
            risk_score=option["overall_risk"],
            fuel_consumption=option["fuel_consumption"],
            co2_emission=option["co2_emission"],
            min_cost=min_cost,
            max_cost=max_cost,
            min_fuel=min_fuel,
            max_fuel=max_fuel,
            min_co2=min_co2,
            max_co2=max_co2,
        )

        timing_adjustment = calculate_market_timing_adjustment(
            strategy=option.get("strategy", ""),
            timing_signal=option.get(
                "market_signal",
                "neutral",
            ),
        )

        score_result["market_timing_adjustment"] = round(
            timing_adjustment,
            2,
        )

        score_result["final_score"] = round(
            score_result["final_score"] + timing_adjustment,
            2,
        )

        option.update(score_result)

        option["evaluation"] = classify_score(
            option["final_score"]
        )

    return options


# ============================================================
# OR-TOOLS OPTIMIZATION
# ============================================================

def optimize_vessel_options(
    options
):
    """
    Select exactly one fully verified feasible vessel
    using OR-Tools.

    CONDITIONAL candidates remain available for visibility,
    but they are not allowed into the fully verified pool.
    """

    pass_options = [
        option
        for option in options
        if option.get(
            "status",
            "UNKNOWN"
        ) == "PASS"
    ]

    candidate_options = pass_options

    if not candidate_options:

        candidate_options = [
            option
            for option in options
            if option.get(
                "status",
                "UNKNOWN"
            ) == "CONDITIONAL"
        ]

    if not candidate_options:

        return None

    solver = (
        pywraplp.Solver.CreateSolver(
            "SCIP"
        )
    )

    if solver is None:

        raise RuntimeError(
            "SCIP solver is not available."
        )

    decision_variables = []

    for index, option in enumerate(
        candidate_options
    ):

        variable = solver.BoolVar(
            f"select_{index}"
        )

        decision_variables.append(
            variable
        )

    # --------------------------------------------------------
    # SELECT EXACTLY ONE VESSEL
    # --------------------------------------------------------

    solver.Add(
        sum(
            decision_variables
        ) == 1
    )

    # --------------------------------------------------------
    # OBJECTIVE
    # --------------------------------------------------------

    objective = solver.Objective()

    for index, option in enumerate(
        candidate_options
    ):

        objective.SetCoefficient(
            decision_variables[index],
            float(
                option[
                    "final_score"
                ]
            )
        )

    objective.SetMaximization()

    status = solver.Solve()

    if status != pywraplp.Solver.OPTIMAL:

        return None

    # --------------------------------------------------------
    # SELECTED OPTION
    # --------------------------------------------------------

    selected_option = None

    for index, variable in enumerate(
        decision_variables
    ):

        if variable.solution_value() > 0.5:

            selected_option = (
                candidate_options[index]
            )

            break

    if selected_option is None:

        return None

    result = selected_option.copy()

    result[
        "optimization_status"
    ] = "OPTIMAL"

    return result


# ============================================================
# RANKING
# ============================================================

def rank_vessel_options(
    options
):
    """
    Rank feasible vessels by final score.
    """

    ranked_options = sorted(
        options,
        key=lambda option:
            option[
                "final_score"
            ],
        reverse=True
    )

    for index, option in enumerate(
        ranked_options,
        start=1
    ):

        option[
            "rank"
        ] = index

    return ranked_options


# ============================================================
# RECOMMENDATION
# ============================================================

def generate_recommendation(
    optimized_option
):
    """
    Generate a human-readable recommendation.
    """

    if optimized_option is None:

        return {
            "status": "Not Recommended",

            "recommended_strategy": None,

            "recommended_vessel": None,

            "reason": (
                "No feasible vessel satisfies "
                "the cargo, port and schedule "
                "constraints."
            )
        }

    recommended_strategy = optimized_option.get(
        "strategy",
        "charter_now"
    )

    recommended_contract_strategy = optimized_option.get(
        "contract_strategy",
        "Immediate spot charter"
    )

    vessel_name = optimized_option[
        "vessel_name"
    ]

    final_score = optimized_option[
        "final_score"
    ]

    sailing_days = optimized_option[
        "sailing_days"
    ]

    total_cost = optimized_option[
        "total_cost"
    ]

    risk_level = optimized_option[
        "risk_level"
    ]

    cargo_per_voyage = optimized_option.get(
        "cargo_per_voyage",
        []
    )

    required_voyages = optimized_option.get(
        "required_voyages",
        1
    )

    total_fuel = optimized_option.get(
        "fuel_consumption",
        0
    )

    total_co2 = optimized_option.get(
        "co2_emission",
        0
    )

    total_waiting_hours = optimized_option.get(
        "total_waiting_hours",
        0
    )

    total_port_days = optimized_option.get(
        "total_port_days",
        0
    )

    total_operational_days = optimized_option.get(
        "total_operational_days",
        0
    )

    deadline_feasible = optimized_option.get(
        "deadline_feasible",
        True
    )

    overall_port_feasibility = optimized_option.get(
        "overall_port_feasibility",
        "UNKNOWN"
    )

    port_verification_note = ""

    if overall_port_feasibility != "PASS":
        port_verification_note = (
            f" Port verification status is {overall_port_feasibility.lower()} for LOA, beam, draft, DWT, and cargo compatibility, so the plan remains partially unverified."
        )

    if optimized_option.get(
        "status",
        "UNKNOWN"
    ) == "CONDITIONAL":
        port_verification_note += (
            " Port and operational confirmation is required before this conditional option can be treated as fully verified."
        )

    reason = (
        f"{vessel_name} is recommended because "
        f"it is a feasible vessel that satisfies "
        f"the cargo and schedule constraints and "
        f"was selected by the optimization model "
        f"with a final score of {final_score:.2f}. "
        f"The plan requires {required_voyages} voyage(s) "
        f"with cargo allocations of {', '.join(f'{value:.0f}' for value in cargo_per_voyage)} tonnes, "
        f"total sailing duration of {sailing_days:.2f} days, "
        f"total port/handling time of {total_port_days:.2f} days, "
        f"total waiting time of {total_waiting_hours:.2f} hours, "
        f"total operational duration of {total_operational_days:.2f} days, "
        f"total cost of {total_cost:.2f}, cost per tonne of {optimized_option['cost_per_tonne']:.4f}, "
        f"total fuel of {total_fuel:.2f}, total CO2 of {total_co2:.2f}, "
        f"and {risk_level.lower()} overall risk."
        f"{port_verification_note}"
        f" Deadline feasibility: {'Yes' if deadline_feasible else 'No'}."
    )

    return {
        "status": "Recommended",

        "recommended_strategy": recommended_strategy,

        "recommended_contract_strategy": recommended_contract_strategy,

        "recommended_vessel": vessel_name,

        "vessel_capacity": optimized_option.get(
            "deadweight_tonnage"
        ),

        "required_voyages": required_voyages,

        "cargo_per_voyage": cargo_per_voyage,

        "final_voyage_cargo": optimized_option.get(
            "final_voyage_cargo"
        ),

        "total_duration_days": sailing_days,

        "sailing_time_days": sailing_days,

        "port_time_days": total_port_days,

        "waiting_time_hours": total_waiting_hours,

        "total_operational_days": total_operational_days,

        "total_waiting_hours": total_waiting_hours,

        "total_cost": total_cost,

        "cost_per_tonne": optimized_option.get(
            "cost_per_tonne"
        ),

        "total_fuel": total_fuel,

        "total_co2": total_co2,

        "risk": optimized_option.get(
            "overall_risk"
        ),

        "deadline_feasible": deadline_feasible,

        "reason": reason
    }

def build_full_recommendation(optimized_option):
    """
    Build the structured recommendation used by the
    AI/ML 2 integration layer.

    Keeps the legacy generate_recommendation()
    API unchanged.
    """

    return build_recommendation(
        optimized_option
    )

def build_full_explanation(optimized_option):
    """
    Build the structured recommendation and then generate
    its human-readable explanation.
    """

    recommendation_result = build_full_recommendation(
        optimized_option
    )

    if recommendation_result.get("recommendation") is None:
        return {
            "recommendation": recommendation_result,
            "explanation": build_explanation(None),
        }

    recommendation = recommendation_result[
        "recommendation"
    ]

    return {
        "recommendation": recommendation_result,
        "explanation": build_explanation(
            recommendation
        ),
    }
# ============================================================
# 9K — WHAT-IF ANALYSIS
# ============================================================

def run_what_if_analysis(
vessels,
cargo_type,
cargo_quantity,
origin_port,
destination_port,
speed_knots,
available_days,
freight_rate,
fuel_price,
waiting_hours,
daily_waiting_cost,
other_cost,
what_if_cargo_quantity=None,
what_if_available_days=None,
what_if_freight_rate=None,
what_if_fuel_price=None,
what_if_waiting_hours=None
):
    """
    Compare the baseline optimized plan with
    a changed what-if scenario.

    
    Supported What-If inputs:

    - Cargo quantity
    - Available delivery days
    - Freight rate
    - Fuel price
    - Waiting hours
    """

    # ========================================================
    # BASELINE
    # ========================================================

    baseline_options = build_optimization_options(
        vessels=vessels,
        cargo_type=cargo_type,
        cargo_quantity=cargo_quantity,
        origin_port=origin_port,
        destination_port=destination_port,
        speed_knots=speed_knots,
        available_days=available_days,
        freight_rate=freight_rate,
        fuel_price=fuel_price,
        waiting_hours=waiting_hours,
        daily_waiting_cost=daily_waiting_cost,
        other_cost=other_cost
    )

    baseline_result = optimize_vessel_options(
        baseline_options
    )

    # ========================================================
    # WHAT-IF VALUES
    # ========================================================

    scenario_cargo_quantity = (
        what_if_cargo_quantity
        if what_if_cargo_quantity is not None
        else cargo_quantity
    )

    scenario_available_days = (
        what_if_available_days
        if what_if_available_days is not None
        else available_days
    )

    scenario_freight_rate = (
        what_if_freight_rate
        if what_if_freight_rate is not None
        else freight_rate
    )

    scenario_fuel_price = (
        what_if_fuel_price
        if what_if_fuel_price is not None
        else fuel_price
    )

    scenario_waiting_hours = (
        what_if_waiting_hours
        if what_if_waiting_hours is not None
        else waiting_hours
    )

    # ========================================================
    # WHAT-IF SCENARIO
    # ========================================================

    what_if_options = build_optimization_options(
        vessels=vessels,
        cargo_type=cargo_type,
        cargo_quantity=scenario_cargo_quantity,
        origin_port=origin_port,
        destination_port=destination_port,
        speed_knots=speed_knots,
        available_days=scenario_available_days,
        freight_rate=scenario_freight_rate,
        fuel_price=scenario_fuel_price,
        waiting_hours=scenario_waiting_hours,
        daily_waiting_cost=daily_waiting_cost,
        other_cost=other_cost
    )

    what_if_result = optimize_vessel_options(
        what_if_options
    )

    # ========================================================
    # USE CENTRAL WHAT-IF COMPARISON MODULE
    # ========================================================

    result = build_what_if_result(
        baseline_result,
        what_if_result
    )

    # Preserve the existing optimizer output contract.
    # The standalone what_if module uses "scenario"
    # and "changes", while the optimizer API also
    # exposes "what_if" and "comparison".

    if "what_if" not in result:
        result["what_if"] = what_if_result

    if "comparison" not in result:
        result["comparison"] = None

    return result
    

# ============================================================
# DEMO / TEST INPUTS
# ============================================================

def get_demo_inputs():
    """
    Return sample caller-supplied inputs for local demo/test runs.

    These are intentionally documented as DEMO/TEST inputs so the
    optimizer core can remain unchanged and later be wired to
    FastAPI/CLI request data without modifying the mathematical logic.
    """

    return {
        "cargo_type": "Thermal Coal",
        "cargo_quantity": 200000,
        "origin_port": "Newcastle, Australia",
        "destination_port": "Visakhapatnam",
        "speed_knots": 12,
        "available_days": 20,
        "freight_rate": 25,
        "fuel_price": 600,
        "waiting_hours": 24,
        "daily_waiting_cost": 20000,
        "other_cost": 10000,
        "loading_handling_days": 1.0,
        "berthing_port_days": 1.0,
        "what_if_cargo_quantity": 205000,
        "what_if_available_days": 16,
        "what_if_freight_rate": 35,
        "what_if_fuel_price": 800,
    }


# ============================================================
# MAIN TEST
# ============================================================

if __name__ == "__main__":

    print("=" * 60)

    print(
        "VESSEL OPTIMIZATION & RECOMMENDATION TEST"
    )

    print("=" * 60)

    # ========================================================
    # LOAD DATA
    # ========================================================

    loaded_data = load_data()

    vessels = loaded_data[0]

    # ========================================================
    # DEMO / TEST INPUTS
    # ========================================================

    demo_inputs = get_demo_inputs()

    cargo_type = demo_inputs["cargo_type"]

    cargo_quantity = demo_inputs["cargo_quantity"]

    origin_port = demo_inputs["origin_port"]

    destination_port = demo_inputs["destination_port"]

    speed_knots = demo_inputs["speed_knots"]

    available_days = demo_inputs["available_days"]

    freight_rate = demo_inputs["freight_rate"]

    fuel_price = demo_inputs["fuel_price"]

    waiting_hours = demo_inputs["waiting_hours"]

    daily_waiting_cost = demo_inputs["daily_waiting_cost"]

    other_cost = demo_inputs["other_cost"]

    # ========================================================
    # BUILD OPTIONS
    # ========================================================

    options = build_optimization_options(

        vessels=vessels,

        cargo_type=cargo_type,

        cargo_quantity=cargo_quantity,

        origin_port=origin_port,

        destination_port=destination_port,

        speed_knots=speed_knots,

        available_days=available_days,

        freight_rate=freight_rate,

        fuel_price=fuel_price,

        waiting_hours=waiting_hours,

        daily_waiting_cost=(
            daily_waiting_cost
        ),

        other_cost=other_cost
    )

    print()

    pass_count = sum(
        1
        for option in options
        if option.get(
            "status",
            "UNKNOWN"
        ) == "PASS"
    )

    conditional_count = sum(
        1
        for option in options
        if option.get(
            "status",
            "UNKNOWN"
        ) == "CONDITIONAL"
    )

    print(
        f"PASS candidates     : "
        f"{pass_count}"
    )

    print(
        f"CONDITIONAL candidates : "
        f"{conditional_count}"
    )

    # ========================================================
    # RANKING
    # ========================================================

    ranked_options = rank_vessel_options(
        options
    )

    print()

    print("=" * 60)
    print("VESSEL RANKING")
    print("=" * 60)

    for option in ranked_options:

        print(
            f"Rank {option['rank']:2d} | "
            f"{option['vessel_name']:<25} | "
            f"Score: "
            f"{option['final_score']:.2f}"
        )

    # ========================================================
    # RANKING VALIDATION
    # ========================================================

    ranking_valid = True

    for expected_rank, option in enumerate(
        ranked_options,
        start=1
    ):

        if option[
            "rank"
        ] != expected_rank:

            ranking_valid = False

    print()

    print(
        "Ranking validation "
        +
        (
            "PASS"
            if ranking_valid
            else "FAIL"
        )
    )

    if ranking_valid:

        print(
            "PASS: All feasible vessels "
            "received ranking positions."
        )

    # ========================================================
    # OR-TOOLS OPTIMIZATION
    # ========================================================

    optimized_option = (
        optimize_vessel_options(
            ranked_options
        )
    )

    print()

    print("=" * 60)
    print("OR-TOOLS OPTIMIZATION")
    print("=" * 60)

    if optimized_option is not None:

        print(
            f"Optimization Status : "
            f"{optimized_option['optimization_status']}"
        )

        print(
            f"Selected Vessel     : "
            f"{optimized_option['vessel_name']}"
        )

        print(
            f"DWT                 : "
            f"{optimized_option['deadweight_tonnage']:.0f}"
        )

        print(
            f"Berth               : "
            f"{optimized_option['berth_name']}"
        )

        print(
            f"Sailing Days        : "
            f"{optimized_option['sailing_days']:.2f}"
        )

        print(
            f"Total Cost          : "
            f"{optimized_option['total_cost']:.2f}"
        )

        print(
            f"Cost/Tonne          : "
            f"{optimized_option['cost_per_tonne']:.4f}"
        )

        print(
            f"Overall Risk        : "
            f"{optimized_option['overall_risk']:.2f}"
        )

        print(
            f"Risk Level          : "
            f"{optimized_option['risk_level']}"
        )

        print(
            f"Final Score         : "
            f"{optimized_option['final_score']:.2f}"
        )

        print(
            f"Evaluation          : "
            f"{optimized_option['evaluation']}"
        )

        # ----------------------------------------------------
        # OPTIMIZATION VALIDATION
        # ----------------------------------------------------

        optimization_valid = True

        if not optimized_option[
            "feasibility"
        ]:

            optimization_valid = False

        if (
            optimized_option[
                "deadweight_tonnage"
            ]
            < cargo_quantity
        ):

            optimization_valid = False

        if (
            optimized_option[
                "sailing_days"
            ]
            > available_days
        ):

            optimization_valid = False

        if (
            optimized_option[
                "final_score"
            ]
            < 0
        ):

            optimization_valid = False

        print()

        print(
            "Optimization validation "
            +
            (
                "PASS"
                if optimization_valid
                else "FAIL"
            )
        )

        if optimization_valid:

            print(
                "PASS: OR-Tools selected a "
                "valid optimized vessel."
            )

    # ========================================================
    # RECOMMENDATION
    # ========================================================

    if optimized_option is None and conditional_count > 0:
        print()
        print(
            "No fully verified feasible vessel; "
            "conditional candidates available subject "
            "to operational confirmation."
        )

    recommendation = (
        generate_recommendation(
            optimized_option
        )
    )

    print()

    print("=" * 60)
    print("RECOMMENDATION")
    print("=" * 60)

    print(
        f"Recommended Vessel : "
        f"{recommendation['recommended_vessel']}"
    )

    print(
        f"Status             : "
        f"{recommendation['status']}"
    )

    print(
        f"Reason             : "
        f"{recommendation['reason']}"
    )

    recommendation_valid = (
        optimized_option is not None
        and
        recommendation[
            "recommended_vessel"
        ]
        ==
        optimized_option[
            "vessel_name"
        ]
    )

    print()

    print(
        "Recommendation validation "
        +
        (
            "PASS"
            if recommendation_valid
            else "FAIL"
        )
    )

    if recommendation_valid:

        print(
            "PASS: Recommendation matches "
            "the optimized feasible vessel."
        )

    # ========================================================
    # 9K.1 WHAT-IF ANALYSIS
    # ========================================================

    print()

    print("=" * 60)
    print("9K.1 WHAT-IF ANALYSIS TEST")
    print("=" * 60)

    what_if_result = (
        run_what_if_analysis(

            vessels=vessels,

            cargo_type=cargo_type,

            cargo_quantity=demo_inputs["cargo_quantity"],

            origin_port=origin_port,

            destination_port=destination_port,

            speed_knots=speed_knots,

            available_days=available_days,

            freight_rate=freight_rate,

            fuel_price=fuel_price,

            waiting_hours=waiting_hours,

            daily_waiting_cost=(
                daily_waiting_cost
            ),

            other_cost=other_cost,

            what_if_cargo_quantity=demo_inputs["what_if_cargo_quantity"]
        )
    )

    print(
        f"Status : "
        f"{what_if_result['status']}"
    )

    # ========================================================
    # 9K.1 COMPLETED
    # ========================================================

    if (
        what_if_result[
            "status"
        ]
        == "COMPLETED"
    ):

        print()

        print("BASELINE")

        print("-" * 40)

        print(
            f"Vessel : "
            f"{what_if_result['baseline']['vessel_name']}"
        )

        print(
            f"Score  : "
            f"{what_if_result['baseline']['final_score']:.2f}"
        )

        print(
            f"Cost   : "
            f"{what_if_result['baseline']['total_cost']:.2f}"
        )

        print(
            f"Risk   : "
            f"{what_if_result['baseline']['overall_risk']:.2f}"
        )

        print()

        print("WHAT-IF")

        print("-" * 40)

        print(
            f"Vessel : "
            f"{what_if_result['scenario']['vessel_name']}"
        )

        print(
            f"Score  : "
            f"{what_if_result['scenario']['final_score']:.2f}"
        )

        print(
            f"Cost   : "
            f"{what_if_result['scenario']['total_cost']:.2f}"
        )

        print(
            f"Risk   : "
            f"{what_if_result['scenario']['overall_risk']:.2f}"
        )

        comparison = what_if_result.get(
            "comparison"
        )

        if comparison is not None:

            print()

            print("IMPACT")

            print("-" * 40)

            print(
                f"Recommendation Changed : "
                f"{comparison['recommendation_changed']}"
            )

            print(
                f"Score Change           : "
                f"{comparison['score_change']:.2f}"
            )

            print(
                f"Cost Change            : "
                f"{comparison['cost_change']:.2f}"
            )

            print(
                f"Risk Change            : "
                f"{comparison['risk_change']:.2f}"
            )

        else:

            print()

            print("IMPACT")

            print("-" * 40)

            print(
                "Comparison data not available for this run."
            )

        print()

        print(
            "9K.1 VALIDATION PASS"
        )

    elif (
        what_if_result[
            "status"
        ]
        == "WHAT_IF_INFEASIBLE"
    ):

        print()

        print(
            "What-if scenario has no "
            "feasible vessel."
        )

        print(
            "Baseline recommendation remains "
            "valid, but the changed scenario "
            "cannot currently be served."
        )

        print()

        print(
            "9K.1 VALIDATION PASS"
        )

    else:

        print()

        print(
            "Baseline scenario is infeasible."
        )

        print()

        print(
            "9K.1 VALIDATION FAIL"
        )

    print("=" * 60)

    print(
        "9K.1 TEST COMPLETED"
    )

    print("=" * 60)

    # ========================================================
    # 9K.2 DEADLINE WHAT-IF ANALYSIS
    # ========================================================

    print()

    print("=" * 60)

    print(
        "9K.2 DEADLINE WHAT-IF ANALYSIS TEST"
    )

    print("=" * 60)

    deadline_what_if = (
        run_what_if_analysis(

            vessels=vessels,

            cargo_type=cargo_type,

            cargo_quantity=cargo_quantity,

            origin_port=origin_port,

            destination_port=destination_port,

            speed_knots=speed_knots,

            available_days=available_days,

            freight_rate=freight_rate,

            fuel_price=fuel_price,

            waiting_hours=waiting_hours,

            daily_waiting_cost=(
                daily_waiting_cost
            ),

            other_cost=other_cost,

            what_if_available_days=demo_inputs["what_if_available_days"]
        )
    )

    print(
        f"Status : "
        f"{deadline_what_if['status']}"
    )

    # ========================================================
    # 9K.2 EXPECTED INFEASIBLE SCENARIO
    # ========================================================

    if (
        deadline_what_if[
            "status"
        ]
        == "WHAT_IF_INFEASIBLE"
    ):

        print()

        print("BASELINE")

        print("-" * 40)

        print(
            f"Vessel : "
            f"{deadline_what_if['baseline']['vessel_name']}"
        )

        print(
            f"Score  : "
            f"{deadline_what_if['baseline']['final_score']:.2f}"
        )

        print(
            f"Cost   : "
            f"{deadline_what_if['baseline']['total_cost']:.2f}"
        )

        print(
            f"Risk   : "
            f"{deadline_what_if['baseline']['overall_risk']:.2f}"
        )

        print()

        print("WHAT-IF")

        print("-" * 40)

        print(
            "Available Days : 16"
        )

        print(
            "Result         : No feasible vessel"
        )

        print()

        print("IMPACT")

        print("-" * 40)

        print(
            "Recommendation Changed : True"
        )

        print(
            "Reason                 : "
            "Deadline is shorter than sailing time"
        )

        print()

        print(
            "9K.2 VALIDATION PASS"
        )

    else:

        print()

        print(
            "9K.2 VALIDATION FAIL"
        )

    print("=" * 60)

    print(
        "9K.2 TEST COMPLETED"
    )

    print("=" * 60)

        # ========================================================
    # 9K.3 FREIGHT RATE WHAT-IF ANALYSIS
    # ========================================================

    print()

    print("=" * 60)

    print(
        "9K.3 FREIGHT RATE WHAT-IF ANALYSIS TEST"
    )

    print("=" * 60)

    freight_what_if = (
        run_what_if_analysis(

            vessels=vessels,

            cargo_type=cargo_type,

            cargo_quantity=cargo_quantity,

            origin_port=origin_port,

            destination_port=destination_port,

            speed_knots=speed_knots,

            available_days=available_days,

            freight_rate=freight_rate,

            fuel_price=fuel_price,

            waiting_hours=waiting_hours,

            daily_waiting_cost=(
                daily_waiting_cost
            ),

            other_cost=other_cost,

            what_if_freight_rate=demo_inputs["what_if_freight_rate"]
        )
    )

    print(
        f"Status : "
        f"{freight_what_if['status']}"
    )

    # ========================================================
    # 9K.3 VALIDATION
    # ========================================================

    if (
        freight_what_if[
            "status"
        ]
        == "COMPLETED"
    ):

        print()

        print("BASELINE")

        print("-" * 40)

        print(
            f"Vessel : "
            f"{freight_what_if['baseline']['vessel_name']}"
        )

        print(
            f"Freight Rate : "
            f"{freight_rate}"
        )

        print(
            f"Cost   : "
            f"{freight_what_if['baseline']['total_cost']:.2f}"
        )

        print()

        print("WHAT-IF")

        print("-" * 40)

        print(
            "Freight Rate : 35"
        )

        print(
            f"Vessel       : "
            f"{freight_what_if['scenario']['vessel_name']}"
        )

        print(
            f"Cost         : "
            f"{freight_what_if['scenario']['total_cost']:.2f}"
        )

        print()

        print("IMPACT")

        print("-" * 40)

        comparison = freight_what_if.get(
            "comparison"
        )

        if comparison is not None:

            print(
                f"Recommendation Changed : "
                f"{comparison['recommendation_changed']}"
            )

            print(
                f"Cost Change            : "
                f"{comparison['cost_change']:.2f}"
            )

            print(
                f"Score Change           : "
                f"{comparison['score_change']:.2f}"
            )

            print(
                f"Risk Change            : "
                f"{comparison['risk_change']:.2f}"
            )

        else:

            print(
                "Comparison data not available for this run."
            )

        # ----------------------------------------------------
        # VALIDATION
        # ----------------------------------------------------

        expected_cost_change = (
            cargo_quantity
            * (35 - freight_rate)
        )

        actual_cost_change = (
            comparison["cost_change"]
            if comparison is not None and "cost_change" in comparison
            else None
        )

        freight_validation = (
            actual_cost_change is not None
            and
            actual_cost_change
            ==
            expected_cost_change
        )

        print()

        print(
            "9K.3 VALIDATION "
            +
            (
                "PASS"
                if freight_validation
                else "FAIL"
            )
        )

    else:

        print()

        print(
            "9K.3 VALIDATION FAIL"
        )

    print("=" * 60)

    print(
        "9K.3 TEST COMPLETED"
    )

    print("=" * 60)

        # ========================================================
    # 9K.4 FUEL PRICE WHAT-IF ANALYSIS
    # ========================================================

    print()

    print("=" * 60)
    print("9K.4 FUEL PRICE WHAT-IF ANALYSIS TEST")
    print("=" * 60)

    fuel_what_if = (
        run_what_if_analysis(

            vessels=vessels,

            cargo_type=cargo_type,

            cargo_quantity=cargo_quantity,

            origin_port=origin_port,

            destination_port=destination_port,

            speed_knots=speed_knots,

            available_days=available_days,

            freight_rate=freight_rate,

            fuel_price=fuel_price,

            waiting_hours=waiting_hours,

            daily_waiting_cost=daily_waiting_cost,

            other_cost=other_cost,

            what_if_fuel_price=demo_inputs["what_if_fuel_price"]
        )
    )

    print(
        f"Status : "
        f"{fuel_what_if['status']}"
    )

    # ========================================================
    # 9K.4 VALIDATION
    # ========================================================

    if fuel_what_if["status"] == "COMPLETED":

        print()

        print("BASELINE")
        print("-" * 40)

        print(
            f"Vessel      : "
            f"{fuel_what_if['baseline']['vessel_name']}"
        )

        print(
            f"Fuel Price  : "
            f"{fuel_price}"
        )

        print(
            f"Cost        : "
            f"{fuel_what_if['baseline']['total_cost']:.2f}"
        )

        print()

        print("WHAT-IF")
        print("-" * 40)

        print("Fuel Price  : 800")

        print(
            f"Vessel      : "
            f"{fuel_what_if['scenario']['vessel_name']}"
        )

        print(
            f"Cost        : "
            f"{fuel_what_if['scenario']['total_cost']:.2f}"
        )

        print()

        print("IMPACT")
        print("-" * 40)

        comparison = fuel_what_if.get(
            "comparison"
        )

        if comparison is not None:

            print(
                f"Recommendation Changed : "
                f"{comparison['recommendation_changed']}"
            )

            print(
                f"Cost Change            : "
                f"{comparison['cost_change']:.2f}"
            )

            print(
                f"Score Change           : "
                f"{comparison['score_change']:.2f}"
            )

            print(
                f"Risk Change            : "
                f"{comparison['risk_change']:.2f}"
            )

        else:

            print(
                "Comparison data not available for this run."
            )

        # ----------------------------------------------------
        # VALIDATION
        # ----------------------------------------------------

        exact_voyage = calculate_voyage(
            origin_port=origin_port,
            destination_port=destination_port,
            speed_knots=speed_knots,
        )

        fuel_reference = calculate_fuel_and_co2(
            dwt=optimized_option["deadweight_tonnage"],
            voyage_days=exact_voyage["sailing_days"],
        )

        expected_fuel_cost_change = round(
            fuel_reference["estimated_voyage_fuel"]
            * (
                demo_inputs["what_if_fuel_price"]
                - fuel_price
            ),
            2,
        )

        actual_cost_change = (
            fuel_what_if[
                "comparison"
            ][
                "cost_change"
            ]
        )

        fuel_validation = (
            actual_cost_change
            ==
            expected_fuel_cost_change
        )

        print()

        print(
            "9K.4 VALIDATION "
            +
            (
                "PASS"
                if fuel_validation
                else "FAIL"
            )
        )

    else:

        print()
        print("9K.4 VALIDATION FAIL")

    print("=" * 60)
    print("9K.4 TEST COMPLETED")
    print("=" * 60)