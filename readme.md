# Inventory & Order Management System

A full-stack, Production-Ready Containerized Inventory & Order Management System built according to the Technical Assessment requirements.

## ✨ Features

- **Product Management**: Manage catalog with unique SKUs, pricing, and stock levels.
- **Customer Management**: Maintain a list of customers with unique email addresses.
- **Order Management**: Create orders linking customers and products. Placing an order automatically validates and reduces available stock.
- **Dashboard**: Real-time overview of Total Products, Customers, Orders, and Low Stock Alerts.

## 🛠️ Technology Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Axios
- Chart.js (react-chartjs-2)
- Lucide React (Icons)

**Backend**
- Python (FastAPI)
- PostgreSQL & SQLAlchemy
- Pydantic
- Uvicorn

**Infrastructure**
- Docker & Docker Compose

## 🚀 Getting Started (Docker Compose)

The easiest way to run the entire application (Frontend, Backend, and Database) is using Docker.

### Prerequisites
Make sure you have [Docker](https://www.docker.com/) and Docker Compose installed on your local machine.

### Run the Application

1. Clone the repository
```bash
git clone https://github.com/shivanshu-kashyap-09/Inventory_Management_System_ethara.git
cd Inventory_Management_System_ethara
```

2. Build and run the containers
```bash
docker-compose up --build
```

3. Access the application
- **Frontend**: [http://localhost](http://localhost) (Port 80)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

## 📂 Project Structure

```text
ethara.ai/
├── backend/
│   ├── routers/       # FastAPI endpoints
│   ├── database.py    # PostgreSQL DB Setup
│   ├── main.py        # FastAPI entry point
│   ├── models.py      # SQLAlchemy Models
│   ├── schemas.py     # Pydantic validation schemas
│   ├── requirements.txt
│   └── Dockerfile     # Python Backend Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/     # Products, Customers, Orders, Dashboard
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── Dockerfile     # Nginx multi-stage build
└── docker-compose.yml # Container orchestration
```

## 🌐 Deployment Guidelines

For deploying to free hosting platforms as per the assessment:

### Backend (Render / Railway / Fly.io)
- Connect your GitHub repo.
- Select the `backend` directory.
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment Variables: Provide a valid `DATABASE_URL` for PostgreSQL.

### Frontend (Vercel / Netlify)
- Connect your GitHub repo.
- Select the `frontend` directory.
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables: Set `VITE_API_URL` to your deployed backend URL.
