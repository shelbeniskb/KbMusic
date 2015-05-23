(function(){
	MCtrl = function() {

	}

	MCtrl.prototype = {
		player: null,
		mModel: null,
		songList: [],
		enablePlayIcon: false,
		curSongIdx: 0,
		frontImgIdx: 0,
		imgList: [],
		showSlider: false,
		init: function(player) {
			var mModel;
			this.player = player[0];
			this.mModel = mModel = new MModel();
			this.loadSongs(true);
		},
		loadSongs: function(reset) {
			var me = this;
			var songLoaded = function(songs) {
				if (!songs || songs.length === 0) {
					songs = defalutSongs;
				}
				me.songList = songs;
				me.enablePlayIcon = true;
				if (reset) {
					me.curSongIdx = 0;
					me.triggerSwitchAnimation();
				}
				me.drawSongList(songs);
			};
			this.enablePlayIcon = false;
			this.mModel.getSongList(songLoaded);
		},
		/*播放列表中的歌曲*/
		play: function() {
			if (!this.enablePlayIcon) {
				return;
			}
			var curSongInfo = this.songList[this.curSongIdx],
				player = this.player;
			player.src = curSongInfo.audioUrl;
			player.play();
			this.highLightItemInList(curSongInfo);

		},

		playForSearch: function(songInfo) {
			var player = this.player;
			player.src = songInfo.audioUrl;
			player.play();
			this.triggerSwitchAnimation(songInfo);
		},

		togglePlay: function() {
			var player = this.player;
			if (player.paused) {
				if (player.src) {
					player.play();
				} else {
					this.play();
				}
			} else {
				this.player.pause();
			}
		},
		/*切歌*/
		cut: function(index) {
			this.lastSongIdx = this.curSongIdx;
			this.curSongIdx = index ? index : (this.curSongIdx === this.songList.length - 1 ? 0 : this.curSongIdx + 1);
			this.play();
			this.triggerSwitchAnimation();
		},
		/*加红心*/
		like: function() {

		},
		/*显示播放列表*/
		showAllMusic: function() {
			var sliderPage;
			if (!this.sliderPage) {
				this.sliderPage = $('#slider-page');
			}
			sliderPage = this.sliderPage;
			if (this.showSlider === false) {
                sliderPage.addClass('show');
                $('#slider-ctrl').addClass('rotate');
                this.showSlider = true;
            } else {
                sliderPage.removeClass('show');
                $('#slider-ctrl').removeClass('rotate');
                this.showSlider = false;
            }
		},

		login: function(userInfo, guiOptsAfterLogin) {
			var me = this;
	        var afterLogin = function(result) {
	        	if (result.status === 'success') {
	        		guiOptsAfterLogin();
	        		me.loadSongs(true);
	        	} else {
	        		alert(result.detail);
	        	}
	        }
	        this.mModel.userLogin(userInfo, afterLogin);
		},

		register: function(userInfo, guiOptsAfterRegister) {
			var me = this;
			var afterRegister = function(result) {
				if (result.status === 'success') {
					guiOptsAfterRegister();
				} else {
					alert(result.detail);
				}
			
			}
			this.mModel.userRegister(userInfo, afterRegister);
		},
		/*触发切换歌曲动画*/
		triggerSwitchAnimation: function(specifySong) {
			var songList = this.songList,
				songNum = songList.length,
				curSongItem = this.songList[this.curSongIdx];
			if (songNum > 0 && !specifySong) {
				this.dist = getStepsForSwitch(songList, this.lastSongIdx, this.curSongIdx, 4);
				this.doShowArtistImg(curSongItem); 
			} else {
				this.doShowArtistImgStatic(specifySong);
			}

		},

		doShowArtistImgStatic: function(songInfo) {
	        var imgSongMap = this.imgSongMap || [],
	            frontImgIdx = this.frontImgIdx,
	            imgList = this.imgList;
	        	imgList[frontImgIdx].attr('src', songInfo.artistImg);
	    },

	    doShowArtistImg: function(songInfo) {
	        var dist = this.dist,
	            find = dist.find,
	            imgNum = 9;
	            rotateValue = this.rotateValue || 0;
	        if (find) {
	            rotateValue = rotateValue + dist.dir * dist.step * 40;
	            this.frontImgIdx = (this.frontImgIdx + dist.dir * dist.step * (-1) + imgNum) % imgNum;
	        } else {
	            rotateValue = rotateValue - 360;
	        }

	        if (this.curSongIdx !== -1) {
	            this.updateDirtyImg();
	        } else {
	            this.updateDirtyImgInterrupt(songInfo);
	        }
	        $('.show-container').css('transform', 'translateZ(-404.747px) rotateY(' + rotateValue + 'deg)');
	        this.rotateValue = rotateValue;
	    },

	    updateDirtyImgInterrupt: function(songInfo) {
	        var imgSongMap = this.imgSongMap || [],
	            frontImgIdx = this.frontImgIdx,
	            imgList = this.imgList;
	        imgList[frontImgIdx].attr('src', songInfo.artistImg);
	        imgSongMap[frontImgIdx] = songInfo.artistImg;
	    },

	    updateDirtyImg: function() {
	        var imgSongMap = this.imgSongMap || [],
	            frontImgIdx = this.frontImgIdx,
	            curSongIdx = this.curSongIdx,
	            songsList = this.songList,
	            imgList = this.imgList,
	            len = songsList.length,
	            step = 4,
	            imgNum = 9,
	            i;
	        //update the front Img
	        if (imgSongMap[frontImgIdx] !== songsList[curSongIdx].artistImg) {
	            imgSongMap[frontImgIdx] = songsList[curSongIdx].artistImg;
	            imgList[frontImgIdx].attr('src', songsList[curSongIdx].artistImg);
	        }
	        i = 1;
	        while (i <= step) {
	            var curI = (frontImgIdx + i) % imgNum,
	                curS = (curSongIdx + i) % len;
	            if (imgSongMap[curI] !== songsList[curS].artistImg) {
	                imgSongMap[curI] = songsList[curS].artistImg;
	                imgList[curI].attr('src', songsList[curS].artistImg);
	            }
	            i++;
	        }
	        i = 1;
	        while (i <= step) {
	            var curI = (frontImgIdx - i + imgNum) % imgNum,
	                curS = (curSongIdx - i + len*9) % len;
	            if (imgSongMap[curI] !== songsList[curS].artistImg) {
	                imgSongMap[curI] = songsList[curS].artistImg;
	                imgList[curI].attr('src', songsList[curS].artistImg);
	            }
	            i++;
	        }
	    },
	    updateDirtyImgInterrupt: function(songInfo) {
	        var imgSongMap = this.imgSongMap || [],
	            frontImgIdx = this.frontImgIdx,
	            imgList = this.imgList;
	        imgList[frontImgIdx].attr('src', songInfo.artistImg);
	        imgSongMap[frontImgIdx] = songInfo.artistImg;
	    },

	    updateDirtyImg: function() {
	        var imgSongMap = this.imgSongMap || [],
	            frontImgIdx = this.frontImgIdx,
	            curSongIdx = this.curSongIdx,
	            songsList = this.songList,
	            imgList = this.imgList,
	            len = songsList.length,
	            step = 4,
	            imgNum = 9,
	            i;
	        //update the front Img
	        if (imgSongMap[frontImgIdx] !== songsList[curSongIdx].artistImg) {
	            imgSongMap[frontImgIdx] = songsList[curSongIdx].artistImg;
	            imgList[frontImgIdx].attr('src', songsList[curSongIdx].artistImg);
	        }
	        i = 1;
	        while (i <= step) {
	            var curI = (frontImgIdx + i) % imgNum,
	                curS = (curSongIdx + i) % len;
	            if (imgSongMap[curI] !== songsList[curS].artistImg) {
	                imgSongMap[curI] = songsList[curS].artistImg;
	                imgList[curI].attr('src', songsList[curS].artistImg);
	            }
	            i++;
	        }
	        i = 1;
	        while (i <= step) {
	            var curI = (frontImgIdx - i + imgNum) % imgNum,
	                curS = (curSongIdx - i + len*9) % len;
	            if (imgSongMap[curI] !== songsList[curS].artistImg) {
	                imgSongMap[curI] = songsList[curS].artistImg;
	                imgList[curI].attr('src', songsList[curS].artistImg);
	            }
	            i++;
	        }
	    },

		drawSongList: function(songs) {
	        var rowContainer = $('#song-row-container')[0];
	        while (rowContainer.firstChild) { //remove all the old children DOM node
	            rowContainer.removeChild(rowContainer.firstChild);
	        }
	        for(var i = 0; i < songs.length; i++) {
	            var rowElem = this.createSongRow(i, songs[i]);
	            rowContainer.appendChild(rowElem);
	        }
	        this.songListDom = rowContainer;
	    },

	    createSongRow: function(num, songInfo) {
	        var tr = document.createElement('tr'),
	            tdNum = document.createElement('td'),
	            tdState = document.createElement('td'),
	            tdName = document.createElement('td'),
	            tdTime = document.createElement('td'),
	            tdSinger = document.createElement('td'),
	            time = songInfo.time,
	            minute = parseInt(time / 60),
	            second = parseInt(time - minute * 60),
	            me = this;
	        tdNum.innerHTML = num;
	        tdName.innerHTML = songInfo.songName;
	        tdTime.innerHTML = minute + ':' + second;
	        tdSinger.innerHTML = songInfo.artistName;
	        tr.appendChild(tdNum);
	        tr.appendChild(tdState);
	        tr.appendChild(tdName);
	        tr.appendChild(tdTime);
	        tr.appendChild(tdSinger);
	        tr.songInfo = songInfo;
	        tr.addEventListener('click', function(e){
	        	me.lastSongIdx = me.curSongIdx
	            me.curSongIdx = num;
	            me.play();
	            me.triggerSwitchAnimation();
	        })
	        return tr;
	    },

		highLightItemInList: function(songInfo) {
		    var songListDom = this.songListDom,
		        children = songListDom.children;
		    $('tr.isPlaying').removeClass('isPlaying');
		    $('td.showPlayIcon').removeClass('showPlayIcon');
		    for (var i = 0; i < children.length; i++) {
		        var Info = children[i].songInfo;
		        if (Info.number === songInfo.number) {
		            var tr = children[i],
		                state = tr.children[1];
		            tr.className = 'isPlaying';
		            state.className = 'showPlayIcon';
		        }
		    }
		},

	    doSearchSong: function(value) {
	        $.ajax({
	            type: "GET",
	            url: "http://s.music.163.com/search/get/?type=1&&s=" + encodeURI(value),
	            dataType:'jsonp',
	            jsonp: 'callback',
	            jsonpCallback: 'vis.mCtrl.handleCallback'
	        });
	    },

		handleCallback: function(response) {
	        var result = response.result,
	            code = response.code;
	        if (code === 200 && result) {
	            this.showResultPop(result.songs);
	        } else {
	            if (this.searchResultDom) {
	                document.body.removeChild(this.searchResultDom);
	                this.searchResultDom = null;
	            }
	            console.log("No Result!");
	        }
	    },

	    showResultPop: function(songs) {
	        var len = songs.length,
	        	searchInput  = $('#search_input'),
	            x = searchInput.offset().left,
	            y = searchInput.offset().top + searchInput.outerHeight() + 1,
	            width = searchInput.outerWidth(),
	            me = this;
	        if (len === 0) {
	            return;
	        }
	        if (this.searchResultDom) {
	            document.body.removeChild(this.searchResultDom);
	            this.searchResultDom = null;
	        }
	        var ulDom = document.createElement('ul');
	        ulDom.className = "list-group";
	        ulDom.style.position = "absolute";
	        ulDom.style.left = x + 'px';
	        ulDom.style.top = y + 'px';
	        ulDom.style.width = width + 'px';
	        for (var i = 0; i < len; i++) {
	            var liDom = document.createElement('li'),
	                songInfo = {songName: songs[i].name, artistName: songs[i].artists[0].name, audioUrl: songs[i].audio, artistImg: songs[i].album.picUrl, number: songs[i].id};
	            liDom.innerHTML = songs[i].name + '   ' + songs[i].artists[0].name;
	            liDom.className = "list-group-item";
	            liDom.songInfo = songInfo;
	            liDom.addEventListener('click', function() {
	                var songInfo = this.songInfo;
	                me.curNewSong = songInfo;
	                me.playForSearch(songInfo);
	                if (me.searchResultDom) {
	                    document.body.removeChild(me.searchResultDom);
	                    me.searchResultDom = null;
	                }
	            });
	            ulDom.appendChild(liDom);
	        }
	        me.searchResultDom = ulDom;
	        document.body.appendChild(ulDom);
	        $(document).on('click', function() {
	            if (me.searchResultDom) {
	                document.body.removeChild(me.searchResultDom);
	                me.searchResultDom = null;
	            }
	            $(document).off('click');
	        });
	    },

		attachEventForPlayer: function() {
	        var media = this.player,
	        	me = this;
	        media.addEventListener('play', function() {
	            $('#play-icon')[0].className = "glyphicon glyphicon-pause";
	        });
	        media.addEventListener('pause', function() {
	            $('#play-icon')[0].className = "glyphicon glyphicon-play";
	        });
	        media.addEventListener('ended', function() {
	            me.cut();
	        });
	    },

	    addNewSong: function(optsAfterUnlogin) {
	    	var newSong = this.curNewSong || {},
	    		songList = this.songList,
	    		hasAdded = false,
	    		me = this;
	    	var callback = function(result) {
	    		if (result.status === 'success') {
	    			me.loadSongs();
	    		} else if (result.status === 'unlogin') {
	    			optsAfterUnlogin();
	    		} else if (result.status === 'error') {
	    			alert(result.detail);
	    		}
	    	}
    		$.each(songList, function(i, song) {
    			if (song._id === newSong._id) {
    				hasAdded = true;
    			}
    		});

    		if (!hasAdded) {
    			newSong.time = this.player.duration;
    			this.mModel.addSong(newSong, callback);
    		}
	    }

	}

	function getStepsForSwitch(songsList, lastSongIdx, curSongIdx, step) {
		var len = songsList.length,
            forward = {find: true, dir: -1, step: Infinity},
            back = {find: true, dir: 1, step: Infinity},
            i = 0;
        if (lastSongIdx === -1 || curSongIdx === -1) {
            return {find: false};
        }
        while (i <= step) {
            var idx = (i + lastSongIdx) % len;
            if (idx === curSongIdx)
            {
                forward = {find: true, dir: -1, step: i};
                break;
            }
            i++;
        }
        i = 0;
        while (i <= step) {
            var idx = (lastSongIdx - i + len) % len;
            if (idx === curSongIdx)
            {
                back = {find: true, dir: 1, step: i};
                break;
            }
            i++;
        }
        if (forward.step < Infinity || back.step < Infinity) {
           return forward.step < back.step ? forward : back; 
        }

        return {find: false};
	}

	var defalutSongs = [{
		_id: "55335229bc11e5b803a52306",
		artistImg: "http://p1.music.126.net/JIc9X91OSH-7fUZqVfQXAQ==/7731765766799133.jpg",
		artistName: "Wiz Khalifa",
		audioUrl: "http://m1.music.126.net/TzeTpKqiTb9AslBbnEC_hw==/7814229139053181.mp3",
		number: 30953009,
		songName: "See You Again",
		time: "229.590204",
		isRecommend: true
	},
	{
		_id: "55335268bc11e5b803a52307",
		artistImg: "http://p1.music.126.net/-qfL1gqOnEIq_UDUObfXOQ==/80264348840422.jpg",
		artistName: "梁静茹",	
		audioUrl: "http://m1.music.126.net/f4zSeQR8e6TEPkbeMnyByA==/3219370046128525.mp3",
		number: 254146,
		songName: "小手拉大手",
		time: "246.752625",
		isRecommend: true
	},
		{
		_id: "553353dcbc11e5b803a5230a",
		artistImg: "http://p1.music.126.net/Y3MAgjvSBOx_BAVyz82cEw==/3240260770098380.jpg",
		artistName: "杨子姗",
		audioUrl: "http://m1.music.126.net/_RC9qKcMSrrRqoTln3WcCg==/6646547791393823.mp3",
		number: 29922116,
		songName: "给我一个吻",
		time: "172.056",
		isRecommend: true
	}]
})()