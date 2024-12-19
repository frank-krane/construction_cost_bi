from app import create_app, db
from flask_migrate import upgrade
import os

app = create_app()

def handle_database_creation():
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

if __name__ == '__main__':
    handle_database_creation()
    app.run(debug=True)
