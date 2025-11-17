const express = require("express");
const verifyToken = require("../utils/verifyToken");
const verifyUserAdmin = require("../utils/verifyUserAdmin");
const Admin = require("../controllers/admin.controller");

const router = express.Router();

router.get("/questions", verifyToken, verifyUserAdmin, Admin.getAdminQuestions);
router.get("/categories", verifyToken, verifyUserAdmin, Admin.getCategories);
router.get("/difficulties", Admin.getDifficulties);
router.put("/questions", verifyToken, verifyUserAdmin, Admin.updateQuestion);

module.exports = router;
