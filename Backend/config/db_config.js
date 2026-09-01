const mongoose = require('mongoose')

async function connectDB () {
    try{
       await mongoose.connect(process.env.MONGO_URI);
       console.log("MONGODB CONNECTED")
    } catch (error){
        console.error(error);
        return;
    }
}

module.exports = connectDB