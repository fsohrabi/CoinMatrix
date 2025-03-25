FROM node:20

WORKDIR /app

# First copy package files for better caching
COPY package.json package-lock.json ./

# Install dependencies (including devDependencies)
RUN npm install --include=dev

# Copy all other files
COPY . .

# Build the app
RUN npm run build

EXPOSE 3000

# Run the production server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]