var mongodb = require('./mongodb'),
    Schema = mongodb.mongoose.Schema,
    SongSchema = new Schema({
        userName: String,
        number: Number,
        songName: String,
        artistName: String,
        audioUrl: String,
        artistImg: String,
        time: String,
    });

    var Song = mongodb.mongoose.model("Song", SongSchema);
    var SongDAO = function(){};
    SongDAO.prototype.save = function(obj, callback) {
        var findObj = {userName: obj.userName || '', songName: obj.songName, artistName: obj.artistName};
        Song.find(findObj, function(err, result){
            if (err) {
                callback({status: 'error', detail: err});
            } else {
                if (result.length > 0 ) {
                    callback({status: 'error', detail: 'this song already exists!'});
                } else {
                    var instance = new Song(obj);
                    instance.save(function(err){
                        if (err) {
                            callback({status: 'error', detail: err});
                        } else {
                            callback({status: 'success'});
                        }
                    });
                }
            }
        })
    }

    SongDAO.prototype.findAll = function(obj, callback) {
        var findObj = {userName: obj.userName};
        Song.find(findObj, function(err, result){
            if (err) {
                callback({status: 'error', detail: err});
            } else {
                callback({status: 'success', songs: result});
            }
        })
    }
    module.exports = new SongDAO();