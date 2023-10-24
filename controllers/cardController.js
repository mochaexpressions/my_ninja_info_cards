var bodyParser = require("body-parser");
var urlEncodedParser= bodyParser.urlencoded({extended: true});

module.exports = function(app){

    app.get("/", (req, res) => {
        res.render("index");
    })

    app.get("/deck", (req, res) => {
        res.render("deck");
    })
};