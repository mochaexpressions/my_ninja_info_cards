var express = require("express");
var cardController = require("./controllers/cardController");

var app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.json());

cardController(app);

app.listen(3000, function(){
    console.log("listening to port 3000");
});
