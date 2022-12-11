const express = require("express");
const port = 3000;
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const mongoose = require("mongoose");
const mainRoutes = require("./routes/route");
const exphbs = require("express-handlebars");
app.engine(
  "handlebars",
  exphbs.engine({ handlebars: allowInsecurePrototypeAccess(Handlebars) })
);
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/img", express.static(__dirname + "public/img"));

//database connection

//db connection
const connectionString = "mongodb://127.0.0.1:27017/user";

mongoose
  .connect(connectionString)
  .then((res) => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error : " + err));

app.use("/", mainRoutes);

app.listen(port, (err) => {
  if (err) throw err;
  else {
    console.log("servber is working on : http://localhost:" + port);
  }
});
