from flask import Blueprint, jsonify, request
from app.services.region_service import RegionService
from app.schemas.region_schema import RegionSchema

region_routes = Blueprint('region_routes', __name__)

region_schema = RegionSchema()
regions_schema = RegionSchema(many=True)

@region_routes.route('/', methods=['GET'])
def get_regions():
    regions = RegionService.get_all_regions()
    return jsonify(regions_schema.dump(regions))

@region_routes.route('/', methods=['POST'])
def create_region():
    data = request.json
    new_region = RegionService.create_region(data)
    return region_schema.dump(new_region), 201
