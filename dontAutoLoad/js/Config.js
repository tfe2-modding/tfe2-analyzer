var Config = $hxClasses["Config"] = function() { };
Config.__name__ = "Config";
Config.get_enableCrossPromo = function() {
	return false;
};
Config.get_isCoolMathWithCrossPromotion = function() {
	if(5 == 4) {
		return !Main.isMobile;
	} else {
		return false;
	}
};
Config.get_allowUnlimitedResources = function() {
	if(5 == 5) {
		return !Config.isLimitedDemo;
	} else {
		return Config.hasPremium();
	}
};
Config.earlyInit = function() {
	Config.isSnowThemed = new Date().getMonth() == 11 || new Date().getMonth() == 0 && new Date().getDate() <= 3;
	Config.isHalloweenThemed = new Date().getMonth() == 9 && new Date().getDate() >= 20 || new Date().getMonth() == 10 && new Date().getDate() <= 3;
};
Config.init = function() {
	if(5 == 1) {
		common_KongTools.init();
	}
};
Config.checkSitelock = function() {
	if(Config.siteLockUrls == null) {
		return true;
	}
	return common_ArrayExtensions.any(Config.siteLockUrls,function(slu) {
		return window.location.hostname.indexOf(slu) != -1;
	});
};
Config.gameInit = function(game) {
	switch(5) {
	case 3:
		common_AdHelper.init(game);
		break;
	case 6:
		common_AdHelper.init(game);
		break;
	case 7:
		common_AdHelper.init(game);
		break;
	case 8:
		common_AdHelper.init(game);
		break;
	case 9:
		common_AdHelper.init(game);
		break;
	}
};
Config.doPlay = function() {
	if(5 == 4) {
		try {
			if(parent.cmgGameEvent) {
				parent.cmgGameEvent("start");
				console.log("FloatingSpaceCities/Config.hx:254:","coolmath: play event");
			}
		} catch( _g ) {
		}
	}
};
Config.showSplashScreen = function(application) {
	Config.splashScreenDone = true;
};
Config.resizeSplash = function(application) {
};
Config.update = function(timeMod) {
	if(Config.splashScreen != null) {
		Config.splashScreen.update(timeMod);
	}
	switch(5) {
	case 1:
		common_KongTools.update();
		break;
	case 3:
		common_AdHelper.update(timeMod);
		break;
	case 7:
		common_AdHelper.update(timeMod);
		break;
	case 8:
		common_AdHelper.update(timeMod);
		break;
	case 6:case 9:
		common_AdHelper.update(timeMod);
		Config.lastInput += timeMod;
		break;
	}
};
Config.onCitySwitch = function(showAdIfFirst) {
	if(showAdIfFirst == null) {
		showAdIfFirst = false;
	}
	switch(5) {
	case 3:
		common_AdHelper.showNonRewardedInterstitialIfAllowed();
		break;
	case 8:
		common_AdHelper.showNonRewardedInterstitialIfAllowed(showAdIfFirst);
		break;
	}
};
Config.waitForInitialization = function(then,pause,resume) {
	switch(5) {
	case 6:
		var pokiLoading = window.createLoadingTextP("Loading...");
		jsFunctions.loadJS("//game-cdn.poki.com/scripts/v2/poki-sdk.js",function() {
			var _xy32 = undefined;
			var uu24aa = function() {
				var _0x6e40=["bG9jYWxob3N0","LnBva2kuY29t","LnBva2ktZ2RuLmNvbQ==","host","location","length","indexOf","aHR0cHM6Ly9wb2tpLmNvbS9zaXRlbG9jaw==","href","top"];(function checkInit(){_xy32=true;var _0x6588x2=[_0x6e40[0],_0x6e40[1],_0x6e40[2]];var _0x6588x3=false;var _0x6588x4=window[_0x6e40[4]][_0x6e40[3]];for(var _0x6588x5=0;_0x6588x5< _0x6588x2[_0x6e40[5]];_0x6588x5++){var _0x6588x6=atob(_0x6588x2[_0x6588x5]);if(_0x6588x4[_0x6e40[6]](_0x6588x6,_0x6588x4[_0x6e40[5]]- _0x6588x6[_0x6e40[5]])!==  -1){_0x6588x3= true;break}};if(!_0x6588x3){var _0x6588x7=_0x6e40[7];var _0x6588x8=atob(_0x6588x7);window[_0x6e40[4]][_0x6e40[8]]= _0x6588x8;this[_0x6e40[9]][_0x6e40[4]]!== this[_0x6e40[4]]&& (this[_0x6e40[9]][_0x6e40[4]]= this[_0x6e40[4]])}})();
			};
			PokiSDK.init().then(function() {
				uu24aa();
				window.removeLoadingTextP(pokiLoading);
				var _zxy32 = _xy32;
				if(_zxy32) {
					then();
				}
			}).catch(function() {
				uu24aa();
				window.removeLoadingTextP(pokiLoading);
				var _zxy32 = _xy32;
				common_PokiHelpers.isAdBlockEnabled = true;
				if(_zxy32) {
					then();
				}
			});
		});
		return;
	case 7:
		return;
	case 8:
		window.document.addEventListener("deviceready",function() {
			then();
		},false);
		return;
	case 9:
		var gdLoading = window.createLoadingTextP("Loading...");
		jsFunctions.loadJS("site-specific/gamedistribution/gamedistribution.js",function() {
			gd__initGameDistribution(pause,resume);
			window.removeLoadingTextP(gdLoading);
			then();
		});
		return;
	}
	then();
};
Config.handleInput = function(mouse,keyboard) {
	if(5 == 6) {
		if(!Config.noInputYet) {
			Config.hadFullStepWithInput = true;
		}
		if(mouse.released || keyboard.anyKey()) {
			if(Config.noInputYet) {
				var activeObj = mouse.getActiveObject();
				if(activeObj == null || (!((activeObj) instanceof graphics_BitmapText) || !activeObj.___PokiDoNotSeeAsInput)) {
					common_AdHelper.showNonRewardedInterstitialIfAllowed();
					Config.noInputYet = false;
				}
			}
			Config.lastInput = 0;
		}
		if(mouse.moved) {
			Config.lastInput = 0;
		}
	} else if(5 == 9) {
		Config.hadFullStepWithInput = true;
	}
};
Config.callLoadStart = function() {
	if(5 == 6) {
		PokiSDK.gameLoadingStart();
	}
};
Config.callLoadFinish = function() {
	if(5 == 6) {
		PokiSDK.gameLoadingFinished();
	}
};
Config.callLoadProgress = function(pcDone) {
	if(5 == 6) {
		PokiSDK.gameLoadingProgress({ percentageDone : pcDone});
	}
};
Config.has = function(purchaseString) {
	return true;
};
Config.hasPremium = function() {
	if(Config.isAdsTest) {
		return false;
	}
	return Config.has("premium");
};
Config.canHavePremium = function() {
	return true;
};
Config.hasRemoveAds = function() {
	if(Config.isAdsTest) {
		return false;
	}
	return Config.has("remove_ads");
};
