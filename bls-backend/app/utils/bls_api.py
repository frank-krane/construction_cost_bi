import requests
from app.constants import BLS_API_KEY, BLS_BASE_URL, BLS_START_YEAR
import time
import datetime

def fetch_bls_data(series_id, start_year, end_year, retries=3, delay=1):
    payload = {
        "seriesid": [series_id],
        "startyear": str(start_year),
        "endyear": str(end_year),
        "registrationkey": BLS_API_KEY
    }
    headers = {"Content-Type": "application/json"}
    
    for attempt in range(retries):
        try:
            response = requests.post(BLS_BASE_URL, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            series_data = data.get("Results", {}).get("series", [])
            if not series_data:
                return []
            return series_data[0].get("data", [])
        except requests.exceptions.RequestException as e:
            print(f"Attempt {attempt + 1} failed to fetch data from BLS API: {e}")
            time.sleep(delay)
    return []

def fetch_bls_data_in_chunks(series_id, start_year, end_year):
    all_data = []
    while start_year <= end_year:
        chunk_end_year = min(start_year + 19, end_year)
        data = fetch_bls_data(series_id, start_year, chunk_end_year)
        all_data.extend(data)
        start_year = chunk_end_year + 1
    return all_data

def find_start_year(series_id):
    start_year = BLS_START_YEAR
    end_year = datetime.datetime.now().year
    while start_year <= end_year:
        mid_year = (start_year + end_year) // 2
        data = fetch_bls_data(series_id, mid_year, mid_year)
        if data:
            return mid_year
        else:
            start_year = mid_year + 1
    return start_year
