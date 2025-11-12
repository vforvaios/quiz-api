const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../services/db");
const config = require("../config");
const nodeMailer = require("nodemailer");
const {
  LOGINSCHEMA,
  FORGOTPASSWORDSCHEMA,
  CHANGEPASSWORDSCHEMA,
} = require("../schemas/loginregister.schema");
const makePassword = require("../utils/makePassword");
require("dotenv").config();

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { value, error } = LOGINSCHEMA.validate(req.body);

    if (error) {
      console.log(error);
      res.status(500).json({ error: config.messages.error });
      return false;
    }

    const [userInDb] = await db.query(
      `SELECT name, email, password, isActive, userId, isAdmin
       FROM USERS WHERE email=?`,
      [email]
    );

    if (!userInDb?.[0]?.isActive) {
      res.status(401).json({
        error:
          "Ο χρήστης σας είναι απενεργοποιημένος. Παρακαλώ επικοινωνήστε μαζί μας.",
      });
      return false;
    }

    const userExists = await bcrypt.compare(password, userInDb[0].password);

    if (userExists) {
      const user = {
        userId: userInDb[0].userId,
        email: userInDb[0].email,
        isAdmin: userInDb[0].isAdmin,
      };

      jwt.sign(
        { user },
        process.env.API_SECRET_KEY || "",
        { expiresIn: "1h" },
        (err, token) => {
          res.status(200).json({
            userLoggedIn: { ...user },
            token,
          });
        }
      );
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.sendStatus(401);
    next(error);
  }
};

const forgotUserPassword = async (req, res, next) => {
  try {
    const { value, error } = FORGOTPASSWORDSCHEMA.validate(req.body);
    if (error) {
      res.status(500).json({ error: config.messages.error });
      return false;
    }

    const { username } = req.body;

    const newPassword = makePassword(8);

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(newPassword, salt);

    await db.query(
      `
    UPDATE USERS SET password=? WHERE email=? AND isAdmin=?
    `,
      [hashPassword, username, 0]
    );

    let transporter = nodeMailer.createTransport(config?.mail?.options);

    let mailOptions = {
      from: config?.mail?.from, // sender address
      to: username, // list of receivers
      subject: `Tierra: Αλλαγή password`, // Subject line
      html: `
      <div>
          <div>
            Ο καινούριος σας κωδικός είναι ο ${newPassword}
          </div>
          <div><a href='${process.env.SITE_URL}/login' target='_blank'>${process.env.SITE_URL}/login</a></div>
      </div>`, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message %s sent: %s", info.messageId, info.response);
    });

    res
      .status(200)
      .json({ message: "Εστάλθη mail με τον καινούριο σας κωδικό." });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const changeUserPassword = async (req, res, next) => {
  try {
    const { value, error } = CHANGEPASSWORDSCHEMA.validate(req.body);

    if (error) {
      res.status(500).json({ error: config.messages.error });
      return false;
    }

    const { password } = req.body;
    const { user } = req.authData;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await db.query(
      `
    UPDATE USERS SET password=? WHERE username=? AND isAdmin=?
    `,
      [hashPassword, user, 0]
    );

    res.status(200).json({ message: "Ο κωδικός σας άλλαξε." });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  loginUser,
  forgotUserPassword,
  changeUserPassword,
};
