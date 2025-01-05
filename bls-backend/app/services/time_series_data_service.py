from app import db
from app.models.time_series_data import TimeSeriesData
from marshmallow.exceptions import ValidationError
from app.schemas.time_series_data_schema import TimeSeriesDataSchema
import json

# Initialize the schema instance
time_series_data_schema = TimeSeriesDataSchema()

class TimeSeriesDataService:
    @staticmethod
    def detect_frequency(data_points):
        """
        Detect the frequency by looking at the gap (in months) between consecutive data points.
        :param data_points: A list of TimeSeriesData objects sorted by date (ascending).
        :return: 'monthly', 'quarterly', 'semi-annual', or 'annual' (string) if detected, otherwise None.
        """
        if len(data_points) < 2:
            return None  # Not enough data to guess frequency

        # Calculate month differences
        month_gaps = []
        for i in range(1, len(data_points)):
            prev = data_points[i - 1]
            curr = data_points[i]
            # Convert year/month to a single integer index, e.g. year * 12 + month
            prev_index = prev.year * 12 + (prev.month or 1)
            curr_index = curr.year * 12 + (curr.month or 1)
            gap = curr_index - prev_index
            month_gaps.append(gap)

        # Get a dominant gap (most frequent difference)
        dominant_gap = max(set(month_gaps), key=month_gaps.count)

        if dominant_gap == 1:
            return 'monthly'
        elif dominant_gap == 3:
            return 'quarterly'
        elif dominant_gap == 6:
            return 'semi-annual'
        elif dominant_gap == 12:
            return 'annual'
        else:
            return None  # Handle irregular intervals

    @staticmethod
    def get_periods_for_duration(frequency, duration):
        """
        Return the number of data points to pull given the frequency and a duration (1Y, 5Y, 10Y, Max).
        """
        freq_to_points_per_year = {
            'monthly': 12,
            'quarterly': 4,
            'semi-annual': 2,
            'annual': 1
        }
        points_per_year = freq_to_points_per_year.get(frequency, 12)  # Default to monthly if unknown

        years_map = {
            '1Y': 1,
            '5Y': 5,
            '10Y': 10,
            'Max': None  # Return None for Max
        }

        return None if duration == 'Max' else points_per_year * years_map.get(duration, 5)

    @staticmethod
    def predict_series_data(series_ids, duration='5Y', include_forecast=True):
        results = {}

        for series_id in series_ids:
            # Retrieve and sort existing data (non-predicted) in ASC order
            all_existing_data = (TimeSeriesData.query
                                 .filter_by(series_id=series_id, ispredicted=False)
                                 .order_by(TimeSeriesData.year.asc(), TimeSeriesData.month.asc()))
            all_existing_data = all_existing_data.all()

            if not all_existing_data:
                results[series_id] = {"error": "No data found for the given series ID"}
                continue

            # Detect frequency
            frequency = TimeSeriesDataService.detect_frequency(all_existing_data)
            if not frequency:
                frequency = 'monthly'  # Fallback if detection fails

            # Determine how many periods to return
            periods_to_return = TimeSeriesDataService.get_periods_for_duration(frequency, duration)

            # Fetch the recent data in descending order
            recent_data_query = (TimeSeriesData.query
                                 .filter_by(series_id=series_id, ispredicted=False)
                                 .order_by(TimeSeriesData.year.desc(), TimeSeriesData.month.desc()))

            # Apply limit ONLY if periods_to_return is not None
            if periods_to_return is not None:
                recent_data_query = recent_data_query.limit(periods_to_return)

            recent_data = recent_data_query.all()

            existing_data_serialized = [
                {
                    'year': d.year,
                    'month': d.month,
                    'value': d.value,
                    'ispredicted': d.ispredicted
                }
                for d in recent_data
            ]

            if not include_forecast:
                results[series_id] = {"existing_data": existing_data_serialized}
                continue

            # Fetch forecasted data (predicted=True)
            forecasted_data_query = (TimeSeriesData.query
                                     .filter_by(series_id=series_id, ispredicted=True)
                                     .order_by(TimeSeriesData.year.asc(), TimeSeriesData.month.asc()))
            forecasted_data = forecasted_data_query.all()

            forecasted_data_serialized = [
                {
                    'year': d.year,
                    'month': d.month,
                    'yhat': d.value,
                    'yhat_lower': d.yhat_lower,
                    'yhat_upper': d.yhat_upper,
                    'ispredicted': d.ispredicted
                }
                for d in forecasted_data
            ]

            results[series_id] = {
                "existing_data": existing_data_serialized,
                "forecasted_data": forecasted_data_serialized
            }

        return json.dumps(results)
