from flask import Blueprint, jsonify, request
import requests
from app.services.test_service import TestService
from app.schemas.test_schema import TestSchema

test_routes = Blueprint('test_routes', __name__)

test_schema = TestSchema()
tests_schema = TestSchema(many=True)

BLS_API_KEY = "_REMOVED"
BLS_BASE_URL = "https://api.bls.gov/publicAPI/v2/timeseries/data/"

@test_routes.route('/', methods=['GET'])
def get_tests():
    tests = TestService.get_all_tests()
    return jsonify(tests_schema.dump(tests))

@test_routes.route('/', methods=['POST'])
def create_test():
    data = request.json
    new_test = TestService.create_test(data)
    return test_schema.dump(new_test), 201

@test_routes.route('/fetch-bls-data', methods=['GET'])
def fetch_bls_data():
    """Fetch data from the BLS API for series ID: WPU102302"""
    series_id = "WPU102302"
    payload = {
        "seriesid": [series_id],
        "startyear": "1980",  
        "endyear": "2025",    
        "registrationkey": BLS_API_KEY
    }
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(BLS_BASE_URL, json=payload, headers=headers)
        response.raise_for_status()  
        data = response.json()
        
        if "Results" in data:
            return jsonify(data["Results"]), 200
        else:
            return jsonify({"error": "No results found", "details": data}), 400
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to fetch data from BLS API", "details": str(e)}), 500
