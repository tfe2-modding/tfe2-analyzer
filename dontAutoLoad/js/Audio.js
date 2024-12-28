var Audio = $hxClasses["Audio"] = function(game) {
	this.extraFormat = "";
	this.isPaused = false;
	this.playSecondMusicOnceLoaded = false;
	this.music1EverFinished = false;
	this.music4 = null;
	this.music3 = null;
	this.music2 = null;
	var _gthis = this;
	Audio.instance = this;
	this.game = game;
	this.music1 = PIXI.sound.Sound.from({ url : "audio/BTFE_BackgroundMusic_1.{" + this.extraFormat + "ogg,mp3}", preload : true, singleInstance : true, loaded : function() {
		if(Settings.musicOn) {
			_gthis.music1.volume = _gthis.musicVolume();
			_gthis.music1.play($bind(_gthis,_gthis.firstMusicCompleteCallback));
			if(_gthis.isPaused) {
				_gthis.music1.pause();
			}
		}
	}});
	this.music2 = null;
	if(Settings.musicOn) {
		this.loadSecondMusic();
	}
	this.buildSound = PIXI.sound.Sound.from({ url : "audio/BTFE_BuildingBuild.{ogg,mp3}", preload : true});
	this.buildingClickSound = PIXI.sound.Sound.from({ url : "audio/BTFE_BuildingClick.{ogg,mp3}", preload : true});
	this.buildingUpgradeSound = PIXI.sound.Sound.from({ url : "audio/BTFE_BuildingUpgrade.{ogg,mp3}", preload : true});
	this.buttonSound = PIXI.sound.Sound.from({ url : "audio/BTFE_Button.{ogg,mp3}", preload : true});
	this.buttonFailSound = PIXI.sound.Sound.from({ url : "audio/BTFE_ButtonFail.{ogg,mp3}", preload : true});
	this.followCitizenSound = PIXI.sound.Sound.from({ url : "audio/BTFE_Follow.{ogg,mp3}", preload : true});
	this.decorateSound = PIXI.sound.Sound.from({ url : "audio/BTFE_Decorate.{ogg,mp3}", preload : true});
	this.changeVitalBuildingSound = PIXI.sound.Sound.from({ url : "audio/BTFE_ChangeVitalBuilding.{ogg,mp3}", preload : true});
	this.rocketLaunchSound = PIXI.sound.Sound.from({ url : "audio/BTFE_RocketLaunch.{ogg,mp3}", preload : true});
	this.music = this.music1;
};
Audio.__name__ = "Audio";
Audio.get = function() {
	return Audio.instance;
};
Audio.prototype = {
	loadSecondMusic: function() {
		var _gthis = this;
		this.music2 = PIXI.sound.Sound.from({ url : "audio/BTFE_BackgroundMusic_2.{" + this.extraFormat + "ogg,mp3}", preload : true, singleInstance : false, loaded : function() {
			if(Settings.musicOn && _gthis.music == _gthis.music1 && !_gthis.music.isPlaying && !_gthis.music.paused && _gthis.playSecondMusicOnceLoaded) {
				_gthis.music = _gthis.music2;
				_gthis.music.volume = _gthis.musicVolume();
				_gthis.music2.play($bind(_gthis,_gthis.startNextMusic));
				if(_gthis.isPaused) {
					_gthis.music2.pause();
				}
				_gthis.playSecondMusicOnceLoaded = false;
			}
		}});
	}
	,loadThirdMusic: function() {
		this.music3 = PIXI.sound.Sound.from({ url : "audio/BTFE_BackgroundMusic_3.{" + this.extraFormat + "ogg,mp3}", preload : true, singleInstance : false});
	}
	,loadFourthMusic: function() {
		this.music4 = PIXI.sound.Sound.from({ url : "audio/BTFE_BackgroundMusic_4.{" + this.extraFormat + "ogg,mp3}", preload : true, singleInstance : false});
	}
	,startNextMusic: function() {
		if(this.music2 != null && this.music2.isLoaded || this.music3 != null && this.music3.isLoaded || this.music4 != null && this.music4.isLoaded) {
			var possibleOptions = [];
			if(this.music2 != null && this.music2.isLoaded) {
				possibleOptions.push(this.music2);
			}
			if(this.music3 != null && this.music3.isLoaded) {
				possibleOptions.push(this.music3);
			} else if(this.music3 == null) {
				this.loadThirdMusic();
			}
			if(this.music4 != null && this.music4.isLoaded) {
				possibleOptions.push(this.music4);
			} else if(this.music3 != null && this.music3.isLoaded && this.music4 == null) {
				this.loadFourthMusic();
			}
			if(possibleOptions.length > 1 && this.music != null) {
				HxOverrides.remove(possibleOptions,this.music);
			}
			var newMusic = random_Random.fromArray(possibleOptions);
			this.music = newMusic;
			this.music.volume = this.musicVolume();
			this.music.play($bind(this,this.startNextMusic));
			if(this.isPaused) {
				this.music.pause();
			}
		} else {
			this.playSecondMusicOnceLoaded = true;
		}
	}
	,firstMusicCompleteCallback: function(audio) {
		if(!Settings.musicOn) {
			return;
		}
		this.music1EverFinished = true;
		this.startNextMusic();
	}
	,changeMusicEnabledness: function(musicIsOn) {
		Settings.musicOn = musicIsOn;
		Settings.save();
		if(!Settings.musicOn) {
			if(this.music.isPlaying) {
				this.music.stop();
			}
		} else {
			if(!this.music.isPlaying) {
				if(this.music1EverFinished) {
					this.startNextMusic();
				} else if(this.music1.isLoaded) {
					this.music1.volume = this.musicVolume();
					this.music1.play($bind(this,this.firstMusicCompleteCallback));
				}
			}
			if(this.music2 == null) {
				this.loadSecondMusic();
			}
		}
	}
	,changeSoundEnabledness: function(soundIsOn) {
		Settings.soundOn = soundIsOn;
		Settings.save();
	}
	,pauseMusic: function() {
		if(this.music != null && this.music.isPlaying && !this.music.paused) {
			this.music.pause();
		}
		this.isPaused = true;
	}
	,resumeMusic: function() {
		if(this.music != null && this.music.paused && Settings.musicOn) {
			this.music.resume();
		}
		this.isPaused = false;
	}
	,playSound: function(sound) {
		if(Settings.soundOn && sound.isLoaded) {
			sound.volume = this.soundVolume();
			sound.play({ });
		}
	}
	,musicVolume: function() {
		return Settings.musicVolume * Settings.musicVolume;
	}
	,soundVolume: function() {
		return Settings.soundVolume * Settings.soundVolume;
	}
	,setVolumeLevels: function() {
		if(this.music != null) {
			this.music.volume = this.musicVolume();
		}
	}
	,__class__: Audio
};
