
/*
 * GET home page.
 */
var path = require('path'),
    url = require("url"),
    querystring = require("querystring"),
/*    song = require('../models/song.js'),
    user = require('../models/user.js'),*/
    User = require('../models/UserS.js'),
    Song = require('../models/Songs.js');
module.exports = function(app) {
    var query;
    app.get('/', function(req, res) {
        //res.sendfile(path.join(__dirname, '..', '/public/index.html')); //use path moudel to get parent path
        res.render('index', {
            title: 'Shelben\'s Music',
            userName: req.session.userName,
        });
    });

    app.get('/getSongList', function(req, res) {
        var userName = req.session.userName;
        console.log("222");
        console.log(req.session);
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
            if (msg.status === 'success') {
                req.session.userName = query.userName;
                console.log("111");
                console.log(req.session);
            }
            res.writeHead(200, {"Content-Type": "text/json"});
            res.end(JSON.stringify(msg)); //be careful, session must be set before res redirecting
        });
    });
}
