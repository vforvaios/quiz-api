const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../services/db");
const config = require("../config");
const { LOGINSCHEMA } = require("../schemas/loginregister.schema");
require("dotenv").config();

const getCategories = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { value, error } = LOGINSCHEMA.validate(req.body);

    if (error) {
      res.status(500).json({ error: config.messages.error });
      return false;
    }

    res.status(200).json({
      categories: [],
    });
  } catch (error) {
    res.sendStatus(401);
    next(error);
  }
};

module.exports = {
  getCategories,
};
