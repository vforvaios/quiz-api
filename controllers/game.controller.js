const db = require("../services/db");
const config = require("../config");
const { SAVESCORESCHEMA } = require("../schemas/game.schema");
require("dotenv").config();

const saveScore = async (req, res, next) => {
  try {
    const { value, error } = SAVESCORESCHEMA.validate(req.body);

    if (error) {
      console.log(error);
      res.status(500).json({ error: config.messages.error });
      return false;
    }

    const { userId, score, category, difficulty } = req.body;

    await db.query(
      `
        INSERT INTO USERS_SCORE(userId, categoryId, difficultyId, score) VALUES(?,?,?,?)
        `,
      [userId, category, difficulty, score]
    );
    res.status(200).json({});
  } catch (error) {
    res.sendStatus(401);
    console.log(error);
    next(error);
  }
};

module.exports = {
  saveScore,
};
