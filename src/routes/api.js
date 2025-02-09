const express = require('express');
const router = express.Router();
const BECKController = require('../app/controllers/BECKController');
const authMiddleware = require('../middlewares/authMiddleware');

/* GET users listing. */
router.get('/beck_answer', BECKController.getAll);

router.get('/beck_answer/:id', BECKController.get);

router.get('/beck_question', BECKController.getQuestions);

router.post('/beck_score', 
    authMiddleware,
    BECKController.beck_score);

module.exports = router;
