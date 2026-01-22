
const mongoose = require('mongoose');

const main = async () => {
    console.log('Connecting to the database...');
    console
    try {
        await mongoose.connect(process.env.DB_URL, {
            dbName: 'ecommerceDB'
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

module.exports = main;