from marshmallow import Schema, fields
from app.models.material import Material

class MaterialSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
