from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_sqlalchemy.fields import Nested
from app.models.series import Series
from app.schemas.material_schema import MaterialSchema
from app.schemas.region_schema import RegionSchema

class SeriesSchema(SQLAlchemyAutoSchema):
    material = Nested(MaterialSchema)
    region = Nested(RegionSchema)

    class Meta:
        model = Series
        load_instance = True
        include_relationships = True
