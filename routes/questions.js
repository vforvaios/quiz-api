const express = require("express");
const Questions = require("../controllers/questions.controller");

const router = express.Router();

router.get("/", Questions.getQuestionsByCategoryAndDifficulty);

module.exports = router;
