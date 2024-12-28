var City = $hxClasses["City"] = function(game,stage,storyName,displayOnly,cityFile) {
	if(cityFile == null) {
		cityFile = "fpc_save";
	}
	if(displayOnly == null) {
		displayOnly = false;
	}
	this.cachedCityEdges = null;
	this.possibleSubCities = [];
	this.subCities = [];
	this.cityName = "";
	this.usingParticleContainers = true;
	this.previousCullRectangle = null;
	this.updateConnectedBuildingSprites = false;
	this.isLoserState = false;
	this.disableSavingOnStopState = false;
	this.skyColor = 0;
	this.saveRawDataToReuse = null;
	this.lastLoadedVersion = -1;
	this.currentlySaving = false;
	this.secondsSinceAutoSave = 0.0;
	this.simulationSpeed = 1.0;
	this.windowRelatedOnBuildOrDestroy = null;
	this.zoomScale = 2;
	this.fixViewBottomYOn = null;
	this.specialActionOld = null;
	this.specialAction = null;
	this.postCreateBuilder = null;
	this.misdirector = null;
	this.maxPermanentID = 0;
	this.worlds = [];
	this.hoverHighlightSetThisStep = false;
	if(storyName == "snowWorld" || storyName == "displayCitySnow") {
		this.usingParticleContainers = false;
	}
	this.cityCullX = 0;
	this.cityCullY = 0;
	this.cityCullX2 = 1;
	this.cityCullY2 = 1;
	this.zoomScale = Math.max(game.scaling,this.zoomScale);
	this.game = game;
	this.outerStage = stage;
	this.displayOnly = displayOnly;
	this.cityFile = cityFile;
	this.cityMainFile = cityFile;
	this.buildingMode = BuildingMode.Normal;
	this.materials = new Materials();
	this.permanentsByID = new haxe_ds_IntMap();
	this.permanents = [];
	this.permanentNumberCached = new haxe_ds_StringMap();
	this.workBuildings = [];
	this.upgrades = new cityUpgrades_CityUpgrades(this);
	this.policies = new policies_Policies(this);
	this.teleporters = [];
	this.landingSites = [];
	this.connections = new simulation_CityConnections(this);
	this.progress = new progress_GameProgress(this,storyName);
	this.progress.init();
	this.viewPos = new common_FPoint(225,150);
	this.cityView = new CityView(this);
	this.sky = new PIXI.Graphics();
	this.updateSky(0);
	this.outerStage.addChild(this.sky);
	this.starStage = new PIXI.Container();
	this.outerStage.addChild(this.starStage);
	this.stars = new graphics_Stars(this.starStage,this);
	this.backgroundImageStage = new PIXI.Container();
	this.outerStage.addChild(this.backgroundImageStage);
	this.backgroundImages = new graphics_BackgroundImages(this.backgroundImageStage,this);
	this.movingViewStage = new PIXI.Container();
	this.outerStage.addChild(this.movingViewStage);
	this.movingViewStage.position.set(game.addX,game.addY);
	this.mainMovingViewStage = new PIXI.Container();
	this.movingViewStage.addChild(this.mainMovingViewStage);
	this.cityBgStageBelow = new graphics_CachingContainer(new common_Rectangle(-1024,-1024,2048,2048));
	this.mainMovingViewStage.addChild(this.cityBgStageBelow);
	this.trainStage = new graphics_CullableContainer();
	this.mainMovingViewStage.addChild(this.trainStage);
	this.cityBgStage = new graphics_CachingContainer(new common_Rectangle(-1024,-1024,2048,2048));
	this.mainMovingViewStage.addChild(this.cityBgStage);
	this.cityBgStageAbove = new PIXI.Container();
	this.mainMovingViewStage.addChild(this.cityBgStageAbove);
	if(this.usingParticleContainers) {
		this.citizenInBuildingStage = new PIXI.ParticleContainer(10000,{ position : true, alpha : true, uvs : true, scale : false});
	} else {
		this.citizenInBuildingStage = new PIXI.Container();
	}
	this.mainMovingViewStage.addChild(this.citizenInBuildingStage);
	this.citizenInBuildingStageNonParticle = new PIXI.Container();
	this.mainMovingViewStage.addChild(this.citizenInBuildingStageNonParticle);
	var particleStage = new PIXI.Container();
	this.mainMovingViewStage.addChild(particleStage);
	this.particles = new graphics_Particles(particleStage,this);
	this.cityMidStage = new graphics_CachingContainer(new common_Rectangle(-1024,-1024,2048,2048));
	this.mainMovingViewStage.addChild(this.cityMidStage);
	this.aboveCitizensInBuildingStage = new graphics_CullableContainer();
	this.mainMovingViewStage.addChild(this.aboveCitizensInBuildingStage);
	this.cityStage = new graphics_CachingContainer(new common_Rectangle(-1024,-1024,2048,2048));
	this.mainMovingViewStage.addChild(this.cityStage);
	this.justAboveCityStage = new PIXI.Container();
	this.mainMovingViewStage.addChild(this.justAboveCityStage);
	this.builderStage = new PIXI.Container();
	this.mainMovingViewStage.addChild(this.builderStage);
	if(this.usingParticleContainers) {
		this.citizenForegroundStage = new PIXI.ParticleContainer(5000,{ position : true, uvs : true, scale : false});
	} else {
		this.citizenForegroundStage = new PIXI.Container();
	}
	this.mainMovingViewStage.addChild(this.citizenForegroundStage);
	this.justAboveCitizensForegroundStage = new PIXI.Container();
	this.mainMovingViewStage.addChild(this.justAboveCitizensForegroundStage);
	this.farForegroundStage = new PIXI.Container();
	this.mainMovingViewStage.addChild(this.farForegroundStage);
	this.furtherForegroundStage = new PIXI.Container();
	this.mainMovingViewStage.addChild(this.furtherForegroundStage);
	this.builderHighlightStage = new PIXI.Container();
	this.furtherForegroundStage.addChild(this.builderHighlightStage);
	this.hoverHighlightStage = new PIXI.Container();
	this.furtherForegroundStage.addChild(this.hoverHighlightStage);
	this.hoverHighlightStage2 = new PIXI.Container();
	this.furtherForegroundStage.addChild(this.hoverHighlightStage2);
	this.furtherForegroundTempStage = new PIXI.Container();
	this.furtherForegroundStage.addChild(this.furtherForegroundTempStage);
	this.simulation = new CitySimulation(this,this.citizenForegroundStage,this.citizenInBuildingStage,this.citizenInBuildingStageNonParticle);
	this.miscCityElements = new miscCityElements_MiscCityElements(this);
	this.guiStage = new PIXI.Container();
	if(displayOnly) {
		this.guiStage.visible = false;
	}
	this.outerStage.addChild(this.guiStage);
	this.gui = new gui_CityGUI(game,this.guiStage,this);
	this.set_pauseGame(false);
	if(!Game.isLoading) {
		this.progress.story.makeWorlds(game,this.cityStage,this.cityMidStage,this.cityBgStage);
		this.createBottomWorld();
		this.progress.story.start();
		this.updateDrawCachingRectSize();
	}
	if(!Game.isLoading) {
		this.connections.updateCityConnections();
		this.simulation.updatePathfinder(true);
		this.progress.unlocks.stopAllNotifyForUnlock();
		this.gui.refreshCategoryBuildingsShown();
	}
	worldResources_AlienRuins.alreadyFoundBonuses = [];
	this.simulation.time.updateSky();
	this.secondsSinceAutoSave = 0;
	this.resize();
	if(Config.enableCheats) {
		window.cheatMaterials = $bind(this,this.cheatMaterials);
		window.cheatPeople = $bind(this,this.cheatPeople);
		window.cheatUnlocks = $bind(this,this.cheatUnlocks);
		window.cheatSpeed = function() {
			Config.cheatSpeedEnabled = true;
		};
		window.cheatMaterialsZero = $bind(this,this.cheatMaterialsZero);
		window.cheatFood = $bind(this,this.cheatFood);
		window.cheatWood = $bind(this,this.cheatWood);
		window.cheatStone = $bind(this,this.cheatStone);
		var city = this;
		var tmp = function() {
			testing_PermanentFinderPerfTest.doTest(city);
		};
		window.permanentFinderPerf = tmp;
	}
	this.viewActions = new cityActions_ViewActions(this);
	window.curCity = this;
	if(!Game.isLoading) {
		this.backgroundImages.postCreate();
	}
	modding_ModTools._performCityOnCreate(this);
};
City.__name__ = "City";
City.__interfaces__ = [GameState];
City.prototype = {
	get_publicGUI: function() {
		return this.gui;
	}
	,get_displayWidth: function() {
		return Math.floor(this.game.rect.width * this.game.scaling / this.zoomScale);
	}
	,get_displayHeight: function() {
		return Math.floor(this.game.rect.height * this.game.scaling / this.zoomScale);
	}
	,set_pauseGame: function(val) {
		this.pauseGame = val;
		this.gui.pausedForWindow = false;
		return this.pauseGame;
	}
	,refreshPossibleSubCities: function() {
		var _gthis = this;
		var _g = [];
		var _g1 = 0;
		var _g2 = this.possibleSubCities;
		while(_g1 < _g2.length) {
			var v = _g2[_g1];
			++_g1;
			if(_gthis.subCities.indexOf(v) == -1) {
				_g.push(v);
			}
		}
		this.possibleSubCities = _g;
	}
	,enableDisplayOnly: function() {
		this.displayOnly = true;
	}
	,disableDisplayOnlyMode: function(newSaveFile) {
		this.displayOnly = false;
		this.guiStage.visible = true;
		if(newSaveFile != null) {
			this.cityFile = newSaveFile;
			this.cityMainFile = this.cityFile;
		}
	}
	,setPermanentTexture: function(permanentTextureAndColor,desiredAlpha) {
		var ind = 0;
		var ind2 = 0;
		if(this.hoverHighlightSetThisStep) {
			ind = this.hoverHighlightStage.children.length;
			ind2 = this.hoverHighlightStage2.children.length;
		}
		var _g = 0;
		var _g1 = this.permanents;
		while(_g < _g1.length) {
			var pm = _g1[_g];
			++_g;
			var desiredTextureAndColor = permanentTextureAndColor(pm);
			if(desiredTextureAndColor != null) {
				var desiredTexture = desiredTextureAndColor.texture;
				var desiredColor = desiredTextureAndColor.color;
				if(ind >= this.hoverHighlightStage.children.length) {
					this.hoverHighlightStage.addChild(new PIXI.Sprite());
				}
				var thisSprite = this.hoverHighlightStage.children[ind];
				thisSprite.position.set(pm.position.x,pm.position.y);
				thisSprite.texture = desiredTexture;
				thisSprite.tint = desiredColor;
				thisSprite.alpha = desiredAlpha;
				++ind;
			}
		}
		if(ind < this.hoverHighlightStage.children.length) {
			var container = this.hoverHighlightStage;
			var startFrom = ind;
			if(startFrom == null) {
				startFrom = 0;
			}
			var i = container.children.length - 1;
			while(i >= startFrom) {
				container.children[i].destroy();
				--i;
			}
		}
		if(ind2 < this.hoverHighlightStage2.children.length) {
			var container = this.hoverHighlightStage2;
			var startFrom = ind2;
			if(startFrom == null) {
				startFrom = 0;
			}
			var i = container.children.length - 1;
			while(i >= startFrom) {
				container.children[i].destroy();
				--i;
			}
		}
		this.hoverHighlightSetThisStep = true;
	}
	,setHoverHightlight: function(forThesePermanents,outlineColor) {
		var ind = 0;
		var ind2 = 0;
		if(this.hoverHighlightSetThisStep) {
			ind = this.hoverHighlightStage.children.length;
			ind2 = this.hoverHighlightStage2.children.length;
		}
		var _g = 0;
		var _g1 = this.permanents;
		while(_g < _g1.length) {
			var pm = _g1[_g];
			++_g;
			var desiredTexture = forThesePermanents(pm);
			if(desiredTexture != null) {
				if(ind >= this.hoverHighlightStage.children.length) {
					this.hoverHighlightStage.addChild(new PIXI.Sprite());
				}
				var thisSprite = this.hoverHighlightStage.children[ind];
				thisSprite.position.set(pm.position.x - 1,pm.position.y - 1);
				thisSprite.texture = desiredTexture;
				thisSprite.alpha = 0.5 + (Math.sin(this.gui.guiTimer / 10) + 1) / 4;
				++ind;
				if(ind2 >= this.hoverHighlightStage2.children.length) {
					this.hoverHighlightStage2.addChild(new PIXI.Sprite());
				}
				var thisSprite1 = this.hoverHighlightStage2.children[ind2];
				thisSprite1.position.set(pm.position.x - 1,pm.position.y - 1);
				thisSprite1.texture = Resources.getTexture("spr_whiteoutline");
				thisSprite1.tint = outlineColor;
				thisSprite1.alpha = 1;
				++ind2;
			}
		}
		if(ind < this.hoverHighlightStage.children.length) {
			var container = this.hoverHighlightStage;
			var startFrom = ind;
			if(startFrom == null) {
				startFrom = 0;
			}
			var i = container.children.length - 1;
			while(i >= startFrom) {
				container.children[i].destroy();
				--i;
			}
		}
		if(ind2 < this.hoverHighlightStage2.children.length) {
			var container = this.hoverHighlightStage2;
			var startFrom = ind2;
			if(startFrom == null) {
				startFrom = 0;
			}
			var i = container.children.length - 1;
			while(i >= startFrom) {
				container.children[i].destroy();
				--i;
			}
		}
		this.hoverHighlightSetThisStep = true;
	}
	,updateDrawCachingRectSize: function() {
		var cacheRect = new common_Rectangle(0,0,1024,1024);
		if(this.worlds.length > 0) {
			cacheRect = new common_Rectangle(common_ArrayExtensions.whereMin(this.worlds,function(w) {
				return w.rect.width > 0;
			},function(w) {
				return w.rect.x;
			}).rect.x,common_ArrayExtensions.max(this.worlds,function(w) {
				return w.rect.get_y2();
			}).rect.get_y2() - 2040,2046,2046);
		}
		this.cityStage.cacheWithinRect = cacheRect;
		this.cityBgStage.cacheWithinRect = cacheRect;
		this.cityMidStage.cacheWithinRect = cacheRect;
		this.cityBgStageBelow.cacheWithinRect = cacheRect;
	}
	,stop: function() {
		if(!this.displayOnly && !this.disableSavingOnStopState) {
			this.saveToBrowserStorage();
		}
		this.simulation.stop();
		var _g = 0;
		var _g1 = this.worlds;
		while(_g < _g1.length) {
			var w = _g1[_g];
			++_g;
			w.cleanup();
		}
		this.cityStage.removeCache();
		this.cityBgStage.removeCache();
		this.cityMidStage.removeCache();
		this.cityBgStageBelow.removeCache();
	}
	,pause: function() {
		if(!this.pauseGame) {
			this.pausedForUnfocused = true;
			this.set_pauseGame(true);
		}
	}
	,resume: function() {
		if(this.pauseGame && this.pausedForUnfocused) {
			this.pausedForUnfocused = false;
			this.set_pauseGame(false);
		}
	}
	,handleMouse: function(mouse) {
		if(this.progress.handleMouse(mouse)) {
			return true;
		}
		if(this.displayOnly || this.pauseGame && this.pausedForUnfocused) {
			return false;
		}
		if((!this.pauseGame || this.gui.pausedForWindow) && !this.displayOnly && this.gui.windowStackMeta.indexOf("GameMenu") == -1 && mouse.pressed) {
			common_PokiHelpers.reportStartGameplay();
		}
		var scrollbarZoomHandled = false;
		if(!this.cityView.isDraggingView) {
			if(this.gui.handleMouse(mouse)) {
				return true;
			}
			this.cityView.handleScrollbarZoom(mouse);
			scrollbarZoomHandled = true;
			if(this.cityView.handleEarlyMouse(mouse)) {
				return true;
			}
			if(!this.isLoserState) {
				if(this.specialAction != null && this.specialAction.get_specialActionID() == "CityPickColor") {
					this.specialAction.handleMouse(mouse);
					return true;
				}
				if(this.simulation.handleMouse(mouse)) {
					return true;
				}
				if(this.builder != null) {
					if(this.builder.handleMouse(mouse)) {
						return true;
					}
				}
				var _g = 0;
				var _g1 = this.worlds;
				while(_g < _g1.length) {
					var world = _g1[_g];
					++_g;
					if(world.handleMouse(mouse)) {
						return true;
					}
				}
				if(this.miscCityElements.handleMouse(mouse)) {
					return true;
				}
			}
			if(mouse.pressed && mouse.disableCityMovement) {
				mouse.disableCityMovement = false;
			}
			if(this.cityView.handleMouse(mouse)) {
				return true;
			}
		}
		if(!scrollbarZoomHandled) {
			this.cityView.handleScrollbarZoom(mouse);
		}
		mouse.releaseAllClaims();
		return false;
	}
	,update: function(timeMod) {
		if(Config.limitedVersionForSmoothFilming) {
			timeMod = 1;
		}
		if(this.game.mouse.rightPressed && (this.buildingMode == BuildingMode.Destroy || this.buildingMode == BuildingMode.DestroyLeavingHole)) {
			this.buildingMode = BuildingMode.Normal;
			if(this.specialActionOld != null) {
				this.specialActionOld.activate();
			}
		}
		if(!(this.pauseGame && this.pausedForUnfocused) && !this.displayOnly && (this.game.keyboard.pressed[32] || this.game.keyboard.pressed[Keyboard.getLetterCode("P")])) {
			this.set_pauseGame(!this.pauseGame);
			if(this.pauseGame) {
				common_PokiHelpers.reportStopGameplay();
			}
		}
		if((!this.pauseGame || this.gui.pausedForWindow) && !this.displayOnly && this.gui.windowStackMeta.indexOf("GameMenu") == -1 && this.game.keyboard.anyKey()) {
			common_PokiHelpers.reportStartGameplay();
		}
		var usedSimulationSpeed = this.pauseGame ? 0 : this.simulationSpeed * 0.6666666666666666666;
		var _g = 0;
		var _g1 = this.worlds;
		while(_g < _g1.length) {
			var world = _g1[_g];
			++_g;
			world.update(timeMod * usedSimulationSpeed);
		}
		this.particles.update(timeMod * usedSimulationSpeed);
		if(this.builder != null) {
			this.builder.update(timeMod);
		} else if(this.game.isMobile) {
			var container = this.builderHighlightStage;
			var i = container.children.length - 1;
			while(i >= 0) {
				container.children[i].destroy();
				--i;
			}
		}
		if(!this.displayOnly) {
			this.gui.update(timeMod);
		}
		var nextWholeSimulationSpeed = Math.ceil(usedSimulationSpeed / 1.67);
		this.cityCullX = this.viewPos.x - this.get_displayWidth() / 2 - 5;
		this.cityCullY = this.viewPos.y - this.get_displayHeight() / 2 - 5;
		this.cityCullX2 = this.cityCullX + this.get_displayWidth() + 10;
		this.cityCullY2 = this.cityCullY + this.get_displayHeight() + 10;
		var _g = 0;
		var _g1 = nextWholeSimulationSpeed;
		while(_g < _g1) {
			var i = _g++;
			this.simulation.update(timeMod * (usedSimulationSpeed / nextWholeSimulationSpeed));
		}
		this.miscCityElements.update(timeMod);
		this.simulation.prevTimeMod = timeMod * usedSimulationSpeed;
		if(nextWholeSimulationSpeed == 0) {
			this.simulation.updateWhilePaused();
		}
		this.stars.update();
		this.progress.update(timeMod);
		if(!this.displayOnly) {
			common_AdHelper.cityUpdate(this,this.game.mouse);
		}
		if(!this.displayOnly) {
			this.cityView.handleMouseMovement(timeMod);
			this.cityView.handleKeyboardMove(timeMod);
		}
		modding_ModTools._performOnCityUpdates(this,timeMod * usedSimulationSpeed);
		if(!this.displayOnly) {
			this.handleAutoSave(timeMod);
		}
		if(!this.displayOnly) {
			this.gui.lateUpdate();
		}
		if(this.updateConnectedBuildingSprites) {
			this.miscCityElements.onCityChange();
			var _g = 0;
			var _g1 = this.permanents;
			while(_g < _g1.length) {
				var pm = _g1[_g];
				++_g;
				if(pm.isBuilding) {
					var bl = pm;
					var ambd = bl.drawer;
					ambd.positionSpritesMerging();
				}
			}
			this.updateConnectedBuildingSprites = false;
		}
		var cullRectangle = new common_FRectangle(this.viewPos.x - this.get_displayWidth() / 2 - 1,this.viewPos.y - this.get_displayHeight() / 2 - 1,this.get_displayWidth() + 2,this.get_displayHeight() + 2);
		if(this.previousCullRectangle == null || this.previousCullRectangle.x != cullRectangle.x || this.previousCullRectangle.y != cullRectangle.y || this.previousCullRectangle.width != cullRectangle.width || this.previousCullRectangle.height != cullRectangle.height) {
			this.simulation.recomputeCull();
			this.previousCullRectangle = cullRectangle.clone();
		}
		this.backgroundImages.update(timeMod * usedSimulationSpeed);
		this.cityBgStage.preDraw(cullRectangle);
		this.cityStage.preDraw(cullRectangle);
		this.cityMidStage.preDraw(cullRectangle);
		this.cityBgStageBelow.preDraw(cullRectangle);
		this.aboveCitizensInBuildingStage.preDraw(cullRectangle);
		this.trainStage.preDraw(cullRectangle);
	}
	,uncull: function() {
		this.cityBgStage.uncull();
		this.cityStage.uncull();
		this.cityMidStage.uncull();
		this.cityBgStageBelow.uncull();
		this.aboveCitizensInBuildingStage.uncull();
		this.trainStage.uncull();
		this.simulation.uncull();
	}
	,postDraw: function() {
		this.simulation.lateUpdate();
		var container = this.furtherForegroundTempStage;
		var i = container.children.length - 1;
		while(i >= 0) {
			container.children[i].destroy();
			--i;
		}
		if(!this.hoverHighlightSetThisStep) {
			var container = this.hoverHighlightStage;
			var i = container.children.length - 1;
			while(i >= 0) {
				container.children[i].destroy();
				--i;
			}
			var container = this.hoverHighlightStage2;
			var i = container.children.length - 1;
			while(i >= 0) {
				container.children[i].destroy();
				--i;
			}
		} else {
			this.hoverHighlightSetThisStep = false;
		}
	}
	,resize: function() {
		if(this.displayOnly) {
			this.zoomScale = this.game.scaling;
		}
		var filterless = false;
		var usedScale = this.zoomScale;
		if(this.zoomScale % 1 < 0.001 || this.zoomScale % 1 > 0.999) {
			filterless = true;
			usedScale = Math.round(this.zoomScale);
		} else {
			usedScale = this.zoomScale;
		}
		this.sky.scale.x = this.sky.scale.y = usedScale;
		this.starStage.scale.x = this.starStage.scale.y = usedScale;
		this.backgroundImages.backgroundImagesStage.scale.x = this.backgroundImages.backgroundImagesStage.scale.y = usedScale;
		var _g = 0;
		var _g1 = this.backgroundImages.cloudsStages;
		while(_g < _g1.length) {
			var cloudsStage = _g1[_g];
			++_g;
			cloudsStage.scale.x = cloudsStage.scale.y = usedScale;
		}
		this.movingViewStage.scale.x = this.movingViewStage.scale.y = usedScale;
		this.cityView.updateMovingView();
		this.gui.resize();
		this.simulation.time.updateSky();
		this.stars.resize();
		this.backgroundImages.resize();
		this.starStage.position.set(usedScale * (this.get_displayWidth() - this.stars.maxStarX) / 2,usedScale * (this.get_displayHeight() - this.stars.maxStarY) / 2);
	}
	,refocus: function() {
		if(this.game.isMobile) {
			this.cityStage.isInvalid = true;
			this.cityMidStage.isInvalid = true;
			this.cityBgStage.isInvalid = true;
			this.cityBgStageBelow.isInvalid = true;
		}
	}
	,updateSky: function(color) {
		this.sky.clear();
		this.skyColor = color;
		this.sky.beginFill(color);
		this.sky.drawRect(0,0,this.get_displayWidth() + 1,this.get_displayHeight() + 1);
		this.sky.endFill();
	}
	,getCityEdges: function() {
		if(this.cachedCityEdges != null && !Game.isLoading) {
			return this.cachedCityEdges;
		}
		var minX = 0;
		var maxX = 0;
		var minY = 0;
		var maxY = 1;
		var _g = 0;
		var _g1 = this.worlds;
		while(_g < _g1.length) {
			var w = _g1[_g];
			++_g;
			if(w.rect.height > 0) {
				var val2 = w.rect.x;
				if(val2 < minX) {
					minX = val2;
				}
				var val21 = w.rect.get_x2();
				if(val21 > maxX) {
					maxX = val21;
				}
				var val22 = w.rect.get_y2();
				if(val22 > maxY) {
					maxY = val22;
				}
			}
			var val23 = w.rect.y - 20 * common_ArrayExtensions.max(w.permanents,function(permanents) {
				return permanents.length;
			}).length;
			if(val23 < minY) {
				minY = val23;
			}
		}
		if(this.miscCityElements.allMiscElements.length > 0) {
			var val1 = common_ArrayExtensions.min(this.miscCityElements.allMiscElements,function(me) {
				return me.rect.x;
			}).rect.x;
			if(minX >= val1) {
				minX = val1;
			}
			var val1 = common_ArrayExtensions.max(this.miscCityElements.allMiscElements,function(me) {
				return me.rect.get_x2();
			}).rect.get_x2();
			if(maxX <= val1) {
				maxX = val1;
			}
			var val1 = common_ArrayExtensions.max(this.miscCityElements.allMiscElements,function(me) {
				return me.rect.get_y2();
			}).rect.get_y2();
			if(maxY <= val1) {
				maxY = val1;
			}
		}
		maxY = Math.ceil(maxY / 20) * 20;
		var theseCityEdges = { minX : minX, maxX : maxX, minY : minY, maxY : maxY};
		if(!Game.isLoading) {
			this.cachedCityEdges = theseCityEdges;
		}
		return theseCityEdges;
	}
	,generatePermanentsByPositionMap: function() {
		this.permanentsByPosition = new haxe_ds_StringMap();
		var _g = 0;
		var _g1 = this.worlds;
		while(_g < _g1.length) {
			var w = _g1[_g];
			++_g;
			var _g2 = 0;
			var _g3 = w.permanents;
			while(_g2 < _g3.length) {
				var p = _g3[_g2];
				++_g2;
				var _g4 = 0;
				while(_g4 < p.length) {
					var pp = p[_g4];
					++_g4;
					if(pp != null) {
						this.permanentsByPosition.h[pp.position.x + "-" + pp.position.y] = pp;
					}
				}
			}
		}
	}
	,getPermanentAtPos: function(xx,yy) {
		if(this.permanentsByPosition == null) {
			this.generatePermanentsByPositionMap();
		}
		return this.permanentsByPosition.h[xx + "-" + yy];
	}
	,fixViewBottom: function(onY) {
		this.fixViewBottomYOn = onY;
	}
	,onCityChange: function() {
		this.cachedCityEdges = null;
	}
	,onBuildBuilding: function(insertBuilding,replaceBuilding,newBuilding,buildingToBuild,yPos,thesePermanents) {
		this.connections.updateCityConnections();
		this.simulation.updatePathfinder(insertBuilding || replaceBuilding,newBuilding);
		this.progress.unlocks.research(buildingToBuild);
		if(insertBuilding) {
			var _g = yPos + 1;
			var _g1 = thesePermanents.length;
			while(_g < _g1) {
				var i = _g++;
				var permanent = thesePermanents[i];
				if(permanent != null) {
					permanent.positionSprites();
				}
			}
		}
		var _g = 0;
		var _g1 = this.simulation.citizens;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			if(citizen.inPermanent != null && citizen.inPermanent.is(buildings_BotanicalGardens)) {
				if(!(citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).get_walkThroughCanViewSelfInThisBuilding()) {
					citizen.canViewSelfInBuilding = false;
					citizen.actuallyUpdateDraw();
				}
			}
		}
		newBuilding.postCreate();
	}
	,createOrRemoveBuilder: function(buildingType,neverRemove,decorationAppearance,mirror,decorationAppearanceColor,customHouseProperties) {
		if(decorationAppearanceColor == null) {
			decorationAppearanceColor = -1;
		}
		if(mirror == null) {
			mirror = false;
		}
		if(decorationAppearance == null) {
			decorationAppearance = 0;
		}
		if(neverRemove == null) {
			neverRemove = false;
		}
		var canPrevalidatePossibly = false;
		if(this.builder != null && this.builder.get_buildingToBuild() == buildingType && this.builder.decorationAppearance == decorationAppearance && this.builder.decorationAppearanceColor == decorationAppearanceColor && this.builder.customHouseProperties == null == (customHouseProperties == null) && (this.builder.customHouseProperties == null || this.builder.customHouseProperties.equals(customHouseProperties))) {
			if(!neverRemove) {
				this.builder.cancel();
			}
			return;
		}
		if(this.builder != null) {
			canPrevalidatePossibly = this.builder.isCacheValid();
		}
		var this1 = this.progress.resources.buildingInfo;
		var key = buildingType.__name__;
		var newBuildingInfo = this1.h[key];
		var canPrevalidateCache = false;
		if(this.builder != null) {
			var _g = this.builder.builderType;
			if(_g._hx_index == 0) {
				var _g1 = _g.buildingType;
				var info = _g.buildingInfo;
				canPrevalidateCache = newBuildingInfo.specialInfo.indexOf("rooftop") != -1 == (info.specialInfo.indexOf("rooftop") != -1);
			}
			this.builder.cancel();
		}
		if(this.specialAction != null) {
			this.specialAction.deactivate();
		}
		if(decorationAppearanceColor != -1) {
			gui_ColorPicker.colorPicked = decorationAppearanceColor;
		}
		this.builder = new Builder(this,this.builderStage,BuilderType.Building(buildingType,newBuildingInfo),decorationAppearance,mirror,decorationAppearanceColor,customHouseProperties);
		if(canPrevalidateCache && canPrevalidatePossibly) {
			this.builder.prevalidateCache();
		}
		if(this.postCreateBuilder != null) {
			this.postCreateBuilder();
		}
	}
	,createOrRemoveFloatingPlatformBuilder: function() {
		if(this.builder != null && this.builder.builderType._hx_index == 4) {
			this.builder.cancel();
			return;
		}
		if(this.builder != null) {
			this.builder.cancel();
		}
		if(this.specialAction != null) {
			this.specialAction.deactivate();
		}
		this.builder = new Builder(this,this.builderStage,BuilderType.FloatingPlatform,0,false,-1,null);
		if(this.postCreateBuilder != null) {
			this.postCreateBuilder();
		}
	}
	,createOrRemoveBridgeBuilder: function(bridgeInfo) {
		if(this.builder != null && Type.enumEq(this.builder.builderType,BuilderType.Bridge(bridgeInfo))) {
			this.builder.cancel();
			return;
		}
		if(this.builder != null) {
			this.builder.cancel();
		}
		if(this.specialAction != null) {
			this.specialAction.deactivate();
		}
		this.builder = new Builder(this,this.builderStage,BuilderType.Bridge(bridgeInfo),0,false,-1,null);
		if(this.postCreateBuilder != null) {
			this.postCreateBuilder();
		}
	}
	,createOrRemoveDecorationBuilder: function(decorationInfo) {
		var tmp;
		if(this.builder != null) {
			var _g = this.builder.builderType;
			var tmp1;
			if(_g._hx_index == 1) {
				var d = _g.decorationInfo;
				tmp1 = d.name;
			} else {
				tmp1 = "";
			}
			tmp = tmp1 == decorationInfo.name;
		} else {
			tmp = false;
		}
		if(tmp) {
			this.builder.cancel();
			return;
		}
		if(this.builder != null) {
			this.builder.cancel();
		}
		if(this.specialAction != null) {
			this.specialAction.deactivate();
		}
		this.builder = new Builder(this,this.builderStage,BuilderType.Decoration(decorationInfo),0,false,-1,null);
		if(this.postCreateBuilder != null) {
			this.postCreateBuilder();
		}
	}
	,createOrRemoveWorldResourceBuilder: function(resourceInfo) {
		var tmp;
		if(this.builder != null) {
			var _g = this.builder.builderType;
			var tmp1;
			if(_g._hx_index == 2) {
				var w = _g.resourceInfo;
				tmp1 = w;
			} else {
				tmp1 = null;
			}
			tmp = tmp1 == resourceInfo;
		} else {
			tmp = false;
		}
		if(tmp) {
			this.builder.cancel();
			return;
		}
		if(this.builder != null) {
			this.builder.cancel();
		}
		if(this.specialAction != null) {
			this.specialAction.deactivate();
		}
		this.builder = new Builder(this,this.builderStage,BuilderType.WorldResource(resourceInfo),0,false,-1,null);
		if(this.postCreateBuilder != null) {
			this.postCreateBuilder();
		}
	}
	,createWorldResourceBuilderMove: function(worldResource) {
		if(this.builder != null) {
			this.builder.cancel();
		}
		if(this.specialAction != null) {
			this.specialAction.deactivate();
		}
		this.builder = new Builder(this,this.builderStage,BuilderType.MoveWorldResource(worldResource),0,false,-1,null);
		if(this.postCreateBuilder != null) {
			this.postCreateBuilder();
		}
	}
	,activateSpecialCityAction: function(newSpecialAction) {
		if(this.builder != null) {
			this.builder.cancel();
		}
		this.specialActionOld = null;
		if(this.specialAction != null) {
			this.specialAction.deactivate(true);
		}
		this.specialAction = newSpecialAction;
		this.specialAction.activate();
	}
	,findPermanentByID: function(id) {
		return this.permanentsByID.h[id];
	}
	,handleAutoSave: function(timeMod) {
		if(Config.limitedVersionForSmoothFilming) {
			return;
		}
		this.secondsSinceAutoSave += timeMod / 60;
		if(this.secondsSinceAutoSave > 1.95 && !this.currentlySaving && !this.isLoserState) {
			this.saveToBrowserStorage(this.cityFile);
		}
	}
	,saveToBrowserStorageSoon: function() {
		this.secondsSinceAutoSave = Math.max(this.secondsSinceAutoSave,1.9);
	}
	,saveToBrowserStorage: function(fileName,andThen) {
		var _gthis = this;
		if(fileName == null) {
			fileName = this.cityFile;
		}
		var saveFile = this.saveToUIntArray();
		this.currentlySaving = true;
		common_Storage.setItem(fileName,saveFile,function() {
			_gthis.secondsSinceAutoSave = 0;
			_gthis.currentlySaving = false;
			if(andThen != null) {
				andThen();
			}
		});
		gamesave_SaveMetaData.saveMetaData(this.cityFile,this.cityMainFile,this);
	}
	,saveToString: function() {
		return this.save().toBase64();
	}
	,saveToOtherSaveSlot: function(newFileSlot,andThen) {
		var _gthis = this;
		common_Storage.setItem("__meta_mostRecentSubOf_" + newFileSlot,"PARTIALLY_OVERWRITTEN",function() {
			var gamesProcessed = 0;
			var addToNewPlace = function(file,fileAdd) {
				if(file != _gthis.cityFile) {
					common_Storage.getItem(file,function(err,savedCity) {
						if(err == null && savedCity != null) {
							var queueData = gamesave_ResizingBytesQueue.fromData(savedCity).getData();
							common_Storage.setItem(newFileSlot + fileAdd,queueData,function() {
								gamesProcessed += 1;
								if(gamesProcessed >= _gthis.subCities.length) {
									common_Storage.setItem("__meta_mostRecentSubOf_" + newFileSlot,_gthis.cityFile,function() {
										andThen();
									});
								}
							});
						} else {
							console.log("FloatingSpaceCities/City.hx:1185:",err);
						}
					},true);
				}
			};
			addToNewPlace(_gthis.cityMainFile,"");
			var _g = 0;
			var _g1 = _gthis.subCities;
			while(_g < _g1.length) {
				var subCity = _g1[_g];
				++_g;
				addToNewPlace(_gthis.cityMainFile + "-" + subCity,"-" + subCity);
			}
			if(_gthis.subCities.length == 0) {
				common_Storage.setItem("__meta_mostRecentSubOf_" + newFileSlot,_gthis.cityFile,function() {
					andThen();
				});
			}
		});
	}
	,saveAllSubCitiesToString: function(andThen) {
		var _gthis = this;
		var gameResult = "THEFINALEARTH2_CITYPACK:";
		var gamesProcessed = 0;
		var addToResult = function(file,fileAdd) {
			if(file != _gthis.cityFile) {
				common_Storage.getItem(file,function(err,savedCity) {
					if(err == null && savedCity != null) {
						var queue = gamesave_ResizingBytesQueue.fromData(savedCity);
						var base64res = queue.toBase64();
						gameResult += fileAdd + ":" + base64res + ":";
						gamesProcessed += 1;
						if(gamesProcessed >= _gthis.subCities.length) {
							andThen(gameResult);
						}
					} else {
						console.log("FloatingSpaceCities/City.hx:1220:",err);
					}
				},true);
			}
		};
		gameResult += this.subCities.length + ":";
		var mainSave = this.save().toBase64();
		gameResult = (gameResult += this.cityFile == this.cityMainFile ? ":" : HxOverrides.substr(this.cityFile,this.cityMainFile.length,null) + ":") + (mainSave + ":");
		addToResult(this.cityMainFile,"");
		var _g = 0;
		var _g1 = this.subCities;
		while(_g < _g1.length) {
			var subCity = _g1[_g];
			++_g;
			addToResult(this.cityMainFile + "-" + subCity,"-" + subCity);
		}
	}
	,saveToUIntArray: function() {
		return this.save().getData();
	}
	,save: function() {
		var queue = new gamesave_ResizingBytesQueue(this.saveRawDataToReuse);
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			var tmp = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes = tmp;
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,-1234);
		queue.size += 4;
		queue.addString(this.progress.story.storyName);
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			var tmp = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes = tmp;
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,70);
		queue.size += 4;
		modding_ModTools._performOnSaveEarly(this,queue);
		Settings.saveToCitySave(queue);
		var value = this.worlds.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			var tmp = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes = tmp;
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		Lambda.iter(this.worlds,function(w) {
			w.save(queue);
		});
		this.progress.save(queue);
		this.simulation.save(queue);
		this.saveBasics(queue);
		this.materials.save(queue);
		this.upgrades.save(queue);
		this.policies.save(queue);
		this.miscCityElements.save(queue);
		modding_ModTools._performOnSave(this,queue);
		this.saveRawDataToReuse = queue.bytes;
		return queue;
	}
	,createBottomWorld: function() {
		var boundaries = this.getCityEdges();
		this.worlds.push(new World(this.game,this,this.cityStage,this.cityMidStage,this.cityBgStage,new common_Rectangle(boundaries.minX - 20,boundaries.maxY + 40,boundaries.maxX - boundaries.minX,0),0));
	}
	,activateLoserState: function() {
		if(this.builder != null) {
			this.builder.cancel();
		}
		this.set_pauseGame(true);
		this.gui.activateLoserState();
		this.isLoserState = true;
	}
	,load: function(queue) {
		if(queue.bytes.getInt32(queue.readStart) == -1234) {
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			queue.readString();
		}
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		queue.version = intToRead;
		this.lastLoadedVersion = queue.version;
		modding_ModTools._performOnLoadStarts(this);
		if(queue.version >= 36) {
			modding_ModTools._performOnLoadEarly(this,queue);
		}
		if(queue.version >= 14) {
			Settings.loadFromCitySave(queue);
		}
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var num = intToRead;
		var _g = 0;
		var _g1 = num;
		while(_g < _g1) {
			var i = _g++;
			this.worlds.push(World.fromLoad(queue,this.game,this,this.cityStage,this.cityMidStage,this.cityBgStage));
		}
		if(queue.version < 24) {
			this.createBottomWorld();
		}
		this.updateDrawCachingRectSize();
		this.progress.load(queue);
		this.simulation.load(queue);
		this.loadBasics(queue);
		this.materials.load(queue);
		if(queue.version >= 4) {
			this.upgrades.load(queue);
		}
		if(queue.version >= 34) {
			this.policies.load(queue);
		}
		if(queue.version >= 43) {
			this.miscCityElements.load(queue);
		}
		if(queue.version >= 35) {
			modding_ModTools._performOnLoad(this,queue);
		}
		this.cityView.updateMovingViewStagePosition();
		this.connections.updateCityConnections();
		this.simulation.updatePathfinder(false);
		this.resize();
		var _g = 0;
		var _g1 = this.permanents;
		while(_g < _g1.length) {
			var pm = _g1[_g];
			++_g;
			pm.postCreate();
		}
		this.simulation.afterLoad();
		this.refreshPossibleSubCities();
		if(queue.version < 38 && this.teleporters.length > 0) {
			this.gui.showSimpleWindow(common_Localize.lo("welcome_back_teleporter_warning"),common_Localize.lo("update_notice"));
		}
		this.gui.refreshCityInfo();
		if(!Config.hasPremium()) {
			if(this.progress.sandbox.unlimitedResources) {
				this.progress.sandbox.disableUnlimitedResources();
			}
		}
		this.backgroundImages.postCreate();
	}
	,getAmountOfPermanentsPerType: function() {
		return this.permanentNumberCached;
	}
	,cheatMaterials: function() {
		this.materials.add(new Materials(10000,10000,10000,10000,10000,10000,10000,0,0,10000,10000));
	}
	,cheatMaterialsZero: function() {
		this.materials.remove(this.materials);
	}
	,cheatFood: function(food) {
		this.materials.set_food(food);
	}
	,cheatWood: function(wood) {
		this.materials.wood = wood;
	}
	,cheatStone: function(stone) {
		this.materials.stone = stone;
	}
	,cheatPeople: function() {
		var _gthis = this;
		var _g = 0;
		while(_g < 100) {
			var i = _g++;
			var tmp = this.simulation;
			var _g1 = [];
			var _g11 = 0;
			var _g2 = this.worlds;
			while(_g11 < _g2.length) {
				var v = _g2[_g11];
				++_g11;
				if(common_ArrayExtensions.any(_gthis.simulation.citizens,(function(w) {
					return function(ct) {
						return ct.onWorld == w[0];
					};
				})([v]))) {
					_g1.push(v);
				}
			}
			tmp.createCitizen(_g1[0],20,null,0);
		}
	}
	,cheatUnlocks: function() {
		var building = haxe_ds_StringMap.valueIterator(Resources.buildingInfo.h);
		while(building.hasNext()) {
			var building1 = building.next();
			var name = "buildings." + building1.className;
			this.progress.unlocks.unlock($hxClasses[name]);
			var name1 = "buildings." + building1.className;
			this.progress.unlocks.fullyUnlock($hxClasses[name1]);
		}
	}
	,onContextRestored: function() {
		this.cityStage.isInvalid = true;
		this.cityMidStage.isInvalid = true;
		this.cityBgStage.isInvalid = true;
		this.cityBgStageBelow.isInvalid = true;
		if(this.usingParticleContainers) {
			graphics_ParticleContainerHelper.recreateContainer(this.citizenInBuildingStage);
			graphics_ParticleContainerHelper.recreateContainer(this.citizenForegroundStage);
		}
	}
	,saveBasics: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(City.saveDefinition);
		}
		var value = this.maxPermanentID;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		queue.addFPoint(this.viewPos);
		var value = this.zoomScale;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		queue.addString(this.cityMainFile);
		queue.addString(this.cityName);
		queue.addString(haxe_Serializer.run(this.subCities));
		queue.addString(haxe_Serializer.run(this.possibleSubCities));
	}
	,loadBasics: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"maxPermanentID")) {
			this.maxPermanentID = loadMap.h["maxPermanentID"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"viewPos")) {
			this.viewPos = loadMap.h["viewPos"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"zoomScale")) {
			this.zoomScale = loadMap.h["zoomScale"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"cityMainFile")) {
			this.cityMainFile = loadMap.h["cityMainFile"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"cityName")) {
			this.cityName = loadMap.h["cityName"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"subCities")) {
			this.subCities = loadMap.h["subCities"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"possibleSubCities")) {
			this.possibleSubCities = loadMap.h["possibleSubCities"];
		}
	}
	,__class__: City
};
