
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.time_series_data import TimeSeriesData

class TimeSeriesDataSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = TimeSeriesData
        load_instance = True