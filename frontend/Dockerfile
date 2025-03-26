FROM node:20

WORKDIR /app

# Copy the .env file from the repo root into the container
COPY .env .env

# First copy package files for better caching
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies (including devDependencies)
RUN npm install --include=dev

# Copy all other files from the frontend directory
COPY frontend/ .

# Build the app
RUN npm run build

EXPOSE 3000

# Run the production server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
