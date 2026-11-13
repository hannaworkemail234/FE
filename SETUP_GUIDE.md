# Quick Start Guide - CRUD Management System

## 📋 Overview

This CRUD Management System consists of:
- **Backend**: Flask API with SQLite for users and products (Port 3000)
- **Frontend**: React application with User and Product management interfaces

## 🚀 Quick Setup

### Step 1: Start the Backend

From the `FE` directory:

```powershell
cd ..\BE1
uv sync
uv run python app.py
```

The Flask API runs at `http://localhost:3000`.

### Step 2: Start Frontend in Another Terminal

Open another terminal in the `FE` directory:

```powershell
$env:PORT = "3001"
$env:REACT_APP_API_URL = "http://localhost:3000/api"
npm.cmd start
```

Open the React app at `http://localhost:3001`.

## 📊 CRUD Operations Overview

### User Management (4 Operations)
1. **CREATE**: Add new users (Name, Age, Address)
2. **READ**: View all users in table
3. **UPDATE**: Edit user details
4. **DELETE**: Remove users

### Product Management (4 Operations)
1. **CREATE**: Add new products (Name, Price, Quantity)
2. **READ**: View all products in table
3. **UPDATE**: Edit product details
4. **DELETE**: Remove products

## 🎯 How to Use

### Adding a User/Product
1. Click the "Users" or "Products" tab
2. Click "+ Add User" or "+ Add Product"
3. Fill in the form fields
4. Click "Create User" or "Create Product"

### Editing
1. Find the entry in the table
2. Click the "Edit" button
3. Modify the fields in the form
4. Click "Update User" or "Update Product"

### Deleting
1. Find the entry in the table
2. Click the "Delete" button
3. Confirm the deletion

### Viewing
- All data is displayed in tables automatically
- Scroll horizontally for more columns if needed

## 🔧 API Endpoints

### User Endpoints
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Product Endpoints
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get specific product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## 📁 File Structure

```
FE/
├── src/
│   ├── api.js                 # API service layer
│   ├── App.js                 # Main app with navigation
│   ├── App.css                # App styles
│   ├── index.js               # Entry point
│   ├── index.css              # Global styles
│   └── components/
│       ├── UserTable.js       # User CRUD component
│       ├── UserTable.css
│       ├── ProductTable.js    # Product CRUD component
│       └── ProductTable.css
├── public/
│   └── index.html             # HTML template
├── package.json
└── README.md
```

## ⚠️ Troubleshooting

### Port Conflicts
If port 3000 is already in use:
- Backend will fail to start - stop other processes using port 3000
- Frontend will automatically use port 3001 (or next available)

### Backend Not Responding
If you see "Failed to fetch users" or similar errors:
1. Check that backend server is running (`http://localhost:3000/health`)
2. Verify CORS is not blocking requests
3. Check browser console for error details

### Data Not Loading
1. Refresh the page (Ctrl+R or Cmd+R)
2. Check that backend server is running
3. Ensure you're on the correct tab (Users or Products)

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Data refreshes after each CRUD operation
- **Error Handling**: Clear error messages for failed operations
- **Confirmation Dialogs**: Prevents accidental deletions
- **Form Validation**: Required fields highlighted
- **Tabbed Navigation**: Easy switching between Users and Products

## 📝 Example Data

### Sample User
```json
{
  "name": "John Doe",
  "age": 30,
  "address": "123 Main Street"
}
```

### Sample Product
```json
{
  "name": "Laptop",
  "price": 999.99,
  "quantity": 5
}
```

## 🔗 Connected Systems

```
Frontend (React) ←→ Backend API (Flask) ←→ SQLite Database
   Port 3001          Port 3000              app.db
```

---

**Ready to start?** Follow the Quick Setup steps above! 🎉
