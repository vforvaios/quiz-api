const verifyUserAdmin = (req, res, next) => {
  const userIsAdmin = String(req.isAdmin); // set in verifyToken

  if (!userIsAdmin) {
    return res
      .status(403)
      .json({ error: "Access forbidden: tenant mismatch." });
  }

  next();
};

module.exports = verifyUserAdmin;
