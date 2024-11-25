# **CoinMatrix**

This repository contains the backend service for a Coin360-like application, built with Flask, SQLAlchemy, Alembic, and PostgreSQL. The API supports CRUD operations, user watchlists, and integration with cryptocurrency data sources.

---
### Installation

1. **Clone the repository:**
   ```bash
   git clone <https://github.com/fsohrabi/CoinMatrix.git>
   cd <CoinMatrix>
   
2. **Create and Activate a Virtual Environment:**
   ```bash
  python -m venv .venv
   source .venv/bin/activate  # On Linux/Mac
   .\.venv\Scripts\activate   # On Windows


3. **Install the required packages:**
    ```bash
   pip install -r requirements.txt

4. **Set up environment variables:** Create a file named .env in the root directory of the project with the following content:
   ```
   FLASK_ENV=
   DEV_DATABASE_URL=
   SECRET_KEY=
   DATABASE_URL=
   TEST_DATABASE_URL=
 
### Database Migration

If you clone this repository and do not have existing migrations, you can initialize the database with the following steps:
1. **Create migrations:**
   ```bash
   flask db init

2. **Create the migration files:**
   ```bash
   flask db migrate -m "Initial migration"
   
3. **apply the migrations to the database:**
   ```bash
   flask db upgrade

### Admin Setup
An admin user is automatically created during the application startup if the required admin details are present in the .env file. Ensure the following environment variables are set in your .env file:

```
ADMIN_EMAIL=<admin_email@example.com>    # Email for the admin account
ADMIN_NAME=<admin_name>                  # Name for the admin account
ADMIN_PASSWORD=<admin_password>          # Strong password for the admin account
```
### Usage
To run the application, use:
   ```bash
   flask run

