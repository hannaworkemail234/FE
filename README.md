# Frontend - CRUD Management System

A modern React application for managing Users and Products with full CRUD operations (Create, Read, Update, Delete). Integrated with the backend API running on `http://localhost:3000`.

## Features

✅ **User Management**
- Create new users
- Read/View all users
- Update user details
- Delete users

✅ **Product Management**
- Create new products
- Read/View all products
- Update product details
- Delete products

✅ **User-Friendly Interface**
- Tabbed navigation between Users and Products
- Responsive design
- Real-time data updates
- Error handling and validation
- Confirmation dialogs for delete operations

## Prerequisites

- Node.js (v14 or higher)
- npm
- Python 3.10+ and [uv](https://docs.astral.sh/uv/)

## Installation

1. In the `FE` directory, install dependencies:
```powershell
npm.cmd install
```

## Getting Started

### Step 1: Start the Backend Server
From the `FE` directory in a terminal, start the Flask backend from the sibling `BE1` folder:

```powershell
cd ..\BE1
uv sync
uv run python app.py
```

The API is available at `http://localhost:3000`.

### Step 2: Start the Frontend Development Server
In a second terminal opened in the `FE` directory:

```powershell
$env:PORT = "3001"
$env:REACT_APP_API_URL = "http://localhost:3000/api"
npm.cmd start
```

Open `http://localhost:3001`. The frontend API URL can be overridden with `REACT_APP_API_URL` (for example, in a local `.env` file).

## Project Structure

```
src/
├── App.js                  - Main application component with tab navigation
├── App.css                 - Global app styles
├── index.js               - React entry point
├── index.css              - Global styles
├── api.js                 - API service layer (all HTTP calls)
└── components/
    ├── UserTable.js       - User management component (CRUD)
    ├── UserTable.css      - User table styles
    ├── ProductTable.js    - Product management component (CRUD)
    └── ProductTable.css   - Product table styles
```

## API Integration

The frontend connects to the following backend endpoints:

### User APIs
- `GET /api/users` - Retrieve all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Product APIs
- `GET /api/products` - Retrieve all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Usage Guide

### Managing Users

1. Click the **Users** tab in the navigation
2. Click **+ Add User** to open the form
3. Fill in Name, Age, and Address
4. Click **Create User** to save
5. View all users in the table below
6. Click **Edit** to modify user details
7. Click **Delete** to remove a user (confirmation required)

### Managing Products

1. Click the **Products** tab in the navigation
2. Click **+ Add Product** to open the form
3. Fill in Product Name, Price, and Quantity
4. Click **Create Product** to save
5. View all products in the table below
6. Click **Edit** to modify product details
7. Click **Delete** to remove a product (confirmation required)

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm eject` - Eject from create-react-app (irreversible)

## Technologies Used

- **React** 18.2.0 - UI library
- **JavaScript** - Programming language
- **CSS** - Styling
- **Fetch API** - HTTP requests

## Error Handling

The application includes comprehensive error handling:
- Network error messages
- Validation error messages
- User-friendly alerts for failed operations
- Confirmation dialogs before deletion

## Responsive Design

The application is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablets
- Mobile devices

## License

ISC
