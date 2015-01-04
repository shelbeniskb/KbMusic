var mongodb = require('./mongodb'),
    Schema = mongodb.mongoose.Schema,
    SongSchema = new Schema({
        userName: String,
        userEmail: String,
        userPwd: String
    });

    var User = mongodb.mongoose.model("User", SongSchema);
    var UserDAO = function(){};
    UserDAO.prototype.save = function(obj, callback) {
        var findObj = {userName: obj.userName};
        User.find(findObj, function(err, result){
            if (err) {
                callback({status: 'error', detail: err});
            } else {
                if (result.length > 0 ) {
                    callback({status: 'error', detail: 'this user name already exists!'})
                } else {
                    var instance = new User(obj);
                    instance.save(function(err){
                        if (err) {
                            callback({status: 'error', detail: err});
                        } else {
                            callback({status: 'success', detail: obj.userName + ' save!'});
                        }
                    });
                }
            }
        });
    }
    
    UserDAO.prototype.login = function(obj, callback) {
        var findObj = {userName: obj.userName, userPwd: obj.userPwd};
        User.find(findObj, function(err, result){
            if (err) {
                callback({status: 'error', detail: err});
            } else {
                if (result.length > 0 ) {
                    callback({status: 'success', detail: obj.userName + ' login!'});
                } else {
                    callback({status: 'error', detail: 'Login fails, check the name or password agian!'});
                }
            }
        });
    }
    module.exports = new UserDAO();