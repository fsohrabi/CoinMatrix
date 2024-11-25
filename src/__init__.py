from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .config import config  # Import the config dictionary
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    env = os.getenv('FLASK_ENV')
    if env not in config:
        raise ValueError(f"Invalid FLASK_ENV value: {env}")
    app.config.from_object(config[env])  # Use the config dictionary

    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints here

    return app
