from flask import Blueprint, jsonify, request, Response
from app.services.material_service import MaterialService
from app.schemas.material_schema import MaterialSchema

material_routes = Blueprint('material_routes', __name__)

material_schema = MaterialSchema()
materials_schema = MaterialSchema(many=True)

@material_routes.route('/', methods=['GET'])
def get_materials():
    materials = MaterialService.get_all_materials()
    return jsonify(materials_schema.dump(materials))

@material_routes.route('/', methods=['POST'])
def create_material():
    data = request.json
    new_material = MaterialService.create_material(data)
    return material_schema.dump(new_material), 201

@material_routes.route('/<int:material_id>', methods=['GET'])
def get_material(material_id):
    material = MaterialService.get_material_by_id(material_id)
    return material_schema.dump(material)

@material_routes.route('/details', methods=['GET'])
def get_materials_detailed():
    data = MaterialService.get_materials_detailed()
    return jsonify(data)

@material_routes.route('/download-json', methods=['GET'])
def download_material_json():
    data = MaterialService.export_materials_json()
    return Response(
        data,
        mimetype='application/json',
        headers={'Content-Disposition': 'attachment;filename=dump.json'}
    )
