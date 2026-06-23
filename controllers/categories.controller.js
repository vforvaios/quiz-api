const db = require("../services/db");

const getCategories = async (req, res, next) => {
  console.log("=======================================");
  try {
    const [categories] = await db.query(
      `
      SELECT * FROM categories WHERE isActive=?
      `,
      [1],
    );
    res.status(200).json({
      trivia_categories: categories?.map((cat) => ({
        id: cat.id,
        name: cat.category_name,
      })),
    });
  } catch (error) {
    res.sendStatus(401);
    console.log(error);
    next(error);
  }
};

module.exports = {
  getCategories,
};
