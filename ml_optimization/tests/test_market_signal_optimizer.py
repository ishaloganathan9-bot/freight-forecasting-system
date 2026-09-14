from optimizer import score_options


def make_option(strategy, market_signal):
    return {
        "strategy": strategy,
        "market_signal": market_signal,
        "feasibility": True,
        "total_cost": 100000,
        "overall_risk": 10,
        "fuel_consumption": 1000,
        "co2_emission": 3000,
    }


def test_charter_earlier_penalizes_wait():
    options = [
        make_option("wait", "charter_earlier"),
        make_option("charter_now", "charter_earlier"),
    ]

    scored = score_options(options)

    wait_option = next(
        option for option in scored
        if option["strategy"] == "wait"
    )

    charter_now_option = next(
        option for option in scored
        if option["strategy"] == "charter_now"
    )

    assert wait_option["market_timing_adjustment"] == -10.0
    assert charter_now_option["market_timing_adjustment"] == 0.0


def test_consider_waiting_rewards_wait():
    options = [
        make_option("wait", "consider_waiting"),
        make_option("charter_now", "consider_waiting"),
    ]

    scored = score_options(options)

    wait_option = next(
        option for option in scored
        if option["strategy"] == "wait"
    )

    assert wait_option["market_timing_adjustment"] == 10.0


def test_neutral_market_has_no_timing_adjustment():
    options = [
        make_option("wait", "neutral"),
    ]

    scored = score_options(options)

    assert scored[0]["market_timing_adjustment"] == 0.0