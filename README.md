# Description

This Jewelry Showcase is a website to display beautiful jewelry, amber, and gemstones, inspired by the Swarovski official website. It's a simple online catalog for visitors to see our products and read blog posts. There's no shopping cart or customer login. Only an administrator can log in to add and manage products and blog entries.

## Features
- Browse and view detailed information for various jewelry items.
- Explore informative blog posts related to jewelry, amber, and gemstones.
- Responsive design for optimal viewing on various devices.
- Administrator access to domain/admin for managing product and blog content (upload, edit, delete).

## Tech stack
- Frontend: React, Tailwind CSS, HTML, TypeScript
- Backend: Node.js, Express.js, MongoDB, Cloudinary

## Local deployment

To get the KLORA Jewelry Showcase running on your local machine, follow these steps:

### Prerequisites
- Node.js (LTS version recommended)
- A MongoDB Atlas account
- A Cloudinary account

1. Backend setup

Navigate into the backend directory and install all the necessary packages:

```
cd backend
npm install
```

2. Environment variables

Create a .env file in the backend directory by copying the example file:
```
cp .env.example .env
```
Open the .env file and populate it with your credentials:
- MONGODB_URI: Your connection string from MongoDB Atlas.
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET: Your API credentials from Cloudinary.
- JWT_SECRET: A secret key for signing JWTs (for admin authentication).
- PORT: The port on which your backend server will run (e.g., 3001).

### Run the Backend Server

Start the backend server in development mode:
```
npm run dev
```
The server will now be running, typically on http://localhost:3001 (or the port you specified).

3. Frontend Setup

Navigate into the frontend directory and install all the necessary packages, then start the frontend server:
```
cd frontend
npm install
npm run dev
```

The frontend application will compile and become available, usually at http://localhost:5173. 

## Accessing the Admin Panel

To access the administrator interface for uploading products and blogs, navigate to http://localhost:5173/admin (or the corresponding frontend URL for your local setup) in your web browser. You will need to log in with the administrator credentials configured in your backend.
