from sqlalchemy.ext.hybrid import hybrid_property

from src import db, pwd_context


class User(db.Model):
    """Model representing a user."""
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password = db.Column('password', db.String(255), nullable=False)
    roles = db.relationship("Role", secondary="user_roles", back_populates="users")
    watchlist = db.relationship('Watchlist', foreign_keys='Watchlist.user_id', back_populates='user', cascade='all, delete-orphan')

    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def password(self, value):
        self._password = pwd_context.hash(value)

    def has_role(self, role):
        return bool(
            Role.query
            .join(Role.users)
            .filter(User.id == self.id)
            .filter(Role.slug == role)
            .count() == 1
        )


class Role(db.Model):
    __tablename__ = "roles"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(36), nullable=False)
    slug = db.Column(db.String(36), nullable=False, unique=True)
    users = db.relationship("User", secondary="user_roles", back_populates="roles")


class UserRole(db.Model):
    __tablename__ = "user_roles"
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey("roles.id"), primary_key=True)


class Watchlist(db.Model):
    __tablename__ = 'watchlist'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    coin_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', foreign_keys=[user_id], back_populates='watchlist')
