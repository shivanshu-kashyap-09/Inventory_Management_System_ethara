import requests

BASE_URL = "http://localhost:8000"

# 5 Categories with 10 products each (50 products total)
products_data = [
    # Category 1: Electronics
    {"name": "Wireless Bluetooth Headphones", "sku": "ELEC-001", "price": 59.99, "quantity_in_stock": 150},
    {"name": "USB-C Charging Cable", "sku": "ELEC-002", "price": 12.99, "quantity_in_stock": 500},
    {"name": "Portable Power Bank 10000mAh", "sku": "ELEC-003", "price": 29.99, "quantity_in_stock": 200},
    {"name": "Wireless Mouse", "sku": "ELEC-004", "price": 24.99, "quantity_in_stock": 300},
    {"name": "Mechanical Keyboard", "sku": "ELEC-005", "price": 79.99, "quantity_in_stock": 120},
    {"name": "HD Webcam 1080p", "sku": "ELEC-006", "price": 45.99, "quantity_in_stock": 80},
    {"name": "USB Hub 4-Port", "sku": "ELEC-007", "price": 18.99, "quantity_in_stock": 250},
    {"name": "Laptop Stand Adjustable", "sku": "ELEC-008", "price": 34.99, "quantity_in_stock": 90},
    {"name": "Smart LED Desk Lamp", "sku": "ELEC-009", "price": 42.99, "quantity_in_stock": 110},
    {"name": "Noise Cancelling Earbuds", "sku": "ELEC-010", "price": 89.99, "quantity_in_stock": 70},

    # Category 2: Clothing
    {"name": "Cotton T-Shirt Round Neck", "sku": "CLTH-001", "price": 19.99, "quantity_in_stock": 400},
    {"name": "Slim Fit Denim Jeans", "sku": "CLTH-002", "price": 49.99, "quantity_in_stock": 200},
    {"name": "Hooded Sweatshirt", "sku": "CLTH-003", "price": 39.99, "quantity_in_stock": 180},
    {"name": "Formal Dress Shirt", "sku": "CLTH-004", "price": 34.99, "quantity_in_stock": 150},
    {"name": "Sports Running Shorts", "sku": "CLTH-005", "price": 22.99, "quantity_in_stock": 300},
    {"name": "Winter Puffer Jacket", "sku": "CLTH-006", "price": 89.99, "quantity_in_stock": 60},
    {"name": "Casual Polo Shirt", "sku": "CLTH-007", "price": 27.99, "quantity_in_stock": 220},
    {"name": "Cargo Pants", "sku": "CLTH-008", "price": 44.99, "quantity_in_stock": 130},
    {"name": "Linen Summer Shirt", "sku": "CLTH-009", "price": 32.99, "quantity_in_stock": 170},
    {"name": "Track Pants Jogger", "sku": "CLTH-010", "price": 29.99, "quantity_in_stock": 250},

    # Category 3: Home & Kitchen
    {"name": "Stainless Steel Water Bottle", "sku": "HOME-001", "price": 15.99, "quantity_in_stock": 350},
    {"name": "Non-Stick Frying Pan 10 inch", "sku": "HOME-002", "price": 28.99, "quantity_in_stock": 140},
    {"name": "Glass Food Storage Containers", "sku": "HOME-003", "price": 24.99, "quantity_in_stock": 200},
    {"name": "Electric Kettle 1.7L", "sku": "HOME-004", "price": 35.99, "quantity_in_stock": 90},
    {"name": "Bamboo Cutting Board Set", "sku": "HOME-005", "price": 19.99, "quantity_in_stock": 160},
    {"name": "Silicone Cooking Utensil Set", "sku": "HOME-006", "price": 22.99, "quantity_in_stock": 180},
    {"name": "Ceramic Coffee Mug Set", "sku": "HOME-007", "price": 18.99, "quantity_in_stock": 270},
    {"name": "Kitchen Weighing Scale Digital", "sku": "HOME-008", "price": 14.99, "quantity_in_stock": 120},
    {"name": "Microfiber Cleaning Cloth Pack", "sku": "HOME-009", "price": 9.99, "quantity_in_stock": 500},
    {"name": "Airtight Spice Jar Set", "sku": "HOME-010", "price": 16.99, "quantity_in_stock": 210},

    # Category 4: Sports & Fitness
    {"name": "Yoga Mat Non-Slip 6mm", "sku": "SPRT-001", "price": 25.99, "quantity_in_stock": 180},
    {"name": "Adjustable Dumbbell Set 20kg", "sku": "SPRT-002", "price": 69.99, "quantity_in_stock": 50},
    {"name": "Resistance Bands Set", "sku": "SPRT-003", "price": 14.99, "quantity_in_stock": 300},
    {"name": "Jump Rope Speed Cable", "sku": "SPRT-004", "price": 11.99, "quantity_in_stock": 250},
    {"name": "Foam Roller Muscle Recovery", "sku": "SPRT-005", "price": 19.99, "quantity_in_stock": 140},
    {"name": "Sports Water Bottle 750ml", "sku": "SPRT-006", "price": 12.99, "quantity_in_stock": 320},
    {"name": "Gym Gloves with Wrist Support", "sku": "SPRT-007", "price": 16.99, "quantity_in_stock": 200},
    {"name": "Ab Roller Wheel", "sku": "SPRT-008", "price": 21.99, "quantity_in_stock": 110},
    {"name": "Skipping Rope Digital Counter", "sku": "SPRT-009", "price": 18.99, "quantity_in_stock": 170},
    {"name": "Pull Up Bar Doorway", "sku": "SPRT-010", "price": 32.99, "quantity_in_stock": 75},

    # Category 5: Books & Stationery
    {"name": "Spiral Notebook A4 200 Pages", "sku": "BOOK-001", "price": 8.99, "quantity_in_stock": 600},
    {"name": "Ballpoint Pen Pack of 10", "sku": "BOOK-002", "price": 5.99, "quantity_in_stock": 800},
    {"name": "Highlighter Marker Set 6 Colors", "sku": "BOOK-003", "price": 7.99, "quantity_in_stock": 400},
    {"name": "Sticky Notes Multicolor Pack", "sku": "BOOK-004", "price": 4.99, "quantity_in_stock": 550},
    {"name": "Desk Organizer Wooden", "sku": "BOOK-005", "price": 22.99, "quantity_in_stock": 130},
    {"name": "A5 Leather Diary Journal", "sku": "BOOK-006", "price": 15.99, "quantity_in_stock": 190},
    {"name": "Whiteboard Marker Set", "sku": "BOOK-007", "price": 6.99, "quantity_in_stock": 350},
    {"name": "Paper Clip Box 100 Pieces", "sku": "BOOK-008", "price": 3.99, "quantity_in_stock": 700},
    {"name": "Correction Tape Roller", "sku": "BOOK-009", "price": 4.49, "quantity_in_stock": 450},
    {"name": "Pencil Set HB 12 Pack", "sku": "BOOK-010", "price": 3.49, "quantity_in_stock": 900},
]

# 10 Customers
customers_data = [
    {"full_name": "Rahul Sharma", "email": "rahul.sharma@email.com", "phone_number": "+91-9876543210"},
    {"full_name": "Priya Patel", "email": "priya.patel@email.com", "phone_number": "+91-9876543211"},
    {"full_name": "Amit Kumar", "email": "amit.kumar@email.com", "phone_number": "+91-9876543212"},
    {"full_name": "Sneha Gupta", "email": "sneha.gupta@email.com", "phone_number": "+91-9876543213"},
    {"full_name": "Vikram Singh", "email": "vikram.singh@email.com", "phone_number": "+91-9876543214"},
    {"full_name": "Anjali Verma", "email": "anjali.verma@email.com", "phone_number": "+91-9876543215"},
    {"full_name": "Rohan Joshi", "email": "rohan.joshi@email.com", "phone_number": "+91-9876543216"},
    {"full_name": "Kavita Nair", "email": "kavita.nair@email.com", "phone_number": "+91-9876543217"},
    {"full_name": "Deepak Reddy", "email": "deepak.reddy@email.com", "phone_number": "+91-9876543218"},
    {"full_name": "Meera Iyer", "email": "meera.iyer@email.com", "phone_number": "+91-9876543219"},
]

def seed():
    print("=" * 50)
    print("Seeding Products...")
    print("=" * 50)
    
    success_products = 0
    for p in products_data:
        res = requests.post(f"{BASE_URL}/products/", json=p)
        if res.status_code == 200:
            success_products += 1
            print(f"  [OK] {p['name']} ({p['sku']})")
        else:
            print(f"  [FAIL] {p['name']} - {res.json().get('detail', res.text)}")
    
    print(f"\nProducts added: {success_products}/{len(products_data)}")
    
    print("\n" + "=" * 50)
    print("Seeding Customers...")
    print("=" * 50)
    
    success_customers = 0
    for c in customers_data:
        res = requests.post(f"{BASE_URL}/customers/", json=c)
        if res.status_code == 200:
            success_customers += 1
            print(f"  [OK] {c['full_name']} ({c['email']})")
        else:
            print(f"  [FAIL] {c['full_name']} - {res.json().get('detail', res.text)}")
    
    print(f"\nCustomers added: {success_customers}/{len(customers_data)}")
    print("\n" + "=" * 50)
    print("SEEDING COMPLETE!")
    print("=" * 50)

if __name__ == "__main__":
    seed()
