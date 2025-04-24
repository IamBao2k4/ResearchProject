const express = require("express");
const router = express.Router();
const profileController = require("../app/controllers/profileController.js");
const siteController = require("../app/controllers/SiteController.js");

const { uploadAvatar } = require("../middlewares/multer");

router.get("/",
    siteController.checkAuthenticated,
    profileController.profile);

router.post("/update-avatar",
    uploadAvatar,
    profileController.updateAvatar);

router.post(
    "/update",
    siteController.checkAuthenticated,
    profileController.updateProfile
);
router.post(
    "/update-password",
    siteController.checkAuthenticated,
    profileController.updatePassword
);

router.post('/update-finished-steps',
    siteController.checkAuthenticated,
    profileController.updateFinishedSteps);

router.get('/get-finished-steps',
    siteController.checkAuthenticated,
    profileController.getFinishedSteps);

router.post('/update-watched-videos',
    siteController.checkAuthenticated,
    profileController.updateWatchedVideos);

router.get('/get-watched-videos',
    siteController.checkAuthenticated,
    profileController.getWatchedVideos);

router.post('/reset-watched-videos',
    siteController.checkAuthenticated,
    profileController.resetWatchedVideos);

module.exports = router;