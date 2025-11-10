const bcrypt = require("bcrypt");
const config = require("../config");
const db = require("../services/db");
const { REGISTERSCHEMA } = require("../schemas/loginregister.schema");

const registerUser = async (req, res, next) => {
  try {
    const { v4: uuidv4 } = await import("uuid");

    console.log(req.body);
    const { email, password, name } = req.body;
    const { value, error } = REGISTERSCHEMA.validate(req.body);

    if (error) {
      console.log(error);
      return res.status(500).json({ error: config.messages.error });
    }

    const [userExists] = await db.query(
      `
    SELECT COUNT(*) as user FROM USERS WHERE email=?
    `,
      [email]
    );

    if (userExists?.[0]?.user >= 1) {
      return res
        .status(500)
        .json({ error: "Το email υπάρχει ήδη. Επιλέξτε άλλο." });
    }

    if (name === "") {
      return res.status(400).json({ error: "Δεν έχετε δώσει name" });
    }

    if (email === "") {
      return res.status(400).json({ error: "Δεν έχετε δώσει email" });
    }

    if (password === "") {
      return res.status(400).json({ error: "Δεν έχετε δώσει κωδικό" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const sql = `INSERT INTO USERS(name, password, email, userId) VALUES (?,?,?,?)`;
    const [result] = await db.query(sql, [name, hashPassword, email, uuidv4()]);

    res.status(200).json({ message: "Η εγγραφή ολοκληρώθηκε επιτυχώς!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { registerUser };
