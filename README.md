# Car Rental Fullstack Project

This project is a full-stack car rental application built with React on the frontend and Express + MongoDB on the backend.

## Project structure

- `client/` - React + Vite frontend
- `server/` - Express API and MongoDB connection

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+ installed
- npm installed
- MongoDB database connection (MongoDB Atlas or local MongoDB)
- Optional: ImageKit account for image uploads

## 1) Install dependencies

Open two terminals from the project root.

### Backend

```bash
cd server
npm install
```

### Frontend

```bash
cd client
npm install
```

## 2) Environment variables

### Backend (`server/.env`)

Create or update `server/.env` with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
PORT=3000
```

Example:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/CarRental
JWT_SECRET=supersecretkey
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
PORT=3000
```

### Frontend (`client/.env`)

Create `client/.env` with:

```env
VITE_BASE_URL=http://localhost:3000
VITE_CURRENCY=USD
```

> If your backend is deployed elsewhere, replace `http://localhost:3000` with that URL.

## 3) Start the backend

From the project root:

```bash
cd server
npm run server
```

This starts the Express server with nodemon.

Default backend URL:

```text
http://localhost:3000
```

## 4) Start the frontend

Open a second terminal and run:

```bash
cd client
npm run dev
```

This starts the Vite dev server.

Default frontend URL:

```text
http://localhost:5173
```

## 5) Open the app

Visit:

```text
http://localhost:5173
```

## Production build

### Frontend build

```bash
cd client
npm run build
```

### Backend start (production)

```bash
cd server
npm start
```

## Common notes

- The frontend calls the backend through `VITE_BASE_URL`.
- The backend uses MongoDB for all car, user, and booking data.
- Image uploads are handled through ImageKit.

If you want, I can also add a short section for troubleshooting common startup errors such as MongoDB connection issues or CORS problems.
