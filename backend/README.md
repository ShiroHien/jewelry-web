# KLORA Jewelry Backend

This directory contains the Node.js, Express, and TypeScript backend for the KLORA Jewelry application.

## Prerequisites

- Node.js (LTS version recommended)
- A MongoDB Atlas account
- A Cloudinary account

## Setup

1.  **Install Dependencies:**
    Navigate to this directory in your terminal and run:
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Create a `.env` file in this directory by copying the `.env.example` file.
    ```bash
    cp .env.example .env
    ```
    Fill in the necessary values in your new `.env` file (MongoDB URI, Cloudinary credentials, etc.).

## Running the Server

-   **For development (with auto-restarting):**
    ```bash
    npm run dev
    ```
    The server will start on the port specified in your `.env` file (defaults to 3001).

-   **For production:**
    First, build the TypeScript code into JavaScript:
    ```bash
    npm run build
    ```
    Then, run the compiled code:
    ```bash
    npm start
    ```