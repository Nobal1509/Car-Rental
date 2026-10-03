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

## Docker Deployment (Single Container)

The root `Dockerfile` uses a multi-stage build:
1. **Frontend stage:** Builds the Vite + React frontend into static assets in `/app/client/dist`.
2. **Backend stage:** Prepares the Express server in `/app/server`, copies the static frontend assets, and serves both the API endpoints (`/api/...`) and the frontend SPA (`index.html`) on a single port.

### Option A: Local Testing with Docker Compose

1. Ensure `server/.env` exists with your MongoDB and ImageKit credentials.
2. From the project root, run:

   ```bash
   docker compose up --build -d
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.
4. To stop the container:

   ```bash
   docker compose down
   ```

---

## Deploying on Render (Step-by-Step)

You can deploy the full-stack container on Render in two ways:

### Method 1: Using Render Dashboard (Recommended)

1. **Push your code to GitHub / GitLab**.
2. Go to your [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your repository.
4. In the service settings:
   - **Name:** `car-rental` (or your preferred name)
   - **Language / Runtime:** `Docker`
   - **Region:** Choose the region closest to you
   - **Branch:** `main`
   - **Dockerfile Path:** `Dockerfile` (default)
   - **Docker Build Context:** `.` (default)
   - **Instance Type:** `Free` (or any paid instance)
   - **Health Check Path:** `/api/health`
5. Under **Environment Variables**, add the following:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `mongodb+srv://<username>:<password>@cluster.mongodb.net/...`
   - `JWT_SECRET` = `<your_jwt_secret>`
   - `IMAGEKIT_PUBLIC_KEY` = `<your_imagekit_public_key>`
   - `IMAGEKIT_PRIVATE_KEY` = `<your_imagekit_private_key>`
   - `IMAGEKIT_URL_ENDPOINT` = `https://ik.imagekit.io/<your_id>`
   *(Note: Render automatically injects `PORT`. The server is configured to bind to `0.0.0.0:$PORT`.)*
6. Click **Deploy Web Service**.

### Method 2: Using Render Blueprint (`render.yaml`)

1. Push this repository (which includes [`render.yaml`](render.yaml)) to GitHub.
2. In Render, click **New +** -> **Blueprint**.
3. Connect your repository.
4. Fill in the prompted secret environment variables (`MONGODB_URI`, ImageKit credentials).
5. Click **Apply**. Render will automatically build and deploy both frontend and backend from the single Dockerfile!

## Common notes

- For separate local development, the frontend calls the backend through
  `VITE_BASE_URL`.
- The backend uses MongoDB for all car, user, and booking data.
- Image uploads are handled through ImageKit.
