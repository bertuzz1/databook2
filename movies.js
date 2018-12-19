// server.js
// load the things we need

var express = require("express"); // otetaan express käyttöön
var app = express();
var fs = require("fs"); // Require the module required for writing data
var bodyParser = require("body-parser"); // Require the module required for using form data
app.use(express.static("public/index"));

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application

app.set("view engine", "ejs"); // otetaan ejs käyttöön

app.get("/moviedata", function(req, res) {
  const MongoClient = require("mongodb").MongoClient;

  // Connection URL
  const url =
    "mongodb://PetriKemppainen:salasana1@ds046377.mlab.com:46377/mean_kurssi";

  // Database Name
  const dbName = "mean_kurssi";

  // Use connect method to connect to the server

  MongoClient.connect(
    url,
    { useNewUrlParser: true },
    function(err, client) {
      if (err) console.log("Tapahtui virhe!");

      const db = client.db(dbName);

      // Query can be copied from Compass
      var query = { year: { $gt: 2000 } };
      db.collection("movies")
        .find(query)
        .limit(20)
        .toArray(function(err, result) {
          if (err) throw err;
          console.log(result);

          res.render("page/moviedata", { movies: result });
        });
      client.close();
    }
  );
});

app.listen(8081);
console.log("App is using port 8081");
