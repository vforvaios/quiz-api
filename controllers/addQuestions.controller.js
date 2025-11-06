const db = require("../services/db");
const csv = require("csv-parser");
const fs = require("fs");

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", () => resolve(rows))
      .on("error", (err) => reject(err));
  });
}

const addQuestions = async (req, res, next) => {
  const fileType = req.params.id;
  const rows = await parseCSV(`./csv/quiz_${fileType}.csv`);
  let conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 2️⃣ Batch insert ερωτήσεων
    const questionValues = rows.map((r) => [r.Question, r.Difficulty]);
    const [
      questionResult,
    ] = await conn.query(
      "INSERT INTO QUESTIONS (question, difficultyId) VALUES ?",
      [questionValues]
    );

    // Υπολογισμός questionIds
    const questionIdStart = questionResult.insertId;
    const questionIds = rows.map((_, i) => questionIdStart + i);

    // 3️⃣ Batch insert Categories_Questions
    const categoryQuestionValues = rows.map((r, i) => [
      r.Category,
      questionIds[i],
    ]);
    await conn.query(
      "INSERT INTO CATEGORIES_QUESTIONS (categoryId, questionId) VALUES ?",
      [categoryQuestionValues]
    );

    // 4️⃣ Batch insert Answers
    const answerValues = [];
    rows.forEach((r, i) => {
      const qId = questionIds[i];
      answerValues.push([qId, r.Correct, true]);
      const wrongAnswers = [r.Wrong, r["Wrong.1"], r["Wrong.2"]].filter(
        Boolean
      );
      wrongAnswers.forEach((w) => answerValues.push([qId, w, false]));
    });

    await conn.query(
      "INSERT INTO ANSWERS (questionId, answer, isCorrect) VALUES ?",
      [answerValues]
    );

    await conn.commit();
    res.json({ success: true, message: "CSV imported successfully" });

    res.status(200).json({ fileType });
  } catch (error) {
    await conn.rollback();
    res.sendStatus(401);
    console.log(error);
    next(error);
  } finally {
    conn.release();
  }
};

module.exports = {
  addQuestions,
};
