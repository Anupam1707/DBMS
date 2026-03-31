# GreenChain: Deep Project Explanation

## 1. Project Overview
GreenChain is a full-stack web application for quantifying and tracking carbon emissions across industrial supply chains. It enables organizations to monitor raw material sourcing, transport logistics, product compositions, and provides actionable analytics for environmental impact.

## 2. Technology Stack
- **Backend:** Node.js with Express.js for RESTful APIs and session management.
- **Database:** MySQL 8.0, chosen for its relational capabilities and support for complex queries.
- **Frontend:** AngularJS (v1.8.2) for a dynamic single-page application (SPA) experience.
- **Visualization:** Chart.js for real-time data visualization.
- **Styling:** Modern CSS3 for responsive and visually appealing layouts.
- **Security:** Bcrypt.js for password hashing, Express-Session for session management.

## 3. Folder & File Structure

### config/
- **database.js:** Sets up a MySQL connection pool using credentials. Exports a promise-based pool for async DB operations.
- **initDb.js:** Initializes the database, creates all tables, and seeds them with sample data. Uses bcrypt to hash the default admin password.

### middleware/
- **auth.js:** Contains `requireAuth` middleware to protect API routes. Checks for a valid session before allowing access.

### public/
- **css/**: Custom CSS styles for the frontend.
- **js/**: AngularJS logic.
  - **controllers/**: Angular controllers for each UI section (dashboard, login, register, suppliers, materials, products, transport logs, product composition, manage account).
  - **services/apiService.js**: Angular service for all API calls (auth, dashboard, suppliers, materials, products, etc.).
  - **app.js**: Main Angular module and route configuration. Handles SPA routing and authentication checks.
- **views/**: HTML partials for each SPA route.
- **index.html**: Main entry point for the frontend.

### routes/
- **auth.js**: Handles user registration, login, logout, profile management, and password changes.
- **dashboard.js**: Provides analytics endpoints (stats, recent transports, transport distribution, top suppliers, high emission materials).
- **materials.js**: CRUD operations for materials.
- **products.js**: CRUD operations for products.
- **suppliers.js**: CRUD operations for suppliers.
- **transportLogs.js**: CRUD operations for transport logs.
- **productComposition.js**: CRUD for mapping materials to products.

### server.js
- Main entry point for the backend. Sets up Express, middleware, session, static file serving, and API routes. Handles errors and starts the server.

### package.json
- Lists all dependencies and scripts for running the project.

## 4. Database Schema
- **USERS:** Stores user credentials and profile info. Passwords are hashed.
- **SUPPLIERS:** Information about material suppliers, including city and distance.
- **MATERIALS:** Raw materials and their emission factors.
- **PRODUCTS:** Finished products and batch numbers.
- **TRANSPORT_LOG:** Tracks shipments, weights, and transport modes. Links materials and suppliers.
- **PRODUCT_COMPOSITION:** Maps which materials are used in which product batches and in what quantity.

## 5. Backend Architecture & API Routes
- All API endpoints are under `/api/`.
- **/api/auth/**: Registration, login, logout, profile, password.
- **/api/dashboard/**: Analytics endpoints (stats, charts, top suppliers, etc.).
- **/api/suppliers, /api/materials, /api/products, /api/transport-logs, /api/product-composition**: CRUD endpoints for each entity.
- Protected routes use `requireAuth` middleware to ensure only authenticated users can access them.

## 6. Frontend Structure
- **AngularJS SPA**: Uses `$routeProvider` for client-side routing. Each route loads a specific controller and view.
- **Controllers**: Manage UI logic for each section (login, register, dashboard, etc.).
- **ApiService**: Handles all HTTP requests to the backend, including authentication and CRUD operations.
- **Views**: HTML partials for each route, loaded dynamically.
- **Chart.js**: Used in dashboard for visualizing transport and emission data.

## 7. Authentication & Security
- **Session-based authentication**: User session is stored on the server using express-session.
- **Password hashing**: All passwords are hashed with bcrypt before storage.
- **Protected routes**: Backend checks for valid session before allowing access to sensitive endpoints.

## 8. Setup & Installation
1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Configure database**: Edit `config/database.js` with your MySQL credentials.
4. **Initialize database**: `node config/initDb.js` (creates tables and seeds data)
5. **Start the server**: `npm start` (runs on http://localhost:3000)

## 9. Troubleshooting
- **bcrypt errors on Apple Silicon**: Delete `node_modules` and `package-lock.json`, then run `npm install` to rebuild native modules.
- **MySQL connection errors**: Ensure MySQL is running and credentials are correct in `config/database.js`.
- **Port in use**: If port 3000 is busy, stop other processes or change the port in `server.js`.

## 10. Example Usage Scenarios
- **Register/Login**: Users can register and log in securely.
- **Manage Suppliers/Materials/Products**: Add, edit, or delete supply chain entities.
- **Log Shipments**: Record new material shipments and their transport modes.
- **Define Product Composition**: Map materials to product batches.
- **View Dashboard**: See analytics on emissions, transport, and suppliers.

## 11. Contributors
- Anupam Kanoongo (Backend, DB, SQL)
- Arjun Borkar (Frontend, UI/UX)

## 12. License
Developed for the DBMS course at SVKM's NMIMS, Indore.
