# ezfind – Garage Storage Manager

A garage management app to organize storage boxes and their contents with photos.

## Prerequisites

- Node.js 16+ (20+ recommended for best compatibility)
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Quick Start

### 1. Start the API (backend)

```bash
cd ezfind-api
npm install
npm run dev
```

The API runs at `http://localhost:3000`. Set `MONGODB_URI` if not using `mongodb://127.0.0.1:27017/ezfind`.

### 2. Start the Angular app (frontend)

```bash
cd ezfind
npm install
ng serve
```

Open `http://localhost:4200` in your browser.

## Project Structure

- **ezfind/** – Angular frontend (boxes list, box detail, add dialogs, camera photo capture)
- **ezfind-api/** – Node.js + Express backend (REST API, MongoDB, local file storage for photos)

## API Endpoints

- `GET /api/boxes` – List boxes
- `POST /api/boxes` – Create box `{ name }`
- `GET /api/boxes/:boxId` – Get one box
- `GET /api/boxes/:boxId/items` – List items in a box
- `POST /api/boxes/:boxId/items` – Create item (multipart: `name`, `photo`)

## Environment

- **Frontend**: `src/environments/environment.ts` – `apiUrl` (default `http://localhost:3000`)
- **Backend**: `MONGODB_URI`, `PORT`
