var User = require('./UserS.js');
exports.registerUser = function(json, res) {
    User.save(json, function(msg){
        res.writeHead(200, {"Content-Type" : "text/json"});
        res.end(JSON.stringify(msg));
    });
}

exports.loginUser = function(json, req, res) {
    User.login(json, function(msg) {

        res.writeHead(200, {"Content-Type": "text/json"});
        res.end(JSON.stringify(msg));
        
        if (msg.status === 'success') {
            req.session.userName = json.userName;
        }
    });
}