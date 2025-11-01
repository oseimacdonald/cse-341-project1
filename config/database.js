const { MongoClient } = require('mongodb');
require('dotenv').config();

let dbConnection;

module.exports = {
    connectToDb: (callback) => {
        MongoClient.connect(process.env.MONGODB_URI)
            .then(client => {
                dbConnection = client.db();
                console.log('Connected to MongoDB');
                return callback();
            })
            .catch(err => {
                console.log(err);
                return callback(err);
            });
    },
    getDb: () => dbConnection
};