from app import db
from app.models.material import Material
from app.models.region import Region
from app.models.series import Series

def seed_materials():
    if Material.query.first():
        print("Material table already has data. Skipping seeding.")
        return

    materials = [
        ('Aluminum', 'WPU102302'),
        ('Asphalt', 'WPU058'),
        ('Commercial and Institutional Type Electric Lighting Fixture', 'WPU108303'),
        ('Concrete Brick', 'WPU133131'),
        ('Construction Machinery', 'WPU112'),
        ('Copper Wire', 'WPU10230101'),
        ('Elevator, Escalator and other Lifts', 'WPU1142'),
        ('Glass', 'WPU131'),
        ('Gypsum', 'WPU137'),
        ('HVAC and Commercial Refregeration', 'WPU1148'),
        ('Insulation', 'WPU1392'),
        ('Lumber and Plywood', 'WPU084'),
        ('Paint and Coating', 'WPU0623'),
        ('Plumbing', 'WPS105402'),
        ('Semi-conductor/Electronics', 'WPU11785602'),
        ('Steel Beam', 'WPU10170810'),
        ('Steel Gates', 'WPU10740813'),
        ('Steel Joist', 'WPU10740510'),
        ('Switchgear, Switchboard, Industrial Controls and Equipment', 'WPU1175'),
        ('Manufacturing and Labor Cost', 'CIU2013000000000I'),
        ('Crude Oil Import', 'EIUIR10000'),
        ('Transportation', 'WPU301'),
        ('Warehousing', 'WPU32')
    ]

    for material_name, series_id in materials:
        if not Material.query.filter_by(series_id=series_id).first():
            material = Material(name=material_name, series_id=series_id)
            db.session.add(material)
            region = Region.query.filter_by(name='National').first()
            series = Series(series_id=series_id, material_id=material.id, region_id=region.id)
            db.session.add(series)

    # Handle Electricity material with multiple locations
    electricity_material = Material(name='Electricity', series_id='CUUS0400SEHF01')
    db.session.add(electricity_material)
    db.session.commit()

    electricity_series = [
        ('CUUS0400SEHF01', 'West'),
        ('CUUS0200SEHF01', 'Midwest'),
        ('CUUS0300SEHF01', 'South'),
        ('CUUS0100SEHF01', 'Northeast')
    ]

    for series_id, region_name in electricity_series:
        region = Region.query.filter_by(name=region_name).first()
        series = Series(series_id=series_id, material_id=electricity_material.id, region_id=region.id)
        db.session.add(series)

    db.session.commit()

if __name__ == '__main__':
    from app import create_app
    app = create_app()
    with app.app_context():
        seed_materials()
