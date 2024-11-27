from flask import request, jsonify, current_app, Blueprint, url_for
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from werkzeug.utils import secure_filename
from src import db
from src.models import Tip
import os

from src.routes.decorators import admin_required
from src.schemas.tip import TipSchema

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
    if request.content_length > current_app.config['MAX_CONTENT_LENGTH']:
        return jsonify({'error': 'File size exceeds the maximum limit of 5 MB'}), 413
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        image_url = url_for("static", filename=f"uploads/{filename}", _external=True)
        return jsonify({'message': 'File uploaded successfully', 'image_url': image_url}), 201
    return jsonify({'error': 'Invalid file type'}), 400


@admin_blueprint.route('/create_tip', methods=['POST'])
@jwt_required()
@admin_required
def create_tip():
    try:
        identity = get_jwt_identity()
        print(f"Authenticated user: {identity}")
    except Exception as e:
        return jsonify({'error': 'Authentication failed', 'details': str(e)}), 422

    # Parse request data
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON or missing payload'}), 400

    # Validate input using Marshmallow
    schema = TipSchema()
    try:
        validated_data = schema.load(data)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    # Create and save the Tip
    try:
        tip = Tip(
            title=validated_data['title'],
            description=validated_data['description'],
            category=validated_data['category'],
            image=validated_data['image_url'],
            is_active=validated_data.get('is_active', True),
        )
        db.session.add(tip)
        db.session.commit()
    except Exception as db_err:
        db.session.rollback()
        return jsonify({'error': 'Failed to save tip', 'details': str(db_err)}), 500

    return jsonify({'message': 'Crypto tip created successfully', 'tip': tip.id}), 201


@admin_blueprint.route('/edit_tip/<int:tip_id>', methods=['PUT'])
@jwt_required()
@admin_required
def edit_tip(tip_id):
    tip = Tip.query.get_or_404(tip_id)
    data = request.get_json()

    # Validate input using Marshmallow
    schema = TipSchema(partial=True)
    try:
        validated_data = schema.load(data)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    # Apply updates
    for key, value in validated_data.items():
        setattr(tip, key, value)

    db.session.commit()
    return jsonify({'message': 'Crypto tip updated successfully', 'tip': tip.id}), 200


@admin_blueprint.route('/delete_tip/<int:tip_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_tip(tip_id):
    tip = Tip.query.get_or_404(tip_id)
    db.session.delete(tip)
    db.session.commit()
    return jsonify({'message': 'Crypto tip deleted successfully'}), 200
