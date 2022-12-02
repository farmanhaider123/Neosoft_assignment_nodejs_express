const express = require('express');
const port = 8989;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", "./views");
const mainRoutes = require("./index");
app.use("/", mainRoutes);

app.listen(port, (err) => {
    if (err) throw err;
    else {
        console.log("server id connected :" + port);
    }
})