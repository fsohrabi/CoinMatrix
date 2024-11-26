from flask import request, jsonify, current_app, Blueprint
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
from src import db
from src.models import Tip
import os

from src.routes.decorators import admin_required

admin_blueprint = Blueprint("admin", __name__, url_prefix="/api/v1/admin")


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


@admin_blueprint.route('/upload_image', methods=['POST'])
@jwt_required()
@admin_required
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return jsonify({'message': 'File uploaded successfully', 'image_url': file_path}), 201
    return jsonify({'error': 'Invalid file type'}), 400


@admin_blueprint.route('/create_tip', methods=['POST'])
def create_tip():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    category = data.get('category')
    image_url = data.get('image_url')  # Get the URL of the uploaded image

    tip = Tip(
        title=title,
        description=description,
        category=category,
        image=image_url,
    )
    db.session.add(tip)
    db.session.commit()

    return jsonify({'message': 'Crypto tip created successfully', 'tip': tip.id}), 201

