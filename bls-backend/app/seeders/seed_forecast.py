
from prophet import Prophet
import pandas as pd
from app import db
from app.models.time_series_data import TimeSeriesData
from app.utils.date_utils import get_end_of_month_date

def seed_forecast():
    # 1. Fetch all distinct series_ids
    series_ids = db.session.query(TimeSeriesData.series_id).distinct().all()
    # 2. For each series, build Prophet model & store forecast rows in DB
    for (sid,) in series_ids:
        # ...existing code for fetching data...
        data = TimeSeriesData.query.filter_by(series_id=sid, ispredicted=False).all()
        df = pd.DataFrame([{'ds': get_end_of_month_date(d.year, d.month), 'y': d.value} for d in data])
        if df.empty:
            continue
        model = Prophet()
        model.fit(df)
        future = model.make_future_dataframe(periods=6, freq='M')
        forecast = model.predict(future)
        for row in forecast.tail(6).itertuples():
            # ...existing code to handle saving...
            new_entry = TimeSeriesData(
                series_id=sid,
                year=row.ds.year,
                month=row.ds.month,
                value=row.yhat,
                yhat_lower=row.yhat_lower,
                yhat_upper=row.yhat_upper,
                ispredicted=True
            )
            db.session.add(new_entry)
    db.session.commit()