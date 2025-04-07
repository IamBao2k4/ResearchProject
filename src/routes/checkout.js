const express = require("express");
const router = express.Router();

const CheckoutController = require("../app/controllers/CheckoutController.js");


router.get("/todayStatus", CheckoutController.getTodayCheckoutStatus);

router.get("/all", CheckoutController.getAllCheckoutStatus);

router.post("/", CheckoutController.checkoutPost);

module.exports = router;
