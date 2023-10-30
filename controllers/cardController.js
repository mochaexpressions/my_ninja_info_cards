var bodyParser = require("body-parser");
var urlEncodedParser= bodyParser.urlencoded({extended: true});

const sqlite = require("sqlite3").verbose();
let db = new sqlite.Database("./ninjas.db", sqlite.OPEN_READWRITE, function(err){
    if(err) return console.error(err.message);

    console.log("connection successful");
});

module.exports = function(app){

    app.get("/", (req, res) => {
        res.render("index");
    });

    app.get("/deck", (req, res) => {
        db.all("SELECT * FROM ninja INNER JOIN village ON ninja.village_id = village.village_id INNER JOIN rank ON ninja.rank_id = rank.rank_id", 
            (err, rows) => {
                if(err) return console.error(err.message);
            var data = [];
            rows.forEach(r => {
                data.push(r.last_name, r.first_name, r.age, r.village_name, r.rank_name);
            })
            res.render("deck", {shinobi: data});
        });
    });

    app.get("/add-card", (req, res) => {
        res.render("add-card");
    });

    app.post("/add-card", urlEncodedParser, (req, res) => {
        var n = Object.assign(req.body);

        //console.log(req.body);

        db.run("INSERT INTO ninja ('first_name', 'last_name', 'age', 'village_id', 'rank_id') VALUES (?, ?, ?, ?, ?)", 
            n.first_name, n.last_name, Number(n.age), n.village, n.rank, (err) => {
                if(err) return console.error(err.message);
                else return console.log("successfully inserted values");
            });
            res.redirect("/deck");
    });
};