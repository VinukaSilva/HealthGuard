const mongoose = require("mongoose");

const connectToDB = async () => {
    const mongoDBUrl = 'mongodb+srv://admin:xQOTEMszzKa7E0Mi@healthguard.ofubfu3.mongodb.net/?retryWrites=true&w=majority';  
    try {
        await mongoose.connect(mongoDBUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

module.exports = connectToDB;
