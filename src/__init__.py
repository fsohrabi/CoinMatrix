from flask import Flask
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from passlib.context import CryptContext
from .config import config
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
pwd_context = CryptContext(schemes=['pbkdf2_sha256'], deprecated='auto')
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    env = os.getenv('FLASK_ENV')
    if env not in config:
        raise ValueError(f"Invalid FLASK_ENV value: {env}")
    app.config.from_object(config[env])  # Use the config dictionary

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    import src.models

    # Register blueprints here
    from src.routes.auth import auth_blueprint
    app.register_blueprint(auth_blueprint)

    return app
