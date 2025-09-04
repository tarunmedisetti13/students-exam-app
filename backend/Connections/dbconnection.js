const mongoose = require('mongoose');
require('dotenv').config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error);
        process.exit(1); // Exit process if DB connection fails
    }
}
module.exports = connectDB;
