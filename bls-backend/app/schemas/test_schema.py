from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.test import Test

class TestSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Test
        load_instance = True
