from src.models import *
from src import pwd_context
from src import db
import os
from dotenv import load_dotenv
load_dotenv()


def assign_role_to_user(user, role_slug):
    """
    Assign a role to a user.
    :param user: User object
    :param role_slug: Role slug to assign
    """
    role = Role.query.filter_by(slug=role_slug).first()
    if not role:
        raise ValueError(f"Role '{role_slug}' does not exist.")
    user.roles.append(role)
    db.session.commit()


def seed_admin_user():
    """Seed an admin user using environment variables."""
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_name = os.getenv("ADMIN_NAME")
    admin_password = os.getenv("ADMIN_PASSWORD")

    if not (admin_email and admin_name and admin_password):
        raise ValueError("Admin details are missing in environment variables.")

    # Check if admin user already exists
    admin_user = User.query.filter_by(email=admin_email).first()
    if admin_user:
        print(f"Admin user with email {admin_email} already exists.")
        return

    # Create admin user
    admin_user = User(
        name=admin_name,
        email=admin_email,
        password=admin_password
    )
    db.session.add(admin_user)
    db.session.commit()

    # Assign admin role
    assign_role_to_user(admin_user, "admin")
    print("Admin user created successfully!")


def seed_roles():
    """Seed default roles into the database."""
    from src.models.users import Role
    from src import db
    roles = ["admin", "user"]
    for role in roles:
        if not Role.query.filter_by(slug=role).first():
            db.session.add(Role(name=role.capitalize(), slug=role))
    db.session.commit()
