#Inventory Management System

A full-stack, Inventory Management System built using the MERN stack (MongoDB, Express, React, Node.js). It provides a robust backend API with Swagger documentation and a beautiful, responsive frontend built with Vite, Tailwind CSS, and Chart.js.

## ✨ Features

- **Role-based Authentication**: Secure JWT-based login and registration with specific roles (Admin/Employee).
- **Dashboard Analytics**: Visualized statistics for total products, categories, low-stock items, and recent transactions using Chart.js.
- **Product Management**: Comprehensive CRUD operations for managing products, including SKU, pricing, current stock, and low-stock thresholds.
- **Category Management**: Organize products dynamically by categories. 
- **Inventory Tracking (Transactions)**: Easily record IN and OUT movements of stock, automatically reflecting updates in the product's available stock.
- **RESTful API**: Clean backend architecture following MVC patterns with complete API documentation using Swagger UI.

## 🛠️ Technology Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- Chart.js (react-chartjs-2)
- Lucide React (Icons)

**Backend**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT) & bcryptjs
- Swagger UI Express & Swagger JSDoc
- Multer (for image handling)
- CORS & dotenv

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your local machine or have a MongoDB URI.

### 1. Clone the repository
```bash
git clone [<repository-url>](https://github.com/shivanshu-kashyap-09/Inventory_Management_System_ethara.git)
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create a .env file and add the following
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/ethara_ai?appName=Cluster0
JWT_SECRET=supersecret123

# Start the backend development server
npm run dev
```
The API will run at `http://localhost:5000/api` and Swagger docs at `http://localhost:5000/api-docs`.

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```
The Frontend will run at `http://localhost:5173/`.

## 🧪 Testing Credentials
You can use the following default credentials to log in and test the application:

- **Admin Account:**
  - **Email:** `admin@ethara.ai`
  - **Password:** `password123`

- **Employee Account:**
  - **Email:** `employee@ethara.ai`
  - **Password:** `password123`

## 📂 Project Structure

```text
ethara.ai/
├── backend/
│   ├── src/
│   │   ├── config/       # Database & Swagger configurations
│   │   ├── controllers/  # Request handlers logic
│   │   ├── middlewares/  # Auth, roles, & error handling
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API endpoints definitions
│   │   ├── services/     # Core business logic
│   │   └── index.js      # Server entry point
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI components (Buttons, Inputs, Modals)
    │   ├── context/      # React Context (AuthContext)
    │   ├── pages/        # Main application pages
    │   ├── services/     # API connection and interceptors (Axios)
    │   ├── App.jsx       # Routing setup
    │   └── main.jsx      # Frontend entry point
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
