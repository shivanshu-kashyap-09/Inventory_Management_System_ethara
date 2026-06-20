from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models
from database import get_db

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_products = db.query(models.Product).count()
    total_customers = db.query(models.Customer).count()
    total_orders = db.query(models.Order).count()
    
    low_stock_products = db.query(models.Product).filter(models.Product.quantity_in_stock < 10).all()
    low_stock_count = len(low_stock_products)
    
    return {
        "totalProducts": total_products,
        "totalCustomers": total_customers,
        "totalOrders": total_orders,
        "lowStockCount": low_stock_count,
        "lowStockProducts": [
            {
                "id": p.id,
                "name": p.name,
                "sku": p.sku,
                "quantity_in_stock": p.quantity_in_stock
            } for p in low_stock_products
        ]
    }
