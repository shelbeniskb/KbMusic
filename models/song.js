var Song = require('./SongS.js');
exports.addSong = function(json, res) {
    Song.save(json, function(msg){
        res.writeHead(200, {"Content-Type" : "text/json"});
        res.end(JSON.stringify(msg));
    });
}

exports.findSongAll = function(json, res) {
    Song.findAll(json, function(msg) {
        res.writeHead(200, {"Content-Type": "text/json"});
        res.end(JSON.stringify(msg));
    });
}