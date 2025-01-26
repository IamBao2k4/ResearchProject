const beck_answer = require("../models/beck_answer.js");
const beck_question = require("../models/beck_question");

class beck_answerController {

  async create(req, res) {
    try {
      const { question, answer } = req.body;
      const questionExist = await beck_question.findOne({ question });
        if (!questionExist) {
            return res.status(400).json({ message: "Question not found" });
        }
        const answerExist = await beck_answer.findOne({ question, answer });
        if (answerExist) {
            return res.status(400).json({ message: "Answer already exists" });
        }
        const newAnswer = await beck_answer.create({ question, answer });
        return res.status(201).json(newAnswer);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    }

    async getAll(req, res) {
        try {
            const answers = await beck_answer.find();
            console.log("answers", answers);
            return res.status(200).json(answers);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const answer = await beck_answer.findById(id);
            if (!answer) {
                return res.status(404).json({ message: "Answer not found" });
            }
            return res.status(200).json(answer);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { question, answer } = req.body;
            const answerExist = await beck_answer.findById(id);
            if (!answerExist) {
                return res.status(404).json({ message: "Answer not found" });
            }
            const questionExist = await beck_question.findOne({ question });
            if (!questionExist) {
                return res.status(400).json({ message: "Question not found" });
            }
            const newAnswer = await beck_answer.findByIdAndUpdate(id, { question, answer }, { new: true });
            return res.status(200).json(newAnswer);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    
    async delete(req, res) {
        try {
            const { id } = req.params;
            const answerExist = await beck_answer.findById(id);
            if (!answerExist) {
                return res.status(404).json({ message: "Answer not found" });
            }
            await beck_answer.findByIdAndDelete(id);
            return res.status(200).json({ message: "Answer deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new beck_answerController();