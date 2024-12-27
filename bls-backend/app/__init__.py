from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_apscheduler import APScheduler
from flask_cors import CORS
from dotenv import load_dotenv

db = SQLAlchemy()
migrate = Migrate()
scheduler = APScheduler()

from app.seeders.seed_regions import seed_regions
from app.seeders.seed_materials import seed_materials
from app.seeders.seed_time_series import seed_time_series

class Config:
    SCHEDULER_API_ENABLED = True

load_dotenv()

def create_app():
    app = Flask(__name__)

    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
    
    app.config.from_object(Config())
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)
    scheduler.init_app(app)

    @scheduler.task('cron', id='seed_time_series_job', day=1, misfire_grace_time=900)
    def seed_time_series_job():
        with scheduler.app.app_context():
            print("Seeding time series data.")
            seed_time_series(force_seed=True)

    scheduler.start()

    from app.routes import api
    app.register_blueprint(api, url_prefix='/api')

    with app.app_context():
        seed_regions()
        seed_materials()
        seed_time_series()

    return app
