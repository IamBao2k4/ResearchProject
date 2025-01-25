var express = require('express');
var router = express.Router();
const beck_answerController = require('../app/controllers/beck_answerController');

/* GET users listing. */
router.get('/beck_answer', beck_answerController.getAll);

module.exports = router;
