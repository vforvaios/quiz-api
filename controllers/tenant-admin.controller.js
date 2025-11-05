const getTenantTemplates = async (req, res, next) => {
  try {
    console.log("tenant id", req.tenant_id);
    console.log("==========================");
    res.status(200).json({ message: "Επιτυχία!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTenantTemplates,
};
