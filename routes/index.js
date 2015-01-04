
/*
 * GET home page.
 */
var path = require('path'),
    url = require("url"),
    querystring = require("querystring"),
    song = require('../models/song.js'),
    user = require('../models/user.js');
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
        song.findSongAll(query, res);
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
        song.addSong(query, res);
    });

    app.post('/register', function(req, res) {
        query = req.body;
        user.registerUser(query, res);
    });

    app.post('/login', function(req, res) {
        query = req.body;
        user.loginUser(query, req, res);
    });
}
