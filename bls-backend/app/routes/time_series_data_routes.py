import json
from flask import Blueprint, jsonify, request
from app.services.time_series_data_service import TimeSeriesDataService
from app.schemas.time_series_data_schema import TimeSeriesDataSchema
from app.services.material_service import MaterialService

time_series_data_routes = Blueprint('time_series_routes', __name__)

time_series_data_schema = TimeSeriesDataSchema()
time_series_datas_schema = TimeSeriesDataSchema(many=True)

@time_series_data_routes.route('/', methods=['GET'])
def get_time_series_data():
    time_series_data = TimeSeriesDataService.get_all_time_series_data()
    return jsonify(time_series_datas_schema.dump(time_series_data))

@time_series_data_routes.route('/', methods=['POST'])
def create_time_series_data():
    data = request.json
    new_time_series_data = TimeSeriesDataService.create_time_series_data(data)
    return time_series_data_schema.dump(new_time_series_data), 201

@time_series_data_routes.route('/predict/<int:material_id>', methods=['GET'])
def predict_material_data(material_id):
    prediction = MaterialService.predict_material_data(material_id)
    return jsonify(json.loads(prediction))
