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
                var ninja = {last_name: r.last_name, first_name: r.first_name, age: r.age, village: r.village_name, rank: r.rank_name};
                data.push(ninja);
            });
            res.render("deck", {shinobi: data});
        });
    });

    app.post("/deck", urlEncodedParser, (req, res) => {
        var filter = req.body.filter;

        var data = [];

        //console.log(filter);

        if(filter==="name"){
                db.all("SELECT * FROM ninja INNER JOIN village ON ninja.village_id = village.village_id INNER JOIN rank ON ninja.rank_id = rank.rank_id ORDER BY last_name ASC", (err, rows) => {
                    if(err) return console.error(err.message);
                    rows.forEach(r => {
                        var ninja = {last_name: r.last_name, first_name: r.first_name, age: r.age, village: r.village_name, rank: r.rank_name};
                        data.push(ninja);
                    });
                    return res.render("deck", {shinobi: data});
                });
        }
        else if(filter==="village"){
            db.all("SELECT * FROM ninja INNER JOIN village ON ninja.village_id = village.village_id INNER JOIN rank ON ninja.rank_id = rank.rank_id ORDER BY village_id ASC", (err, rows) => {
                    if(err) return console.error(err.message);
                    rows.forEach(r => {
                        var ninja = {last_name: r.last_name, first_name: r.first_name, age: r.age, village: r.village_name, rank: r.rank_name};
                        data.push(ninja);
                    });
                    return res.render("deck", {shinobi: data});
                });
        }
                
        else if(filter==="rank"){
            db.all("SELECT * FROM ninja INNER JOIN village ON ninja.village_id = village.village_id INNER JOIN rank ON ninja.rank_id = rank.rank_id ORDER BY rank_id ASC", (err, rows) => {
                if(err) return console.error(err.message);
                    rows.forEach(r => {
                        var ninja = {last_name: r.last_name, first_name: r.first_name, age: r.age, village: r.village_name, rank: r.rank_name};
                        data.push(ninja);
                    });
                    return res.render("deck", {shinobi: data});
            });
        }
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

    
    app.post("/search", urlEncodedParser, (req, res) => {
        var search = req.body.userQuery;

        //console.log(search);

        search = "%" + search + "%";

        db.all("SELECT * FROM ninja INNER JOIN village ON ninja.village_id = village.village_id INNER JOIN rank ON ninja.rank_id = rank.rank_id WHERE last_name LIKE ? OR first_name LIKE ?",
        (search, search), (err, rows) => {
            if(err) return console.error(err.message);
            var data = [];
            rows.forEach(r => {
                var ninja = {last_name: r.last_name, first_name: r.first_name, age: r.age, village: r.village_name, rank: r.rank_name};
                data.push(ninja);
            });
            res.render("search", {shinobi: data});
        });
    });
};