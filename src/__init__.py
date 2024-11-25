from flask import Flask
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from passlib.context import CryptContext
from .config import config
import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
jwt = JWTManager()


def create_app():
    """
    Create and configure a Flask application.

    :return: A configured Flask app instance
    :raises ValueError: If FLASK_ENV environment variable is not valid
    """
    app = Flask(__name__)

    # Load environment-specific configuration
    env = os.getenv("FLASK_ENV")
    if env not in config:
        raise ValueError(f"Invalid FLASK_ENV value: {env}")
    app.config.from_object(config[env])

    # Initialize Flask extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Import models to ensure they are registered with SQLAlchemy
    import src.models

    # Register blueprints
    from src.routes.auth import auth_blueprint
    app.register_blueprint(auth_blueprint)

    return app
