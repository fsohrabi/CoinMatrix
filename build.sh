#!/usr/bin/env bash
# Install Python dependencies
pip install -r requirements.txt

# Apply database migrations
alembic upgrade head

# Any other commands your app needs to initialize (e.g., collect static files)
echo "Build script completed."
