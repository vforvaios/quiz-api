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
// const productsRoute = require("./routes/products");
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");
const adminRoute = require("./routes/tenant-admin");
// const removeMasterMindUserRoute = require("./routes/removemasterminduser");
// const productRoute = require("./routes/product");
// const cartRoute = require("./routes/cart");
// const wishlistResultsRoute = require("./routes/wishlist");
// const categoriesRoute = require("./routes/categories");
// const menuRoute = require("./routes/menu");
// const subCategoriesRoute = require("./routes/subcategories");
// const brandsRoute = require("./routes/brands");
// const paymentmethodsRoute = require("./routes/paymentmethods");
// const shippingmethodsRoute = require("./routes/shippingmethods");
// const pricesRoute = require("./routes/prices");
// const orderRoute = require("./routes/order");
// const homeRoute = require("./routes/home");
// const newsletterRoute = require("./routes/newsletter");
// const statusesRoute = require("./routes/statuses");
// const dashboardRoute = require("./routes/dashboard");
// const staticRoute = require("./routes/static");
// const usersRoute = require("./routes/users");
// const countriesRoute = require("./routes/countries");
// const doysRoute = require("./routes/doys");
// const prefecturesRoute = require("./routes/prefectures");
// const logoRoute = require("./routes/logo");
// const offerTitleRoute = require("./routes/offerTitle");
// const availableCouponsRoute = require("./routes/availableCoupons");

// const initMasterMindRoute = require("./routes/initmastermind");
// const checkMasterMindResultsRoute = require("./routes/checkmastermindresults");
// app.use("/api/products", productsRoute);
app.use("/api/login", loginRoute);
app.use("/api/register", registerRoute);
app.use("/api/admin", adminRoute);
// app.use("/api/product", productRoute);
// app.use("/api/cart", cartRoute);
// app.use("/api/wishlist", wishlistResultsRoute);
// app.use("/api/categories", categoriesRoute);
// app.use("/api/subcategories", subCategoriesRoute);
// app.use("/api/brands", brandsRoute);
// app.use("/api/menu", menuRoute);
// app.use("/api/paymentmethods", paymentmethodsRoute);
// app.use("/api/shippingmethods", shippingmethodsRoute);
// app.use("/api/prices", pricesRoute);
// app.use("/api/home", homeRoute);
// app.use("/api/newsletter", newsletterRoute);
// app.use("/api/order", orderRoute);
// app.use("/api/statuses", statusesRoute);
// app.use("/api/dashboard", dashboardRoute);
// app.use("/api/staticcontent", staticRoute);
// app.use("/api/users", usersRoute);
// app.use("/api/countries", countriesRoute);
// app.use("/api/doys", doysRoute);
// app.use("/api/prefectures", prefecturesRoute);
// app.use("/api/logo", logoRoute);
// app.use("/api/offertitle", offerTitleRoute);
// app.use("/api/availablecoupons", availableCouponsRoute);
// app.use("/images", express.static("images"));

// app.use("/api/initmastermind", initMasterMindRoute);
// app.use("/api/removemasterminduser", removeMasterMindUserRoute);
// app.use("/api/checkmastermindresults", checkMasterMindResultsRoute);

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
