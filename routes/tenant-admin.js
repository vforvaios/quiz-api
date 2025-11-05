const express = require("express");
const verifyToken = require("../utils/verifyToken");
const verifyTenantId = require("../utils/verifyTenantId");
const TenantAdmin = require("../controllers/tenant-admin.controller");

const router = express.Router();

router.get(
  "/tenant/:id/templates",
  verifyToken,
  verifyTenantId,
  TenantAdmin.getTenantTemplates
);

module.exports = router;
