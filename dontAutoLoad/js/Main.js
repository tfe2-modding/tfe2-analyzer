var Main = $hxClasses["Main"] = function() {
	this.knownDPI = -1;
	this.knownInnerW = -1;
	this.knownInnerH = -1;
	this.rotationAsker = null;
	this.askForRotation = false;
	this.setScalingIn = -1;
	this.scaling = 1;
	this.maxScaling = 2;
	var _gthis = this;
	Main.isMobile = Config.canBeMobile && (Config.forceMobile || jsFunctions.isAnyMobile());
	common_PixiApplication.call(this);
	Config.waitForInitialization(function() {
		_gthis.init();
	},function() {
		if(_gthis.game != null) {
			_gthis.game.pause("ConfigBasedPause");
		}
	},function() {
		if(_gthis.game != null) {
			_gthis.game.resume("ConfigBasedPause");
		}
	});
};
Main.__name__ = "Main";
Main.main = function() {
	new Main();
};
Main.__super__ = common_PixiApplication;
Main.prototype = $extend(common_PixiApplication.prototype,{
	init: function() {
		var _gthis = this;
		if(!Config.checkSitelock()) {
			window.alert("This version of The Final Earth 2 has not been licensed for this site. " + "If you're seeing this in error or need a new domain added to an existing sitelock, just contact me and I'll fix it. " + "Otherwise, please contact me (e.g. from florianvanstrien.nl) for licensing options.");
			return;
		}
		this.autoResize = false;
		this.onUpdate = $bind(this,this.update);
		window.addEventListener("resize",$bind(this,this.setGameScaleSoon));
		this.backgroundColor = 0;
		this.pixelRatio = 1;
		if(Main.isMobile || Main.isIPadVersionOnAMac) {
			this.pixelRatio = window.devicePixelRatio;
		}
		if(this.pixelRatio == null || this.pixelRatio <= 0) {
			this.pixelRatio = 1;
		}
		this.knownInnerH = window.innerHeight;
		this.knownInnerW = window.innerWidth;
		this.knownDPI = window.devicePixelRatio;
		var iw = window.innerWidth;
		var ih = window.innerHeight;
		this.width = Math.max(iw * this.pixelRatio,3 * this.pixelRatio);
		this.height = Math.max(ih * this.pixelRatio,3 * this.pixelRatio);
		Config.earlyInit();
		try {
			this.preserveDrawingBuffer = jsFunctions.maliDetect();
		} catch( _g ) {
			var e = haxe_Exception.caught(_g);
			console.log("FloatingSpaceCities/Main.hx:101:",e);
		}
		this.transparent = true;
		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
		this.initConfig();
		var rendererType = "auto";
		common_PixiApplication.prototype.start.call(this,rendererType);
		this.setGameScale();
		this.loader = new GameLoader(function() {
			_gthis.loader.update(_gthis.gameRect,_gthis.scaling);
			_gthis.loader = null;
			var gameStage = _gthis.stage.addChild(new PIXI.Container());
			_gthis.game = new Game(_gthis,gameStage,_gthis.gameRect,_gthis.addX,_gthis.addY,_gthis.scaling,Main.isMobile);
			_gthis.game.isLargeMobile = _gthis.game.isMobile && Main.isLargeMobile;
			if(_gthis.askForRotation && _gthis.rotationAsker == null) {
				_gthis.rotationAsker = new common_PleaseRotateDevice(_gthis.stage);
				_gthis.game.pause("pleaseRotateFirst");
			}
		},this.stage,this);
		Main.isCanvasRenderer = this.renderer.type == PIXI.RENDERER_TYPE.CANVAS;
		this.canvas.addEventListener("contextmenu",function(ev) {
			ev.preventDefault();
			return false;
		},jsFunctions.getPassiveEventListenerVar());
		this.canvas.addEventListener("webglcontextrestored",$bind(this,this.onContextRestored));
		Config.init();
		Config.showSplashScreen(this);
		Analytics.init();
		if(Config.get_enableCrossPromo()) {
			jsFunctions.initCrossPromo("steam");
		}
		this.addPostDraw($bind(this,this.postDraw));
		if(window.document.hidden != null) {
			window.addEventListener("visibilitychange",function() {
				if(window.document.hidden) {
					_gthis.onWindowBlur();
				} else {
					_gthis.onWindowFocus();
				}
			});
		} else if(5 == 8) {
			window.addEventListener("blur",$bind(this,this.onWindowBlur));
			window.addEventListener("focus",$bind(this,this.onWindowFocus));
		}
		if(5 == 8) {
			window.document.addEventListener("deviceready",function() {
				window.document.addEventListener("pause",$bind(_gthis,_gthis.onWindowBlur));
				window.document.addEventListener("resume",$bind(_gthis,_gthis.onWindowFocus));
			});
		}
		try {
			window.addEventListener("error",function(err) {
				var stack = "";
				if(err.error != null) {
					stack = err.error.stack;
				}
				var errorMessage = "1.0.63+: " + err.message + " - " + err.filename + " - line " + err.lineno + " - col " + err.colno + " - " + stack + "}";
				Analytics.sendErrorEvent(errorMessage);
			});
		} catch( _g ) {
		}
		if(Config.limitedVersionForSmoothFilming) {
			this.app.ticker.maxFPS = 20;
		}
	}
	,onContextRestored: function() {
		if(this.game != null) {
			this.game.onContextRestored();
		}
	}
	,onWindowBlur: function() {
		if(this.game != null) {
			if(common_MobileApplicationLifecycleManager.shouldShowPause()) {
				this.game.pauseCityForBlurIfDesired();
			}
			this.game.pause("windowBlur");
		}
	}
	,onWindowFocus: function() {
		if(this.game != null) {
			if(this.game.resume("windowBlur")) {
				this.game.refocus();
			}
		}
	}
	,getWebRequestParams: function() {
		var get = "";
		get = HxOverrides.substr($global.location.search,1,null);
		var params = new haxe_ds_StringMap();
		var _g = 0;
		var _g1 = new EReg("[&;]","g").split(get);
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			var pl = p.split("=");
			if(pl.length < 2) {
				continue;
			}
			var name = pl.shift();
			var key = decodeURIComponent(name.split("+").join(" "));
			var s = pl.join("=");
			var value = decodeURIComponent(s.split("+").join(" "));
			params.h[key] = value;
		}
		return params;
	}
	,initConfig: function() {
		try {
			var params = this.getWebRequestParams();
			if(params.h["maxScale"] != null) {
				this.maxScaling = Std.parseInt(params.h["maxScale"]);
			}
			if(params.h["kv_maxScale"] != null) {
				this.maxScaling = Std.parseInt(params.h["kv_maxScale"]);
			}
			if(this.maxScaling == 0) {
				this.maxScaling = 2;
			}
		} catch( _g ) {
		}
	}
	,update: function(elapsedTime) {
		common_Performance.registerFrame();
		if(this.setScalingIn != -1) {
			this.setScalingIn--;
			if(this.setScalingIn == 0) {
				this.setGameScale();
				this.setScalingIn = -1;
			}
		} else if(window.innerHeight != this.knownInnerH || window.innerWidth != this.knownInnerW || window.devicePixelRatio != this.knownDPI) {
			if(jsFunctions.isAnyApple()) {
				this._onWindowResize(null);
				this.setGameScaleSoon();
				this.knownInnerH = window.innerHeight;
				this.knownInnerW = window.innerWidth;
				this.knownDPI = window.devicePixelRatio;
			}
		} else if(Main.isMobile && jsFunctions.isAnyApple()) {
			if(window.scrollY != 0) {
				window.scrollTo(0,0);
			}
		}
		if(this.rotationAsker != null) {
			this.rotationAsker.update(this.width / this.scaling,this.height / this.scaling,this.scaling);
		} else if(this.game != null) {
			this.game.update(elapsedTime);
		} else if(this.loader != null) {
			this.loader.update(this.gameRect,this.scaling);
		}
		Config.update(elapsedTime);
	}
	,postDraw: function() {
		if(this.game != null) {
			this.game.postDraw();
		}
	}
	,_onWindowResize: function(event) {
		this.knownInnerH = window.innerHeight;
		this.knownInnerW = window.innerWidth;
		common_PixiApplication.prototype._onWindowResize.call(this,event);
	}
	,setGameScale: function() {
		if(Main.isIPadVersionOnAMac) {
			this.pixelRatio = window.devicePixelRatio;
		}
		var dpi = this.pixelRatio * (Config.mobileTrailerMode ? Config.mobileTrailerModeMultiplier : 1.0);
		var minFloatScaling = 2.0;
		var floatScaling = minFloatScaling;
		floatScaling *= dpi;
		this.scaling = floatScaling / dpi > this.maxScaling ? Math.floor(this.maxScaling * dpi) : Math.floor(floatScaling);
		if(Main.isMobile && this.width < this.height && Math.floor(this.width / this.scaling) < 320 && 5 != 8) {
			this.askForRotation = true;
			if(this.loader == null && this.game != null && this.rotationAsker == null) {
				this.rotationAsker = new common_PleaseRotateDevice(this.stage);
				this.game.pause("pleaseRotateFirst");
			}
		} else {
			if(this.width / this.scaling < 320) {
				var val = Math.floor(this.width / 320);
				var maxVal = this.scaling;
				this.scaling = val < 1 ? 1 : val > maxVal ? maxVal : val;
			}
			if(this.height / this.scaling < 150) {
				var val = Math.floor(this.height / 150);
				var maxVal = this.scaling;
				this.scaling = val < 1 ? 1 : val > maxVal ? maxVal : val;
			}
			if(Main.isIPadVersionOnAMac) {
				this.scaling += 1;
			}
			var val = this.scaling + Main.scalingMod;
			this.scaling = val < 1 ? 1 : val > 100 ? 100 : val;
			this.askForRotation = false;
			if(this.rotationAsker != null) {
				this.rotationAsker.destroy();
				this.rotationAsker = null;
				this.game.resume("pleaseRotateFirst");
			}
		}
		Main.isLargeMobile = Math.floor(this.width / this.scaling) >= 450;
		this.gameRect = new common_Rectangle(0,0,Math.floor(this.width / this.scaling),Math.floor(this.height / this.scaling));
		this.addX = 0;
		this.addY = 0;
		if(this.game != null) {
			this.game.isLargeMobile = this.game.isMobile && Main.isLargeMobile;
			this.game.resize(this.gameRect,this.addX,this.addY,this.scaling);
		} else {
			Config.resizeSplash(this);
		}
	}
	,setGameScaleSoon: function() {
		if(5 == 8) {
			this.setScalingIn = 30;
		} else {
			this.setScalingIn = 5;
		}
	}
	,__class__: Main
});
