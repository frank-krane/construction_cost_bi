from app import db
from app.models.material import Material
from marshmallow.exceptions import ValidationError
from app.schemas.material_schema import MaterialSchema

material_schema = MaterialSchema()

class MaterialService:
    @staticmethod
    def get_all_materials():
        return Material.query.all()

    @staticmethod
    def create_material(data):
        try:
            material = material_schema.load(data, session=db.session)
            db.session.add(material)
            db.session.commit()
            return material
        except ValidationError as e:
            raise ValueError(f"Invalid data: {e}")

    @staticmethod
    def get_material_by_id(material_id):
        return Material.query.get(material_id)
