var Settings = $hxClasses["Settings"] = function() { };
Settings.__name__ = "Settings";
Settings.loadLanguages = function(then) {
	common_Localize.loadLanguage("en",true,function() {
		if(Settings.language != "en") {
			common_Localize.loadLanguage(Settings.language,false,function() {
				Settings.settingsLoaded = true;
				if(then != null) {
					then();
				}
			},function() {
				Settings.settingsLoaded = true;
				if(then != null) {
					then();
				}
			});
		} else {
			Settings.settingsLoaded = true;
			if(then != null) {
				then();
			}
		}
	},function() {
	});
};
Settings.load = function(application) {
	if(common_Storage.getItem("tfe2_settings",function(err,theSave) {
		if(err == null && theSave != null) {
			Settings.musicOn = theSave.musicOn;
			Settings.soundOn = theSave.soundOn;
			if(theSave.pathfindingWorkers != null) {
				Settings.pathfindingWorkers = theSave.pathfindingWorkers;
			}
			if(theSave.secretCodesEnabled != null) {
				Settings.secretCodesEnabled = theSave.secretCodesEnabled;
			}
			if(theSave.modsDisabled != null) {
				Settings.modsDisabled = theSave.modsDisabled;
			}
			if(theSave.boostHidden != null) {
				Settings.boostHidden = theSave.boostHidden;
			}
			if(theSave.colorBlindMode != null) {
				Settings.colorBlindMode = theSave.colorBlindMode;
			}
			if(theSave.musicVolume != null) {
				Settings.musicVolume = theSave.musicVolume;
			}
			if(theSave.soundVolume != null) {
				Settings.soundVolume = theSave.soundVolume;
			}
			if(theSave.language != null) {
				Settings.language = theSave.language;
			}
			if(theSave.euAdConsentStatus != null) {
				Settings.euAdConsentStatus = theSave.euAdConsentStatus;
			}
			if(theSave.showScreenshotHelpInfo != null) {
				Settings.showScreenshotHelpInfo = theSave.showScreenshotHelpInfo;
			}
			if(theSave.allowMoreZoom != null) {
				Settings.allowMoreZoom = theSave.allowMoreZoom;
			}
			if(theSave.disableClouds != null) {
				Settings.disableClouds = theSave.disableClouds;
			}
			if(theSave.disablePlanets != null) {
				Settings.disablePlanets = theSave.disablePlanets;
			}
			if(theSave.scalingMod != null) {
				Main.scalingMod = theSave.scalingMod;
				if(Main.scalingMod != 0) {
					application.setGameScale();
				}
			}
			Settings.fullscreen = theSave.isFullScreen;
			if(Settings.fullscreen == null) {
				Settings.fullscreen = true;
			}
			if(Settings.fullscreen && window.document.fullscreenElement == null) {
				jsFunctions.goFullscreen();
			}
		} else {
			Settings.language = Settings.getLanguage();
			Settings.fullscreen = true;
			if(Settings.fullscreen && window.document.fullscreenElement == null) {
				jsFunctions.goFullscreen();
			}
		}
		Settings.loadLanguages();
	}) == null) {
		Settings.language = Settings.getLanguage();
		Settings.loadLanguages();
		Settings.fullscreen = true;
		if(Settings.fullscreen && window.document.fullscreenElement == null) {
			jsFunctions.goFullscreen();
		}
	}
	if(Settings.pathfindingWorkers <= 0) {
		Settings.resetPathfindingWorkers();
	}
	window.document.addEventListener("fullscreenchange",function() {
		Settings.fullscreen = window.document.fullscreenElement != null || window.fullScreen == true;
		Settings.save();
	});
};
Settings.getLanguage = function() {
	var browserLanguage = $global.navigator.language;
	if(browserLanguage != null && browserLanguage != "") {
		var lang = browserLanguage.split("-")[0];
		switch(lang) {
		case "de":
			return "de";
		case "en":
			return "en";
		case "es":
			return "es";
		case "fr":
			return "fr";
		case "pt":
			return "pt";
		case "ru":
			return "ru";
		case "vi":
			return "vi";
		}
	}
	return "en";
};
Settings.resetPathfindingWorkers = function() {
	Settings.pathfindingWorkers = 2;
	if($global.navigator != null && $global.navigator.hardwareConcurrency != null) {
		try {
			var val = ($global.navigator.hardwareConcurrency / 2 | 0) - 1;
			Settings.pathfindingWorkers = val < 2 ? 2 : val > 7 ? 7 : val;
		} catch( _g ) {
			Settings.pathfindingWorkers = 2;
		}
	}
	return Settings.pathfindingWorkers;
};
Settings.save = function() {
	var theSave = { };
	theSave.musicOn = Settings.musicOn;
	theSave.soundOn = Settings.soundOn;
	theSave.boostHidden = Settings.boostHidden;
	theSave.colorBlindMode = Settings.colorBlindMode;
	theSave.pathfindingWorkers = Settings.pathfindingWorkers;
	theSave.secretCodesEnabled = Settings.secretCodesEnabled;
	theSave.modsDisabled = Settings.modsDisabled;
	theSave.musicVolume = Settings.musicVolume;
	theSave.soundVolume = Settings.soundVolume;
	theSave.language = Settings.language;
	theSave.euAdConsentStatus = Settings.euAdConsentStatus;
	theSave.scalingMod = Main.scalingMod;
	theSave.allowMoreZoom = Settings.allowMoreZoom;
	theSave.compatDisableMasking = Settings.compatDisableMasking;
	theSave.disableClouds = Settings.disableClouds;
	theSave.disablePlanets = Settings.disablePlanets;
	theSave.showScreenshotHelpInfo = Settings.showScreenshotHelpInfo;
	theSave.isFullScreen = Settings.fullscreen;
	common_Storage.setItem("tfe2_settings",theSave,function() {
	});
};
Settings.hasSecretCode = function(code) {
	return Settings.secretCodesEnabled.indexOf(code) != -1;
};
Settings.unlockSecretCode = function(code) {
	if(Settings.hasSecretCode(code)) {
		return;
	}
	Settings.secretCodesEnabled.push(code);
	Settings.save();
};
Settings.loadFromCitySave = function(queue) {
	var intToRead = queue.bytes.getInt32(queue.readStart);
	queue.readStart += 4;
	var numberOfSecretCodesStored = intToRead;
	var _g = 0;
	var _g1 = numberOfSecretCodesStored;
	while(_g < _g1) {
		var i = _g++;
		Settings.unlockSecretCode(queue.readString());
	}
};
Settings.saveToCitySave = function(queue) {
	var value = Settings.secretCodesEnabled.length;
	if(queue.size + 4 > queue.bytes.length) {
		var oldBytes = queue.bytes;
		queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
		queue.bytes.blit(0,oldBytes,0,queue.size);
	}
	queue.bytes.setInt32(queue.size,value);
	queue.size += 4;
	var _g = 0;
	var _g1 = Settings.secretCodesEnabled;
	while(_g < _g1.length) {
		var sc = _g1[_g];
		++_g;
		queue.addString(sc);
	}
};
Settings.update = function(game) {
	if(js_Boot.getClass(game.state) == City) {
		var c = game.state;
		if(Config.iosMobileScreenshotMode && game.mouse.pressed && game.mouse.get_x() < 100 || game.keyboard.down[17] && game.keyboard.pressed[117]) {
			var _this = gui_LanguageSelectWindow.languages.concat(gui_LanguageSelectWindow.languagesSecondary);
			var result = new Array(_this.length);
			var _g = 0;
			var _g1 = _this.length;
			while(_g < _g1) {
				var i = _g++;
				result[i] = _this[i].code;
			}
			var allLanguages = result;
			gui_LanguageSelectWindow.changeLanguage(c,allLanguages[(allLanguages.indexOf(Settings.language) + 1) % allLanguages.length],c.gui);
		}
	}
};
