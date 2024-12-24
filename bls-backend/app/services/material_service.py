from app import db
from app.models.material import Material
from marshmallow.exceptions import ValidationError
from app.schemas.material_schema import MaterialSchema
from app.models.time_series_data import TimeSeriesData
from prophet import Prophet
import pandas as pd
import json

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
    def predict_material_data(material_id):
        # Fetch the last 5 years of data for the given material
        data = TimeSeriesData.query.filter_by(material_id=material_id).order_by(TimeSeriesData.year.desc(), TimeSeriesData.month.desc()).limit(60).all()
        
        if not data:
            return json.dumps({"error": "No data found for the given material ID"})

        # Prepare data for Prophet
        df = pd.DataFrame([{'ds': f"{d.year}-{d.month}-01", 'y': d.value} for d in data])
        
        # Initialize and fit the Prophet model
        model = Prophet(growth='linear', interval_width=0.8)
        model.fit(df)
        
        # Create a dataframe for future dates
        future = model.make_future_dataframe(periods=6, freq='M')
        
        # Predict the future values
        forecast = model.predict(future)
        
        # Prepare the output JSON
        existing_data = [{'year': d.year, 'month': d.month, 'value': d.value, 'ispredicted': d.ispredicted} for d in data]
        forecasted_data = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(6).to_dict('records')
        
        for f in forecasted_data:
            f['year'] = pd.to_datetime(f['ds']).year
            f['month'] = pd.to_datetime(f['ds']).month
            f['ispredicted'] = True
            del f['ds']
        
        return json.dumps({"existing_data": existing_data, "forecasted_data": forecasted_data})
