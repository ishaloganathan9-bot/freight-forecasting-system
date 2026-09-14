# AI/ML 2 Freight Forecasting System

## Purpose
AI/ML 2 performs the end-to-end prototype optimization flow for vessel selection, voyage planning, risk assessment, cost estimation, scoring, and recommendation generation.

## Module responsibilities
- `src/feasibility.py`: vessel/cargo compatibility, berth feasibility, LOA/beam/draft/DWT checks, and PASS/FAIL/UNKNOWN handling.
- `src/voyage.py`: route lookup and voyage duration calculations from the prototype route dataset.
- `src/fuel_emissions.py`: fleet-reference fuel and CO2 estimation for voyage duration.
- `src/cost.py`: freight, fuel, waiting, other, and total cost calculations.
- `src/risk.py`: risk scoring based on the configured thresholds from `configs/weights.yaml`.
- `src/scoring.py`: normalization and weighted option scoring from the same YAML configuration.
- `src/optimizer.py`: candidate filtering, multi-voyage planning, option scoring, OR-Tools optimization, ranking, recommendation, and what-if analysis.
- `src/config_loader.py`: YAML configuration validation and loading.

## Data flow
User/analysis input → vessel-cargo matching → vessel-port feasibility → required voyages → voyage calculation → port and waiting time → fuel estimation → CO2 estimation → cost calculation → risk → scoring → OR-Tools optimization → ranking → recommendation → what-if analysis.

## Optimization approach
The optimizer builds feasible bulk-carrier candidates, checks destination berth feasibility, extends the plan to multiple voyages when cargo exceeds a single vessel capacity, computes voyage-level operating metrics, scores all feasible options, and uses OR-Tools to select the best-scoring vessel.

## Feasibility handling
Feasibility intentionally preserves PASS / FAIL / UNKNOWN semantics. Missing vessel draft data, missing port restriction data, and incomplete berth metadata remain explicit UNKNOWN results rather than being silently treated as verified. This prevents false positives in the prototype.

## Fuel and CO2 estimation
Fuel and CO2 are estimated from the existing IMO bulk-carrier fleet-reference dataset. These values are reference-based estimates, not engine-specific measured values.

## Risk and scoring
Risk categories and scoring weights are loaded from `configs/weights.yaml`, so the business rules are configurable without changing Python logic.

## How to run tests
From `ml_optimization`:

```bash
.\.venv\Scripts\python.exe -m pytest -q
```

## How to run the optimizer
From `ml_optimization`:

```bash
.\.venv\Scripts\python.exe src\optimizer.py
```

## Known limitations
- Vessel draft data is incomplete in the current dataset.
- Detailed berth restriction data is incomplete for some ports.
- Fuel and CO2 are estimate-based reference calculations, not live measured values.
- Waiting time and congestion handling are prototype/input-driven.
- This is an internal prototype and not a replacement for live commercial chartering or berth data.
