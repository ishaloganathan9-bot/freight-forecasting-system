from pathlib import Path
import pandas as pd


# ---------------------------------------------------------
# PROJECT PATH
# ---------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[1]

ROUTE_FILE = (
    PROJECT_ROOT
    / "data"
    / "raw"
    / "routes"
    / "port_routes.csv"
)


# ---------------------------------------------------------
# LOAD ROUTE DATA
# ---------------------------------------------------------

def load_routes():
    """Load prototype route-distance data."""

    if not ROUTE_FILE.exists():
        raise FileNotFoundError(
            f"Route dataset not found: {ROUTE_FILE}"
        )

    routes = pd.read_csv(ROUTE_FILE)

    return routes


# ---------------------------------------------------------
# NORMALIZE PORT NAME
# ---------------------------------------------------------

def normalize_port_name(port_name):
    """Normalize a port name for reliable comparison."""

    return (
        str(port_name)
        .strip()
        .lower()
    )


# ---------------------------------------------------------
# FIND ROUTE
# ---------------------------------------------------------

def find_route(
    origin_port,
    destination_port,
):
    """Find the route between two ports."""

    routes = load_routes()

    origin = normalize_port_name(origin_port)
    destination = normalize_port_name(destination_port)

    matches = routes[
        (
            routes["origin_port"]
            .apply(normalize_port_name)
            == origin
        )
        &
        (
            routes["destination_port"]
            .apply(normalize_port_name)
            == destination
        )
    ]

    if matches.empty:
        raise ValueError(
            f"No route found for "
            f"{origin_port} -> {destination_port}"
        )

    return matches.iloc[0]


# ---------------------------------------------------------
# CALCULATE SAILING TIME
# ---------------------------------------------------------

def calculate_sailing_time(
    distance_nm,
    speed_knots,
):
    """
    Calculate sailing time.

    Nautical miles / knots = hours.
    """

    if distance_nm <= 0:
        raise ValueError(
            "Distance must be greater than zero."
        )

    if speed_knots <= 0:
        raise ValueError(
            "Vessel speed must be greater than zero."
        )

    sailing_hours = distance_nm / speed_knots

    sailing_days = sailing_hours / 24

    return sailing_hours, sailing_days


# ---------------------------------------------------------
# CALCULATE VOYAGE
# ---------------------------------------------------------

def calculate_voyage(
    origin_port,
    destination_port,
    speed_knots,
    loading_handling_days=0.0,
    berthing_port_days=0.0,
    waiting_hours=0.0,
):
    """
    Calculate basic voyage information using the
    prototype route-distance dataset.

    Port and waiting time are represented as explicit
    configuration-driven inputs rather than inferred from
    live congestion data.
    """

    if loading_handling_days < 0:
        raise ValueError(
            "Loading/handling days cannot be negative."
        )

    if berthing_port_days < 0:
        raise ValueError(
            "Berthing/port days cannot be negative."
        )

    if waiting_hours < 0:
        raise ValueError(
            "Waiting hours cannot be negative."
        )

    route = find_route(
        origin_port,
        destination_port,
    )

    distance_nm = float(
        route["distance_nm"]
    )

    sailing_hours, sailing_days = (
        calculate_sailing_time(
            distance_nm,
            float(speed_knots),
        )
    )

    loading_handling_days = float(
        loading_handling_days
    )

    berthing_port_days = float(
        berthing_port_days
    )

    waiting_hours = float(
        waiting_hours
    )

    waiting_days = waiting_hours / 24

    total_port_days = (
        loading_handling_days
        + berthing_port_days
    )

    total_voyage_hours = (
        sailing_hours
        + (total_port_days * 24)
        + waiting_hours
    )

    total_voyage_days = (
        sailing_days
        + total_port_days
        + waiting_days
    )

    return {
        "origin_port": route["origin_port"],
        "destination_port": route["destination_port"],
        "distance_nm": distance_nm,
        "speed_knots": float(speed_knots),
        "sailing_hours": sailing_hours,
        "sailing_days": sailing_days,
        "loading_handling_days": loading_handling_days,
        "berthing_port_days": berthing_port_days,
        "port_days": total_port_days,
        "waiting_hours": waiting_hours,
        "waiting_days": waiting_days,
        "total_port_days": total_port_days,
        "total_voyage_hours": total_voyage_hours,
        "total_voyage_days": total_voyage_days,
        "distance_status": "prototype_reference",
    }


# ---------------------------------------------------------
# TEST
# ---------------------------------------------------------

if __name__ == "__main__":

    # DEMO / TEST INPUTS ONLY.
    # These sample values are for local execution and will later be
    # replaced by caller-supplied values from a CLI or API request.
    demo_voyage_inputs = {
        "origin_port": "Newcastle, Australia",
        "destination_port": "Paradip",
        "speed_knots": 12,
    }

    result = calculate_voyage(
        origin_port=demo_voyage_inputs["origin_port"],
        destination_port=demo_voyage_inputs["destination_port"],
        speed_knots=demo_voyage_inputs["speed_knots"],
    )

    print("\n" + "=" * 60)
    print("VOYAGE CALCULATION TEST")
    print("=" * 60)

    print(
        f"Origin Port      : "
        f"{result['origin_port']}"
    )

    print(
        f"Destination Port : "
        f"{result['destination_port']}"
    )

    print(
        f"Distance         : "
        f"{result['distance_nm']} NM"
    )

    print(
        f"Speed            : "
        f"{result['speed_knots']} knots"
    )

    print(
        f"Sailing Time     : "
        f"{result['sailing_hours']:.2f} hours"
    )

    print(
        f"Sailing Duration : "
        f"{result['sailing_days']:.2f} days"
    )

    print(
        f"Distance Status  : "
        f"{result['distance_status']}"
    )

    print("=" * 60)
    print("TEST COMPLETED")
    print("=" * 60)