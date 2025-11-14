const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false;

module.exports = {
    connectToDb: (callback) => {
        const connectionString = process.env.MONGODB_URI;
        
        if (isConnected) {
            console.log('✅ Using existing database connection');
            return callback();
        }

        mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            isConnected = true;
            console.log('✅ Connected to MongoDB with Mongoose');
            return callback();
        })
        .catch(err => {
            console.log('❌ MongoDB connection error:', err);
            return callback(err);
        });
    },
    getDb: () => {
        if (!isConnected) {
            throw new Error('Database not initialized. Call connectToDb first.');
        }
        return mongoose.connection;
    }
};