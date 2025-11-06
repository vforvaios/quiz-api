const db = require("../services/db");

const getQuestionsByCategoryAndDifficulty = async (req, res, next) => {
  try {
    const category = req.query.category;
    const difficulty = req.query.difficulty;

    const [questions] = await db.query(
      `
        SELECT q.id, q.question
        FROM QUESTIONS q
        INNER JOIN CATEGORIES_QUESTIONS cq ON cq.questionId = q.id
        WHERE cq.categoryId = ? AND q.difficultyId = ? AND q.isActive = 1
        ORDER BY RAND()               
        LIMIT 5;
      `,
      [category, difficulty]
    );

    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found" });
    }

    const questionIds = questions.map((q) => q.id);
    const placeholders = questionIds.map(() => "?").join(", ");

    const [answers] = await db.query(
      `
        SELECT *
        FROM ANSWERS
        WHERE questionId IN (${placeholders})
        ORDER BY questionId, id;
        `,
      questionIds
    );

    const questionsWithAnswers = questions.map((q) => ({
      ...q,
      answers: answers.filter((a) => a.questionId === q.id),
    }));
    res.status(200).json({
      questionsWithAnswers,
    });
  } catch (error) {
    res.sendStatus(401);
    console.log(error);
    next(error);
  }
};

module.exports = {
  getQuestionsByCategoryAndDifficulty,
};
