const express = require('express');
const cors = require('cors');
const path = require('path');

// ⬇️ FORCE dotenv to load ONLY server/.env
require('dotenv').config({ path: path.resolve(__dirname, '.env') });



const connectDB = require('./config/db');                   // 👈 now env is available

const app = express();

// CORS - Allow frontend to connect
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Health check (used by Render/Railway)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/todos', require('./routes/todos'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});