# Content Management System (Backend & Frontend)

This is a full-stack Content Management System built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Required Tools

Before you begin, ensure you have the following tools installed on your machine:
- **Node.js** (v16 or higher recommended)
- **npm** (usually comes with Node.js)
- **MongoDB** (Local installation or MongoDB Atlas cluster)
- **Git**
- A code editor like **VS Code**

## Project Process Details (Setup Instructions)

Follow these steps to set up and run the project locally.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd content_management_system_backend
```

### 2. Backend Setup
The backend is an Express.js application connected to MongoDB.

1. Navigate to the Backend folder:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Environment Variables:
   Create a `.env` file in the `Backend` directory and add the required configurations (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_URL`).
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *(The server will start using nodemon)*

### 3. Frontend Setup
The frontend is a React application built with Vite.

1. Open a new terminal and navigate to the FrontEnd folder:
   ```bash
   cd FrontEnd
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. To build for production (e.g., for Vercel deployment):
   ```bash
   npm run build
   ```

## Folder Structure

```text
content_management_system_backend/
│
├── Backend/                   # Node.js & Express Backend
│   ├── Configurations/        # Database and third-party API configs
│   ├── Controllers/           # Request handlers and business logic
│   ├── Middlewares/           # Custom middlewares (auth, file uploads)
│   ├── Models/                # Mongoose database schemas
│   ├── Routers/               # Express API routes
│   ├── .env                   # Environment variables (create this file)
│   ├── package.json           # Backend dependencies and scripts
│   └── server.js              # Entry point for the backend application
│
├── FrontEnd/                  # React & Vite Frontend
│   ├── public/                # Static public assets
│   ├── src/                   # React source code
│   │   ├── Components/        # Reusable UI components & Dashboards
│   │   ├── Layouts/           # Layout wrappers (AdminLayout, CustomerLayout)
│   │   └── ...                # Other frontend files (Assets, Context, etc.)
│   ├── index.html             # Main HTML file
│   ├── package.json           # Frontend dependencies and scripts
│   ├── vercel.json            # Deployment configuration for Vercel
│   └── vite.config.js         # Vite configuration
│
└── README.md                  # Project documentation
```