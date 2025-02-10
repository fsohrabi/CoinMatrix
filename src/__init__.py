from flask import Flask
from flask_caching import Cache
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from passlib.context import CryptContext
from .config import config
import os
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables from a .env file
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
jwt = JWTManager()

cache = Cache()


def create_app():
    """
    Create and configure a Flask application.

    :return: A configured Flask app instance
    :raises ValueError: If FLASK_ENV environment variable is not valid
    """
    app = Flask(__name__)
    frontend_url = os.environ.get("FRONTEND_URL")
    CORS(app, supports_credentials=True, origins=frontend_url)

    # Load environment-specific configuration
    env = os.getenv("FLASK_ENV")
    if env not in config:
        raise ValueError(f"Invalid FLASK_ENV value: {env}")
    app.config.from_object(config[env])
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    # Initialize Flask extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cache.init_app(app)

    # Import models to ensure they are registered with SQLAlchemy
    import src.models
    with app.app_context():
        db.create_all()
        # Seed roles and admin user
        from src.utils.user_role_utils import seed_admin_user, seed_roles
        seed_roles()
        seed_admin_user()

    # Register blueprints
    from src.routes.auth import auth_blueprint
    app.register_blueprint(auth_blueprint)
    from src.routes.admin import admin_blueprint
    app.register_blueprint(admin_blueprint)
    from src.routes.main import main_blueprint
    app.register_blueprint(main_blueprint)

    return app
