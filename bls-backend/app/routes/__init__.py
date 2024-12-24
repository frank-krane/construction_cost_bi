from flask import Blueprint
from app.routes.test_routes import test_routes
from app.routes.time_series_data_routes import time_series_data_routes
from app.routes.region_routes import region_routes
from app.routes.material_routes import material_routes

api = Blueprint('api', __name__)

# register individual route blueprints
api.register_blueprint(test_routes, url_prefix='/tests')
api.register_blueprint(time_series_data_routes, url_prefix='/time_series')
api.register_blueprint(region_routes, url_prefix='/regions')
api.register_blueprint(material_routes, url_prefix='/materials')

