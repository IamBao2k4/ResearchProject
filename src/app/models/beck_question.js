const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const beck_question = new Schema({
    question: { type: Number, required: true },
});

module.exports = mongoose.model("beck_questions", beck_question);