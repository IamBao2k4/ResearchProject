const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const beck_score = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    score: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("beck_scores", beck_score);