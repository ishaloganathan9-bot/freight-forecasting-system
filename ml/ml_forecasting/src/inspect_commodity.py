import pandas as pd
from pathlib import Path

FILE = Path(
    "ml_forecasting/data/raw/commodity/CMO-Historical-Data-Monthly.xlsx"
)

print("=" * 60)
print("COMMODITY DATASET INSPECTION")
print("=" * 60)

excel_file = pd.ExcelFile(FILE)

print("\nSheets available:")
print(excel_file.sheet_names)

for sheet in excel_file.sheet_names:

    print("\n" + "=" * 60)
    print(f"SHEET: {sheet}")
    print("=" * 60)

    df = pd.read_excel(FILE, sheet_name=sheet, header=None)

    print("\nShape:")
    print(df.shape)

    print("\nFirst 8 rows:")
    print(df.head(8))

    print("\nData types:")
    print(df.dtypes)

    print("\nMissing values:")
    print(df.isna().sum().head(15))

print("\n" + "=" * 60)
print("COMMODITY INSPECTION COMPLETED")
print("=" * 60)