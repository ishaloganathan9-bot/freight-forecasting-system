"""
AI/ML 1 -> AI/ML 2 Market Signal

Converts the AI/ML 1 BDI forecast into a simple market-timing
signal for AI/ML 2.

Important:
BDI is used only as a market-direction indicator.
It is NOT treated as a route-specific freight rate.
"""

from ai1_forecast_adapter import forecast_market_signal


def build_market_signal(forecast=None):
    """
    Build an AI/ML 2 market-timing signal from AI/ML 1 forecast data.
    """

    if forecast is None:
        forecast = forecast_market_signal()

    change_pct = float(
        forecast["forecast_change_pct"]
    )

    if change_pct >= 5.0:
        timing_signal = "charter_earlier"
        timing_reason = (
            "Freight market is forecast to increase materially."
        )
    elif change_pct <= -5.0:
        timing_signal = "consider_waiting"
        timing_reason = (
            "Freight market is forecast to decrease materially."
        )
    else:
        timing_signal = "neutral"
        timing_reason = (
            "Freight market forecast does not show a strong "
            "directional movement."
        )

    return {
        "current_bdi": forecast["current_bdi"],
        "forecast_bdi": forecast["forecast_bdi"],
        "forecast_change_pct": forecast["forecast_change_pct"],
        "trend": forecast["trend"],
        "timing_signal": timing_signal,
        "timing_reason": timing_reason,
        "forecast_horizon": forecast["forecast_horizon"],
        "model": forecast["model"],
        "source_date": forecast["source_date"],
    }


if __name__ == "__main__":
    result = build_market_signal()

    print("=" * 60)
    print("AI/ML 1 -> AI/ML 2 MARKET SIGNAL TEST")
    print("=" * 60)

    for key, value in result.items():
        print(f"{key}: {value}")

    print("=" * 60)
    print("TEST COMPLETED")