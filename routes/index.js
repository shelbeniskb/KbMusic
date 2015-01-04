
/*
 * GET home page.
 */
var path = require('path'),
    url = require("url"),
    querystring = require("querystring"),
    song = require('../models/song.js'),
    user = require('../models/user.js'),
    User = require('./UserS.js');
module.exports = function(app) {
    var query;
    app.get('/', function(req, res) {
        //res.sendfile(path.join(__dirname, '..', '/public/index.html')); //use path moudel to get parent path
        console.log("111");
        console.log(req.session.userName);
        res.render('index', {
            title: 'Shelben\'s Music',
            userName: req.session.userName,
        });
    });

    app.get('/getSongList', function(req, res) {
        var userName = req.session.userName;
        if (userName === undefined) {
            query = {userName: 'hkb'};
        } else {
            query = {userName: userName};
        }
        Song.findAll(query, function(msg) {
            res.writeHead(200, {"Content-Type": "text/json"});
            res.end(JSON.stringify(msg));
        });
    });

    app.post('/addSong', function(req, res) {
        var userName = req.session.userName,
            query = req.body;
        if (userName === undefined) {
            var msg = {status: 'unlogin', detail: 'please login first!'};
            res.writeHead(200, {"Content-Type": "text/json"});
            res.end(JSON.stringify(msg));
        } else {
            query.userName = userName;
        }
        Song.save(query, function(msg){
            res.writeHead(200, {"Content-Type" : "text/json"});
            res.end(JSON.stringify(msg));
        });
    });

    app.post('/register', function(req, res) {
        query = req.body;
        User.save(query, function(msg){
            res.writeHead(200, {"Content-Type" : "text/json"});
            res.end(JSON.stringify(msg));
        });
    });

    app.post('/login', function(req, res) {
        query = req.body;
        User.login(query, function(msg) {
            res.writeHead(200, {"Content-Type": "text/json"});
            res.end(JSON.stringify(msg));
            if (msg.status === 'success') {
                req.session.userName = json.userName;
            }
        });
    });
}
