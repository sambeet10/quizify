const mongoose = require('mongoose');

async function dbConnect() {
    const DB_URL = process.env.DB_URL;
    const DB_NAME = process.env.DB_NAME;

    try {
        await mongoose.connect(`${DB_URL}/${DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
    }
}

module.exports = dbConnect;