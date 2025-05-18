const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");
const qcTaskRoutes = require("./routes/QCTaskRoutes");
const app = express();
require('dotenv').config();


const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,  // ✅ Allow credentials
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};


app.use(cors(corsOptions));

// Improved body parsing
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.json());

// MongoDB Connection with retry logic
const URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/MistyEMS';
const connectWithRetry = () => {
  mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    setTimeout(connectWithRetry, 5000);
  });
};
connectWithRetry();

// Routes - Added both /api/qc-tasks and /api/tasks for compatibility
app.use('/api/qc-tasks', require('./routes/QCTaskRoutes'));
//app.use('/api/tasks', require('./routes/QCTaskRoutes')); // Alias for frontend compatibility
app.use('/api/qc-feedback', require('./routes/QCFeedbackRoutes'));
app.use('/api/qc-reports', require('./routes/QCReportRoutes'));



// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5371;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
