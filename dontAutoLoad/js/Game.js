var Game = $hxClasses["Game"] = function(application,stage,gameRect,addX,addY,scaling,isMobile) {
	this.tempSavedState = null;
	this.workshopOverlay = null;
	this.tapToContinue = null;
	this.gamePausedFor = 0;
	this.isLargeMobile = false;
	this.isMobile = false;
	this.setOnClickTo = null;
	this.onClick = null;
	this.state = null;
	var _gthis = this;
	this.application = application;
	this.stage = stage;
	this.keyboard = new Keyboard(this);
	this.audio = new Audio(this);
	this.isMobile = isMobile;
	this.currentlyPausedForReasons = [];
	this.resize(gameRect,addX,addY,scaling);
	this.initInteraction(stage);
	if(isMobile) {
		this.mouse.isTouch = true;
	}
	this.textHelper = new common_TextHelper(this);
	common_Localize.init(this);
	if(!Game.isLoading) {
		this.metaGame = new progress_MetaGame(function() {
			mobileSpecific_Premium.init(_gthis,function() {
				Config.gameInit(_gthis);
				common_AdHelper.prepare(function() {
					_gthis.createMainMenu();
				});
			});
		});
		this.addImportHandler();
	}
	modding_ModTools._performOnModsLoaded(this);
};
Game.__name__ = "Game";
Game.prototype = {
	get_preDPIAdjustScaling: function() {
		return this.scaling / this.application.pixelRatio;
	}
	,get_pixelRatio: function() {
		return this.application.pixelRatio;
	}
	,createMainMenu: function(withError) {
		if(withError != null && withError != "" && this.state != null && ((this.state) instanceof City)) {
			this.state.disableSavingOnStopState = true;
		}
		this.stopState();
		var mainMenu = new MainMenu(this,this.stage);
		if(withError != null) {
			mainMenu.showError(withError);
		}
		this.state = mainMenu;
		this.afterStateSwitch();
	}
	,tempSaveState: function() {
		this.savedStateStages = this.stage.children.slice();
		this.tempSavedState = this.state;
		this.stage.removeChildren();
		this.saveStateSpriteCitizens = Citizen.spriteCitizens;
	}
	,destroyTempSaveState: function() {
		var _g = 0;
		var _g1 = this.savedStateStages;
		while(_g < _g1.length) {
			var d = _g1[_g];
			++_g;
			d.destroy({ children : true});
		}
		this.savedStateStages = null;
		this.tempSavedState = null;
		this.saveStateSpriteCitizens = null;
	}
	,restoreState: function() {
		this.stopState();
		Citizen.spriteCitizens = this.saveStateSpriteCitizens;
		var _g = 0;
		var _g1 = this.savedStateStages;
		while(_g < _g1.length) {
			var savedStage = _g1[_g];
			++_g;
			this.stage.addChild(savedStage);
		}
		this.state = this.tempSavedState;
		this.state.refocus();
		this.state.resize();
		this.afterStateSwitch();
	}
	,switchState: function(newState,stopCurrent) {
		if(stopCurrent == null) {
			stopCurrent = false;
		}
		if(stopCurrent) {
			this.stopState();
		}
		this.state = newState;
		this.afterStateSwitch();
	}
	,createNewGameState: function(storyName) {
		var _gthis = this;
		this.tempSaveState();
		var onDone = function() {
			_gthis.state = new NewGameCreator(_gthis,_gthis.stage,storyName);
			_gthis.afterStateSwitch();
			_gthis.mouse.releaseAllClaims(true);
		};
		if(Object.prototype.hasOwnProperty.call(Resources.storiesInfo.h,storyName)) {
			onDone();
		} else {
			new progress_StoryLoader(storyName,function() {
				onDone();
			},function() {
				_gthis.createMainMenu(common_Localize.lo("game_load_error"));
				Analytics.sendEvent("game","newGameFailed",null,storyName);
				Analytics.sendEventFirebase("newGameFailed","scenario",storyName);
			});
		}
	}
	,newCity: function(storyName,saveFileName,displayOnly,afterDone) {
		if(displayOnly == null) {
			displayOnly = false;
		}
		var _gthis = this;
		this.stopState();
		var onDone = function() {
			var theCity = new City(_gthis,_gthis.stage,storyName,displayOnly,saveFileName);
			_gthis.state = theCity;
			_gthis.afterStateSwitch();
			_gthis.updateCityMousePos();
			_gthis.mouse.releaseAllClaims(true);
			Config.doPlay();
			Analytics.sendEvent("game","newGame",null,storyName);
			Analytics.sendEventFirebase("newGame","scenario",storyName);
			if(saveFileName.indexOf("-") == -1) {
				common_Storage.setItem("__meta_mostRecentSubOf_" + saveFileName,theCity.cityFile,function() {
				});
			}
			if(afterDone != null) {
				afterDone(theCity);
			}
		};
		if(Object.prototype.hasOwnProperty.call(Resources.storiesInfo.h,storyName)) {
			onDone();
		} else {
			new progress_StoryLoader(storyName,function() {
				onDone();
			},function() {
				_gthis.createMainMenu(common_Localize.lo("game_load_error"));
				Analytics.sendEvent("game","newGameFailed",null,storyName);
				Analytics.sendEventFirebase("newGameFailed","scenario",storyName);
			});
		}
		Config.onCitySwitch();
	}
	,loadFromString: function(from,saveFileName) {
		try {
			var queue = gamesave_ResizingBytesQueue.fromBase64(from);
			this.load(queue,saveFileName);
			common_Storage.setItem("__meta_mostRecentSubOf_" + saveFileName,saveFileName,function() {
			});
		} catch( _g ) {
			this.createMainMenu(common_Localize.lo("game_import_error"));
		}
	}
	,loadFromTypedArray: function(from,saveFileName,andThen) {
		var queue = gamesave_ResizingBytesQueue.fromData(from);
		this.load(queue,saveFileName,andThen);
	}
	,loadFromStorage: function(fileName,andThen,ignoreMostRecentSubOf) {
		if(ignoreMostRecentSubOf == null) {
			ignoreMostRecentSubOf = false;
		}
		var _gthis = this;
		this.stopState();
		var doLoadActual = function(mostRecentFile) {
			common_Storage.getItem(mostRecentFile,function(err,savedCity) {
				if(err == null && savedCity != null) {
					_gthis.loadFromTypedArray(savedCity,mostRecentFile,andThen);
				} else {
					console.log("FloatingSpaceCities/Game.hx:296:",err);
					_gthis.createMainMenu(common_Localize.lo("game_load_save_error") + Std.string(err.code));
				}
			},true);
		};
		if(ignoreMostRecentSubOf) {
			doLoadActual(fileName);
		} else {
			common_Storage.getItem("__meta_mostRecentSubOf_" + fileName,function(err,mostRecentFile) {
				if(err != null || mostRecentFile == null || mostRecentFile == "") {
					mostRecentFile = fileName;
				}
				if(mostRecentFile == "PARTIALLY_OVERWRITTEN") {
					mostRecentFile = fileName;
					console.log("FloatingSpaceCities/Game.hx:310:","this file has been partially overwritten, may be problematic sometimes...");
				}
				doLoadActual(mostRecentFile);
			});
		}
	}
	,loadMultiFromString: function(str,saveFileName) {
		var _gthis = this;
		var splitStr = str.split(":");
		var i = 1;
		var subCitiesLength = Std.parseInt(splitStr[i++]);
		var curCityFile = splitStr[i++];
		var curCityContent = splitStr[i++];
		var partsDone = 0;
		var queue = gamesave_ResizingBytesQueue.fromBase64(curCityContent);
		var _g = 0;
		var _g1 = subCitiesLength;
		while(_g < _g1) {
			var j = _g++;
			var thisFile = splitStr[i++];
			var thisContent = splitStr[i++];
			var thisContentRBQ = gamesave_ResizingBytesQueue.fromBase64(thisContent).getData();
			common_Storage.setItem(saveFileName + thisFile,thisContentRBQ,function() {
				partsDone += 1;
				if(partsDone > subCitiesLength) {
					try {
						_gthis.load(queue,saveFileName + curCityFile,function(city) {
							city.cityMainFile = saveFileName;
							common_Storage.setItem("__meta_mostRecentSubOf_" + saveFileName,city.cityFile,function() {
							});
						});
					} catch( _g ) {
						_gthis.createMainMenu(common_Localize.lo("game_import_error"));
					}
				}
			});
			common_Storage.setItem(saveFileName + thisFile + "__meta","(recently imported)",function() {
			});
		}
		try {
			var dat = queue.getData();
			common_Storage.setItem(saveFileName + curCityFile,dat,function() {
				partsDone += 1;
				if(partsDone > subCitiesLength) {
					_gthis.load(queue,saveFileName + curCityFile,function(city) {
						city.cityMainFile = saveFileName;
					});
				}
			});
		} catch( _g ) {
			this.createMainMenu(common_Localize.lo("game_import_error"));
		}
	}
	,createSubCity: function(currentCity,storyName) {
		var _gthis = this;
		var unlockData = null;
		var cityUpgradeInfo = null;
		if(currentCity != null) {
			unlockData = currentCity.progress.unlocks.saveForCitySwitch();
			cityUpgradeInfo = currentCity.upgrades.saveForCitySwitch();
			currentCity.subCities.push(storyName);
			currentCity.saveToBrowserStorage();
		}
		this.newCity(storyName,currentCity.cityMainFile + "-" + storyName,null,function(newCity) {
			newCity.cityMainFile = currentCity.cityMainFile;
			newCity.subCities = currentCity.subCities;
			newCity.refreshPossibleSubCities();
			newCity.progress.allCitiesInfo = currentCity.progress.allCitiesInfo;
			newCity.progress.allCitiesInfo.city = newCity;
			newCity.progress.allCitiesInfo.update();
			if(unlockData != null) {
				newCity.progress.unlocks.restoreFromCitySwitch(unlockData);
				newCity.upgrades.loadFromCitySwitch(cityUpgradeInfo);
			}
			newCity.progress.allCitiesInfo.doCityStart();
			newCity.gui.simulationSpeedChosen = currentCity.gui.simulationSpeedChosen;
			newCity.simulationSpeed = gui_CityGUI.simulationSpeeds[currentCity.gui.simulationSpeedChosen].speed;
			newCity.gui.gameSpeedButton.imageSprite.texture = gui_CityGUI.simulationSpeeds[currentCity.gui.simulationSpeedChosen].icon;
			_gthis.updateCityMousePos();
			newCity.saveToBrowserStorage(null,function() {
				common_Storage.setItem("__meta_mostRecentSubOf_" + currentCity.cityMainFile,currentCity.cityMainFile + "-" + storyName,function() {
				});
			});
			newCity.gui.refreshCityInfo();
		});
	}
	,loadSubCity: function(currentCity,cityMainFile,subCity) {
		var _gthis = this;
		var unlockData = null;
		var cityUpgradeInfo = null;
		if(currentCity != null) {
			unlockData = currentCity.progress.unlocks.saveForCitySwitch();
			cityUpgradeInfo = currentCity.upgrades.saveForCitySwitch();
		}
		this.loadFromStorage(subCity == "" ? cityMainFile : cityMainFile + "-" + subCity,function(newCity) {
			if(unlockData != null) {
				newCity.cityMainFile = currentCity.cityMainFile;
				newCity.cityFile = subCity == "" ? cityMainFile : cityMainFile + "-" + subCity;
				newCity.gui.simulationSpeedChosen = currentCity.gui.simulationSpeedChosen;
				newCity.simulationSpeed = gui_CityGUI.simulationSpeeds[currentCity.gui.simulationSpeedChosen].speed;
				newCity.gui.gameSpeedButton.imageSprite.texture = gui_CityGUI.simulationSpeeds[currentCity.gui.simulationSpeedChosen].icon;
				newCity.progress.unlocks.restoreFromCitySwitch(unlockData);
				newCity.upgrades.loadFromCitySwitch(cityUpgradeInfo);
				newCity.subCities = currentCity.subCities;
				newCity.refreshPossibleSubCities();
				newCity.progress.allCitiesInfo = currentCity.progress.allCitiesInfo;
				newCity.progress.allCitiesInfo.city = newCity;
				newCity.progress.allCitiesInfo.update();
				newCity.progress.allCitiesInfo.doCityStart();
				newCity.progress.allCitiesInfo.doTransfer();
				_gthis.updateCityMousePos();
				common_Storage.setItem("__meta_mostRecentSubOf_" + currentCity.cityMainFile,newCity.cityFile,function() {
				});
			}
		},true);
	}
	,updateCityMousePos: function() {
		if(((this.state) instanceof City)) {
			var cityState = this.state;
			this.mouse.cityScaledPosition = new common_FPoint(this.mouse.unscaledPosition.x / cityState.zoomScale,this.mouse.unscaledPosition.y / cityState.zoomScale);
			this.mouse.cityPosition = this.mouse.calcCityPosition(this,cityState);
		}
	}
	,load: function(queue,saveFileName,andThen) {
		var _gthis = this;
		this.stopState();
		var storyName = "theLostShip";
		Game.isLoading = true;
		var onDone = function() {
			if(queue.bytes.getInt32(queue.readStart) > 70) {
				_gthis.createMainMenu(common_Localize.lo("game_load_save_error_version"));
				return;
			}
			_gthis.newCity(storyName,saveFileName);
			var city = _gthis.state;
			try {
				city.load(queue);
			} catch( _g ) {
				_gthis.createMainMenu(common_Localize.lo("game_load_save_error"));
				return;
			}
			if(saveFileName.indexOf("-") == -1) {
				city.cityMainFile = saveFileName;
			}
			_gthis.updateCityMousePos();
			Game.isLoading = false;
			if(andThen != null) {
				andThen(city);
			}
		};
		if(queue.bytes.getInt32(queue.readStart) == -1234) {
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			storyName = queue.readString();
			if(Object.prototype.hasOwnProperty.call(Resources.storiesInfo.h,storyName)) {
				onDone();
			} else {
				new progress_StoryLoader(storyName,function() {
					onDone();
				},function() {
					_gthis.createMainMenu(common_Localize.lo("game_load_error"));
				});
			}
		} else {
			onDone();
		}
	}
	,resize: function(gameRect,addX,addY,scaling) {
		this.rect = gameRect;
		this.addX = addX;
		this.addY = addY;
		this.scaling = scaling;
		var tmp = Infinity;
		this.stage.hitArea = new PIXI.Rectangle(0,0,tmp,Infinity);
		this.stage.interactiveChildren = false;
		if(this.state != null) {
			this.state.resize();
		}
	}
	,update: function(timeMod) {
		this.mouseBeginStep();
		this.mouse.timeMod = timeMod;
		this.keyboard.update();
		if(5 == 5) {
			common_DesktopHelpers.update(this);
		}
		if(jsFunctions.crossPromoIsVisible() && this.keyboard.anyBack()) {
			jsFunctions.crossPromoClose();
			this.keyboard.pressed[27] = false;
		}
		if(this.workshopOverlay != null && this.workshopOverlay.isOpen() && this.keyboard.anyBack()) {
			this.workshopOverlay.createOrClose();
			this.keyboard.pressed[27] = false;
		}
		Config.handleInput(this.mouse,this.keyboard);
		this.mouse.preHandling();
		this.setOnClickTo = null;
		if(this.state != null && (!this.isMobile || !this.mouse.hasStrongClaim || this.mouse.strongClaimOnUpdate == null)) {
			this.state.handleMouse(this.mouse);
		}
		this.onClick = this.setOnClickTo;
		this.mouse.afterHandling();
		if(this.state != null) {
			if(this.currentlyPausedForReasons.indexOf("WaitAndShowAd") == -1) {
				this.state.update(timeMod);
			}
		}
		this.updateForceUnpause(timeMod);
		Settings.update(this);
		if(Config.mobileTrailerMode && this.keyboard.down[17] && this.keyboard.pressed[116]) {
			Config.mobileTrailerModeMultiplier += 0.5;
			if(Config.mobileTrailerModeMultiplier > 3) {
				Config.mobileTrailerModeMultiplier = 2;
			}
			this.application.setGameScale();
		}
		this.mouseEndStep(timeMod);
		this.keyboard.postUpdate();
		Analytics.update(timeMod);
		mobileSpecific_WaitAndShowAd.generalUpdate(timeMod);
		common_MobileApplicationLifecycleManager.update(timeMod);
		if(this.waitAndShowAdInstance != null) {
			this.waitAndShowAdInstance.update(timeMod);
		}
	}
	,waitAndShowAd: function(adText,andThen) {
		var inst = new mobileSpecific_WaitAndShowAd(this,this.stage,adText);
		inst.useIfPossible(andThen);
	}
	,updateForceUnpause: function(timeMod) {
		if(5 == 8 && this.currentlyPausedForReasons.length > 0 && this.currentlyPausedForReasons.indexOf("AdShown") != -1) {
			this.gamePausedFor += timeMod;
			if(this.gamePausedFor >= 60) {
				if(this.mouse.pressed) {
					this.resume("AdShown");
				}
				if(this.tapToContinue == null || this.tapToContinue.parent == null) {
					this.tapToContinue = new PIXI.Text(common_Localize.lo("tap_to_continue"),{ fontFamily : "Arial,sans-serif", fontSize : 24 * this.scaling, fill : 16777215, align : "center"});
					this.tapToContinue.alpha = 0;
					this.tapToContinue.anchor.set(0.5,0.5);
					this.stage.addChild(this.tapToContinue);
					this.tapToContinue.position.set(this.rect.width * this.scaling / 2,this.rect.height * this.scaling / 2);
				} else if(this.stage.children.length > 0) {
					this.stage.addChildAt(this.tapToContinue,this.stage.children.length - 1);
					this.tapToContinue.position.set(this.rect.width * this.scaling / 2,this.rect.height * this.scaling / 2);
				}
			}
		} else {
			this.gamePausedFor = 0;
			if(this.tapToContinue != null && this.tapToContinue.parent != null) {
				this.tapToContinue.destroy();
				this.tapToContinue = null;
			}
		}
	}
	,postDraw: function() {
		if(this.state != null) {
			this.state.postDraw();
		}
	}
	,mouseBeginStep: function() {
		var mouseWasReleased = this.mouse.nextStepReleased;
		if(this.mouse.nextStepReleased) {
			this.mouse.down = false;
			this.mouse.nextStepReleased = false;
			this.mouse.released = true;
		}
		if(this.mouse.nextStepQuietReleased) {
			this.mouse.down = false;
			this.mouse.nextStepQuietReleased = false;
			this.mouse.released = false;
			this.mouse.releaseAllClaims(true);
		}
		if(this.mouse.nextStepDown) {
			if(!mouseWasReleased) {
				this.mouse.down = true;
			}
			this.mouse.pressed = true;
			this.mouse.nextStepDown = false;
		}
		var mouseWasReleased = this.mouse.nextStepRightReleased;
		if(this.mouse.nextStepRightReleased) {
			this.mouse.rightDown = false;
			this.mouse.nextStepRightReleased = false;
			this.mouse.rightReleased = true;
		}
		if(this.mouse.nextStepRightDown) {
			if(!mouseWasReleased) {
				this.mouse.rightDown = true;
			}
			this.mouse.rightPressed = true;
			this.mouse.nextStepRightDown = false;
		}
		var mouseWasReleased = this.mouse.nextStepMiddleReleased;
		if(this.mouse.nextStepMiddleReleased) {
			this.mouse.middleDown = false;
			this.mouse.nextStepMiddleReleased = false;
			this.mouse.middleReleased = true;
		}
		if(this.mouse.nextStepMiddleDown) {
			if(!mouseWasReleased) {
				this.mouse.middleDown = true;
			}
			this.mouse.middlePressed = true;
			this.mouse.nextStepMiddleDown = false;
		}
		this.mouse.scrollBarMovement = this.mouse.scrollBarNextMovement;
		this.mouse.scrollBarMovementPages = this.mouse.scrollBarNextMovementPages;
		this.mouse.scrollBarNextMovementPages = 0;
		this.mouse.scrollBarNextMovement = 0;
		if(this.isMobile && !this.mouse.down && !this.mouse.released && this.mouse.pointerDown.length == 0 && this.state != null && !this.state.get_publicGUI().tooltip.shown()) {
			this.mouse.position = new common_Point(-100000,-100000);
			this.mouse.unscaledPosition = new common_Point(-100000,-100000);
			this.mouse.cityScaledPosition = new common_FPoint(-100000,-100000);
			this.mouse.cityPosition = new common_Point(-100000,-100000);
		}
		if(this.mouse.prevPosition != null && (this.mouse.position.x != this.mouse.prevPosition.x || this.mouse.position.y != this.mouse.prevPosition.y)) {
			this.mouse.moved = true;
		} else {
			this.mouse.moved = false;
		}
	}
	,mouseEndStep: function(timeMod) {
		this.mouse.pressed = false;
		this.mouse.released = false;
		this.mouse.rightPressed = false;
		this.mouse.rightReleased = false;
		this.mouse.middlePressed = false;
		this.mouse.middleReleased = false;
		if(this.mouse.mouseDownTick > 0) {
			this.mouse.mouseDownTick -= timeMod;
		}
		var _this = this.mouse.position;
		var tmp = new common_Point(_this.x,_this.y);
		this.mouse.prevPosition = tmp;
		var _this = this.mouse.cityPosition;
		var tmp = new common_Point(_this.x,_this.y);
		this.mouse.prevCityPosition = tmp;
	}
	,initInteraction: function(stage) {
		var _gthis = this;
		var mouseUpFunc = function(e) {
			var origev = e.data.originalEvent;
			if(_gthis.isMobile || origev.pointerType == "touch") {
				if(_gthis.mouse.pointerDown.length == 1 && (_gthis.mouse.down || _gthis.mouse.nextStepDown)) {
					_gthis.mouse.nextStepReleased = true;
				}
				HxOverrides.remove(_gthis.mouse.pointerDown,e.data.identifier);
				_gthis.mouse.pointerUnscaledPosition.remove(e.data.identifier);
			} else {
				var button = e.data.originalEvent.button;
				if(button == null) {
					button = 0;
				}
				if(button == 1) {
					_gthis.mouse.nextStepMiddleReleased = true;
				} else if(button == 2) {
					_gthis.mouse.nextStepRightReleased = true;
				} else if(button == 0) {
					_gthis.mouse.nextStepReleased = true;
				}
			}
		};
		var pointerOutFunc = function(e) {
			var origev = e.data.originalEvent;
			if(_gthis.isMobile || origev.pointerType == "touch") {
				if((_gthis.mouse.down || _gthis.mouse.nextStepDown) && _gthis.mouse.pointerDown.length == 1) {
					_gthis.mouse.nextStepReleased = true;
				}
				HxOverrides.remove(_gthis.mouse.pointerDown,e.data.identifier);
				_gthis.mouse.pointerUnscaledPosition.remove(e.data.identifier);
			}
		};
		var updatePointerPos = function(stageLocalPos) {
			if(_gthis.workshopOverlay != null && _gthis.workshopOverlay.isOpen()) {
				return;
			}
			_gthis.mouse.unscaledPosition = stageLocalPos;
			var withInt = _gthis.scaling;
			var updatePointerPos = new common_Point(stageLocalPos.x / withInt | 0,stageLocalPos.y / withInt | 0);
			_gthis.mouse.position = updatePointerPos;
			if(((_gthis.state) instanceof City)) {
				var cityState = _gthis.state;
				_gthis.mouse.cityScaledPosition = new common_FPoint(stageLocalPos.x / cityState.zoomScale,stageLocalPos.y / cityState.zoomScale);
				_gthis.mouse.cityPosition = _gthis.mouse.calcCityPosition(_gthis,cityState);
			}
		};
		var updateSecondaryPointerPos = function(stageLocalPos,pointerID) {
			_gthis.mouse.pointerUnscaledPosition.h[pointerID] = stageLocalPos;
			var this1 = _gthis.mouse.pointerPosition;
			var withInt = _gthis.scaling;
			var v = new common_Point(stageLocalPos.x / withInt | 0,stageLocalPos.y / withInt | 0);
			this1.h[pointerID] = v;
			if(((_gthis.state) instanceof City)) {
				var cityState = _gthis.state;
				var this1 = _gthis.mouse.pointerCityScaledPosition;
				var v = new common_FPoint(stageLocalPos.x / cityState.zoomScale,stageLocalPos.y / cityState.zoomScale);
				this1.h[pointerID] = v;
				var this1 = _gthis.mouse.pointerCityPosition;
				var v = _gthis.mouse.calcCityFPositionForPointer(_gthis,cityState,pointerID);
				this1.h[pointerID] = v;
			}
		};
		this.mouse = new Mouse();
		stage.interactive = true;
		stage.on("pointermove",function(e) {
			var origev = e.data.originalEvent;
			if(_gthis.isMobile || origev.pointerType == "touch") {
				var updateSecondaryPointerPos1 = updateSecondaryPointerPos;
				var point = e.data.getLocalPosition(stage);
				updateSecondaryPointerPos1(new common_Point(Math.floor(point.x),Math.floor(point.y)),e.data.identifier);
			}
			var updatePointerPos1 = updatePointerPos;
			var point = e.data.getLocalPosition(stage);
			updatePointerPos1(new common_Point(Math.floor(point.x),Math.floor(point.y)));
			var buttons = e.data.originalEvent.buttons;
			if(buttons != undefined) {
				if(typeof(buttons) == "number" && ((buttons | 0) === buttons)) {
					if((buttons & 1) != 1 && _gthis.mouse.down) {
						_gthis.mouse.nextStepReleased = true;
					}
					if((buttons & 2) != 2 && _gthis.mouse.rightDown) {
						_gthis.mouse.nextStepRightReleased = true;
					}
					if((buttons & 4) != 4 && _gthis.mouse.middleDown) {
						_gthis.mouse.nextStepMiddleReleased = true;
					}
				}
			}
		});
		if(this.isMobile) {
			stage.on("touchend",function(e) {
				if(_gthis.onClick != null) {
					_gthis.onClick();
				} else if(_gthis.mouse.isTouch && (_gthis.rect.width < 500 || _gthis.rect.height < 230) && !jsFunctions.isAnyApple() && 5 != 8) {
					jsFunctions.goFullscreen(false,function() {
						_gthis.mouse.nextStepReleased = true;
					});
				}
			});
		}
		if(!this.isMobile || Config.mobileTrailerMode) {
			stage.on("click",function(e) {
				if(_gthis.onClick != null) {
					_gthis.onClick();
				}
			});
		}
		stage.on("pointerdown",function(e) {
			var origev = e.data.originalEvent;
			if(_gthis.isMobile || origev.pointerType == "touch") {
				if(_gthis.mouse.pointerDown.indexOf(e.data.identifier) == -1) {
					_gthis.mouse.pointerDown.push(e.data.identifier);
					var updateSecondaryPointerPos1 = updateSecondaryPointerPos;
					var point = e.data.getLocalPosition(stage);
					updateSecondaryPointerPos1(new common_Point(Math.floor(point.x),Math.floor(point.y)),e.data.identifier);
					if(_gthis.mouse.pointerDown.length == 1) {
						var updatePointerPos1 = updatePointerPos;
						var point = e.data.getLocalPosition(stage);
						updatePointerPos1(new common_Point(Math.floor(point.x),Math.floor(point.y)));
						_gthis.mouse.nextStepDown = true;
						_gthis.mouse.nextStepReleased = false;
					} else {
						if(_gthis.mouse.down) {
							_gthis.mouse.nextStepQuietReleased = true;
						}
						_gthis.mouse.nextStepDown = false;
						_gthis.mouse.nextStepReleased = false;
					}
				}
			} else {
				var updatePointerPos1 = updatePointerPos;
				var point = e.data.getLocalPosition(stage);
				updatePointerPos1(new common_Point(Math.floor(point.x),Math.floor(point.y)));
				var button = origev.button;
				if(button == null) {
					button = 0;
				}
				if(button == 1) {
					_gthis.mouse.nextStepMiddleDown = true;
					_gthis.mouse.nextStepMiddleReleased = false;
					e.data.originalEvent.preventDefault();
				} else if(button == 2) {
					_gthis.mouse.nextStepRightReleased = false;
					_gthis.mouse.nextStepRightDown = true;
				} else if(button == 0) {
					_gthis.mouse.nextStepDown = true;
					_gthis.mouse.nextStepReleased = false;
				}
			}
		});
		window.document.addEventListener("mousedown",function(e) {
			if(e.button == 1) {
				e.preventDefault();
			}
		},jsFunctions.getPassiveEventListenerVar());
		window.document.addEventListener("dragstart",function(e) {
			e.preventDefault();
			return false;
		});
		stage.on("pointerup",mouseUpFunc);
		stage.on("pointerupoutside",mouseUpFunc);
		stage.on("pointercancel",pointerOutFunc);
		window.addEventListener("wheel",function(e) {
			switch(e.deltaMode) {
			case 0:
				_gthis.mouse.scrollBarNextMovement += e.deltaY / _gthis.scaling;
				break;
			case 1:
				_gthis.mouse.scrollBarNextMovement += e.deltaY * 10;
				break;
			case 2:
				_gthis.mouse.scrollBarNextMovementPages += e.deltaY;
				break;
			}
			e.preventDefault();
		},jsFunctions.getPassiveEventListenerVar());
	}
	,refocus: function() {
		if(this.state != null) {
			this.state.refocus();
		}
		this.mouse.pointerDown.splice(0,this.mouse.pointerDown.length);
		this.mouse.pointerUnscaledPosition = new haxe_ds_IntMap();
		this.mouse.releaseAllClaims(true);
		this.mouse.down = false;
		this.mouse.middleDown = false;
		this.mouse.rightDown = false;
	}
	,addImportHandler: function(onCancel) {
		var _gthis = this;
		var wasFullscreen = false;
		var importButton = window.document.getElementById("importFile");
		importButton.addEventListener("change",function() {
			var file = importButton.files[0];
			var reader = common_GetFileReader.getFileReader();
			reader.addEventListener("load",function(e) {
				var fileStr = e.target.result;
				gui_SaveLoadWindows.createSaveWindow(_gthis,_gthis.state.get_publicGUI(),common_Localize.lo("save_slot_import"),function(fname) {
					if(StringTools.startsWith(fileStr,"THEFINALEARTH2_CITYPACK")) {
						_gthis.loadMultiFromString(fileStr,fname);
					} else {
						_gthis.loadFromString(fileStr,fname);
					}
				},function() {
					if(onCancel != null) {
						onCancel();
					}
				});
				importButton.value = "";
			});
			reader.readAsText(file);
		});
		importButton.addEventListener("click",function() {
			wasFullscreen = window.document.fullscreenElement != null;
			var restoreFullscreen = null;
			restoreFullscreen = function() {
				if(wasFullscreen) {
					jsFunctions.goFullscreen();
				}
				window.removeEventListener("focus",restoreFullscreen);
			};
			window.addEventListener("focus",restoreFullscreen);
		});
	}
	,stopState: function() {
		if(this.state != null) {
			this.state.stop();
			var _g = 0;
			var _g1 = this.stage.children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				child.destroy({ children : true});
			}
			this.stage.removeChildren();
			Citizen.spriteCitizens = new haxe_ds_ObjectMap();
		}
		this.state = null;
	}
	,pause: function(reason) {
		if(this.currentlyPausedForReasons.length == 0) {
			this.actuallyPauseState();
		}
		if(this.currentlyPausedForReasons.indexOf(reason) == -1) {
			this.currentlyPausedForReasons.push(reason);
		}
	}
	,pauseCityForBlurIfDesired: function() {
		if(5 == 8) {
			if(((this.state) instanceof City)) {
				var cityState = this.state;
				if(!cityState.pausedForUnfocused && !cityState.pauseGame) {
					cityState.set_pauseGame(true);
					cityState.pausedForUnfocused = false;
					cityState.gui.createResumeGameControl();
				}
			}
		}
	}
	,actuallyPauseState: function() {
		if(this.state != null) {
			this.state.pause();
		}
		this.audio.pauseMusic();
	}
	,resume: function(reason) {
		if(this.currentlyPausedForReasons.length == 0) {
			return false;
		}
		HxOverrides.remove(this.currentlyPausedForReasons,reason);
		if(this.currentlyPausedForReasons.length == 0) {
			if(this.state != null) {
				this.state.resume();
			}
			this.audio.resumeMusic();
			return true;
		}
		return false;
	}
	,afterStateSwitch: function() {
		if(this.currentlyPausedForReasons.length > 0) {
			this.actuallyPauseState();
		}
	}
	,onContextRestored: function() {
		if(this.state != null) {
			this.state.onContextRestored();
		}
		if(this.tempSavedState != null) {
			this.tempSavedState.onContextRestored();
		}
	}
	,createOrCloseSteamOverlay: function() {
		if(this.workshopOverlay == null) {
			this.workshopOverlay = new modding_WorkshopOverlay();
		}
		this.workshopOverlay.createOrClose();
		if(this.workshopOverlay.isOpen()) {
			this.mouse.position = new common_Point(-100000,-100000);
			this.mouse.unscaledPosition = new common_Point(-100000,-100000);
			this.mouse.cityScaledPosition = new common_FPoint(-100000,-100000);
			this.mouse.cityPosition = new common_Point(-100000,-100000);
		}
	}
	,__class__: Game
};
