    # ---------------------------------------------------------
# COST CALCULATION MODULE
# ---------------------------------------------------------
#
# Calculates voyage cost using supplied:
# - Freight rate
# - Fuel price
# - Waiting cost
#
# This module does NOT invent market prices.
# Actual freight/fuel prices can be supplied later
# by the market-data/API layer.
# ---------------------------------------------------------


# ---------------------------------------------------------
# FUEL COST
# ---------------------------------------------------------

def calculate_fuel_cost(
    fuel_consumption,
    fuel_price,
):
    """
    Calculate fuel cost.

    fuel_consumption:
        Voyage fuel consumption.

    fuel_price:
        Price per unit of fuel consumption.

    The units must be consistent between the two inputs.
    """

    if fuel_consumption < 0:
        raise ValueError(
            "Fuel consumption cannot be negative."
        )

    if fuel_price < 0:
        raise ValueError(
            "Fuel price cannot be negative."
        )

    return fuel_consumption * fuel_price


# ---------------------------------------------------------
# FREIGHT COST
# ---------------------------------------------------------

def calculate_freight_cost(
    cargo_quantity,
    freight_rate,
):
    """
    Calculate freight cost.

    cargo_quantity:
        Cargo quantity.

    freight_rate:
        Freight rate per unit of cargo.
    """

    if cargo_quantity <= 0:
        raise ValueError(
            "Cargo quantity must be greater than zero."
        )

    if freight_rate < 0:
        raise ValueError(
            "Freight rate cannot be negative."
        )

    return cargo_quantity * freight_rate


# ---------------------------------------------------------
# WAITING COST
# ---------------------------------------------------------

def calculate_waiting_cost(
    waiting_hours,
    daily_waiting_cost,
):
    """
    Calculate waiting/idle cost.

    Waiting cost is converted from hours to days.
    """

    if waiting_hours < 0:
        raise ValueError(
            "Waiting hours cannot be negative."
        )

    if daily_waiting_cost < 0:
        raise ValueError(
            "Daily waiting cost cannot be negative."
        )

    waiting_days = waiting_hours / 24

    return waiting_days * daily_waiting_cost


# ---------------------------------------------------------
# TOTAL VOYAGE COST
# ---------------------------------------------------------

def calculate_total_cost(
    freight_cost,
    fuel_cost,
    waiting_cost=0,
    other_cost=0,
):
    """
    Calculate total voyage cost.
    """

    costs = [
        freight_cost,
        fuel_cost,
        waiting_cost,
        other_cost,
    ]

    if any(cost < 0 for cost in costs):
        raise ValueError(
            "Cost values cannot be negative."
        )

    return sum(costs)


# ---------------------------------------------------------
# COST PER TONNE
# ---------------------------------------------------------

def calculate_cost_per_tonne(
    total_cost,
    cargo_quantity,
):
    """Calculate total voyage cost per tonne of cargo."""

    if total_cost < 0:
        raise ValueError(
            "Total cost cannot be negative."
        )

    if cargo_quantity <= 0:
        raise ValueError(
            "Cargo quantity must be greater than zero."
        )

    return total_cost / cargo_quantity


# ---------------------------------------------------------
# COMPLETE COST CALCULATION
# ---------------------------------------------------------

def calculate_voyage_cost(
    cargo_quantity,
    freight_rate,
    fuel_consumption,
    fuel_price,
    waiting_hours=0,
    daily_waiting_cost=0,
    other_cost=0,
):
    """
    Calculate the complete voyage cost.

    All monetary units must use the same currency.
    Fuel quantity and fuel price must use compatible units.
    """

    freight_cost = calculate_freight_cost(
        cargo_quantity,
        freight_rate,
    )

    fuel_cost = calculate_fuel_cost(
        fuel_consumption,
        fuel_price,
    )

    waiting_cost = calculate_waiting_cost(
        waiting_hours,
        daily_waiting_cost,
    )

    total_cost = calculate_total_cost(
        freight_cost=freight_cost,
        fuel_cost=fuel_cost,
        waiting_cost=waiting_cost,
        other_cost=other_cost,
    )

    cost_per_tonne = calculate_cost_per_tonne(
        total_cost,
        cargo_quantity,
    )

    return {
        "cargo_quantity": cargo_quantity,
        "freight_rate": freight_rate,
        "freight_cost": freight_cost,
        "fuel_consumption": fuel_consumption,
        "fuel_price": fuel_price,
        "fuel_cost": fuel_cost,
        "waiting_hours": waiting_hours,
        "waiting_cost": waiting_cost,
        "other_cost": other_cost,
        "total_cost": total_cost,
        "cost_per_tonne": cost_per_tonne,
    }


# ---------------------------------------------------------
# TEST
# ---------------------------------------------------------

if __name__ == "__main__":

    # DEMO / TEST INPUTS ONLY.
    # These sample values are not production data and are intended
    # to be replaced later by caller-supplied values from a CLI or API.
    demo_cost_inputs = {
        "cargo_quantity": 50000,
        "freight_rate": 25,
        "fuel_consumption": 985.34,
        "fuel_price": 600,
        "waiting_hours": 24,
        "daily_waiting_cost": 20000,
        "other_cost": 10000,
    }

    result = calculate_voyage_cost(
        cargo_quantity=demo_cost_inputs["cargo_quantity"],
        freight_rate=demo_cost_inputs["freight_rate"],
        fuel_consumption=demo_cost_inputs["fuel_consumption"],
        fuel_price=demo_cost_inputs["fuel_price"],
        waiting_hours=demo_cost_inputs["waiting_hours"],
        daily_waiting_cost=demo_cost_inputs["daily_waiting_cost"],
        other_cost=demo_cost_inputs["other_cost"],
    )

    print("\n" + "=" * 60)
    print("VOYAGE COST CALCULATION TEST")
    print("=" * 60)

    print(
        f"Cargo Quantity    : "
        f"{result['cargo_quantity']}"
    )

    print(
        f"Freight Rate      : "
        f"{result['freight_rate']}"
    )

    print(
        f"Freight Cost      : "
        f"{result['freight_cost']:.2f}"
    )

    print(
        f"Fuel Consumption   : "
        f"{result['fuel_consumption']:.2f}"
    )

    print(
        f"Fuel Price         : "
        f"{result['fuel_price']}"
    )

    print(
        f"Fuel Cost          : "
        f"{result['fuel_cost']:.2f}"
    )

    print(
        f"Waiting Hours      : "
        f"{result['waiting_hours']}"
    )

    print(
        f"Waiting Cost       : "
        f"{result['waiting_cost']:.2f}"
    )

    print(
        f"Other Cost         : "
        f"{result['other_cost']:.2f}"
    )

    print(
        f"Total Voyage Cost  : "
        f"{result['total_cost']:.2f}"
    )

    print(
        f"Cost Per Tonne     : "
        f"{result['cost_per_tonne']:.2f}"
    )

    print("=" * 60)
    print("TEST COMPLETED")
    print("=" * 60)