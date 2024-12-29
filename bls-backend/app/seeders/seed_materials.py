from app import db
from app.models.material import Material
from app.models.region import Region
from app.models.series import Series
from app.enums.material_type import MaterialType

def seed_materials():
    if Material.query.first():
        print("Material table already has data. Skipping seeding.")
        return

    materials = [
        ('Aluminum', 'WPU102302', MaterialType.MATERIAL),
        ('Asphalt', 'WPU058', MaterialType.MATERIAL),
        ('Commercial and Institutional Type Electric Lighting Fixture', 'WPU108303', MaterialType.MATERIAL),
        ('Concrete Brick', 'WPU133131', MaterialType.MATERIAL),
        ('Construction Machinery', 'WPU112', MaterialType.MATERIAL),
        ('Copper Wire', 'WPU10230101', MaterialType.MATERIAL),
        ('Elevator, Escalator and other Lifts', 'WPU1142', MaterialType.MATERIAL),
        ('Glass', 'WPU131', MaterialType.MATERIAL),
        ('Gypsum', 'WPU137', MaterialType.MATERIAL),
        ('HVAC and Commercial Refregeration', 'WPU1148', MaterialType.MATERIAL),
        ('Insulation', 'WPU1392', MaterialType.MATERIAL),
        ('Lumber and Plywood', 'WPU084', MaterialType.MATERIAL),
        ('Paint and Coating', 'WPU0623', MaterialType.MATERIAL),
        ('Plumbing', 'WPS105402', MaterialType.MATERIAL),
        ('Semi-conductor/Electronics', 'WPU11785602', MaterialType.MATERIAL),
        ('Steel Beam', 'WPU10170810', MaterialType.MATERIAL),
        ('Steel Gates', 'WPU10740813', MaterialType.MATERIAL),
        ('Steel Joist', 'WPU10740510', MaterialType.MATERIAL),
        ('Switchgear, Switchboard, Industrial Controls and Equipment', 'WPU1175', MaterialType.MATERIAL),
        ('Manufacturing and Labor Cost', 'CIU2013000000000I', MaterialType.MANUFACTURING_LABOR_COST),
        ('Crude Oil Import', 'EIUIR10000', MaterialType.ENERGY_AND_FREIGHT),
        ('Transportation', 'WPU301', MaterialType.ENERGY_AND_FREIGHT),
        ('Warehousing', 'WPU32', MaterialType.ENERGY_AND_FREIGHT)
    ]

    for material_name, series_id, material_type in materials:
        if not Material.query.filter_by(name=material_name).first():
            material = Material(name=material_name, type=material_type)
            db.session.add(material)
            db.session.commit()
            region = Region.query.filter_by(name='National').first()
            series = Series(series_id=series_id, material_id=material.id, region_id=region.id)
            db.session.add(series)

    # Handle Electricity material with multiple locations
    electricity_material = Material(name='Electricity', type=MaterialType.ENERGY_AND_FREIGHT)
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
