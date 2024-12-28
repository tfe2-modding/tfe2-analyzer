var GameLoader = $hxClasses["GameLoader"] = function(then,drawOnStage,main) {
	this.finalizedLoad = false;
	this.hasError = false;
	var _gthis = this;
	Settings.load(main);
	Config.callLoadStart();
	if(5 == 4) {
		if (window.removeLoadingExplainer != undefined) window.removeLoadingExplainer();
	}
	this.loader = new PIXI.Loader();
	this.loadingGraphics = new PIXI.Graphics();
	drawOnStage.addChild(this.loadingGraphics);
	var cacheBust = "?cache=" + "20241021113841";
	this.loader.add("sprites.json" + cacheBust);
	this.loader.add("fonts/standard.fnt" + cacheBust);
	this.loader.add("fonts/standard10.fnt" + cacheBust);
	this.loader.add("fonts/standard16.fnt" + cacheBust);
	this.loader.add("fonts/standard15.fnt" + cacheBust);
	this.loader.add("fonts/standard18.fnt" + cacheBust);
	this.loader.add("buildinginfo.json" + cacheBust);
	this.loader.add("buildingUpgradesInfo.json" + cacheBust);
	this.loader.add("buildingCategoriesInfo.json" + cacheBust);
	this.loader.add("decorationsInfo.json" + cacheBust);
	this.loader.add("buildableWorldResourcesInfo.json" + cacheBust);
	this.loader.add("cityUpgradesInfo.json" + cacheBust);
	this.loader.add("policiesInfo.json" + cacheBust);
	this.loader.add("stories.json" + cacheBust);
	this.loader.add("js/pathfinder.js" + cacheBust);
	if(Config.canHavePremium()) {
		this.loader.add("bridgesInfo.json" + cacheBust);
	}
	var stories_h = Object.create(null);
	var fileName = "stories/" + "theLostShip" + ".json";
	stories_h[fileName] = "theLostShip";
	_gthis.loader.add(fileName);
	var name = Config.isSnowThemed ? "displayCitySnow" : "displayCity";
	var fileName = "stories/" + name + ".json";
	stories_h[fileName] = name;
	_gthis.loader.add(fileName);
	this.loader.use(function(res,next) {
		if(res.error) {
			console.log("FloatingSpaceCities/GameLoader.hx:70:",res.error);
			if(!_gthis.hasError) {
				var v = "Unfortunately, something went wrong while loading the game. Please check your internet connection and reload the page. " + "If your internet connection is working fine, please report the technical details below. " + "Technical details:\n" + Std.string(res.error);
				window.alert(Std.string(v));
			}
			_gthis.hasError = true;
			return;
		}
		if(res.name == "buildingUpgradesInfo.json" + cacheBust) {
			Resources.buildingUpgradesInfo = new haxe_ds_StringMap();
			var buildingsUpgrades = res.data;
			var _g = 0;
			while(_g < buildingsUpgrades.length) {
				var buildingUpgrade = buildingsUpgrades[_g];
				++_g;
				Resources.buildingUpgradesInfo.h["buildingUpgrades." + buildingUpgrade.className] = buildingUpgrade;
			}
		} else if(res.name == "buildinginfo.json" + cacheBust) {
			Resources.buildingInfo = new haxe_ds_StringMap();
			Resources.buildingInfoArray = res.data;
			var _g = 0;
			var _g1 = Resources.buildingInfoArray;
			while(_g < _g1.length) {
				var building = _g1[_g];
				++_g;
				Resources.buildingInfo.h["buildings." + building.className] = building;
			}
		} else if(res.name == "buildableWorldResourcesInfo.json" + cacheBust) {
			Resources.worldResourcesInfo = res.data;
		} else if(res.name == "buildingCategoriesInfo.json" + cacheBust) {
			Resources.buildingCategoriesInfo = res.data;
		} else if(res.name == "decorationsInfo.json" + cacheBust) {
			Resources.decorationsInfo = res.data;
		} else if(res.name == "bridgesInfo.json" + cacheBust) {
			Resources.bridgesInfo = res.data;
		} else if(res.name == "cityUpgradesInfo.json" + cacheBust) {
			Resources.cityUpgradesInfo = new haxe_ds_StringMap();
			var cityUpgrades = res.data;
			var _g = 0;
			while(_g < cityUpgrades.length) {
				var cityUpgrade = cityUpgrades[_g];
				++_g;
				Resources.cityUpgradesInfo.h["cityUpgrades." + cityUpgrade.className] = cityUpgrade;
			}
		} else if(res.name == "policiesInfo.json" + cacheBust) {
			Resources.policiesInfo = new haxe_ds_StringMap();
			var policies = res.data;
			var _g = 0;
			while(_g < policies.length) {
				var policy = policies[_g];
				++_g;
				Resources.policiesInfo.h["policies." + policy.className] = policy;
			}
		} else if(res.name == "stories.json" + cacheBust) {
			Resources.allStoriesInfo = res.data;
		} else if(res.name == "js/pathfinder.js" + cacheBust) {
			Resources.pathfinderCodeUrl = URL.createObjectURL(new Blob([res.data]));
		} else if(Object.prototype.hasOwnProperty.call(stories_h,res.name)) {
			var storyName = stories_h[res.name];
			var v = res.data;
			Resources.storiesInfo.h[storyName] = v;
		} else if(res.name == "shader.glsl") {
			Resources.shader = new PIXI.Filter("",res.data);
		}
		next();
	});
	this.loader.load(function() {
		var onLoadDone = function() {
			jsFunctions.fontsPrepareVietnamese();
			_gthis.resourcesLoaded = true;
			if(Settings.settingsLoaded && Config.splashScreenDone) {
				_gthis.postLoad();
			}
		};
		if (window.showLoadingModsText != undefined) window.showLoadingModsText();
		modding_ModLoader.loadMods(onLoadDone);
	});
	this.loaderThen = then;
};
GameLoader.__name__ = "GameLoader";
GameLoader.prototype = {
	postLoad: function() {
		this.finalizedLoad = true;
		Config.callLoadFinish();
		if (window.removeLoadingExplainer != undefined) window.removeLoadingExplainer();
		this.loadOptionals();
		common_Localize.translateFiles();
		this.loaderThen();
		this.loadingGraphics.destroy();
	}
	,loadOptionals: function() {
		var optionalLoader = new PIXI.Loader();
		optionalLoader.add("citizenNames.txt");
		optionalLoader.use(function(res,next) {
			if(res.error) {
				console.log("FloatingSpaceCities/GameLoader.hx:168:","error loading optionals");
				return;
			}
			if(res.name == "citizenNames.txt") {
				var loaderData = res.data;
				var splitData = loaderData.split("\r\n");
				if(splitData.length == 1) {
					splitData = loaderData.split("\n");
				}
				splitData.splice(0,1 + splitData.indexOf("START"));
				Resources.citizenNames = splitData;
			}
			next();
		});
		optionalLoader.load(function() {
		});
	}
	,update: function(drawRectangle,scaling) {
		if(Config.splashScreenDone) {
			this.loadingGraphics.scale.x = this.loadingGraphics.scale.y = scaling;
			Config.callLoadProgress(this.loader.progress / 100);
			var val2 = drawRectangle.width / 3 | 0;
			var halfWidth = val2 < 100 ? val2 : 100;
			var halfHeight = 5;
			var width = halfWidth * 2;
			var height = halfHeight * 2;
			if(this.resourcesLoaded) {
				this.loadingGraphics.clear();
			} else {
				var tmp = this.hasError ? 6303792 : 6316128;
				var tmp1 = this.loadingGraphics.clear().beginFill(tmp);
				var tmp = drawRectangle.get_center().x - halfWidth;
				var tmp2 = drawRectangle.get_center().y - halfHeight;
				var tmp3 = this.hasError ? 16711680 : 16777215;
				tmp1.drawRect(tmp,tmp2,width,height).endFill().beginFill(tmp3).drawRect(drawRectangle.get_center().x - halfWidth,drawRectangle.get_center().y - halfHeight,width * (this.loader.progress / 100),height).endFill();
			}
		}
		if(this.resourcesLoaded && !this.finalizedLoad) {
			if(Settings.settingsLoaded && Config.splashScreenDone) {
				this.postLoad();
			}
		}
	}
	,__class__: GameLoader
};
