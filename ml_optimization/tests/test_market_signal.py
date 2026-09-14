from market_signal import build_market_signal


def test_market_signal_increasing():
    forecast = {
        "current_bdi": 1945.0,
        "forecast_bdi": 2359.66,
        "forecast_change_pct": 21.32,
        "trend": "increasing",
        "forecast_horizon": "1 month",
        "model": "xgboost_v1.0",
        "source_date": "2025-11-01",
    }

    result = build_market_signal(forecast)

    assert result["timing_signal"] == "charter_earlier"
    assert result["trend"] == "increasing"


def test_market_signal_decreasing():
    forecast = {
        "current_bdi": 2000.0,
        "forecast_bdi": 1800.0,
        "forecast_change_pct": -10.0,
        "trend": "decreasing",
        "forecast_horizon": "1 month",
        "model": "xgboost_v1.0",
        "source_date": "2025-11-01",
    }

    result = build_market_signal(forecast)

    assert result["timing_signal"] == "consider_waiting"


def test_market_signal_neutral():
    forecast = {
        "current_bdi": 2000.0,
        "forecast_bdi": 2040.0,
        "forecast_change_pct": 2.0,
        "trend": "stable",
        "forecast_horizon": "1 month",
        "model": "xgboost_v1.0",
        "source_date": "2025-11-01",
    }

    result = build_market_signal(forecast)

    assert result["timing_signal"] == "neutral"