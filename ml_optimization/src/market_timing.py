"""
Market timing adjustment for chartering strategy ranking.

This module does not change the freight rate.
It only adjusts the strategy score based on the
forecast market-timing signal from AI/ML 1.
"""

import yaml


CONFIG_PATH = "configs/weights.yaml"


def load_market_timing_config():
    """Load market-timing configuration from YAML."""
    with open(CONFIG_PATH, "r", encoding="utf-8-sig") as file:
        config = yaml.safe_load(file)

    return config.get("market_timing", {})


def calculate_market_timing_adjustment(strategy, timing_signal):
    """
    Calculate the strategy-level market timing adjustment.

    Higher final score is better.

    charter_earlier:
        Penalize waiting because freight is forecast to rise.

    consider_waiting:
        Give waiting a relative advantage because freight
        is forecast to fall.

    neutral:
        No market timing adjustment.
    """

    config = load_market_timing_config()

    if strategy == "wait" and timing_signal == "charter_earlier":
        return -float(
            config.get("charter_earlier_penalty_for_wait", 0)
        )

    if strategy == "wait" and timing_signal == "consider_waiting":
        return float(
            config.get("consider_waiting_bonus_for_wait", 0)
        )

    return float(
        config.get("neutral_adjustment", 0)
    )