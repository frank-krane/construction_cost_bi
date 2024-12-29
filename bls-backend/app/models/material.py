from app import db
from app.enums.material_type import MaterialType

class Material(db.Model):
    __tablename__ = 'materials'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(500))
    type = db.Column(db.Enum(MaterialType), nullable=False)
    series = db.relationship('Series', back_populates='material')




