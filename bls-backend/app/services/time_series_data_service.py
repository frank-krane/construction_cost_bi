from app import db
from app.models.time_series_data import TimeSeriesData
from marshmallow.exceptions import ValidationError
from app.schemas.time_series_data_schema import TimeSeriesDataSchema
from prophet import Prophet
import pandas as pd
import json
from app.utils.date_utils import get_end_of_month_date

time_series_data_schema = TimeSeriesDataSchema()

class TimeSeriesDataService:
    @staticmethod
    def get_all_time_series_data():
        return TimeSeriesData.query.all()

    @staticmethod
    def create_time_series_data(data):
        try:
            time_series_data = time_series_data_schema.load(data, session=db.session)
            db.session.add(time_series_data)
            db.session.commit()
            return time_series_data
        except ValidationError as e:
            raise ValueError(f"Invalid data: {e}")

    @staticmethod
    def predict_material_data(material_id, duration='5Y', include_forecast=True):
        # Fetch the data for the given material
        query = TimeSeriesData.query.filter_by(material_id=material_id).order_by(TimeSeriesData.year.desc(), TimeSeriesData.month.desc())
        data = query.all()
        
        if not data:
            return json.dumps({"error": "No data found for the given material ID"})

        # Prepare data for Prophet
        df = pd.DataFrame([{'ds': get_end_of_month_date(d.year, d.month), 'y': d.value} for d in data])
        
        # Determine if the data is monthly, quarterly, or semi-annual
        months = df['ds'].dt.month.unique()
        is_quarterly = set(months) == {3, 6, 9, 12}
        is_semi_annual = set(months) == {6, 12}
        
        # Adjust the number of data points for training based on the frequency
        if is_semi_annual:
            periods_to_train = 10  # 5 years of semi-annual data
            periods_to_return = 2 if duration == '1Y' else 10 if duration == '5Y' else 20 if duration == '10Y' else None
        elif is_quarterly:
            periods_to_train = 20  # 5 years of quarterly data
            periods_to_return = 4 if duration == '1Y' else 20 if duration == '5Y' else 40 if duration == '10Y' else None
        else:
            periods_to_train = 60  # 5 years of monthly data
            periods_to_return = 12 if duration == '1Y' else 60 if duration == '5Y' else 120 if duration == '10Y' else None

        # Fetch the last 5 years of data for prediction
        prediction_data = query.limit(periods_to_train).all()
        
        if not prediction_data:
            return json.dumps({"error": "No data found for the given material ID"})

        # Prepare data for Prophet
        df = pd.DataFrame([{'ds': get_end_of_month_date(d.year, d.month), 'y': d.value} for d in prediction_data])
        
        # Fetch the data for the given material based on the specified duration
        if periods_to_return:
            data = query.limit(periods_to_return).all()
        else:
            data = query.all()
        
        existing_data = [{'year': d.year, 'month': d.month, 'value': d.value, 'ispredicted': d.ispredicted} for d in data]
        
        if not include_forecast:
            return json.dumps({"existing_data": existing_data})

        # Initialize and fit the Prophet model
        model = Prophet(growth='linear', interval_width=0.8)
        model.fit(df)
        
        # Create a dataframe for future dates
        if is_semi_annual:
            future = model.make_future_dataframe(periods=1, freq='6M')
        elif is_quarterly:
            future = model.make_future_dataframe(periods=2, freq='QE')
        else:
            future = model.make_future_dataframe(periods=6, freq='ME')
        
        # Predict the future values
        forecast = model.predict(future)
        
        # Prepare the output JSON
        forecasted_data = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(1 if is_semi_annual else 2 if is_quarterly else 6).to_dict('records')
        
        for f in forecasted_data:
            f['year'] = pd.to_datetime(f['ds']).year
            f['month'] = pd.to_datetime(f['ds']).month
            f['ispredicted'] = True
            del f['ds']
        
        return json.dumps({"existing_data": existing_data, "forecasted_data": forecasted_data})
