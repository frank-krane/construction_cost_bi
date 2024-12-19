from flask import Blueprint, jsonify, request
from app.services.test_service import TestService
from app.schemas.test_schema import TestSchema

test_routes = Blueprint('test_routes', __name__)

test_schema = TestSchema()
tests_schema = TestSchema(many=True)

@test_routes.route('/', methods=['GET'])
def get_tests():
    tests = TestService.get_all_tests()
    return jsonify(tests_schema.dump(tests))

@test_routes.route('/', methods=['POST'])
def create_test():
    data = request.json
    new_test = TestService.create_test(data)
    return test_schema.dump(new_test), 201
