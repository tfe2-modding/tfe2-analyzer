var modding_ModLoader = $hxClasses["modding.ModLoader"] = function() { };
modding_ModLoader.__name__ = "modding.ModLoader";
modding_ModLoader.mergeArray = function(addToArray,addThisArray) {
	var addThisArrayCast = addThisArray;
	var _g = 0;
	while(_g < addThisArrayCast.length) {
		var item = addThisArrayCast[_g];
		++_g;
		var indexInCurrent = -1;
		var _g1 = 0;
		var _g2 = addToArray.length;
		while(_g1 < _g2) {
			var i = _g1++;
			if(addToArray[i].className == item.className) {
				indexInCurrent = i;
				break;
			}
		}
		if(indexInCurrent == -1) {
			addToArray.push(item);
		}
	}
};
modding_ModLoader.makeLoaderForMod = function() {
	var loaderWrapper = new modding_SingleModLoader();
	var loader = new PIXI.Loader();
	loaderWrapper.loader = loader;
	var hasError = false;
	var javascriptsToLoad = [];
	loader.pre(function(res,next) {
		var splitResource;
		if(res.name.indexOf("/") < 0) {
			splitResource = res.name.split("\\");
		} else {
			splitResource = res.name.split("/");
		}
		var resourceName = splitResource[splitResource.length - 1];
		res.name = resourceName;
		if(StringTools.endsWith(res.name,".js")) {
			javascriptsToLoad.push("file:///" + StringTools.replace(res.url,"\\","/"));
			res.complete();
			next();
		} else if(res.loadType != PIXI.LoaderResource.LOAD_TYPE.AUDIO && res.loadType != PIXI.LoaderResource.LOAD_TYPE.VIDEO && res.loadType != PIXI.LoaderResource.LOAD_TYPE.IMAGE) {
			_internalModHelpers.readModFile(res.url,"utf8",function(data) {
				res.data = data;
				next();
			});
		} else {
			next();
		}
	});
	loader.use(function(res,next) {
		if(res.error) {
			console.log("FloatingSpaceCities/modding/ModLoader.hx:126:",res);
			console.log("FloatingSpaceCities/modding/ModLoader.hx:127:",res.error);
			if(!hasError) {
				var v = common_Localize.lo("mod_resource_not_loaded") + " " + common_Localize.lo("technical_details") + "\n" + Std.string(res.error);
				window.alert(Std.string(v));
			}
			hasError = true;
			return;
		}
		if(res.name == "buildinginfo.json") {
			var newBuildingInfo = res.data;
			var _g = 0;
			while(_g < newBuildingInfo.length) {
				var building = newBuildingInfo[_g];
				++_g;
				if(!Object.prototype.hasOwnProperty.call(Resources.buildingInfo.h,"buildings." + building.className)) {
					Resources.buildingInfoArray.push(building);
				} else {
					var existingBuildingI = -1;
					var _g1 = 0;
					var _g2 = Resources.buildingInfoArray.length;
					while(_g1 < _g2) {
						var i = _g1++;
						var bld = Resources.buildingInfoArray[i];
						if(bld.className == building.className) {
							existingBuildingI = i;
						}
					}
					Resources.buildingInfoArray[existingBuildingI] = building;
				}
				Resources.buildingInfo.h["buildings." + building.className] = building;
			}
		} else if(res.name == "buildingUpgradesInfo.json") {
			var buildingsUpgrades = res.data;
			var _g = 0;
			while(_g < buildingsUpgrades.length) {
				var buildingUpgrade = buildingsUpgrades[_g];
				++_g;
				Resources.buildingUpgradesInfo.h["buildingUpgrades." + buildingUpgrade.className] = buildingUpgrade;
			}
		} else if(res.name == "buildableWorldResourcesInfo.json") {
			modding_ModLoader.mergeArray(Resources.worldResourcesInfo,res.data);
		} else if(res.name == "buildingCategoriesInfo.json") {
			var _g = 0;
			var _g1 = res.data;
			while(_g < _g1.length) {
				var category = _g1[_g];
				++_g;
				Resources.buildingCategoriesInfo.push(category);
			}
		} else if(res.name == "decorationsInfo.json") {
			var _g = 0;
			var _g1 = res.data;
			while(_g < _g1.length) {
				var decoration = _g1[_g];
				++_g;
				Resources.decorationsInfo.push(decoration);
			}
		} else if(res.name == "cityUpgradesInfo.json") {
			var cityUpgrades = res.data;
			var _g = 0;
			while(_g < cityUpgrades.length) {
				var cityUpgrade = cityUpgrades[_g];
				++_g;
				Resources.cityUpgradesInfo.h["cityUpgrades." + cityUpgrade.className] = cityUpgrade;
			}
		} else if(res.name == "policiesInfo.json") {
			var thesePolicies = res.data;
			var _g = 0;
			while(_g < thesePolicies.length) {
				var policy = thesePolicies[_g];
				++_g;
				Resources.policiesInfo.h["policies." + policy.className] = policy;
			}
		} else if(res.name == "stories.json") {
			var _g = 0;
			var _g1 = res.data;
			while(_g < _g1.length) {
				var story = _g1[_g];
				++_g;
				Resources.allStoriesInfo.push(story);
			}
		} else if(res.name == "bridgesInfo.json") {
			var _g = 0;
			var _g1 = res.data;
			while(_g < _g1.length) {
				var bridgeInfo = _g1[_g];
				++_g;
				Resources.bridgesInfo.push(bridgeInfo);
			}
		} else if(StringTools.startsWith(res.name,"lang_") && StringTools.endsWith(res.name,".csv")) {
			var langName = HxOverrides.substr(res.name,"lang_".length,res.name.length - ".csv".length - "lang_".length);
			if(Object.prototype.hasOwnProperty.call(common_LocalizeLoader.additionalLocalizations.h,langName)) {
				var _g = langName;
				var _g1 = common_LocalizeLoader.additionalLocalizations;
				var v = _g1.h[_g] + ("\n" + Std.string(res.data));
				_g1.h[_g] = v;
			} else {
				var v = res.data;
				common_LocalizeLoader.additionalLocalizations.h[langName] = v;
			}
			modding_ModLoader.reloadLanguages = true;
		} else if(res.name == "languageInfo.json") {
			var _g = 0;
			var _g1 = res.data;
			while(_g < _g1.length) {
				var langInfo = _g1[_g];
				++_g;
				Resources.customLanguagesInfo.push(langInfo);
			}
		} else if(StringTools.endsWith(res.name,".json")) {
			var v = res.data;
			Resources.storiesInfo.h[res.name] = v;
			var v = res.data;
			Resources.storiesInfo.h[res.name.split(".")[0]] = v;
		}
		next();
	});
	var loadJavascripts = null;
	loadJavascripts = function(callback) {
		if(javascriptsToLoad.length == 0) {
			callback();
			return;
		}
		var jsFile = javascriptsToLoad.pop();
		jsFunctions.loadJS(jsFile,function() {
			loadJavascripts(callback);
		},function() {
			var v = StringTools.replace(common_Localize.lo("mod_resource_not_loaded"),".",":") + " " + jsFile;
			window.alert(Std.string(v));
		});
	};
	loaderWrapper.load = function(callback) {
		loader.load(function(arg1,arg2) {
			if(!loaderWrapper.reverseJSLoadOrder) {
				javascriptsToLoad.reverse();
			}
			var _g = callback;
			var a1 = arg1;
			var a2 = arg2;
			var tmp = function() {
				_g(a1,a2);
			};
			loadJavascripts(tmp);
		});
	};
	return loaderWrapper;
};
modding_ModLoader.initConstants = function() {
	var entertainmentTypes = { };
	entertainmentTypes.Club = 2;
	entertainmentTypes.Bar = 0;
	entertainmentTypes.Art = 3;
	entertainmentTypes.Nature = 1;
	entertainmentTypes.Games = 4;
	entertainmentTypes.Education = 5;
	window.entertainmentTypes = entertainmentTypes;
	var upgradeStages = { };
	upgradeStages.Foreground = 0;
	upgradeStages.Middle = 2;
	upgradeStages.Background = 1;
	window.upgradeDisplayLayer = upgradeStages;
};
modding_ModLoader.loadAllMods = function(loaders,then) {
	var _g = [];
	var _g1 = 0;
	var _g2 = loaders;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		if(v != null) {
			_g.push(v);
		}
	}
	loaders = _g;
	haxe_ds_ArraySort.sort(loaders,function(lo,lo2) {
		return lo2.priority - lo.priority;
	});
	modding_ModLoader.loadAllModsPhase2(loaders,then,0);
};
modding_ModLoader.loadAllModsPhase2 = function(loaders,then,startI) {
	if(startI == null) {
		startI = 0;
	}
	if(startI >= loaders.length) {
		if(modding_ModLoader.reloadLanguages) {
			modding_ModLoader.reloadLanguages = false;
			Settings.loadLanguages(then);
		} else {
			then();
		}
		return;
	}
	if(loaders[startI] == null) {
		modding_ModLoader.loadAllModsPhase2(loaders,then,startI + 1);
		return;
	}
	loaders[startI].load(function(ldr,res) {
		modding_ModLoader.loadAllModsPhase2(loaders,then,startI + 1);
	});
};
modding_ModLoader.modIsIncompatible = function(mod) {
	return mod == "2951093059";
};
modding_ModLoader.loadMods = function(then) {
	modding_ModLoader.initConstants();
	var loaders = [];
	_internalModHelpers.getAllMods(function(mods) {
		var unloadedMods = 0;
		var ready = false;
		try {
			mods = mods.concat(_internalModHelpers.getAllModsSteam());
		} catch( _g ) {
		}
		var _g = [];
		var _g1 = 0;
		var _g2 = mods.length;
		while(_g1 < _g2) {
			var _ = _g1++;
			_g.push(null);
		}
		loaders = _g;
		if(loaders.length >= 1) {
			common_Achievements.achieve("MOD_INSTALL");
		}
		var _g = 0;
		var _g1 = mods.length;
		while(_g < _g1) {
			var i = [_g++];
			var mod = mods[i[0]];
			var modPath = mod;
			if(StringTools.startsWith(mod,"steamMod:///")) {
				modPath = StringTools.replace(mod,"steamMod:///","");
			} else {
				modPath = _internalModHelpers.path + "\\" + mod;
			}
			if(modding_ModLoader.modIsIncompatible(HxOverrides.substr(mod,("\\" + mod).lastIndexOf("\\"),null)) || Settings.modsDisabled.indexOf(mod) != -1 || Settings.modsDisabled.indexOf(HxOverrides.substr(mod,("\\" + mod).lastIndexOf("\\"),null)) != -1) {
				continue;
			}
			unloadedMods += 1;
			_internalModHelpers.getModFiles(modPath,(function(i) {
				return function(files) {
					var loader = modding_ModLoader.makeLoaderForMod();
					loaders[i[0]] = loader;
					loader.doPreload(files,(function() {
						return function() {
							unloadedMods -= 1;
							var _g = 0;
							while(_g < files.length) {
								var file = files[_g];
								++_g;
								loader.loader.add(file);
							}
							if(unloadedMods == 0 && ready) {
								modding_ModLoader.loadAllMods(loaders,then);
							}
						};
					})());
				};
			})(i));
		}
		if(unloadedMods == 0) {
			modding_ModLoader.loadAllMods(loaders,then);
		}
		ready = true;
	});
};
