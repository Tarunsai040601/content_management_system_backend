# Real Estate Platform Frontend

A production-quality, modern, responsive real estate web application built with React and Vite. It serves both customers (to browse, search, and favorite properties) and administrators (to manage properties).

## Features

### Customer Features
- **Modern Landing Page**: Premium aesthetic with search integration.
- **Dynamic Property Listing**: View properties with responsive grid layouts.
- **Advanced Search & Filtering**: Filter by property type, price, bedrooms, and location.
- **Sorting**: Sort by newest, lowest price, or highest price.
- **Favorites System**: Save favorite properties to local storage.
- **Recently Viewed**: Automatically tracks the latest 10 properties you've viewed.
- **Property Details**: Extensive details view with image galleries and amenities.
- **Authentication**: Customer registration and login.

### Admin Features
- **Isolated Authentication**: Admin login is completely separated from customer login using different tokens.
- **Dashboard**: High-level overview of property statistics.
- **Property Management**: Create, Read, Update, Delete (CRUD) properties.
- **Image Uploads**: Upload multiple images (up to 5) when creating or editing properties via `multipart/form-data`.

## Tech Stack
- React 19 (via Vite)
- React Router v7
- Axios (for API communication)
- Vanilla CSS with Component-Specific styling
- React Hot Toast (for notifications)
- React Icons

## Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── FilterPanel/     # Sidebar for properties filter
│   ├── Footer/          # Website footer
│   ├── HeroSection/     # Landing page hero
│   ├── Layout/          # Main and Admin layouts
│   ├── Loading/         # Skeleton loaders
│   ├── Navbar/          # Responsive navigation
│   ├── PropertyCard/    # Individual property item
│   └── SearchBar/       # Dynamic search bar
├── context/             # Global state (AuthContext)
├── pages/               # Route pages
│   ├── Admin/           # Admin-specific pages (Dashboard, CRUD)
│   ├── Auth/            # Customer Login/Register
│   ├── Favorites/       # User favorites
│   ├── Home/            # Landing page
│   ├── NotFound/        # 404 page
│   ├── Properties/      # Property listings
│   ├── PropertyDetails/ # Single property view
│   └── RecentlyViewed/  # Recently viewed properties
├── routes/              # Application routing definitions
├── services/            # Axios API wrappers (api.js, authService, propertyService)
├── App.jsx              # Main App component
├── App.css              # Global layout styles
├── index.css            # CSS Custom Properties (Variables)
└── main.jsx             # React Entry point
```

## Installation & Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add the backend URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8095
   ```
   *(Ensure this matches the port your Node.js backend is running on)*

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Configuration
All API calls are centralized in `src/services/api.js`. 
- `customerApi`: Intercepts and attaches the `customerToken`.
- `adminApi`: Intercepts and attaches the `adminToken`.

The backend is custom-built and integrated via REST APIs for operations like `/api/create`, `/api/getAll`, `/api/update`, and `/api/registerRouter/login`.

## Important Notes on Authentication
- Customer tokens are stored in `localStorage` under `customerToken`.
- Admin tokens are stored in `localStorage` under `adminToken`.
- Admin routes (`/admin/*`) are protected and require the `adminToken`.
- Customer routes (like favorites) verify the `customerToken`.
