from app import db
from app.models.series import Series
from marshmallow.exceptions import ValidationError
from app.schemas.series_schema import SeriesSchema

series_schema = SeriesSchema()
series_schemas = SeriesSchema(many=True)

class SeriesService:
    @staticmethod
    def get_all_series():
        return Series.query.all()

    @staticmethod
    def create_series(data):
        try:
            series = series_schema.load(data, session=db.session)
            db.session.add(series)
            db.session.commit()
            return series
        except ValidationError as e:
            raise ValueError(f"Invalid data: {e}")

    @staticmethod
    def get_series_by_id(series_id):
        return Series.query.get(series_id)
