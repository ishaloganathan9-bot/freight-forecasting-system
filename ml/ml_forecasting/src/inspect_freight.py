import pandas as pd
from pathlib import Path

# Project base folder
BASE_DIR = Path(__file__).resolve().parent.parent

# Freight dataset path
FILE_PATH = (
    BASE_DIR
    / "data"
    / "raw"
    / "freight"
    / "SJ102_20260911-162316.xlsx"
)

print("=" * 60)
print("FREIGHT DATASET INSPECTION")
print("=" * 60)

# Check whether file exists
if not FILE_PATH.exists():
    print("\nERROR: Freight dataset not found!")
    print("Expected location:")
    print(FILE_PATH)
    raise FileNotFoundError(FILE_PATH)

print("\nFile found:")
print(FILE_PATH)

# Check Excel sheets
excel_file = pd.ExcelFile(FILE_PATH)

print("\nSheets available:")
print(excel_file.sheet_names)

# Read first sheet without assuming headers
df = pd.read_excel(
    FILE_PATH,
    sheet_name=0,
    header=None
)

print("\n" + "=" * 60)
print("RAW DATA INFORMATION")
print("=" * 60)

print("\nShape:")
print(df.shape)

print("\nFirst 10 rows:")
print(df.head(10))

print("\nData types:")
print(df.dtypes)

print("\nMissing values:")
print(df.isnull().sum())

print("\nDuplicate rows:")
print(df.duplicated().sum())

print("\nNumeric summary:")
print(df.describe(include="all"))

print("\nLast 10 rows:")
print(df.tail(10))

print("\n" + "=" * 60)
print("INSPECTION COMPLETED")
print("=" * 60)