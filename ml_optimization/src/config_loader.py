from pathlib import Path
import math

import yaml


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CONFIG_PATH = PROJECT_ROOT / "configs" / "weights.yaml"


def _validate_number(value, field_name):
    """Validate that a config value is a finite numeric value."""

    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(
            f"Configuration field '{field_name}' must be numeric."
        )

    if not math.isfinite(float(value)):
        raise ValueError(
            f"Configuration field '{field_name}' must be finite."
        )

    return float(value)


def _require_mapping(section_name, value):
    """Validate that a configuration section is a dictionary."""

    if not isinstance(value, dict):
        raise ValueError(
            f"Configuration section '{section_name}' must be a mapping."
        )

    return value


def load_configuration(config_path=None):
    """Load AI/ML 2 configuration from YAML."""

    path = Path(config_path) if config_path else DEFAULT_CONFIG_PATH

    if not path.exists():
        raise FileNotFoundError(
            f"Configuration file not found: {path}"
        )

    with path.open("r", encoding="utf-8") as handle:
        loaded = yaml.safe_load(handle) or {}

    if not isinstance(loaded, dict):
        raise ValueError(
            "Configuration file must contain a top-level mapping."
        )

    scoring = _require_mapping("scoring", loaded.get("scoring"))
    risk = _require_mapping("risk", loaded.get("risk"))

    required_scoring_keys = {
        "feasibility",
        "cost",
        "risk",
        "fuel",
        "co2",
    }

    missing_scoring = required_scoring_keys.difference(scoring)

    if missing_scoring:
        raise ValueError(
            "Missing required scoring configuration: "
            f"{', '.join(sorted(missing_scoring))}"
        )

    scoring_weights = {}

    for key in required_scoring_keys:
        scoring_weights[key] = _validate_number(
            scoring[key],
            f"scoring.{key}",
        )

    total_weight = sum(scoring_weights.values())

    if not math.isclose(total_weight, 1.0, rel_tol=1e-9, abs_tol=1e-9):
        raise ValueError(
            "Scoring weights must sum to 1.0; "
            f"received {total_weight:.6f}."
        )

    required_risk_sections = {
        "feasibility",
        "schedule",
        "waiting",
        "operational",
        "overall",
    }

    missing_risk_sections = required_risk_sections.difference(risk)

    if missing_risk_sections:
        raise ValueError(
            "Missing required risk configuration: "
            f"{', '.join(sorted(missing_risk_sections))}"
        )

    for section_name in required_risk_sections:
        _require_mapping(section_name, risk[section_name])

    risk_cfg = {}

    for section_name in required_risk_sections:
        risk_cfg[section_name] = {}

    # Feasibility scores
    risk_cfg["feasibility"]["pass_score"] = _validate_number(
        risk["feasibility"].get("pass_score"),
        "risk.feasibility.pass_score",
    )
    risk_cfg["feasibility"]["fail_score"] = _validate_number(
        risk["feasibility"].get("fail_score"),
        "risk.feasibility.fail_score",
    )

    # Schedule thresholds and scores
    risk_cfg["schedule"]["unavailable_days_score"] = _validate_number(
        risk["schedule"].get("unavailable_days_score"),
        "risk.schedule.unavailable_days_score",
    )
    risk_cfg["schedule"]["low_ratio_threshold"] = _validate_number(
        risk["schedule"].get("low_ratio_threshold"),
        "risk.schedule.low_ratio_threshold",
    )
    risk_cfg["schedule"]["medium_ratio_threshold"] = _validate_number(
        risk["schedule"].get("medium_ratio_threshold"),
        "risk.schedule.medium_ratio_threshold",
    )
    risk_cfg["schedule"]["low_score"] = _validate_number(
        risk["schedule"].get("low_score"),
        "risk.schedule.low_score",
    )
    risk_cfg["schedule"]["medium_score"] = _validate_number(
        risk["schedule"].get("medium_score"),
        "risk.schedule.medium_score",
    )
    risk_cfg["schedule"]["high_score"] = _validate_number(
        risk["schedule"].get("high_score"),
        "risk.schedule.high_score",
    )

    # Waiting thresholds and scores
    risk_cfg["waiting"]["low_hours_threshold"] = _validate_number(
        risk["waiting"].get("low_hours_threshold"),
        "risk.waiting.low_hours_threshold",
    )
    risk_cfg["waiting"]["medium_hours_threshold"] = _validate_number(
        risk["waiting"].get("medium_hours_threshold"),
        "risk.waiting.medium_hours_threshold",
    )
    risk_cfg["waiting"]["low_score"] = _validate_number(
        risk["waiting"].get("low_score"),
        "risk.waiting.low_score",
    )
    risk_cfg["waiting"]["medium_score"] = _validate_number(
        risk["waiting"].get("medium_score"),
        "risk.waiting.medium_score",
    )
    risk_cfg["waiting"]["high_score"] = _validate_number(
        risk["waiting"].get("high_score"),
        "risk.waiting.high_score",
    )

    # Operational scores
    risk_cfg["operational"]["default_score"] = _validate_number(
        risk["operational"].get("default_score"),
        "risk.operational.default_score",
    )
    risk_cfg["operational"]["failed_checks_score"] = _validate_number(
        risk["operational"].get("failed_checks_score"),
        "risk.operational.failed_checks_score",
    )
    risk_cfg["operational"]["unknown_checks_score"] = _validate_number(
        risk["operational"].get("unknown_checks_score"),
        "risk.operational.unknown_checks_score",
    )
    risk_cfg["operational"]["pass_score"] = _validate_number(
        risk["operational"].get("pass_score"),
        "risk.operational.pass_score",
    )

    # Overall thresholds
    risk_cfg["overall"]["low_threshold"] = _validate_number(
        risk["overall"].get("low_threshold"),
        "risk.overall.low_threshold",
    )
    risk_cfg["overall"]["medium_threshold"] = _validate_number(
        risk["overall"].get("medium_threshold"),
        "risk.overall.medium_threshold",
    )

    return {
        "scoring": scoring_weights,
        "risk": risk_cfg,
    }
