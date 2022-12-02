const proModel = require("../Model/product");
function Saveproduct(req, res) {
  const bodyData1 = req.body;
  console.log(bodyData1);
  let ins = new proModel(bodyData1);
  ins.save((err) => {
    if (err) res.render("add");
    else {
      res.render("index1", {
        Title: "",
        prods: "",
      });
    }
  });
}

function editProductPage(req, res) {
  let pid = req.params.id;
  console.log(pid);
  proModel
    .findOne({ _id: pid }) //findAndModify
    .then((result) => {
      console.log(result);
      res.render("edit", { prods: result, errmsg: "", succmsg: "", msg: pid });
      console.log(pid);
    })
    .catch((err) => console.log(err));
}
function update(req, res) {
  let { pname, price, description, quantity, image, _id } = req.body;

  proModel
    .updateOne(
      { _id: _id },
      {
        $set: {
          pname: pname,
          price: price,
          description: description,
          quantity: quantity,
          image: image,
        },
      }
    )
    .then((data1) => {
      res.render("edit", {
        prods: "",
        succmsg: "data is updated",
        msg: "",
        errmsg: "",
      });
    })
    .catch((err) => {
      res.render("edit", {
        prods: "",
        succmsg: "",
        errmsg: "something went wrong",
        msg: "",
      });
    });
}
function deleteProduct(req, res, next) {
  // Product.deleteOne({ _id: req.body.id }) //deleteOne mongodb
  // Product.findByIdAndDelete(req.body.id) //findOneAndDelete
  let pid = req.params.id;
  console.log(pid);
  proModel
    .deleteOne({ _id: pid }) //findAndModify
    .then((result) => {
      res.redirect("/getproducts");
    })
    .catch((err) => console.log(err));
}
function Getallproducts(req, res, next) {
  proModel
    .find()
    .then((products) => {
      res.render("index1", {
        Title: "Crud application",
        prods: products,
      });
    })
    .catch((err) => console.log(err));
}

module.exports = {
  Saveproduct,
  Getallproducts,
  editProductPage,
  deleteProduct,
  update,
};
