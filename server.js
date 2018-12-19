var express = require("express"); // otetaan express käyttöön
var app = express();
var fs = require("fs"); // Require the module required for writing data
var bodyParser = require("body-parser"); // Require the module required for using form data
var data = require("./guestbookdata.json");
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application
// otetaan ejs käyttöön
app.set("view engine", "ejs");

app.use(express.static("public/index/"));
app.use(express.static(__dirname + "/views/css"));
//app.use(express.static(dirname + "/css"));
//app.use(express.static(__dirname + "/views/img"));

app.get("/", function(req, res) {
  res.render("page/index");
});

app.get("/newmessage", function(req, res) {
  res.render("page/newmessage");

});

//tulostus taulukkoon //
app.get("/guestbook", function(req, res) {
  var data = require("./guestbookdata.json");

  //parse results

  res.render("page/guestbook", { data: data });
});

app.post("/newmessage", function(req, res) {
  var data = require("./guestbookdata.json");
  data.push({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
    date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  });

  var jsonStr = JSON.stringify(data);
  fs.writeFile("guestbookdata.json", jsonStr, err => {
    if (err) throw err;
    console.log("it's saved!");
  });


  res.statusCode = 302;
  res.setHeader("Location", "/guestbook");
  res.end();
});

app.listen(8081);
console.log("App is using port 8081");