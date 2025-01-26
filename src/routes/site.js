var express = require('express');
var router = express.Router();
const siteController = require('../app/controllers/SiteController');

router.get('/', siteController.login);

module.exports = router;