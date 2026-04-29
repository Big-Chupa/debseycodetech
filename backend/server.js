const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// --- IMPORT ALL ROUTES ---
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); // Our Cloudinary Video route

// --- INITIALIZE APP ---
const app = express();

// --- MIDDLEWARE ---
app.use(cors()); // Allows your React frontend to talk to this backend
app.use(express.json()); // Allows the backend to understand JSON data

// --- CONNECT TO MONGODB ---
// THE FIX: Removed the outdated parser options. Modern Mongoose handles this automatically!
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ Successfully connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// --- ROUTE TRAFFIC COP ---
// When the frontend asks for these URLs, send them to the right file!
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/upload', uploadRoutes);

// --- ROOT ROUTE (Just to test if the server is awake) ---
app.get('/', (req, res) => {
    res.send('DesbyCodeTech Backend API is running smoothly...');
});

// --- START THE SERVER ---
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
    console.log(`✅ Auth, Course, and Upload routes loaded.`);
    console.log(`========================================\n`);
});