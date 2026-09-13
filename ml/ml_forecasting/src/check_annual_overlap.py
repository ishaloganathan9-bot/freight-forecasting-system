import pandas as pd
from pathlib import Path


FREIGHT_FILE = Path(
    "ml_forecasting/data/interim/freight_cleaned.csv"
)

PORT_FILE = Path(
    "ml_forecasting/data/interim/port_traffic_cleaned.csv"
)

TRADE_FILE = Path(
    "ml_forecasting/data/interim/trade_cleaned.csv"
)


print("=" * 60)
print("ANNUAL DATA INTEGRATION CHECK")
print("=" * 60)


# ---------------------------------------------------------
# Freight
# ---------------------------------------------------------

freight = pd.read_csv(
    FREIGHT_FILE,
    parse_dates=["Date"]
)

freight["Year"] = freight["Date"].dt.year

freight_years = sorted(
    freight["Year"].unique()
)

print("\nFreight years:")
print(
    freight_years[0],
    "to",
    freight_years[-1]
)


# ---------------------------------------------------------
# Port
# ---------------------------------------------------------

ports = pd.read_csv(
    PORT_FILE
)

print("\nPort years:")
print(
    ports["Year"].astype(str).min(),
    "to",
    ports["Year"].astype(str).max()
)

print("\nPort rows by port:")
print(
    ports["Port"].value_counts()
)


# ---------------------------------------------------------
# Trade
# ---------------------------------------------------------

trade = pd.read_csv(
    TRADE_FILE
)

trade_years = sorted(
    trade["Year"].unique()
)

print("\nTrade years:")
print(
    trade_years[0],
    "to",
    trade_years[-1]
)


# ---------------------------------------------------------
# Trade years overlapping freight
# ---------------------------------------------------------

trade_overlap = sorted(
    set(freight_years)
    .intersection(set(trade_years))
)

print("\nTrade + Freight overlapping years:")
print(trade_overlap)


# ---------------------------------------------------------
# Port financial years that overlap freight period
# ---------------------------------------------------------

port_year_numbers = (
    ports["Year"]
    .astype(str)
    .str[:4]
)

port_year_numbers = pd.to_numeric(
    port_year_numbers,
    errors="coerce"
)

port_overlap = sorted(
    set(freight_years)
    .intersection(
        set(port_year_numbers.dropna().astype(int))
    )
)

print("\nPort + Freight overlapping starting years:")
print(port_overlap)


# ---------------------------------------------------------
# Basic port statistics for overlapping period
# ---------------------------------------------------------

overlap_ports = ports[
    port_year_numbers.isin(freight_years)
].copy()

print("\nPort rows in freight-period overlap:")
print(
    overlap_ports.shape
)

print("\nPort rows by port in overlap:")
print(
    overlap_ports["Port"].value_counts()
)


print("\n" + "=" * 60)
print("ANNUAL OVERLAP CHECK COMPLETED")
print("=" * 60)