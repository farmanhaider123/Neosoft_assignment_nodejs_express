const bodyParser = require("body-parser");
const { registration, login } = require("../Controllers/user");

const express = require("express");
const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.get("/", (req, res) => {});
router.get("/welcome:id", (req, res) => {
  let email = req.params.id;
  res.render("welcome", { email: email });
});
router.get("/dashboard:id", (req, res) => {
  let email = req.params.id;
  res.render("dashboard", { email: email });
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/regis", (req, res) => {
  res.render("regis");
});

router.post("/postdata_r", registration);
router.post("/postdata_l", login);
module.exports = router;
