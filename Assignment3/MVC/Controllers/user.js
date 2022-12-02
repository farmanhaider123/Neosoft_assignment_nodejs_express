const fs = require("fs");
const registration = (req, res) => {
  let { uname, password, email, age, city } = req.body;
  if (fs.existsSync(`./users/${email}.txt`)) {
    res.render("regis", { errmsg: "Emails is Already registred" });
  } else {
    fs.writeFile(
      `./users/${email}.txt`,
      `${uname}\n${email}\n${password}\n${age}\n${city}`,
      (err) => {
        if (err) {
          res.render("regis", { errmsg: "Something went wrong" });
        } else {
          res.redirect(`/user/welcome ${email}`);
          // res.render('regis',{succmsg:'Registred sucessfully!!!!'});
        }
      }
    );
  }
};
const login = (req, res) => {
  let { password, email } = req.body;
  if (fs.existsSync(`./users/${email}.txt`)) {
    fs.readFile(`./users/${email}.txt`, (err, data) => {
      if (err) throw err;
      var array = data.toString().split("\n");
      console.log(array[2]);
      if (password == array[2]) {
        // res.render("login", { succmsg: "login sucessfully" });
        res.redirect(`/user/dashboard ${email} `);
      } else {
        res.render("login", { errmsg: "Pssword not match" });
      }
    });
  } else {
    res.render("login", { errmsg: "User is not registred in our system" });
  }
};
module.exports = {
  registration,
  login,
};
