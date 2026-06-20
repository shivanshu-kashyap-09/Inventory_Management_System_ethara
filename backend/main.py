from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import products, customers, orders, dashboard

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ethara Inventory Management System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Inventory Management System API"}
