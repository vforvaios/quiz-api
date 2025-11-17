const config = require("../config");
const db = require("../services/db");

const { QUESTIONSCHEMA } = require("../schemas/questions.schema");

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
      SELECT distinct q.id, q.question, q.difficultyId, q.isActive, cq.categoryId, JSON_ARRAYAGG(
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

const getDifficulties = async (req, res, next) => {
  try {
    const [difficulties] = await db.query(
      `
      SELECT * FROM DIFFICULTIES
      `
    );
    res.status(200).json({
      difficulties,
    });
  } catch (error) {
    res.sendStatus(401);
    console.log(error);
    next(error);
  }
};

const updateQuestion = async (req, res, next) => {
  const { value, error } = QUESTIONSCHEMA.validate(req.body);

  if (error) {
    console.log(error);
    res.status(500).json({ error: config.messages.error });
    return false;
  } else {
    const { id, categoryId, question, difficultyId, answers } = req.body;
    if (answers?.length <= 1) {
      res
        .status(500)
        .json({ message: "Η ερώτηση πρέπει να έχει πάνω από μία απάντηση." });
    } else {
      let conn = await db.getConnection();
      try {
        await conn.beginTransaction();

        // ΑΡΧΙΚΑ ΚΑΝΩ UPDATE ΤΟΝ ΣΥΝΔΥΑΣΜΟ QUESTION/CATEGORY
        await conn.query(
          `UPDATE CATEGORIES_QUESTIONS SET categoryId=? WHERE questionId=?`,
          [categoryId, id]
        );

        // ΜΕΤΑ ΚΑΝΩ UPDATE ΣΤΟ QUESTIONS ΜΕ ΤΗΝ ΚΑΙΝΟΥΡΙΑ ΕΡΩΤΗΣΗ ΚΑΙ ΤΗΝ ΚΑΙΝΟΥΡΙΑ ΔΥΣΚΟΛΙΑ
        await conn.query(
          `
          UPDATE QUESTIONS SET difficultyId=?, question=? WHERE id=?
          `,
          [difficultyId, question, id]
        );

        // ΜΕΤΑ ΔΙΑΓΡΑΦΩ ΤΙΣ ΥΠΑΡΧΟΥΣΕΣ ΑΠΑΝΤΗΣΕΙΣ
        await conn.query(
          `
          DELETE FROM ANSWERS WHERE questionId=?
          `,
          id
        );

        // ΜΕΤΑ ΕΙΣΑΓΩ ΤΙΣ ΚΑΙΝΟΥΡΙΕΣ ANSWERS
        const answersToBeInserted = answers?.map((ans) => [
          id,
          ans.answer,
          ans.isCorrect,
        ]);
        await conn.query(
          `
          INSERT INTO ANSWERS(questionId, answer, isCorrect) VALUES=?
          `,
          [answersToBeInserted]
        );

        await conn.commit();

        res.status(200).json({
          message: "Η ερώτηση και οι απαντήσεις ενημερώθηκαν επιτυχώς!",
        });
      } catch (error) {
        await conn.rollback();
        res.sendStatus(401);
        console.log(error);
        next(error);
      } finally {
        conn.release();
      }
    }
  }
};

module.exports = {
  getAdminQuestions,
  getCategories,
  getDifficulties,
  updateQuestion,
};
