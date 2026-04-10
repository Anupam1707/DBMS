const bcrypt = require('bcrypt');
const mysql = require('mysql2');

// Create connection (without selecting database first)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root' // Add your MySQL password here
});

async function initializeDatabase() {
  try {
    // Create database if not exists
    await connection.promise().query('CREATE DATABASE IF NOT EXISTS supply_chain_db');
    console.log('Database supply_chain_db created or already exists');
    
    // Use the database
    await connection.promise().query('USE supply_chain_db');
    
    // Drop existing tables if they exist (for clean initialization)
    console.log('\nDropping existing tables...');
    await connection.promise().query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.promise().query('DROP TABLE IF EXISTS PRODUCT_COMPOSITION');
    await connection.promise().query('DROP TABLE IF EXISTS TRANSPORT_LOG');
    await connection.promise().query('DROP TABLE IF EXISTS PRODUCTS');
    await connection.promise().query('DROP TABLE IF EXISTS MATERIALS');
    await connection.promise().query('DROP TABLE IF EXISTS SUPPLIERS');
    await connection.promise().query('DROP TABLE IF EXISTS USERS');
    await connection.promise().query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Tables dropped successfully');

    // Create USERS table
    await connection.promise().query(`
      CREATE TABLE USERS (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        full_name VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('USERS table created successfully');

    // Create SUPPLIERS table
    await connection.promise().query(`
      CREATE TABLE SUPPLIERS (
        Supplier_ID INT PRIMARY KEY AUTO_INCREMENT,
        Supplier_Name VARCHAR(255) NOT NULL,
        City VARCHAR(255) NOT NULL,
        Distance_KM INT NOT NULL
      )
    `);
    console.log('SUPPLIERS table created successfully');

    // Create MATERIALS table
    await connection.promise().query(`
      CREATE TABLE MATERIALS (
        Material_ID INT PRIMARY KEY AUTO_INCREMENT,
        Material_Name VARCHAR(255) NOT NULL,
        Emission_Factor DECIMAL(10,2) NOT NULL
      )
    `);
    console.log('MATERIALS table created successfully');

    // Create PRODUCTS table
    await connection.promise().query(`
      CREATE TABLE PRODUCTS (
        Product_ID INT PRIMARY KEY AUTO_INCREMENT,
        Product_Name VARCHAR(255) NOT NULL,
        Batch_Number VARCHAR(255) NOT NULL
      )
    `);
    console.log('PRODUCTS table created successfully');

    // Create TRANSPORT_LOG table
    await connection.promise().query(`
      CREATE TABLE TRANSPORT_LOG (
        Log_ID INT PRIMARY KEY AUTO_INCREMENT,
        Material_ID INT NOT NULL,
        Supplier_ID INT NOT NULL,
        Weight_KG DECIMAL(10,2) NOT NULL,
        Transport_Mode ENUM('Air', 'Ship', 'Truck', 'Rail') NOT NULL,
        FOREIGN KEY (Material_ID) REFERENCES MATERIALS(Material_ID) ON DELETE CASCADE,
        FOREIGN KEY (Supplier_ID) REFERENCES SUPPLIERS(Supplier_ID) ON DELETE CASCADE
      )
    `);
    console.log('TRANSPORT_LOG table created successfully');

    // Create PRODUCT_COMPOSITION table
    await connection.promise().query(`
      CREATE TABLE PRODUCT_COMPOSITION (
        Composition_ID INT PRIMARY KEY AUTO_INCREMENT,
        Product_ID INT NOT NULL,
        Material_ID INT NOT NULL,
        Quantity_Used DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (Product_ID) REFERENCES PRODUCTS(Product_ID) ON DELETE CASCADE,
        FOREIGN KEY (Material_ID) REFERENCES MATERIALS(Material_ID) ON DELETE CASCADE
      )
    `);
    console.log('PRODUCT_COMPOSITION table created successfully');

    // Insert sample data
    console.log('\nInserting sample data...');
    
    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.promise().query(
      'INSERT INTO USERS (username, password, email, full_name) VALUES (?, ?, ?, ?)',
      ['admin', hashedPassword, 'admin@example.com', 'Administrator']
    );
    console.log('Default admin user created (username: admin, password: admin123)');

    // Sample suppliers
    const suppliers = [
      ['ABC Materials Co.', 'Mumbai', 500],
      ['Global Supplies Inc.', 'Delhi', 800],
      ['East Asia Trading', 'Bangalore', 300],
      ['Western Materials Ltd.', 'Chennai', 600],
      ['Northern Supplies Co.', 'Kolkata', 1000]
    ];

    for (const supplier of suppliers) {
      await connection.promise().query(
        'INSERT INTO SUPPLIERS (Supplier_Name, City, Distance_KM) VALUES (?, ?, ?)',
        supplier
      );
    }
    console.log('Sample suppliers inserted');

    // Sample materials
    const materials = [
      ['Steel', 1.85],
      ['Aluminum', 8.24],
      ['Plastic', 3.5],
      ['Copper', 4.2],
      ['Glass', 0.85]
    ];

    for (const material of materials) {
      await connection.promise().query(
        'INSERT INTO MATERIALS (Material_Name, Emission_Factor) VALUES (?, ?)',
        material
      );
    }
    console.log('Sample materials inserted');

    // Sample products
    const products = [
      ['Laptop Model X', 'BATCH-2024-001'],
      ['Smartphone Pro', 'BATCH-2024-002'],
      ['Tablet Ultra', 'BATCH-2024-003'],
      ['Desktop Workstation', 'BATCH-2024-004'],
      ['Smart Watch', 'BATCH-2024-005']
    ];

    for (const product of products) {
      await connection.promise().query(
        'INSERT INTO PRODUCTS (Product_Name, Batch_Number) VALUES (?, ?)',
        product
      );
    }
    console.log('Sample products inserted');

    // Sample transport logs
    const transportLogs = [
      [1, 1, 500.5, 'Truck'],
      [2, 2, 300.75, 'Ship'],
      [3, 3, 150.25, 'Air'],
      [1, 4, 800.0, 'Rail'],
      [2, 5, 250.5, 'Truck']
    ];

    for (const log of transportLogs) {
      await connection.promise().query(
        'INSERT INTO TRANSPORT_LOG (Material_ID, Supplier_ID, Weight_KG, Transport_Mode) VALUES (?, ?, ?, ?)',
        log
      );
    }
    console.log('Sample transport logs inserted');

    // Sample product compositions
    const compositions = [
      [1, 1, 2.5],
      [1, 2, 1.0],
      [2, 3, 0.5],
      [3, 4, 0.8],
      [4, 1, 5.0]
    ];

    for (const comp of compositions) {
      await connection.promise().query(
        'INSERT INTO PRODUCT_COMPOSITION (Product_ID, Material_ID, Quantity_Used) VALUES (?, ?, ?)',
        comp
      );
    }
    console.log('Sample product compositions inserted');

    console.log('\n✓ Database initialization completed successfully!');
    console.log('\nDefault Login Credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error initializing database:', error.message);
  } finally {
    connection.end();
  }
}

initializeDatabase();
