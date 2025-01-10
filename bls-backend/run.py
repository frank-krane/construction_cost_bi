from app import create_app, db
from flask_migrate import upgrade
import os

app = create_app()

def handle_database_creation_and_seeding():
    if not os.path.exists('instance/app.db'):
        print("Database not found. Creating a new database...")
        with app.app_context():
            db.create_all()
            print("Database created successfully.")
    else:
        print("Database exists!")

    with app.app_context():
        print("Applying migrations...")
        upgrade()
        print("Migrations applied successfully.")

        # Run the seeders after the database is confirmed to exist
        from app.seeders.seed_regions import seed_regions
        from app.seeders.seed_materials import seed_materials
        from app.seeders.seed_time_series import seed_time_series

        print("Running seeders...")
        seed_regions()
        seed_materials()
        seed_time_series()
        print("Seeders completed.")

if __name__ == '__main__':
    handle_database_creation_and_seeding()
    app.run(debug=True)
