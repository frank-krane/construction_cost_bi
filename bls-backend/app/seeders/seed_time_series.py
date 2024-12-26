from app import db
from app.models.material import Material
from app.models.time_series_data import TimeSeriesData
from app.utils.bls_api import fetch_bls_data_in_chunks, find_start_year
from datetime import datetime

def seed_time_series(force_seed=False):
    if not force_seed and TimeSeriesData.query.first():
        print("TimeSeriesData table already has data. Skipping seeding.")
        return

    materials = Material.query.all()
    current_year = datetime.now().year
    for material in materials:
        series_id = material.series_id
        start_year = find_start_year(series_id)
        end_year = current_year
        data = fetch_bls_data_in_chunks(series_id, start_year, end_year)
        
        for entry in data:
            year = int(entry["year"])
            period = entry["period"]
            month = get_month_from_period(period)
            value = float(entry["value"])
            ispredicted = False
            
            time_series_entry = TimeSeriesData.query.filter_by(
                material_id=material.id,
                year=year,
                month=month,
                period=period
            ).first()
            
            if time_series_entry:
                print(f"Updating {material.name} for {year}-{period}: {time_series_entry.value} -> {value}")
                time_series_entry.value = value
            else:
                print(f"Adding new entry for {material.name} for {year}-{period}: {value}")
                time_series_entry = TimeSeriesData(
                    material_id=material.id,
                    year=year,
                    month=month,
                    period=period,
                    value=value,
                    ispredicted=ispredicted
                )
                db.session.add(time_series_entry)
    db.session.commit()

def get_month_from_period(period):
    if period.startswith("M"):
        return int(period[1:])
    elif period.startswith("Q"):
        quarter = int(period[1:])
        return quarter * 3  # Mapping Q1 to M3, Q2 to M6, etc.
    elif period.startswith("S"):
        season = int(period[1:])
        return season * 6  # Mapping S1 to M6, S2 to M12
    else:
        return None

if __name__ == '__main__':
    from app import create_app
    app = create_app()
    with app.app_context():
        seed_time_series()
