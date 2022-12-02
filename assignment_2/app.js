const express = require("express");
const path = require("path");
const app = express();
const port = 8001;
const fs = require("fs");
// EXPRESS SPECIFIC STUFF
app.use("/static", express.static("static")); // For serving static files
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// PUG SPECIFIC STUFF
app.set("view engine", "pug"); // Set the template engine as pug
app.set("views", path.join(__dirname, "views")); // Set the views directory

// ENDPOINTS
app.get("/", (req, res) => {
  const params = {};
  res.status(200).render("index.pug", params);
});
app.get("/contactdata", (req, res) => {
  const params = {};
  res.status(200).render("contactdata", params);
});
app.get("/contact", (req, res) => {
  const params = {};
  res.status(200).render("contact", params);
});
app.get("/gallery", (req, res) => {
  const params = {};
  res.status(200).render("gallery.pug", params);
});
app.get("/payments", (req, res) => {
  const params = {};
  res.status(200).render("payments.pug", params);
});
app.post("/postdata", (req, res) => {
  let { name, email, phone, message } = req.body;
  let data = `
<tr>
    <td>${name}</td>
    <td>${email}</td>
    <td>${phone}</td>
    <td>${message}</td>
<tr>
    `;
  let succmsg = "";
  let errmsg = "";

  if (fs.existsSync(`./users`)) {
    fs.appendFileSync(`./users/detail.pug`, data);
    res.render("contact", { succmsg: "Request submitted" });
  } else {
    res.render("contact", { errmsg: "somethingwent wrong" });
    fs.mkdirSync(`./user/`);
    fs.writeFileSync(`./users/detail.pug`, `${data.toString()}`);
  }
});
// START THE SERVER
app.listen(port, () => {
  console.log(`The application started successfully on port ${port}`);
});
