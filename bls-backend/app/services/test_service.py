from app import db
from app.models.test import Test
from marshmallow.exceptions import ValidationError
from app.schemas.test_schema import TestSchema

test_schema = TestSchema()

class TestService:
    @staticmethod
    def get_all_tests():
        return Test.query.all()

    @staticmethod
    def create_test(data):
        try:
            test = test_schema.load(data, session=db.session)
            db.session.add(test)
            db.session.commit()
            return test
        except ValidationError as e:
            raise ValueError(f"Invalid data: {e}")
