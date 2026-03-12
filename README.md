# GreenChain: Supply Chain Carbon Quantification System

GreenChain is a full-stack relational database framework designed to quantify and track carbon emissions across industrial supply chains. By mapping raw material sourcing, transport logistics, and product compositions, the system provides actionable environmental impact analytics.

## 🚀 Features

- **🔐 Secure Authentication:** User registration and login with bcrypt-hashed passwords and session management.
- **📊 Interactive Dashboard:** Real-time visualization of transport mode distributions and material emission factors using Chart.js.
- **🏗️ Inventory Management:** Full CRUD operations for Suppliers, Materials, and Products.
- **🚛 Transport Logistics:** Detailed logging of material shipments, weights, and transit modes.
- **🧪 Product Composition:** Specialized registry to define the "recipe" of products and calculate their aggregate carbon footprint.
- **📈 Emissions Analysis:** SQL-driven quantification logic to identify the most carbon-intensive segments of the supply chain.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL 8.0
- **Frontend:** AngularJS (v1.8.2), Chart.js (v4.4.1)
- **Styling:** Modern CSS3 with custom gradients and responsive layouts
- **Security:** Bcrypt.js, Express-Session

## 📁 Project Structure

```text
├── config/             # Database connection and initialization
├── middleware/         # Auth guards and session checks
├── public/             # Frontend assets (AngularJS controllers, views, styles)
├── routes/             # Express API endpoints (SQL Query logic)
├── server.js           # Main application entry point
└── Report_F044_F005_DBMS.tex # Project Report Source
```

## 🏗️ Database Schema

The system relies on a highly normalized (3NF) relational schema:
- `USERS`: System access control.
- `SUPPLIERS`: Material source origins.
- `MATERIALS`: Raw material properties and emission factors.
- `PRODUCTS`: Final manufactured goods.
- `TRANSPORT_LOG`: Shipment tracking between suppliers and materials.
- `PRODUCT_COMPOSITION`: Mapping of materials to specific product batches.

## ⚙️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v14+)
- [MySQL Server](https://www.mysql.com/) (v8.0)

### 1. Clone the Repository
```bash
git clone https://github.com/AnupamKanoongo/DBMS_Project_GreenChain.git
cd DBMS_Project_GreenChain
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Database
Update `config/database.js` with your local MySQL credentials:
```javascript
module.exports = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'supply_chain_db'
};
```

### 4. Initialize Database
The system includes an automated setup script to create tables and seed initial data:
```bash
node config/initDb.js
```

### 5. Start the Server
```bash
npm start
```
The application will be available at `http://localhost:3000`.

## 👥 Contributors

- **Anupam Kanoongo (F044)** - Backend Architecture, Database Design, SQL Optimization.
- **Arjun Borkar (F005)** - Frontend Development, Data Visualization, UI/UX Design.

## 📄 License
This project is developed for the **Database Management Systems (DBMS)** course (A.Y. 2025-26) at SVKM's NMIMS, Indore.
