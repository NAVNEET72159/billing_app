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
    const isArchived = req.query.archived === 'true';
    const query = isArchived
        ? 'SELECT item_id, barcode, item_name, item_group_id, mrp, sale_rate, stock, gst_percentage FROM ITEM WHERE is_active = FALSE'
        : 'SELECT item_id, barcode, item_name, item_group_id, mrp, sale_rate, stock, gst_percentage FROM ITEM WHERE is_active = TRUE';
    db.query(query, (err, results) => {
        if (err) 
            if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.put('/items/:id/restore', verifyToken, async (req, res) => {
    const itemId = req.params.id;

    try {
        const restoreQuery = 'UPDATE item SET is_active = TRUE WHERE item_id = ?';
        const [result] = await db.promise().query(restoreQuery, [itemId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No item found with that ID!" });
        }
        res.status(200).json({ message: "Item restored successfully!" });
    } catch (error) {
        console.error("Database Restore Error:", error);
        res.status(500).json({ error: "Failed to restore item" });
    }
});

// ==========================================
// 🧑‍🤝‍🧑 CUSTOMER ROUTE (Protected)
// ==========================================
// Registering a new customer
app.post('/customer', verifyToken, async (req, res) => {
    const customer_name = req.body.customer_name || '';
    const country_code = req.body.country_code || req.body.code || ''; 
    const phone_number = req.body.phone_number || '';
    const alternate_number = req.body.alternate_number || '';
    const email = req.body.email || '';
    const current_address = req.body.current_address || '';
    const permanent_address = req.body.permanent_address || '';
    const city = req.body.city || '';
    const state = req.body.state || '';
    const pincode = req.body.pincode || '';

    try {
        const query = 'INSERT INTO CUSTOMER (customer_name, country_code, phone_number, alternate_number, email, current_address, permanent_address, city, state, pincode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [customer_name, country_code, phone_number, alternate_number, email, current_address, permanent_address, city, state, pincode];
        const [result] = await db.promise().query(query, values);

        res.status(201).json({ 
            message: "Customer added successfully!", 
            insertId: result.insertId 
        });
    }catch (error) {
        console.error("Database Insert Error:", error);
        res.status(500).json({ error: "Failed to add customer to database" });
    }
});

app.get('/customers', verifyToken, async (req, res) => {
    try {
        const query = 'SELECT * FROM CUSTOMER ORDER BY customer_name ASC';
        const [rows] = await db.promise().query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Fetch Customers Error:", error);
        res.status(500).json({ error: "Failed to fetch customers from database" });
    }
});

app.put('/customer/:id', async (req, res) => {
    const customerId = req.params.id;
    const customer_name = req.body.customer_name || '';
    const country_code = req.body.country_code || req.body.code || ''; 
    const phone_number = req.body.phone_number || '';
    const alternate_number = req.body.alternate_number || '';
    const email = req.body.email || '';
    const current_address = req.body.current_address || '';
    const permanent_address = req.body.permanent_address || '';
    const city = req.body.city || '';
    const state = req.body.state || '';
    const pincode = req.body.pincode || '';

    try {
        const updateQuery = `
            UPDATE customer 
            SET customer_name = ?, country_code = ?, phone_number = ?, 
                alternate_number = ?, email = ?, current_address = ?, 
                permanent_address = ?, city = ?, state = ?, pincode = ?
            WHERE customer_id = ?
        `;
        
        const values = [
            customer_name, country_code, phone_number, alternate_number, 
            email, current_address, permanent_address, city, state, pincode, 
            customerId
        ];
        const [result] = await db.promise().query(updateQuery, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No customer found with that ID!" });
        }
        res.status(200).json({ message: "Customer updated successfully!" });
    } catch (error) {
        console.error("Database Update Error:", error);
        res.status(500).json({ error: "Failed to update customer in database" });
    }
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

app.delete('/customers/:id', async (req, res) => {
    const customerId = req.params.id;

    try {
        const deleteQuery = 'DELETE FROM customer WHERE customer_id = ?';
        const [result] = await db.promise().query(deleteQuery, [customerId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No customer found with that ID!" });
        }

        res.status(200).json({ message: "Customer deleted successfully!" });
    } catch (error) {
        console.error("Database Delete Error:", error);
        res.status(500).json({ error: "Failed to delete customer from database" });
    }
});

app.post('/items', async (req, res) => {
    const barcode = req.body.barcode || '';
    const item_name = req.body.item_name || '';
    const item_group_id = req.body.item_group_name || '';
    const gst_percentage = parseFloat(req.body.gst_percentage) || 0;
    const mrp = parseFloat(req.body.mrp) || 0;
    const purchase_rate = parseFloat(req.body.purchase_rate) || 0;
    const sale_rate = parseFloat(req.body.sale_rate) || 0;
    const stock = parseInt(req.body.stock) || 0;
    const unit = req.body.unit || '';

    try {
        const insertQuery = `
            INSERT INTO item 
            (barcode, item_name, item_group_id, gst_percentage, mrp, purchase_rate, sale_rate, stock, unit) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            barcode, item_name, item_group_id, gst_percentage, 
            mrp, purchase_rate, sale_rate, stock, unit
        ];
        const [result] = await db.promise().query(insertQuery, values);

        res.status(201).json({ 
            message: "Item added successfully!", 
            insertId: result.insertId 
        });
        
    } catch (error) {
        console.error("Database Insert Item Error:", error);
        res.status(500).json({ error: "Failed to add item to database" });
    }
});

app.delete('/items/:id', verifyToken, async (req, res) => {
    const itemId = req.params.id;

    try {
        const archiveQuery = 'UPDATE item SET is_active = FALSE WHERE item_id = ?';
        const [result] = await db.promise().query(archiveQuery, [itemId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No item found with that ID!" });
        }
        res.status(200).json({ message: "Item archived successfully!" });
    } catch (error) {
        console.error("Database Delete Error:", error);
        res.status(500).json({ error: "Failed to archive item" });
    }
});

app.put('/items/:id', async (req, res) => {
    const itemId = req.params.id;
    
    const barcode = req.body.barcode || '';
    const item_name = req.body.item_name || '';
    const item_group_id = req.body.item_group_id || '';
    const gst_percentage = parseFloat(req.body.gst_percentage) || 0;
    const mrp = parseFloat(req.body.mrp) || 0;
    const purchase_rate = parseFloat(req.body.purchase_rate) || 0;
    const sale_rate = parseFloat(req.body.sale_rate) || 0;
    const stock = parseInt(req.body.stock) || 0;
    const unit = req.body.unit || '';

    try {
        const updateQuery = `
            UPDATE item 
            SET barcode = ?, item_name = ?, item_group_id = ?, 
                gst_percentage = ?, mrp = ?, purchase_rate = ?, 
                sale_rate = ?, stock = ?, unit = ?
            WHERE item_id = ?
        `;
        
        const values = [
            barcode, item_name, item_group_id, gst_percentage, 
            mrp, purchase_rate, sale_rate, stock, unit, itemId
        ];

        const [result] = await db.promise().query(updateQuery, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No item found with that ID!" });
        }

        res.status(200).json({ message: "Item updated successfully!" });
    } catch (error) {
        console.error("Database Update Item Error:", error);
        res.status(500).json({ error: "Failed to update item in database" });
    }
});

app.get('/groups', verifyToken, async (req, res) => {
    try {
        const query = `
            SELECT item_group_id, group_name 
            FROM item_group 
            ORDER BY group_name ASC
        `;
        const [results] = await db.promise().query(query);

        res.status(200).json(results);
        
    } catch (error) {
        console.error("Error fetching item groups:", error);
        res.status(500).json({ error: "Failed to fetch item groups from database." });
    }
});

// ==========================================
// 🧾 INVOICE & RESTOCKING ROUTES 
// ==========================================

app.get('/invoices', verifyToken, async (req, res) => {
    try {
        const query = `
            SELECT s.sale_id, s.invoice_number, s.grand_total, s.payment_method, s.sale_date, c.customer_name
            FROM SALES s
            LEFT JOIN CUSTOMER c ON s.customer_id = c.customer_id
            ORDER BY s.sale_date DESC
        `;
        const [invoices] = await db.promise().query(query);
        res.status(200).json(invoices);
    } catch (error) {
        console.error("Fetch Invoices Error:", error);
        res.status(500).json({ error: "Failed to fetch invoices" });
    }
});

app.delete('/invoices/:id', verifyToken, async (req, res) => {
    const saleId = req.params.id;
    const connection = await db.promise().getConnection();

    try {
        await connection.beginTransaction();
        const getItemsQuery = 'SELECT item_id, quantity FROM SALES_ITEM WHERE sale_id = ?';
        const [soldItems] = await connection.query(getItemsQuery, [saleId]);
        for (let item of soldItems) {
            const restockQuery = 'UPDATE ITEM SET stock = stock + ? WHERE item_id = ?';
            await connection.query(restockQuery, [item.quantity, item.item_id]);
        }
        await connection.query('DELETE FROM SALES_ITEM WHERE sale_id = ?', [saleId]);
        const [deleteResult] = await connection.query('DELETE FROM SALES WHERE sale_id = ?', [saleId]);
        if (deleteResult.affectedRows === 0) {
            throw new Error("Invoice not found.");
        }
        await connection.commit();
        res.status(200).json({ message: "Invoice deleted and stock revised successfully!" });

    } catch (error) {
        await connection.rollback();
        console.error("Delete Invoice Error:", error);
        res.status(500).json({ error: "Failed to delete invoice and revise stock." });
    } finally {
        connection.release();
    }
});

app.get('/invoices/:id/items', verifyToken, async (req, res) => {
    const saleId = req.params.id;
    try {
        const query = `
            SELECT si.quantity, si.sale_rate, si.tax_amount, si.amount, i.item_name, i.barcode 
            FROM SALES_ITEM si
            LEFT JOIN ITEM i ON si.item_id = i.item_id
            WHERE si.sale_id = ?
        `;
        const [items] = await db.promise().query(query, [saleId]);
        res.status(200).json(items);
    } catch (error) {
        console.error("Fetch Invoice Items Error:", error);
        res.status(500).json({ error: "Failed to fetch invoice details" });
    }
});

app.post('/item-groups', verifyToken, async (req, res) => {
    const { group_name } = req.body;
    
    if (!group_name) {
        return res.status(400).json({ error: "Group name is required." });
    }

    try {
        const query = 'INSERT INTO item_group (group_name) VALUES (?)';
        const [result] = await db.promise().query(query, [group_name]);
        res.status(201).json({ 
            item_group_id: result.insertId, 
            group_name: group_name 
        });
    } catch (error) {
        console.error("Create Group Error:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "This group already exists!" });
        }
        res.status(500).json({ error: "Failed to create item group." });
    }
});

// ==========================================
// 📊 Top Selling Item Route (Transactions)
// ==========================================
app.get('/reports/monthly-top-items', verifyToken, async (req, res) => {
    try {
        // This query fetches the total quantity sold for every item, grouped by month
        const query = `
            SELECT 
                DATE_FORMAT(s.sale_date, '%b') AS month_name,
                MONTH(s.sale_date) AS month_num,
                i.item_name,
                SUM(si.quantity) AS total_sold
            FROM SALES_ITEM si
            JOIN SALES s ON si.sale_id = s.sale_id
            JOIN ITEM i ON si.item_id = i.item_id
            GROUP BY month_num, month_name, i.item_name
            ORDER BY month_num ASC, total_sold DESC
        `;
        
        const [results] = await db.promise().query(query);
        const topItemsPerMonth = [];
        const seenMonths = new Set();

        for (const row of results) {
            if (!seenMonths.has(row.month_num)) {
                topItemsPerMonth.push({
                    month: row.month_name,
                    itemName: row.item_name,
                    totalSold: Number(row.total_sold)
                });
                seenMonths.add(row.month_num);
            }
        }

        res.status(200).json(topItemsPerMonth);
    } catch (error) {
        console.error("Report Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch report data" });
    }
});

// ==========================================
// 🏭 MANUFACTURING & RAW MATERIALS
// ==========================================
app.post('/raw-materials', verifyToken, async (req, res) => {
    const { item_name, purchase_rate, stock } = req.body;
    if (!item_name) return res.status(400).json({ error: "Item name is required" });

    try {
        const query = 'INSERT INTO raw_materials (item_name, purchase_rate, stock) VALUES (?, ?, ?)';
        const [result] = await db.promise().query(query, [item_name, purchase_rate || 0, stock || 0]);
        res.status(201).json({ raw_id: result.insertId, message: "Raw material added successfully!" });
    } catch (error) {
        console.error("Raw Material Error:", error);
        res.status(500).json({ error: "Failed to add raw material" });
    }
});

app.get('/raw-materials', verifyToken, async (req, res) => {
    try {
        const [results] = await db.promise().query('SELECT * FROM raw_materials ORDER BY item_name ASC');
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch raw materials" });
    }
});

app.get('/raw-material-logs', verifyToken, async (req, res) => {
    try {
        // We JOIN the tables to get the actual item name instead of just the ID
        const query = `
            SELECT 
                l.log_id,
                r.item_name,
                l.financial_year,
                l.month_name,
                l.stock_start,
                l.stock_used
            FROM raw_material_monthly_log l
            JOIN raw_materials r ON l.raw_id = r.raw_id
            ORDER BY l.financial_year DESC, l.log_id DESC
        `;
        const [results] = await db.promise().query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error("Log Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch log book data" });
    }
});