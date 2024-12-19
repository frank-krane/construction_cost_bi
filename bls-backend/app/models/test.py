from app import db

class Test(db.Model):
    __tablename__ = 'test'
    id = db.Column(db.Integer, primary_key=True)
    test1 = db.Column(db.String)
    test2 = db.Column(db.String)
