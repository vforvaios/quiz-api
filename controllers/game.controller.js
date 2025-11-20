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

const userProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [profile] = await db.query(
      `
        SELECT SUM(score) as totalScore, COUNT(us.userId) as totalGames, name
        FROM USERS_SCORE us
        INNER JOIN USERS u ON u.userId = us.userId
        WHERE us.userId=?
        GROUP BY score, us.userId
        `,
      [id]
    );

    res.status(200).json({ profile: profile?.[0] });
  } catch (error) {
    res.sendStatus(401);
    console.log(error);
    next(error);
  }
};

const getLeaderBoard = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [leaderBoard] = await db.query(
      `
       SELECT 
            u.userId,
            u.name,
            COALESCE(SUM(us.score), 0) as totalScore
        FROM USERS u
        LEFT JOIN USERS_SCORE us ON u.userId = us.userId
        GROUP BY u.userId, u.name
        ORDER BY totalScore DESC
        LIMIT 8
        `
    );

    const [myRanking] = await db.query(
      `
          WITH scores AS (
              SELECT 
                  u.userId,
                  u.name,
                  COALESCE(SUM(us.score), 0) AS totalScore
              FROM USERS u
              LEFT JOIN USERS_SCORE us ON u.userId = us.userId
              GROUP BY u.userId, u.name
          ),
          ranked AS (
              SELECT
                  *,
                  RANK() OVER (ORDER BY totalScore DESC) AS rank
              FROM scores
          )
          SELECT *
          FROM ranked
          WHERE userId = ?
          `,
      [id]
    );

    res.status(200).json({
      leaderBoard: leaderBoard?.map((lead) =>
        lead?.userId === id ? { ...lead, me: true } : { ...lead }
      ),
      myRanking: myRanking?.[0],
    });
  } catch (error) {
    res.sendStatus(401);
    console.log(error);
    next(error);
  }
};

module.exports = {
  saveScore,
  userProfile,
  getLeaderBoard,
};
