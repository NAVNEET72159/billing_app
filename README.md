# ShanDelay Enterprises - POS System
*Stocking the Present, Building the Future.*

## 📖 Overview
This is a custom, full-stack Point of Sale (POS) and Inventory Management application built to streamline billing, track stock securely, and visualize sales data. It features a cross-platform React Native frontend (Web/Mobile) and a secure Node.js/MySQL backend.

## ✨ Key Features

### 🔐 Security & Authentication
* **JWT Authentication:** Secure login flow with encrypted tokens.
* **Smart Auto-Login:** Persistent sessions using `AsyncStorage`.
* **Inactivity Timeout:** Global touch listeners automatically log the user out and destroy the session token after 30 minutes of inactivity.
* **Route Protection:** Conditional rendering completely isolates the main app from unauthenticated users.

### 📦 Inventory Management
* **Item Tracking:** Track item details including purchase rate, sale rate, GST, MRP, and stock limits.
* **Dynamic Item Groups:** Create and manage customized item groups with a beautifully integrated UI.
* **Barcode Generation:** Auto-generate unique 12-digit barcodes for new inventory items.

### 🛒 Billing & Checkout (Cart)
* **Strict Stock Validation:** Hard-blocks adding out-of-stock items or exceeding available inventory limits in the cart.
* **Real-Time Calculations:** Auto-calculates grand totals, taxes, and quantities.

### 🧾 Invoice Management
* **Digital History:** View a complete history of all generated invoices.
* **Detailed Receipts:** Interactive UI to view itemized line details of past transactions.
* **Delete & Restock:** Securely void an invoice—automatically returning the sold quantities back to the main inventory.

### 📊 Analytics & Reporting
* **Visual Dashboards:** Utilizes `react-native-chart-kit` for native data rendering.
* **Top-Selling Metrics:** Backend aggregation of the highest-selling items grouped by month.
* **Custom Charts:** Toggle between Categorical (Bar), Pie, and Stacked charts for quick business insights.

---

## 🛠️ Tech Stack

**Frontend:**
* React Native (Expo)
* React Navigation (Native Stack)
* Axios (API Client & Interceptors)
* React Native Chart Kit & React Native SVG
* Async Storage

**Backend:**
* Node.js / Express.js
* MySQL (Relational Database)
* JSON Web Tokens (JWT)

---

## 🚀 Installation & Setup

### 1. Database Setup
Ensure your MySQL server is running and the following tables are created: `USERS`, `ITEM_GROUPS`, `ITEM`, `SALES`, and `SALES_ITEM`.

### 2. Backend Environment
Navigate to your backend directory, install dependencies, and start the server:
```bash
npm install
node server.js