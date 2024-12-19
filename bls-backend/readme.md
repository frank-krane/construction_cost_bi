# Flask Backend Project

This is a Flask-based backend for estimation of material costs from the Bureu of Labour Statistics.

---

## Project Structure

```
my-backend-app/
├── app/
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── user.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── user_schema.py
│   ├── routes/
│   │   ├── __init__.py
│   │   └── user_routes.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── user_service.py
├── migrations/          # will be created on first run
├── instance/            # will be created on first run
│   └── app.db
├── run.py
├── requirements.txt
└── .gitignore
```

---

## Prerequisites

- Python 3.8 or later
- SQLite (included with Python)
- Virtual environment tools (`venv`)

---

## Setup Instructions

Follow these steps to set up the project:

### 1. Clone the Repository

```bash
git clone git@github.com:frank-krane/construction_cost_bi.git
cd bls-backend
```

### 2. Create and Activate a Virtual Environment

```bash
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up the Database

- The database file will be stored in `instance/app.db` (ignored by Git, initialized in first run).
- Initialize and apply migrations:

```bash
flask db init
flask db migrate -m "Initial migration."
flask db upgrade
```

### 5. Run the Application

```bash
python run.py
```

The application will be accessible at `http://127.0.0.1:5000`.

---

## Development Notes

- **Database Migrations**:
  - Create a new migration after making model changes:
    ```bash
    flask db migrate -m "Describe the change"
    ```
  - Apply migrations:
    ```bash
    flask db upgrade
    ```

---
