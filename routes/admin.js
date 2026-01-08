const express = require("express");
const verifyToken = require("../utils/verifyToken");
const verifyUserAdmin = require("../utils/verifyUserAdmin");
const Admin = require("../controllers/admin.controller");

const router = express.Router();

router.get("/questions", verifyToken, verifyUserAdmin, Admin.getAdminQuestions);
router.get("/categories", verifyToken, verifyUserAdmin, Admin.getCategories);
router.get("/difficulties", Admin.getDifficulties);
router.put(
  "/questions/:id",
  verifyToken,
  verifyUserAdmin,
  Admin.updateQuestion
);
router.delete(
  "/questions/:id",
  verifyToken,
  verifyUserAdmin,
  Admin.deleteQuestion
);
router.post("/questions", verifyToken, verifyUserAdmin, Admin.addQuestion);

module.exports = router;
