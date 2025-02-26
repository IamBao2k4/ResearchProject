const express = require("express");
const router = express.Router();
const profileController = require("../app/controllers/profileController.js");
const siteController = require("../app/controllers/SiteController.js");

router.get("/",
    siteController.checkAuthenticated,
    profileController.profile);

module.exports = router;