const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { connectToDb } = require('./config/database');
const { specs, swaggerUi } = require('./config/swagger');

// Middleware
app.use(express.json());

// Routes
app.use('/', require('./routes'));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Connect to MongoDB and start server
connectToDb((err) => {
    if (!err) {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
        });
    }
});