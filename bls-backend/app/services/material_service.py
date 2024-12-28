from app import db
from app.models.material import Material
from marshmallow.exceptions import ValidationError
from app.schemas.material_schema import MaterialSchema
from app.models.time_series_data import TimeSeriesData
from app.utils.date_utils import get_end_of_month_date
import pandas as pd

material_schema = MaterialSchema()

class MaterialService:
    @staticmethod
    def get_all_materials():
        return Material.query.all()

    @staticmethod
    def create_material(data):
        try:
            material = material_schema.load(data, session=db.session)
            db.session.add(material)
            db.session.commit()
            return material
        except ValidationError as e:
            raise ValueError(f"Invalid data: {e}")

    @staticmethod
    def get_material_by_id(material_id):
        return Material.query.get(material_id)

class MaterialDetailedService:
    @staticmethod
    def get_materials_detailed():
        materials = Material.query.all()
        results = []

        for material in materials:
            # Get most recent data points for monthly, quarterly, semi-annual, annual
            time_series_data = (
                TimeSeriesData.query
                .filter_by(material_id=material.id)
                .order_by(TimeSeriesData.year.desc(), TimeSeriesData.month.desc())
                .all()
            )
            if not time_series_data:
                continue

            df = pd.DataFrame([{'year': int(d.year), 'month': int(d.month), 'value': d.value}
                               for d in time_series_data])
            df['date'] = df.apply(lambda x: get_end_of_month_date(int(x['year']), int(x['month'])), axis=1)
            df.sort_values(by='date', ascending=False, inplace=True)

            latest = df.iloc[0]
            monthly_previous = df.iloc[1] if len(df) > 1 else latest
            quarterly_previous = df.iloc[3] if len(df) > 3 else latest
            semi_annual_previous = df.iloc[6] if len(df) > 6 else latest
            annual_previous = df.iloc[11] if len(df) > 11 else latest

            def calc_change(a, b):
                return ((a - b) / b * 100) if b != 0 else 0

            details = {
                "materialId": material.id,
                "materialName": material.name,
                "monthlyChange": calc_change(latest['value'], monthly_previous['value']),
                "quarterlyChange": calc_change(latest['value'], quarterly_previous['value']),
                "semiAnnualChange": calc_change(latest['value'], semi_annual_previous['value']),
                "annualChange": calc_change(latest['value'], annual_previous['value']),
                "lastUpdated": f"{int(latest['year'])}-{int(latest['month'])}"
            }
            results.append(details)
        return results
