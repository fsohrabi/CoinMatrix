# Start from Python base image
FROM python:3.10-slim

# Create directory for database
RUN mkdir -p /data && \
    touch /data/coinmatrix.db && \
    chmod a+rw /data/coinmatrix.db

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV FLASK_APP=run.py
ENV FLASK_ENV=development

# Expose port
EXPOSE 5000

# Run application
CMD ["python", "run.py", "--host=0.0.0.0", "--port=5000"]