from app import db

class Series(db.Model):
    __tablename__ = 'series'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    series_id = db.Column(db.String(500), unique=True)
    material_id = db.Column(db.Integer, db.ForeignKey('materials.id'))
    region_id = db.Column(db.Integer, db.ForeignKey('regions.id'))
    material = db.relationship('Material', back_populates='series')
    region = db.relationship('Region', back_populates='series')
    time_series_data = db.relationship('TimeSeriesData', back_populates='series')
