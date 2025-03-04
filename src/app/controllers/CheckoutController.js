const Users = require("../models/Users.js");
const checkout_status = require("../models/checkout_status.js");

class CheckoutController {
    // [GET] /checkout/all
    getAllCheckoutStatus(req, res) {
        const userId = req.params.userId;
        checkout_status.findMany({ userId: userId })
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                res.json(err);
            });
    }

    // [GET] /checkout/todayStatus
    async getTodayCheckoutStatus(req, res) {
        const userId = req.user._id;
        try {
            const data = await checkout_status.find({userId: userId}).sort({date: -1}).limit(1);
            res.json(data);
        } catch (err) {
            res.json(err);
        }
    }

    // [POST] /checkout
    async checkoutPost(req, res) {
        try {
            const user = req.user;
            const { status } = req.body;
            await checkout_status.create({ userId: user._id, status, date: new Date() });
            let data = {};
            data.success = true;
            data.message = "Checkout successful";
            res.json(data);
        } catch (error) {
            res.json(error);
        }
    }
}

module.exports = new CheckoutController;
