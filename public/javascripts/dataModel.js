(function() {
	MModel = function() {

	}
	MModel.prototype = {
		/*从服务器获取歌曲列表*/
		getSongList: function(callback) {
			var request = $.ajax({
	            	type: "GET",
	            	url: "http://localhost:3000/getSongList"
	        });
	        request.done(function(result){
	        	callback(result.songs);
	        }).fail(function() {
	        	alert('could not download song list, pelease check agian!');
	        })
		},
		userLogin: function(data, callback) {
			var request = $.ajax({
				type: "POST",
	            url: "http://localhost:3000/login",
	            data: data
			});
			request.done(function(result) {
				callback(result);
			}).fail(function() {
				alert('login in fail, can you check your info again?')
			});
		},
		userRegister: function(data, callback) {
			var request = $.ajax({
				type: "POST",
	            url: "http://localhost:3000/register",
	            data: data
			});
			request.done(function(result) {
				callback(result);
			}).fail(function() {
				alert('register fail, server or network may crashed!')
			});
		},
		addSong: function(data, callback) {
            var request = $.ajax({
            	type: "POST",
            	data: data,
            	url: 'http://localhost:3000/addSong'
            });
            request.done(function(data){
            	callback(data);
            }).fail(function() {
            	alert('add song fials!');
            })
		}
	}
})()