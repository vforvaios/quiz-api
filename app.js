const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const errorHandler = require("./errors/errorHandler");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["https://quickpage-fe.vercel.app", "http://localhost:5173"],
  })
);

// routes
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");
const adminRoute = require("./routes/tenant-admin");
const categoriesRoute = require("./routes/categories");
const questionsRoute = require("./routes/questions");
const addQuestionsRoute = require("./routes/addQuestions");

app.use("/api/login", loginRoute);
app.use("/api/register", registerRoute);
app.use("/api/admin", adminRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/questions", questionsRoute);
app.use("/api/auto", addQuestionsRoute);

app.use(errorHandler);

// initial routes
app.get("/", (req, res) => {
  res.send(
    "Express is on the way and listening dude....Give me some api routes to resolve! Bit bucket on the run!!!!!!!!"
  );
});

app.get("/api", (req, res) => {
  res.send("Api route");
});

module.exports = app;
