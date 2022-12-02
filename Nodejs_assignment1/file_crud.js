//load http module
const http = require("http");
const fs = require("fs");
const port = 9998;

//server creating using http
const server = http.createServer((req, res) => {
  const url = req.url;
  if (url == "/") {
    fs.readFile("./htmls/index.html", function (err, data) {
      res.writeHead(200, { "Content-Type": "text/Html" });
      res.write(data);
      res.end();
    });
  }
  //For file creation
  else if (req.url == "/createfile") {
    if (fs.existsSync("JS.txt")) {
      fs.readFile("./htmls/Already_exist.html", (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      });
    } else {
       fs.readFile("./htmls/create.html", (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
       });
      let data =req.body.input;
      fs.writeFile("JS.txt",`${data}`, (err) => {
        if (err) throw err;
        else {
          fs.readFile("./htmls/File_created.html", (err, data) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
          });
        }
      });
    }
  }
  //For file Read
  else if (url == "/read") {
    if (!fs.existsSync("JS.txt")) {
      return fs.readFile("./htmls/File_notexist.html", (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      });
    }

    let data = fs.readFileSync("JS.txt");
    res.end(
      `<html><head><body><h1 style='    text-align: center;
    margin-top: 32px;
    height: 73px;
    padding-top: 40;
    background-color: cornflowerblue;
    color: white;
    border-radius: 40px;
' ;>${data.toString()}</h1><button
    style='margin-left: 597px;height: 63px;   width: 119px;color:white;border-radius: 9px;background-color: rgb(165, 122, 233);font-size: 23px;'><a
      href='/'>Home</a></button></body></head></html>`
    );
  }
  //Append the data in file
  else if (url == "/append") {
    if (fs.existsSync("JS.txt")) {
      fs.appendFileSync("JS.txt", "This is a updated data");
      fs.readFile("./htmls/update.html", (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      });
    } else {
      fs.readFile("./htmls/File_notexist.html", (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      });
    }
  }
  //For file deletion of file
  else if (url == "/delete") {
    if (fs.existsSync("JS.txt")) {
      fs.unlink("JS.txt", (err) => {
        if (err) throw err;
        else {
          fs.readFile("./htmls/delete.html", (err, data) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
          });
        }
      });
    } else {
      fs.readFile("./htmls/File_notexist.html", (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      });
    }
  }
  //For file invalid request
  else {
    res.end("<Html><head><body><h2>Invalid request</h2></body></head></Html>");
  }
});
server.listen(port, (err) => {
  if (err) throw err;
  else {
    console.log("server is wrorking with " + port);
  }
});
