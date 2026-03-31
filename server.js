const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: 'supply-chain-secret-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');
const suppliersRouter = require('./routes/suppliers');
const materialsRouter = require('./routes/materials');
const productsRouter = require('./routes/products');
const transportLogsRouter = require('./routes/transportLogs');
const productCompositionRouter = require('./routes/productComposition');

// Import middleware
const { requireAuth } = require('./middleware/auth');

// Public routes (no authentication required)
app.use('/api/auth', authRouter);

// Protected routes (authentication required)
app.use('/api/dashboard', requireAuth, dashboardRouter);
app.use('/api/suppliers', requireAuth, suppliersRouter);
app.use('/api/materials', requireAuth, materialsRouter);
app.use('/api/products', requireAuth, productsRouter);
app.use('/api/transport-logs', requireAuth, transportLogsRouter);
app.use('/api/product-composition', requireAuth, productCompositionRouter);

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Supply Chain Management System API is ready!');
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} is already in use.`);
    console.error(`Run: npm run dev   (the predev script auto-kills it)\n`);
    process.exit(1);
  } else {
    throw err;
  }
});
