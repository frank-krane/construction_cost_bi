from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.material import Material

class MaterialSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Material
        load_instance = True
