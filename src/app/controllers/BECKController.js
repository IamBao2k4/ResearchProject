const beck_answer = require("../models/beck_answer.js");
const beck_question = require("../models/beck_question.js");
const beck_score = require("../models/beck_score.js");
const Users = require("../models/Users.js");
const checkin_status = require("../models/checkin_status.js");
const checkout_status = require("../models/checkout_status.js");

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
            return res.status(200).json(answers);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async get(req, res) {
        try {
            const { id } = req.params;
            const answer = await beck_answer.find({ questionId: id }).sort({ _id: "asc" });
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

    async getQuestions(req, res) {
        try {
            const questions = await beck_question.find().sort({ question: "asc" }).limit(21);
            return res.status(200).json(questions);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // [POST] /api/beck_score
    async beck_score(req, res) {
        try {
            const user = req.user;
            const score = req.body.score;
            
            // Lưu điểm vào beck_score
            await beck_score.create({ userId: user._id, score });
            
            // Cập nhật lastSurveyScore và surveyDate cho user 
            await Users.findByIdAndUpdate(user._id, { lastSurveyScore: score });
            await Users.findByIdAndUpdate(user._id, { surveyDate: new Date() });

            return res.status(201).json({ message: "Score created successfully" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // [GET] /api/all-status-date
    async getAllStatusDate(req, res) {
        try {
            const userId = req.user._id;

            const checkinStatus = await checkin_status.find({ userId: userId }).sort({ date: -1 });
            const checkoutStatus = await checkout_status.find({ userId: userId }).sort({ date: -1 });

            let dates = [];

            checkinStatus.forEach(checkin => {
                const dateStr = checkin.date.toISOString().split("T")[0];
                if (!dates.includes(dateStr)) {
                    dates.push(dateStr);
                }
            });
    
            checkoutStatus.forEach(checkout => {
                const dateStr = checkout.date.toISOString().split("T")[0];
                if (!dates.includes(dateStr)) {
                    dates.push(dateStr);
                }
            });

            const uniqueDates = dates.sort((a, b) => new Date(a) - new Date(b));

            return res.status(200).json(uniqueDates);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new beck_answerController();