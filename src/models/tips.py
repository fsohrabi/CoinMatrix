from datetime import datetime
from src import db


class Tip(db.Model):
    __tablename__ = 'tips'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    image = db.Column(db.String(255), nullable=True)  # Store image URL or path
    is_active = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f'<Tip {self.title}>'
