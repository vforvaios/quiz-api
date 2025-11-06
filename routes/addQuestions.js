const express = require("express");
const AddQuestions = require("../controllers/addQuestions.controller");

const router = express.Router();

router.post("/add-questions/:id", AddQuestions.addQuestions);

module.exports = router;
