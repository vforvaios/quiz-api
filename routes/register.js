const express = require("express");
const Register = require("../controllers/register.controller");

const router = express.Router();

router.post("/", Register.registerUser);

module.exports = router;
