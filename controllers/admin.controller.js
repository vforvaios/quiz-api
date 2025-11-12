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
    let categoryInnerJoin = category
      ? ` INNER JOIN CATEGORIES_QUESTIONS on q.id = CATEGORIES_QUESTIONS.questionId`
      : "";

    let questionWherePart = question
      ? ` AND q.question like CONCAT('%', ?, '%') `
      : ``;
    if (question) {
      placeholdersVariables.push(question);
    }
    let categoryWherePart = category
      ? ` AND CATEGORIES_QUESTIONS.categoryId=?`
      : ``;
    if (category) {
      placeholdersVariables.push(category);
    }

    sql_results = `SELECT distinct q.id, q.question FROM QUESTIONS q
    ${categoryInnerJoin}
    ${wherePart}
    ${questionWherePart}
    ${categoryWherePart}
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

    res.json({ questions, total: total[0].total });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  getAdminQuestions,
};
