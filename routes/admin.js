const express = require("express");
const verifyToken = require("../utils/verifyToken");
const verifyTenantId = require("../utils/verifyTenantId");
const Admin = require("../controllers/admin.controller");

const router = express.Router();

router.get(
  "/questions",
  // verifyToken,
  // verifyTenantId,
  Admin.getAdminQuestions
);

module.exports = router;
