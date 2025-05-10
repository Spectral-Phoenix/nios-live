# Nios.live - Tech News Platform

A simple tech news platform with React frontend and Spring Boot backend.

## Project Structure

- `src/` - React frontend built with TypeScript
- `backend/` - Spring Boot backend

## Prerequisites

- Node.js and npm for the frontend
- Java 17 or higher for the backend
- Gradle for building the backend

## Running the Application

### Backend

Start the Spring Boot backend:

```bash
cd backend
./gradlew bootRun
```

The backend will run on http://localhost:8080

### Frontend

Start the React development server:

```bash
npm install
npm run dev
```

The frontend will run on http://localhost:3000

## Features

- View tech news in different categories
- News data served from Spring Boot backend
- Responsive design with light/dark mode
- Category filtering
