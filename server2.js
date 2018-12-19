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

  // Start server on port 3000 OR ENVIROMENT VARIABLE
const PORT = process.env.PORT || 3000;
  console.log("App is using port 3000 or herokuport");
  app.listen(PORT);

  // Render index.ejs to browser
  app.get("/", function(req, res) {
    res.render("page/index");
  });

  // Render movie data to browser
  app.get('/guestbook', (req, res) => {
    var query = { year: { $gt: 2000 } };
      db.collection("movies")
        .find(query)
        .limit(10)
        .toArray(function(err, result) {
          if (err) throw err;
          console.log(result);

          res.render("page/guestbook", { movies: result });
        });
    });
  });


  // Newmessage
  app.get('/newmessage', (req, res) => {
    res.render('page/newmessage')
  });

  // Insert data 
  app.post('/newmessage', (req, res) => {
    db.collection("insert1").insertOne(req.body, (err, result) => {
      if (err) throw err;
      console.log(req.body);
      console.log('The data has been updated to our database!');
      res.redirect('/');
        });
    });

// admin page
app.get('/admin', (req, res) => {
// Sort with latest posts added in database
    db.collection("movies").find({}).sort({"_id": 1}).toArray((err, result) => {
      if (err) throw err;
      res.render("page/admin", {
        movies: result
      });
    });
  });

    // Remove a movie 
    app.post('/delete', (req, res) => {
        db.collection("movies").deleteOne({username: req.body.username}, (err, result) => {
          if (err) throw err;
          console.log(req.body.movies + " has been deleted!");
          res.render("page/delete", {
            movies: result
          });
        });
      });
    






///////////////////////////           API STUFF         ///////////////////////

const ObjectId = require("mongodb").ObjectID;

// get all movie
app.get("/api/getall", (req, res) => {
    db.collection("movies")
      .find()
      .toArray(function(err, result) {
        if (err) throw err;
        res.send({ result });
      });
  });

// get single movie
app.get("/api/movie/:movieId", function(req, res) {
  const movieId = req.params.movieId;
  console.log(movieId);
  db.collection("movies")
    .find({ _id: { $eq: ObjectId(movieId) } })
    .toArray(function(err, movie) {
      console.log(movie);
      res.send({ results: movie });
    });
});

// delete a single movie
app.delete("/api/movie/:movieId", function(req, res) {
  const movieId = req.params.movieId;
  db.collection("movies").deleteOne({ _id: ObjectId(movieId) });
  res.send(200);
});

// update a single movie
app.put("/api/movie/:movieId", function(req, res) {
  const movieId = req.params.movieId;
  const updated = db
    .collection("movies")
    .updateOne({ _id: ObjectId(movieId) }, req.body);
  res.send({ result: updated });
});