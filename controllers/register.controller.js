const bcrypt = require("bcrypt");
const config = require("../config");
const db = require("../services/db");
const { v4: uuidv4 } = require("uuid");
const { REGISTERSCHEMA } = require("../schemas/loginregister.schema");

const registerUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const { value, error } = REGISTERSCHEMA.validate(req.body);

    if (error) {
      res.status(500).json({ error: config.messages.error });
      return false;
    }

    const [userExists] = await db.query(
      `
    SELECT COUNT(*) as user FROM TENANTS WHERE email=?
    `,
      [email]
    );

    if (userExists?.[0]?.user >= 1) {
      res.status(500).json({ error: "Το email υπάρχει ήδη. Επιλέξτε άλλο." });
      return false;
    }

    if (name === "") {
      res.status(400).json({ error: "Δεν έχετε δώσει name" });
      return false;
    }

    if (email === "") {
      res.status(400).json({ error: "Δεν έχετε δώσει email" });
      return false;
    }

    if (password === "") {
      res.status(400).json({ error: "Δεν έχετε δώσει κωδικό" });
      return false;
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const sql = `INSERT INTO TENANTS(name, password, email, template_id, tenant_id) VALUES (?,?,?,?)`;
    const [result] = await db.query(sql, [
      name,
      hashPassword,
      email,
      config.defaultTemplateId,
      uuidv4(),
    ]);

    res.status(200).json({ message: "Η εγγραφή ολοκληρώθηκε επιτυχώς!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { registerUser };
