const express = require("express");
const router = express.Router();
const siteController = require("../app/controllers/SiteController.js");

router.get("/", siteController.home);

router.get("/login", siteController.login);

router.post("/login", siteController.loginPost);

router.get("/register", siteController.register);

router.post("/register", siteController.registerPost);

router.get("/verify/:userId/:uniqueString", siteController.verifyEmail);

router.get("/verified", siteController.verified);

router.get("/forgot-password", siteController.forgotPassword);

router.post("/forgot-password", siteController.forgotPasswordPost);

module.exports = router;