const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const beck_answer = new Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    answer: { type: String, required: true },
});

module.exports = mongoose.model("beck_answers", beck_answer);