const express = require("express");
const router = express.Router();

const CheckoutController = require("../app/controllers/CheckoutController.js");


router.get("/todayStatus", CheckoutController.getCheckoutStatus);

router.post("/", CheckoutController.checkoutPost);

module.exports = router;
