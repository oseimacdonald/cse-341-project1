const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { connectToDb } = require('./config/database');

// Middleware
app.use(express.json());

// Routes
app.use('/', require('./routes'));

// Connect to MongoDB and start server
connectToDb((err) => {
    if (!err) {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
});