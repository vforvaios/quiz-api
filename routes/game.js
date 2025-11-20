const express = require("express");
const verifyToken = require("../utils/verifyToken");
const Game = require("../controllers/game.controller");

const router = express.Router();

router.post("/save-score", verifyToken, Game.saveScore);
router.get("/profile/:id", verifyToken, Game.userProfile);

module.exports = router;
