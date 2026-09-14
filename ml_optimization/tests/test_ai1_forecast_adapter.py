from ai1_forecast_adapter import forecast_market_signal


def test_forecast_market_signal():
    result = forecast_market_signal()

    assert isinstance(result, dict)

    assert "current_bdi" in result
    assert "forecast_bdi" in result
    assert "forecast_change_pct" in result
    assert "trend" in result

    assert isinstance(result["current_bdi"], float)
    assert isinstance(result["forecast_bdi"], float)
    assert isinstance(result["forecast_change_pct"], float)

    assert result["trend"] in {
        "increasing",
        "decreasing",
        "stable",
    }