from app import db

class TimeSeriesData(db.Model):
    __tablename__ = 'time_series_data'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    series_id = db.Column(db.Integer, db.ForeignKey('series.id'))
    year = db.Column(db.Integer)
    month = db.Column(db.Integer)
    period = db.Column(db.String(500))
    value = db.Column(db.Float)
    ispredicted = db.Column(db.Boolean)
    series = db.relationship('Series', back_populates='time_series_data')
