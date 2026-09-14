from market_timing import calculate_market_timing_adjustment


def test_charter_earlier_penalizes_wait():
    adjustment = calculate_market_timing_adjustment(
        strategy="wait",
        timing_signal="charter_earlier",
    )

    assert adjustment == -10.0


def test_consider_waiting_rewards_wait():
    adjustment = calculate_market_timing_adjustment(
        strategy="wait",
        timing_signal="consider_waiting",
    )

    assert adjustment == 10.0


def test_neutral_has_no_adjustment():
    adjustment = calculate_market_timing_adjustment(
        strategy="wait",
        timing_signal="neutral",
    )

    assert adjustment == 0.0


def test_non_wait_strategy_has_no_timing_adjustment():
    adjustment = calculate_market_timing_adjustment(
        strategy="charter_now",
        timing_signal="charter_earlier",
    )

    assert adjustment == 0.0