const express = require("express");
const router = express.Router();

const CheckinController = require("../app/controllers/CheckinController.js");

router.get("/todayStatus", CheckinController.getTodayCheckinStatus);

router.get("/all", CheckinController.getAllCheckinStatus);

router.post("/", CheckinController.checkinPost);

module.exports = router;
