from flask import Blueprint
from app.routes.test_routes import test_routes

api = Blueprint('api', __name__)

# register individual route blueprints
api.register_blueprint(test_routes, url_prefix='/tests')
