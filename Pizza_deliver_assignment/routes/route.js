const express = require("express");
const routes = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const nodemailer = require("nodemailer");
const userModel = require("../model/user");
const pizzaModel = require("../model/pizza");
var hbs = require("nodemailer-express-handlebars");
const multer = require("multer");
const seceret = "assd123^&*^&*ghghggh";
const oneDay = 1000 * 60 * 60 * 24;
const sessions = require("express-session");
routes.use("/uploads", express.static(__dirname + "public/uploads"));
var path = require("path");

routes.use(
  sessions({
    secret: seceret,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);
let transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "farmanhaider240@gmail.com",
    pass: "srjxfghezmkienjf",
  },
});
transporter.use(
  "compile",
  hbs({
    viewEngine: "nodemailer-express-handlebars",
    viewPath: "emailTamplates/",
  })
);

var session;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + fileExtension);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("only png and jpg formate support"));
    }
  },
});

routes.get("/", (req, res) => {
  res.render("index", { count: count });
});
routes.get("/upload", (req, res) => {
  res.render("upload", { succmsg: "", errmsg: "" });
});
routes.get("/regis", (req, res) => {
  res.render("regis");
});
const uploadSingle = upload.single("att");
//regoistratoion page
routes.post("/postregis", (req, res) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      res.render("upload", { errmsg: err.message, succmsg: "" });
    } else {
      let {
        fullname,
        email,
        phone,
        password,
        gender,
        address1,
        address2,
        city,
        att,
        pcode,
      } = req.body;
      let status = 0;
      const hash = bcrypt.hashSync(password, saltRounds);
      userModel
        .create({
          fullname: fullname,
          email: email,
          phone: phone,
          password: hash,
          gender: gender,
          address1: address1,
          address2: address2,
          city: city,
          img: req.file.filename,
          pcode: pcode,
          status: status,
        })

        .then((data) => {
          let mailOptions = {
            from: "farmanhaider240@gmail.com",
            to: email,
            subject: "Activation Mail",
            template: "mail",
            context: {
              id: data._id,
              uname: fullname,
            },
          };

          transporter.sendMail(mailOptions, (err, info) => {
            res.render("upload", {
              errmsg: "",
              succmsg:
                "You have registred sucessfully kindly check your mail to activate your account",
            });
            if (err) {
              console.log(err);
            } else {
              console.log("Mail send : " + id);
            }
          });
        })
        .catch((err) => {
          res.render("regis", { error: "User Already Registered" });
        });
    }
  });
});
//activation page
routes.get("/act/:id", (req, res) => {
  let id = req.params.id;

  userModel.findOne({ _id: id }, (err, data) => {
    console.log(data);
    if (err) {
      res.send("kuch to gadbad hai");
    } else {
      userModel
        .updateOne({ _id: id }, { $set: { status: "1" } })
        .then((data1) => {
          res.render("activate", { username: data.fullname });
        })
        .catch((err) => {
          res.send("something went wrong");
        });
    }
  });
});
//login
routes.get("/login", (req, res) => {
  let auth = req.query.msg ? true : false;
  if (auth) {
    return res.render("login", { error: "Invalid username or password" });
  } else {
    return res.render("login");
  }
});
//login post
routes.post("/postlogin", (req, res) => {
  console.log("received");
  let { email, password } = req.body;
  userModel.findOne({ email: email }, (err, data) => {
    session = req.session;
    session.fullname = data.fullname;
    if (err) {
      return res.redirect("/login?msg=fail");
    } else if (data == null) {
      return res.redirect("/login?msg=fail");
    } else {
      console.log(data.password);
      if (bcrypt.compareSync(password, data.password)) {
        session = req.session;
        session.email = email;
        console.log("email", req.session);
        return res.redirect("/profile");
      } else {
        return res.redirect("/login?msg=fail");
      }
    }
  });
});
//user profile
routes.get("/profile", (req, res) => {
  //let username=req.cookies.username;
  let email = req.session.email;
  console.log(email);
  if (email) {
    userModel.findOne({ email: email }, (err, data) => {
      if (err) {
        return res.redirect("/login");
      } else {
        console.log(data.fullname);
        console.log(data.email);
        return res.render("profile", {
          email: email,
          fullname: data.fullname,
          phone: data.phone,
          address1: data.address1,
          address2: data.address2,
          pcode: data.pcode,
          img: data.img,
          gender: data.gender,
          city: data.city,
          count: count,
        });
      }
    });
  }
});
//create all products
routes.get("/create", (req, res) => {
  pizzaModel.create([
    {
      name: "Margherita",
      img: "pizza.png",
      price: "250",
      size: "small",
    },
    {
      name: "Marinara",
      img: "pizza.png",
      price: "350",
      size: "medium",
    },
    {
      name: "Carbonara",
      img: "pizza.png",
      price: "220",
      size: "small",
    },
    {
      name: "Americana",
      img: "pizza.png",
      price: "522",
      size: "large",
    },
    {
      name: "Chicken Mushroom",
      img: "pizza.png",
      price: "350",
      size: "medium",
    },
    {
      name: "Paneer pizza",
      img: "pizza.png",
      price: "2001",
      size: "small",
    },
    {
      name: "Vegies pizza",
      img: "pizza.png",
      price: "600",
      size: "large",
    },
    {
      name: "Pepperoni",
      img: "pizza.png",
      price: "520",
      size: "medium",
    },
    {
      name: "Pepperoni",
      img: "pizza.png",
      price: "220",
      size: "small",
    },
  ]);
  res.end();
});
//get all products
routes.get("/products", (req, res) => {
  let email = req.session.email;
  if (email) {
    pizzaModel
      .find()
      .then((products) => {
        console.log(products);
        res.render("product", {
          data: products,
          count: count,
        });
      })
      .catch((err) => console.log(err));
  } else {
    return res.redirect("/login");
  }
});
//logout
routes.get("/logout", (req, res) => {
  req.session.destroy();
  //res.clearCookie("username");
  return res.redirect("/login");
});
var arr = [];
var count = 0;
routes.get("/cart", (req, res) => {
  res.render("cart", {
    data: arr,
    count: count,
    total: total,
    price: price,
    quantity: session.quantity,
  });
});
const initialValue = 0;
//add pizza in cart
var price = 0;
let total_all = [];
routes.get("/addcart/:id", (req, res) => {
  let id = req.params.id;
  let quantity = req.query.quantity;
  session = req.session;
  session.quantity = quantity;

  console.log("session.quantity " + session.quantity);
  if (quantity == null) {
    pizzaModel.findOne({ _id: id }).then((data) => {
      arr.push(data);
      count++;
      console.log("ARRAY:" + arr);
      price = parseInt(data.price);
      price = parseInt(data.price);
      session = req.session;

      session.price = price;
      session = req.session;
      session.name = data.name;
      res.render("cart", {
        data: arr,
        count: count,
        total: total,
        price: price,
        quantity: session.quantity,
      });
    });
  } else {
    pizzaModel.findOne({ _id: id }).then((data) => {
      price = 0;
      price = parseInt(data.price);
      if (quantity > 0) {
        total = price * quantity;
        session = req.session;
        session.total = total;
        console.log("total" + session.total);

        total_all.push(session.total);
        console.log(total_all);

        total = total_all.reduce((totalValue, currentValue) => {
          console.log(
            `totalValue: ${totalValue}, currentValue: ${currentValue}`
          );
          return totalValue + currentValue;
        }, initialValue);

        console.log("sum", total);
        res.render("cart", {
          data: arr,
          count: count,
          total: total,
          price: price,
          q: session.quantity,
        });
      }
    });
  }
});

var total = 0;
//Delete cart items:
routes.get("/delete/:id", (req, res) => {
  let id = req.params.id;

  var i = 0;
  console.log("pid" + id);
  for (i in arr) {
    console.log("d_id:" + arr[i]._id);
    if (id == arr[i]._id) {
      console.log(i);
      if (total > 0) {
        total = total - arr[i].price * session.quantity;
      }
      arr.splice(i, 1);
      count--;
      total_all = [];
      session.price = 0;

      res.render("cart", {
        data: arr,
        count: count,
        total: total,
        price: price,
        q: session.quantity,
        msghead: "",
        succmsg: "",
      });
    }
  }

  // session.destroy();
});
routes.get("/checkout", (req, res) => {
  if (session.total > 0) {
    res.render("checkout", { msghead: "", succmsg: "" });
  } else {
    res.render("cart", { msghead: "", succmsg: "please add product in cart" });
  }
});
routes.post("/checkpost", (req, res) => {
  let bodydata = req.body;
  console.log(session.email);
  console.log(bodydata);
  for (i in arr) {
    arr.pop(i);

    count--;
  }
  for (i in total_all) {
    total_all.pop(i);
  }
  let mailOptions = {
    from: "farmanhaider240@gmail.com",
    to: session.email,
    subject: "order Details",
    template: "order",
    context: {
      id: Math.floor(Math.random() * 9000000000) + 1000000000,
      uname: session.fullname,
      email: session.email,
      name: session.name,
      price: session.price,
      total: total,
      quantity: session.quantity,
    },
  };

  transporter.sendMail(mailOptions, (err, info) => {
    res.render("pass", {
      msghead: "Order has been placed SucessFully",
      succmsg: "You will recieve notification by email with order detials",
    });
    session.quantity = 0;
    session.price = 0;
    session.total = 0;
    total = 0;
    arr = [];
    total_all = [];
  });
});
module.exports = routes;
