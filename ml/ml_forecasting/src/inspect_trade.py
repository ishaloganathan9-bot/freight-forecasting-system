import pandas as pd
from pathlib import Path

FILE = Path(
    "ml_forecasting/data/raw/trade/US_SeaborneTrade.csv"
)

print("=" * 60)
print("TRADE DATASET INSPECTION")
print("=" * 60)

df = pd.read_csv(FILE)

print("\nShape:")
print(df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nData types:")
print(df.dtypes)

print("\nMissing values:")
print(df.isna().sum())

print("\nDuplicate rows:")
print(df.duplicated().sum())

print("\nFirst 10 rows:")
print(df.head(10))

print("\nLast 10 rows:")
print(df.tail(10))

print("\nNumeric summary:")
print(df.describe(include="all"))

print("\nUnique values for important columns:")

for column in df.columns:
    if df[column].nunique() <= 20:
        print(f"\n{column}:")
        print(df[column].unique())

print("\nYear range:")

if "Year" in df.columns:
    print(df["Year"].min(), "to", df["Year"].max())

print("\n" + "=" * 60)
print("TRADE INSPECTION COMPLETED")
print("=" * 60)