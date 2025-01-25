require('dotenv').config();

const mongoose = require("mongoose");

const connectionString = process.env.CONNECTION_STRING;

async function connect() {
    try {
        await mongoose.connect(
            connectionString,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log("Connect Successfully!!!");
    } catch (error) {
        console.log("Connect failure!!!", error.message);
        console.error(error.stack);
    }
}

module.exports = { connect };