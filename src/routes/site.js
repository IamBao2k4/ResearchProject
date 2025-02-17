const express = require("express");
const router = express.Router();
const siteController = require("../app/controllers/SiteController.js");

router.get("/", (req, res) => {
    res.render("home", { 
        user: req.user,
        avatar: req.user?.avatar || '/img/anonymous-avatar.png'
    });
});

router.get("/login", 
    siteController.checkNotAuthenticated,
    siteController.login);

router.post("/login", siteController.loginPost);

router.get("/register", 
    siteController.checkNotAuthenticated,
    siteController.register);

router.post("/register", siteController.registerPost);

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

module.exports = router;