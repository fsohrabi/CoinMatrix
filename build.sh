#!/usr/bin/env bash
# Install Python dependencies
pip install -r requirements.txt

# Run Alembic migrations (specify config if not in the root)
alembic -c migrations/alembic.ini upgrade head

# Any other commands your app needs to initialize (e.g., collect static files)
echo "Build script completed."
