from app import db
from app.models.region import Region
from marshmallow.exceptions import ValidationError
from app.schemas.region_schema import RegionSchema

region_schema = RegionSchema()

class RegionService:
    @staticmethod
    def get_all_regions():
        return Region.query.all()

    @staticmethod
    def create_region(data):
        try:
            region = region_schema.load(data, session=db.session)
            db.session.add(region)
            db.session.commit()
            return region
        except ValidationError as e:
            raise ValueError(f"Invalid data: {e}")
