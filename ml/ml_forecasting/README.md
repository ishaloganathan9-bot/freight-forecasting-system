# Intelligent Freight Forecasting - ML Module 1

## 1. Objective

This module develops a machine learning based freight-market forecasting system to support vessel chartering and bulk cargo procurement decisions.

The current prototype forecasts the **Baltic Dry Index (BDI)** as a global dry-bulk freight-market proxy.

The BDI is not a route-specific freight rate for overseas-to-East-Coast-India movements. Route-specific historical freight-rate data can later replace or complement the BDI target when suitable route-level data becomes available.

---

## 2. Target Variable

### Current Target

- Target variable: `Target_Freight_Next_Month`
- Forecast horizon: 1 month
- Freight indicator: Baltic Dry Index (BDI)
- Frequency: Monthly
- Historical period: January 2011 - December 2025

The model predicts the next month's freight index using historical freight behaviour and supporting market indicators.

---

## 3. Data Sources

### Freight Data

Monthly Baltic Dry Index historical data.

The BDI is used as the primary freight-market target and represents the global dry-bulk freight market.

### Port Traffic Data

Supporting cargo traffic data for major East Coast Indian ports:

- Chennai
- Kamarajar
- Paradip
- Visakhapatnam
- Syama Prasad Mookerjee Port (Kolkata/Haldia)

Port traffic data includes overseas, coastal and total traffic measures where available.

Port data is treated as supporting information rather than the forecasting target.

### Commodity Data

World Bank Commodity Price Data (Pink Sheet).

Selected commodities include:

- Aluminum
- Australian Coal
- South African Coal
- Copper
- Brent Crude Oil
- Iron Ore
- Natural Gas
- Soybeans
- US HRW Wheat

Lagged commodity prices are used as model features to reduce the risk of future information leakage.

### Trade Data

UNCTAD seaborne trade data was used to derive supporting dry-cargo indicators.

The following India-level indicators were incorporated:

- India dry cargo loaded
- India dry cargo discharged

These variables are used with a lag so that future information is not used during prediction.

---

## 4. Data Processing

The preprocessing pipeline includes:

1. Date conversion
2. Numeric data conversion
3. Duplicate detection
4. Missing-value inspection
5. Unit consistency checking
6. Freight data cleaning
7. Port traffic data cleaning
8. Commodity data cleaning
9. Trade data cleaning
10. Leakage-safe dataset integration

Missing values were investigated rather than blindly deleted.

Where appropriate, data transformations and cleaning decisions were documented.

---

## 5. Integrated Dataset

The final integrated dataset contains:

- 180 monthly observations
- January 2011 to December 2025
- Freight-market indicator
- East Coast India port traffic indicators
- Commodity price indicators
- India dry-cargo trade indicators

Final integrated dataset:

`data/processed/freight_forecasting_dataset.csv`

---

## 6. Feature Engineering

The forecasting features are constructed using historical and supporting market information.

### Freight Features

The model uses:

- Current Freight Index
- 1-month freight lag
- 3-month freight lag
- 6-month freight lag
- 12-month freight lag
- 3-month rolling mean
- 6-month rolling mean
- 12-month rolling mean

Rolling statistics are calculated using only previous observations to avoid future leakage.

### Commodity Features

One-month lagged commodity prices are used for:

- Aluminum
- Australian Coal
- South African Coal
- Copper
- Brent Crude Oil
- Iron Ore
- Natural Gas
- Soybeans
- US HRW Wheat

### Trade Features

One-month lagged trade indicators are used:

- India dry cargo loaded
- India dry cargo discharged

### Calendar Features

- Month
- Quarter
- Year

### Port Features

Port traffic indicators were integrated into the processed dataset.

However, the current XGBoost model excludes port features because the available port data does not provide complete observations across the model's evaluation period.

This prevents missing-value driven predictions and keeps the current supervised model evaluation consistent.

---

## 7. Models Evaluated

Three forecasting approaches were evaluated:

1. Naive baseline
2. Moving Average baseline
3. XGBoost Regressor

Chronological walk-forward validation was used instead of random train-test splitting.

This approach is more appropriate for time-series forecasting because it preserves temporal ordering and reduces the risk of training on future information.

---

## 8. Model Evaluation

Final walk-forward validation results:

| Model | MAE | RMSE | MAPE |
|---|---:|---:|---:|
| Naive | 445.88 | 582.99 | 29.02% |
| Moving Average | 397.15 | 531.20 | 25.74% |
| XGBoost | 331.15 | 462.50 | 19.89% |

XGBoost achieved the lowest MAE, RMSE and MAPE among the evaluated models under the chronological walk-forward validation.

The results indicate that XGBoost performed better than the selected baseline methods on the available evaluation period.

Because the dataset is relatively small and the evaluation window is limited, these results should not be interpreted as a guarantee of future performance.

---

## 9. Uncertainty Estimation

An empirical prediction interval was created using the 5th and 95th percentiles of walk-forward prediction errors.

Observed coverage:

**88.24%**

The resulting interval is an empirical error-based prediction interval.

It should not be interpreted as a formally calibrated probabilistic confidence interval.

Future versions can improve uncertainty estimation using more advanced calibration techniques and larger route-specific datasets.

---

## 10. Trend Detection

The forecast trend is classified using the percentage change between the current freight index and the predicted next-month value.

Rules:

- Change greater than 5% → Rising
- Change less than -5% → Falling
- Otherwise → Stable

### Current Prototype Prediction

- Current BDI: 1945.00
- Forecast BDI: 2359.66
- Expected change: approximately +21.32%
- Trend: Rising

---

## 11. Volatility

Monthly freight volatility is calculated using the standard deviation of month-to-month percentage changes.

Current measured volatility:

**24.51%**

Prototype classification:

- Below 10% → Low
- 10% to below 20% → Moderate
- 20% or above → High

Current classification:

**High**

These thresholds are prototype thresholds and are not external industry benchmarks.

---

## 12. SHAP Explainability

SHAP (SHapley Additive exPlanations) is used to analyse feature contribution to model predictions.

The highest mean absolute SHAP values in the current model include:

1. Copper lag
2. Current Freight Index
3. Aluminum lag
4. Month
5. Iron Ore lag

SHAP magnitude represents the importance or contribution magnitude of a feature to model predictions.

SHAP results should not be interpreted as proof of causal relationships.

---

## 13. Model Configuration

The current forecasting model uses an XGBoost Regressor.

Main configuration:

- Number of estimators: 200
- Maximum depth: 3
- Learning rate: 0.05
- Subsample: 0.8
- Column subsampling: 0.8
- Objective: Regression
- Random state: 42

---

## 14. Model Version

Current model:

**XGBoost v1.0**

Saved model:

`models/xgboost_v1.0.joblib`

Model metadata:

`models/xgboost_v1.0_metadata.json`

The metadata file records the model target, training period, evaluation period and performance metrics.

---

## 15. Prediction Interface

The prediction interface provides the following output fields:

- `current_rate`
- `forecast_rate`
- `trend`
- `volatility`
- `confidence`
- `lower_bound`
- `upper_bound`
- `forecast_horizon`
- `model`
- `model_version`
- `explanation`

### Example Output

```text
Freight Forecast Output
=======================

current_rate: 1945.0
forecast_rate: 2359.66
trend: Rising
volatility: 24.51%
confidence: Medium
lower_bound: 1789.70
upper_bound: 3064.28
forecast_horizon: 1 month
model: XGBoost
model_version: xgboost_v1.0
explanation: Forecast is 21.32% higher than the current Baltic Dry Index. The model predicts a Rising trend.