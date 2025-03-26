# CoinMatrix - Full Stack Cryptocurrency Platform with Docker

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD43D)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-E34F26?style=for-the-badge&logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Docker Compose](https://img.shields.io/badge/Docker_Compose-E34F26?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![CoinMarketCap](https://img.shields.io/badge/CoinMarketCap-FF712B?style=for-the-badge&logo=CoinMarketCap&logoColor=white)](https://coinmarketcap.com/)

This repository contains the complete source code for the CoinMatrix application, a modern full-stack platform for tracking and analyzing cryptocurrency market data. Built with a focus on performance and user experience, CoinMatrix leverages a robust Python Flask backend and a dynamic React Vite frontend, all containerized with Docker for seamless setup and deployment.

## Overview

CoinMatrix is designed to **provide users with a comprehensive platform for tracking and analyzing cryptocurrency market data. It offers real-time price updates, historical data visualization, and tools for users to manage their cryptocurrency portfolios. The application aims to empower users to make informed decisions in the dynamic world of cryptocurrency investments.**

**Built With:**

* **Frontend:**
    * **React:** A JavaScript library for building user interfaces.
    * **Vite:** A next-generation frontend tooling that provides an extremely fast development environment.
    * **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
* **Backend:**
    * **Python:** A versatile and powerful programming language.
    * **Flask:** A micro web framework for Python.
    * **SQLAlchemy:** A SQL toolkit and Object Relational Mapper (ORM) for Python.
    * **JSON Web Tokens (JWT):** For secure user authentication.
* **Containerization:**
    * **Docker:** A platform for building, sharing, and running applications in containers.
    * **Docker Compose:** A tool for defining and managing multi-container Docker applications.

This repository includes:

* **`backend/`:** The Python Flask backend application responsible for data fetching, API endpoints, database interactions (using SQLAlchemy), and user authentication.
* **`frontend/`:** The React Vite frontend application, styled with Tailwind CSS, providing a user-friendly interface for interacting with the backend API.
* **`docker-compose.yml`:** Configuration for running the backend and frontend services in isolated containers using Docker, simplifying the setup process and ensuring consistent environments.
* **.env:** Configuration file for environment variables (not tracked by Git, see `.env.example`).

## Features

* **Real-time Cryptocurrency Price Tracking:** Fetches and displays up-to-the-minute price data for a wide range of cryptocurrencies.
* **User Authentication and Authorization:** Securely manages user accounts using JWT, allowing users to create profiles and protect their portfolio information.
* **API Integration with CoinMarketCap:** Leverages the CoinMarketCap API to retrieve accurate and reliable cryptocurrency data.
* **Responsive User Interface:** Provides a seamless experience across various devices, built with Tailwind CSS for rapid and consistent styling.

## Prerequisites

* **Docker:** Ensure you have Docker and Docker Compose installed on your system. You can find installation instructions for your operating system on the official Docker website: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

## Getting Started

Follow these steps to get the CoinMatrix application running locally using Docker:

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/fsohrabi/CoinMatrix.git](https://github.com/fsohrabi/CoinMatrix.git)
    cd CoinMatrix
    ```

2.  **Create a `.env` file:**

    Copy the `.env.example` file to `.env` in the root directory of the project.

    ```bash
    cp .env.example .env
    ```

3.  **Configure Environment Variables:**

    Open the `.env` file and update the values according to your needs. The important environment variables are:

    * `VITE_APP_API_URL`: URL for the backend API (default: `http://localhost:5000/api/v1`).
    * `VITE_APP_APP_NAME`: Name of the application (default: `CoinMatrix`).
    * `VITE_APP_DEBUG`: Debug mode for the frontend (default: `true`).
    * `FLASK_ENV`: Environment for the Flask backend (default: `development`).
    * `SECRET_KEY`: Secret key for Flask application. **Important: Use a strong, unique key in production.**
    * `DEV_DATABASE_URL`: Database URL for development (default: `sqlite:////data/coinmatrix.db`).
    * `DATABASE_URL`: Database URL for production (default: `sqlite:////data/coinmatrix.db`).
    * `TEST_DATABASE_URL`: Database URL for testing (default: ``).
    * `JWT_SECRET_KEY`: Secret key for JWT authentication. **Important: Use a strong, unique key in production.**
    * `ADMIN_NAME`: Default admin username.
    * `ADMIN_EMAIL`: Default admin email.
    * `ADMIN_PASSWORD`: Default admin password. **Important: Change this password immediately after setup.**
    * `COIN_API_KEY`: API key for the cryptocurrency data provider (replace with your actual key).
    * `SQLALCHEMY_DATABASE_URI`: SQLAlchemy database URI (default: `sqlite:////data/coinmatrix.db`).
    * `FRONTEND_URL`: URL for the frontend application (default: `http://localhost:3000`).

4.  **Run the application with Docker Compose:**

    ```bash
    docker-compose up -d --build
    ```

    This command will:

    * Build the Docker images for the backend and frontend.
    * Start the backend and frontend containers in detached mode.

5.  **Access the application:**

    * **Frontend:** Open your browser and navigate to the URL specified by `FRONTEND_URL` in your `.env` file (default: `http://localhost:3000`).
    * **Backend API:** The backend API will be accessible at the URL specified by `VITE_APP_API_URL` in your `.env` file (default: `http://localhost:5000/api/v1`).

## Development

For local development, you might want to run the backend and frontend separately.

### Backend Development

1.  Navigate to the backend directory:

    ```bash
    cd backend
    ```

2.  **Set up a virtual environment (recommended):**

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Linux/macOS
    # venv\Scripts\activate  # On Windows
    ```

3.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Flask development server:**

    ```bash
    flask run
    ```

### Frontend Development

1.  Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the Vite development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

## Docker Compose Commands

Here are some useful Docker Compose commands:

* **Build and start containers:** `docker-compose up -d --build`
* **Start containers (without rebuilding):** `docker-compose up -d`
* **Stop containers:** `docker-compose down`
* **View logs for a specific service (e.g., backend):** `docker-compose logs backend`
* **View logs for all services:** `docker-compose logs`
* **List running containers:** `docker-compose ps`

## Environment Variables

The application uses environment variables for configuration. You can configure these variables in the `.env` file. **Do not commit your `.env` file to the repository.** The `.env.example` file provides a template.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them.
4.  Push your changes to your fork.
5.  Submit a pull request.

## License

[Specify your project's license here. For example: MIT License](LICENSE)
