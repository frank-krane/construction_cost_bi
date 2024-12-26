import pandas as pd

def get_end_of_month_date(year, month):
    return pd.Timestamp(year=year, month=month, day=1) + pd.offsets.MonthEnd(1)
