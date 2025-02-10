import os
import uuid
from PIL import Image
from werkzeug.utils import secure_filename
from flask import current_app, url_for


def resize_image(file_path, max_size=(1024, 1024)):
    with Image.open(file_path) as img:
        img.thumbnail(max_size)
        img.save(file_path)


def generate_filename(filename):
    extension = filename.rsplit('.', 1)[1].lower()
    return f"{uuid.uuid4().hex}.{extension}"


def handle_image_upload(image_file):
    """Handles image upload, resizing, and returns the image URL."""
    try:
        if image_file.filename == '':
            return None, "No selected file"  # Return None and an error message

        filename = secure_filename(image_file.filename)
        filename = generate_filename(filename)
        upload_folder = current_app.config['UPLOAD_FOLDER']

        # Ensure the upload directory exists
        os.makedirs(upload_folder, exist_ok=True)

        file_path = os.path.join(upload_folder, filename)

        # Save the image before trying to resize
        image_file.save(file_path)

        # Now resize the image
        resize_image(file_path)

        image_url = url_for("static", filename=f"uploads/{filename}", _external=True)
        return image_url, None  # Return the URL and None for no error
    except Exception as e:
        return None, str(e)  # Return None and the error message
