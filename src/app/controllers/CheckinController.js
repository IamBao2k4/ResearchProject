const Users = require("../models/Users.js");
const checkin_status = require("../models/checkin_status.js");

class CheckinController {
    // [GET] /checkin/all
    getAllCheckinStatus(req, res) {
        const userId = req.user._id;
        checkin_status.findMany({ userId: userId })
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                res.json(err);
            });
    }

    // [GET] /checkin/todayStatus
    async getTodayCheckinStatus(req, res) {
        const userId = req.user._id;
        try {
            const data = await checkin_status.find({userId: userId}).sort({date: -1}).limit(1);
            res.json(data);
        } catch (err) {
            res.json(err);
        }
    }

    // [POST] /checkin
    async checkinPost(req, res) {
        try {
            const user = req.user;
            const { status } = req.body;
            await checkin_status.create({ userId: user._id, status, date: new Date() });
            const data = {
                success: true,
                message: "Checkin successful",
            };
            res.json(data);
        } catch (error) {
            res.json(error);
        }
    }
}

module.exports = new CheckinController();