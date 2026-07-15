const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("./authMiddleware");
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

db.getConnection((err, connection)=>{
    if (err) {
        console.error("❌ Database connection failed:", err);
    } else {
        console.log("✅ Database connected successfully");
        connection.release();
    }
});

app.get("/", (req, res) => {
    res.send("Hello from the backend!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// ==========================================
// 🛠️ TEMPORARY ROUTE: Create First Admin
// ==========================================

app.post('/setup-admin', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const query = 'INSERT INTO APP_USERS (username, password_hash, role) VALUES (?, ?, ?)';
        db.query(query, ['superadmin', hashedPassword, 'ADMIN'], (err, result) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({ message: "Admin created! Username: superadmin, Password: admin123" });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error during setup." });
    }
});

// ==========================================
// 🔐 THE REAL ROUTE: Login System
// ==========================================

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM APP_USERS WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) 
            return res.status(500).json({ error: err.message });
        // if no user found, return 401 Unauthorized
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        // if admin suspended, return 403 Forbidden
        const user = results[0];
        if (user.account_status === 'SUSPENDED') {
            return res.status(403).json({ error: "Your account has been suspended" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const token = jwt.sign(
            { userId: user.user_id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            message: "Login successful!",
            token: token,   
            role: user.role
        });
    });
});

// ==========================================
// 📦 INVENTORY ROUTE (Protected)
// ==========================================
// Any logged-in user (Admin or Sales) can view items
app.get('/items', verifyToken, (req, res) => {
    const query = 'SELECT item_id, barcode, item_name, item_group_id, mrp, sale_rate, stock, gst_percentage FROM ITEM';
    db.query(query, (err, results) => {
        if (err) 
            if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ==========================================
// 🧑‍🤝‍🧑 CUSTOMER ROUTE (Protected)
// ==========================================
// Registering a new customer
app.post('/customers', verifyToken, (req, res) => {
    const{
        customer_name, country_code, phone_number, email, current_address, city, state, pincode
    } = req.body;

    const query = 'INSERT INTO CUSTOMERS (customer_name, country_code, phone_number, email, current_address, city, state, pincode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    const values = [customer_name, country_code, phone_number, email, current_address, city, state, pincode];
    db.query(query, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Customer with this phone number or email already exists.' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Customer registered successfully', customerId: result.insertId });
    });
});

app.get('/customers', verifyToken, (req, res) => {
    const query = 'SELECT customer_id, customer_name, phone_number, current_address FROM CUSTOMER ORDER BY customer_name ASC';
    db.query(query, (err, results) => {
        if(err) {
            if (err) return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// ==========================================
// 🛒 CHECKOUT ROUTE (Transactions)
// ==========================================
app.post('/checkout', verifyToken, (req, res) => {
    const { 
        customer_id, 
        items, 
        total_tax_amount, 
        grand_total, 
        payment_method 
    } = req.body;

    const invoice_number = 'INV-' + Date.now();

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: "Database connection failed" });

        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                return res.status(500).json({ error: "Failed to start transaction" });
            }

            // STEP A: Insert into the SALES table (The Header)
            const salesQuery = `
                INSERT INTO SALES (invoice_number, customer_id, total_tax_amount, grand_total, payment_method) 
                VALUES (?, ?, ?, ?, ?)
            `;
            
            connection.query(salesQuery, [invoice_number, customer_id, total_tax_amount, grand_total, payment_method], (err, salesResult) => {
                if (err) {
                    return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ error: "Failed to create sales record." });
                    });
                }

                const newSaleId = salesResult.insertId;

                // STEP B: Insert into the SALES_ITEM table (The Line Items)
                const salesItemsData = items.map(item => [
                    newSaleId, 
                    item.item_id, 
                    item.sale_rate, 
                    item.quantity, 
                    item.tax_amount, 
                    item.amount
                ]);

                const itemsQuery = `
                    INSERT INTO SALES_ITEM (sale_id, item_id, sale_rate, quantity, tax_amount, amount) 
                    VALUES ?
                `;

                connection.query(itemsQuery, [salesItemsData], (err, itemsResult) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            res.status(500).json({ error: "Failed to insert line items." });
                        });
                    }
                    // We use a recursive function to safely loop through the items array using callbacks
                    const deductInventoryStock = (index) => {
                        
                        if (index === items.length) {
                            connection.commit((err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        res.status(500).json({ error: "Failed to commit transaction." });
                                    });
                                }
                                connection.release();
                                return res.status(201).json({ 
                                    message: "Checkout successful and inventory updated!", 
                                    invoice_number: invoice_number,
                                    sale_id: newSaleId
                                });
                            });
                            return;
                        }

                        const currentItem = items[index];
                        const stockUpdateQuery = `UPDATE ITEM SET stock = stock - ? WHERE item_id = ?`;

                        connection.query(stockUpdateQuery, [currentItem.quantity, currentItem.item_id], (err, result) => {
                            if (err) {
                                
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ error: `Failed to update stock for item ID ${currentItem.item_id}.` });
                                });
                            }
                            
                            deductInventoryStock(index + 1);
                        });
                    };
                    
                    deductInventoryStock(0);
                });
            });
        });
    });
});