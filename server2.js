var express = require('express'); // Require Express
var app = express(); // Instantiate Express to app-variable
var bodyParser = require("body-parser"); // Require the module required for using form data

app.use(bodyParser.urlencoded({ extended: true })); // For parsing application
app.set('view engine', 'ejs'); // Set EJS

// Make use of static files
app.use(express.static("public/index/"));
app.use(express.static(__dirname + "/views/css"));

// Initialize constants and a variable
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://PetriKemppainen:salasana1@ds046377.mlab.com:46377/mean_kurssi';
var db;

// Connect to database
MongoClient.connect(url, { useNewUrlParser: true }, (err, info) => {
  // console.log(info);
  db = info.db('mean_kurssi');

  // Start server on port 8081
  app.listen(8081);
  console.log("App is using port 8081");

  // Render index.ejs to browser
  app.get("/", function(req, res) {
    res.render("page/index");
  });

  // Render movie data to browser
  app.get('/guestbook', (req, res) => {
    var query = { year: { $gt: 2000 } };
      db.collection("movies")
        .find(query)
        .limit(20)
        .toArray(function(err, result) {
          if (err) throw err;
          console.log(result);

          res.render("page/guestbook", { movies: result });
        });
    });
  });

  // Render new message to browser
  app.get('/newmessage', (req, res) => {
    res.render('page/newmessage')
  });

  // Insert data to database in mlab
  app.post('/newmessage', (req, res) => {
    db.collection("insert1").insertOne(req.body, (err, result) => {
      if (err) throw err;
      console.log(req.body);
      console.log('The data has been updated to our database!');
      res.redirect('/');
        });
    });
