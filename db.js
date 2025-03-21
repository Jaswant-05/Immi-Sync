const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connection successful!");
    }
    catch(error){
        console.error("Mongoose connection faliure",error);
    }
};

module.exports = {
    connectDB
}