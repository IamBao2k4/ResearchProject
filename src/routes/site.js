const express = require("express");
const router = express.Router();
const siteController = require("../app/controllers/SiteController.js");

router.get("/", siteController.home);

router.get("/login", 
    siteController.checkNotAuthenticated,
    siteController.login);

router.post("/login", siteController.loginPost);

router.get("/register", 
    siteController.checkNotAuthenticated,
    siteController.register);

router.post("/register", siteController.registerPost);

router.post("/logout", siteController.logout);

router.get("/verify/:userId/:uniqueString", siteController.verifyEmail);

router.get("/verified", siteController.verified);

router.get("/forgot-password", siteController.forgotPassword);

router.post("/forgot-password", siteController.forgotPasswordPost);

router.get("/survey", 
    siteController.checkAuthenticated,
    siteController.survey);

router.get("/practice/:score", 
    siteController.checkAuthenticated,
    siteController.practice);

router.get("/diary-status", 
    siteController.checkAuthenticated,
    siteController.diaryStatus);

module.exports = router;