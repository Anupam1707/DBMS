const mysql = require('mysql2');

// Create connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root1234', // Add your MySQL password here
  database: 'supply_chain_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get promise-based pool
const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.message);
    console.error('Please ensure MySQL is running and database "supply_chain_db" exists');
  } else {
    console.log('Connected to MySQL database');
    connection.release();
  }
});

module.exports = promisePool;
