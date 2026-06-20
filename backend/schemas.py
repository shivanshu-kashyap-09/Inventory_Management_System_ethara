from pydantic import BaseModel, EmailStr
from typing import Optional

# Product Schemas
class ProductBase(BaseModel):
    name: str
    sku: str
    price: float
    quantity_in_stock: int

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[float] = None
    quantity_in_stock: Optional[int] = None

class ProductResponse(ProductBase):
    id: int
    class Config:
        from_attributes = True

# Customer Schemas
class CustomerBase(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: str

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: int
    class Config:
        from_attributes = True

# Order Schemas
class OrderBase(BaseModel):
    customer_id: int
    product_id: int
    quantity: int

class OrderCreate(OrderBase):
    pass

class OrderResponse(OrderBase):
    id: int
    total_amount: float
    class Config:
        from_attributes = True
