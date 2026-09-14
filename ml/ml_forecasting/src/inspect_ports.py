import pandas as pd
import xlrd
from pathlib import Path

PORT_FOLDER = Path("ml_forecasting/data/raw/port")

PORT_FILES = [
    "datafile chennai .xls",
    "datafile kamarajar.xls",
    "datafile kolkata,haldia.xls",
    "datafile paradip.xls",
    "datafile vishakhapatnam.xls"
]

print("=" * 60)
print("PORT DATASET INSPECTION")
print("=" * 60)

for filename in PORT_FILES:

    filepath = PORT_FOLDER / filename

    print("\n" + "=" * 60)
    print(f"FILE: {filename}")
    print("=" * 60)

    try:
        workbook = xlrd.open_workbook(
            filename=str(filepath),
            ignore_workbook_corruption=True
        )

        print("Sheets:", workbook.sheet_names())

        sheet = workbook.sheet_by_index(0)

        data = [
            sheet.row_values(row)
            for row in range(sheet.nrows)
        ]

        df = pd.DataFrame(data)

        print("\nShape:")
        print(df.shape)

        print("\nFirst 10 rows:")
        print(df.head(10))

        print("\nData types:")
        print(df.dtypes)

        print("\nMissing values:")
        print(df.isna().sum())

        print("\nDuplicate rows:")
        print(df.duplicated().sum())

        print("\nLast 5 rows:")
        print(df.tail(5))

    except Exception as e:
        print("ERROR:", e)

print("\n" + "=" * 60)
print("PORT INSPECTION COMPLETED")
print("=" * 60)