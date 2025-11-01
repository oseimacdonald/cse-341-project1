const { MongoClient } = require('mongodb');
require('dotenv').config();

let dbConnection;
let client;

module.exports = {
    connectToDb: (callback) => {
        // Parse the connection string to get database name, or use default
        const connectionString = process.env.MONGODB_URI;
        let databaseName;
        
        // Extract database name from connection string
        try {
            const url = new URL(connectionString);
            databaseName = url.pathname.substring(1); // Remove the leading '/'
        } catch (e) {
            console.log('Could not parse connection string URL');
        }
        
        // If no database specified in connection string, use a default
        if (!databaseName) {
            databaseName = 'cse341-project1'; // CHANGE THIS TO YOUR DATABASE NAME
            console.log(`⚠️ No database specified in connection string. Using default: ${databaseName}`);
        }
        
        MongoClient.connect(connectionString)
            .then(connectedClient => {
                client = connectedClient;
                dbConnection = connectedClient.db(databaseName);
                console.log(`✅ Connected to MongoDB database: ${databaseName}`);
                return callback();
            })
            .catch(err => {
                console.log('❌ MongoDB connection error:', err);
                return callback(err);
            });
    },
    getDb: () => {
        if (!dbConnection) {
            throw new Error('Database not initialized. Call connectToDb first.');
        }
        return dbConnection;
    }
};