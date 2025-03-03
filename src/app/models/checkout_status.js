const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const checkout_status = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("checkout_status", checkout_status);