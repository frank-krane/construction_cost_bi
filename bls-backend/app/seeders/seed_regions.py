from app import db
from app.models.region import Region

def seed_regions():
    if Region.query.first():
        print("Region table already has data. Skipping seeding.")
        return

    regions = ['West', 'Midwest', 'South', 'Northeast']
    for region_name in regions:
        if not Region.query.filter_by(name=region_name).first():
            region = Region(name=region_name)
            db.session.add(region)
    db.session.commit()

if __name__ == '__main__':
    from app import create_app
    app = create_app()
    with app.app_context():
        seed_regions()
