const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const mobileVerificationRoutes = require('./routes/mobileVerification');

const app = express();

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // Add your Firebase project configuration here
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/mobile-verification', mobileVerificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 