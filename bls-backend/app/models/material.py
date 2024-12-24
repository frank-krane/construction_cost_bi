from app import db

class Material(db.Model):
    __tablename__ = 'materials'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(500))
    series_id = db.Column(db.String(500), unique=True)
    region_id = db.Column(db.Integer, db.ForeignKey('regions.id'))
    region = db.relationship('Region', back_populates='materials')
    time_series_data = db.relationship('TimeSeriesData', back_populates='material')




