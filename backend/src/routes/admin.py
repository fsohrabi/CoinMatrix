from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from sqlalchemy.exc import NoResultFound

from src import db
from src.models import Tip
from src.utils.decorators import admin_required
from src.schemas.tip import TipSchema
from src.utils.handle_image_upload import handle_image_upload

admin_blueprint = Blueprint("admin", __name__, url_prefix="/api/v1/admin")


@admin_blueprint.route('/tips', methods=['GET'])
@jwt_required()
@admin_required
def tips():
    """
    Endpoint to fetch paginated tips for admin.
    """
    try:
        get_jwt_identity()
    except Exception as e:
        return jsonify({'error': 'Authentication failed', 'details': str(e)}), 422
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        pagination = Tip.query.paginate(page=page, per_page=limit, error_out=False)

        tips_data = pagination.items

        # Prepare the response with pagination metadata
        return jsonify({
            "page": pagination.page,
            "total_pages": pagination.pages,
            "total_items": pagination.total,
            "limit": limit,
            "data": [
                {
                    "id": tip.id,
                    "title": tip.title,
                    "description": tip.description,
                    "created_at": tip.created_at.isoformat(),
                    "updated_at": tip.updated_at.isoformat(),
                    "image": tip.image,
                    "category": tip.category,
                    "is_active": tip.is_active
                }
                for tip in tips_data
            ]
        }), 200

    except NoResultFound:
        return jsonify({"error": "No tips found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin_blueprint.route('/create_tip', methods=['POST'])
@jwt_required()
@admin_required
def create_tip():
    try:
        get_jwt_identity()
    except Exception as e:
        return jsonify({'error': 'Authentication failed', 'details': str(e)}), 422

    # Handle image upload
    image = None
    if 'image' in request.files and request.files['image'].filename != '':
        image_file = request.files['image']
        image, error_message = handle_image_upload(image_file)
        if error_message:
            return jsonify({'error': 'Image upload failed', 'details': error_message}), 500
    else:
        return jsonify({'error': 'Image is required.'}), 400  # Ensure image is always provided

    data = {
        'title': request.form.get('title'),
        'description': request.form.get('description'),
        'category': request.form.get('category'),
        'is_active': request.form.get('is_active'),
        'image': image,  # Use the uploaded image URL/path
    }

    schema = TipSchema()
    try:
        validated_data = schema.load(data)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    try:
        tip = Tip(**validated_data)
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
    try:
        get_jwt_identity()
    except Exception as e:
        return jsonify({'error': 'Authentication failed', 'details': str(e)}), 422

    tip = Tip.query.get_or_404(tip_id)

    data = request.form.to_dict()

    # Handle image upload
    if 'image' in request.files and request.files['image'].filename != '':
        image_file = request.files['image']
        image, error_message = handle_image_upload(image_file)
        if error_message:
            return jsonify({'error': 'Image upload failed', 'details': error_message}), 500
        data['image'] = image
    else:
        data['image'] = tip.image  # Keep existing image if no new one is provided

    # Ensure an image is always present
    if not data.get('image'):
        return jsonify({'error': 'Image is required.'}), 400

    # Validate input
    schema = TipSchema(partial=True)
    try:
        validated_data = schema.load(data)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

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
