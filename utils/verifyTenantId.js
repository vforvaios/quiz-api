const verifyTenantId = (req, res, next) => {
  const requestedTenantId = String(req.params.id); // match ":id" in route
  const tokenTenantId = String(req.tenant_id); // set in verifyToken

  if (requestedTenantId !== tokenTenantId) {
    return res
      .status(403)
      .json({ error: "Access forbidden: tenant mismatch." });
  }

  next();
};

module.exports = verifyTenantId;
