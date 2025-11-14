const config = require("../config");
const db = require("../services/db");

const getAdminQuestions = async (req, res, next) => {
  try {
    const category = req.query.category;
    const question = req.query.question;
    const page = req.query.page;

    let sql_results = ``;
    let sql_count_results = "";
    let wherePart = ` WHERE 1=1 `;
    let placeholdersVariables = [];

    // CONSTRUCT CATEGORY SQL PARTS
    let categoryInnerJoin = ` LEFT JOIN CATEGORIES_QUESTIONS cq on q.id = cq.questionId`;

    let questionWherePart = question
      ? ` AND q.question like CONCAT('%', ?, '%') `
      : ``;
    if (question) {
      placeholdersVariables.push(question);
    }
    let categoryWherePart = category ? ` AND cq.categoryId=?` : ``;
    if (category) {
      placeholdersVariables.push(category);
    }

    sql_results = `
      SELECT distinct q.id, q.question, cq.categoryId, JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', a.id,
          'answer', a.answer,
          'isCorrect', a.isCorrect
        )
      ) AS answers 
      FROM QUESTIONS q
      LEFT JOIN ANSWERS a ON q.id = a.questionId 
    ${categoryInnerJoin}
    ${wherePart}
    ${questionWherePart}
    ${categoryWherePart}
    GROUP BY q.id
    ORDER BY q.id
    LIMIT ${(page - 1) * config.recordsPerPage}, ${config.recordsPerPage}
    `;

    sql_count_results = `SELECT COUNT(distinct q.id) as total FROM QUESTIONS q 
    ${categoryInnerJoin}
    ${wherePart}
    ${questionWherePart} 
    ${categoryWherePart} 
    `;

    const [questions] = await db.query(sql_results, placeholdersVariables);
    const [total] = await db.query(sql_count_results, placeholdersVariables);
    questions.forEach((q) => {
      if (typeof q.answers === "string") {
        q.answers = JSON.parse(q.answers);
      }
    });

    res.json({ questions, total: total[0].total });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const [categories] = await db.query(
      `
      SELECT * FROM CATEGORIES
      `
    );
    res.status(200).json({
      categories,
    });
  } catch (error) {
    res.sendStatus(401);
    console.log(error);
    next(error);
  }
};

module.exports = {
  getAdminQuestions,
  getCategories,
};
