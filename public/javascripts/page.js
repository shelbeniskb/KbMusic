(function(){
	MView = function() {

	}
	MView.prototype = {
		init: function() {
			this.mCtrl = new MCtrl();
			this.mCtrl.init($('#player_default'));
			this.attachAllEvent();
			for (var i = 0; i < 9; i++) {
		        this.mCtrl.imgList.push($('.img-card.card' + (i+1)));
			}
		},
		attachAllEvent: function() {
			var me = this,
				mCtrl = this.mCtrl; 
			$('#play').on('click', function(e) {
            	mCtrl.togglePlay();
        	});
        	$('#next').on('click', function() {
            	mCtrl.cut();
        	});
        	$('#like').on('click', function(e) {
        		mCtrl.like();
        	});
        	$('#slider-trigger').on('click', function(e) {
        		mCtrl.showAllMusic();
        	});
        	$('#user-container').on('click', function(e) {
            	showLogin();
            	return false;
        	});
	        $('#login_form').submit(function() {
	            validateAndSubmit.call(me, 0);
	            return false; //stop the default behavior of form submiting
	        });
	        $('#register_form').submit(function() {
	            validateAndSubmit.call(me, 1);
	            return false;
	        });

		    $('#search_input').on('input', function(e){
	            if (e.keyCode === 13) {
	                mCtrl.doSearchSong(this.value);
	            }
	        });
	        $('#search_input').on('keyup', function(e){
	            mCtrl.doSearchSong(this.value);
	        });
	        $('#search_btn').on('click', function(e){
	            mCtrl.doSearchSong($('#search_input')[0].value);
	        });

		    $('#like').on('click', function(e) {
		    	var optsAfterUnlogin = function() {
		    		showLogin();
		    	};
	            mCtrl.addNewSong(optsAfterUnlogin);
	        });

		    $('#signin-link').on('click', function() {
	            $('.rotate-container').css('transform', 'rotateY(' + 0 + 'deg)');
	        });

	        $('#signup-link').on('click', function() {
	            $('.rotate-container').css('transform', 'rotateY(' + 180 + 'deg)');
	        });

		    $('.menu-button').on('click', function(e) {
	            e.preventDefault();
	            $('.circle').toggleClass('open');
	        });

	        this.mCtrl.attachEventForPlayer();

	        this.initShareMenu();
		},

		initShareMenu: function() {
	        var items = $('.circle a'),
	        	l = items.length,
	        	mCtrl = this.mCtrl;
	 
/*	        for(var i = 0, l = items.length; i < l; i++) {
	          items[i].style.left = (50 + 35*Math.cos(0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
	          items[i].style.top = (50 - 35*Math.sin(0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
	        }*/
	        items.each(function(i, item) {
	            item.style.left = (50 + 35*Math.cos(0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
	            item.style.top = (50 - 35*Math.sin(0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
	        })

	        $('#sina').on('click', function() {
	            var shareUrl = "http://service.weibo.com/share/share.php?";
	            var curMusic = mCtrl.songList[mCtrl.curSongIdx];
	            var title ='推荐 ' + curMusic.artistName + ' 的《' + curMusic.songName+ '》 （来自Shelben Musiic @白满川哦）';
	            var pic = curMusic.artistImg;
	            shareUrl = shareUrl + '&title=' + title + '&pic=' + pic;
	            window.open(shareUrl, "_blank");
	        });

	        $('#douban').on('click', function() {
	            var shareUrl = "http://shuo.douban.com/!service/share?";
	            var curMusic = mCtrl.songList[mCtrl.curSongIdx];
	            var title ='推荐 ' + curMusic.artistName + ' 的《' + curMusic.songName+ '》 （来自Shelben Musiic @白满川哦）';
	            var pic = curMusic.artistImg;
	            shareUrl = shareUrl + '&text=' + title + '&image=' + pic;
	            window.open(shareUrl, "_blank");
	        });

	        $('#facebook').on('click', function() {
	            var shareUrl = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?";
	            var curMusic = mCtrl.songList[mCtrl.curSongIdx];
	            var title ='推荐 ' + curMusic.artistName + ' 的《' + curMusic.songName+ '》 （来自Shelben Musiic @白满川哦）';
	            var u = curMusic.artistImg;
	            window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(u),'sharer','toolbar=0,status=0,width=626,height=436', '_blank');
	        });
	    }

	}

	function showLogin() {
            $('#overlay').css('display', 'block');
            $('#user-login-signup').css('display', 'block');
            $(document).on('click', function() {
                $('#overlay').css('display', 'none');
                $('#user-login-signup').css('display', 'none');
                $(document).off('click');
            });
            $('#user-login-signup').on('click', function(e) {
                e.stopPropagation(); //do not use return false, return false will preventDefault();
            });
	}

	function validateAndSubmit(type) {
	    var LOGIN = 0,
	        REGISTER = 1,
	        mCtrl = this.mCtrl,
	        userName, userPwd, userPwdAgain, userEmail, userInfo;

	    if (type === LOGIN) {
	    	var guiOptsAfterLogin = function() {
	    		$('#overlay').css('display', 'none');
                $('#user-login-signup').css('display', 'none');
                $(document).off('click');
                $('#user-name').html(userName);
                //alert('login success!');
	    	}
	    	userName = $("input[name = userName_login]").val();
	    	userPwd = $("input[name = userPwd_login]").val();
	        userInfo = {userName: userName, userPwd: userPwd};
	        mCtrl.login(userInfo, guiOptsAfterLogin);
	    } 

	    if (type === REGISTER) {
	    	var guiOptsAfterRegister = function() {
	    		$('#overlay').css('display', 'none');
	            $('#user-login-signup').css('display', 'none');
	            $(document).off('click');
	            //alert('register success!');
	    	}
	        userName = $("input[name = userName_reg]").val();
	        userPwd = $("input[name = userPwd_reg]").val();
	        userPwdAgain = $("input[name = userPwdAgain_reg]").val();
	        userEmail = $("input[name = userEmail_reg]").val();
	        if (userPwd !== userPwdAgain) {
	            console.log('两次密码输入不一致');
	            return;
	        }
	        userInfo = {userName: userName, userPwd: userPwd, userEmail: userEmail};
	        mCtrl.register(userInfo, guiOptsAfterRegister);
	    }
	}


	$(document).ready(function(){
		vis = new MView();
		vis.init();
	});
})()