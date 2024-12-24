from app import db
from app.models.time_series_data import TimeSeriesData
from marshmallow.exceptions import ValidationError
from app.schemas.time_series_data_schema import TimeSeriesDataSchema

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
