var modding_ModTools = $hxClasses["modding.ModTools"] = $hx_exports["ModTools"] = function() { };
modding_ModTools.__name__ = "modding.ModTools";
modding_ModTools.addMaterial = function(varName,displayName,description,tooltipExt) {
	if(tooltipExt == null) {
		tooltipExt = function() {
			return "";
		};
	}
	MaterialsHelper.modMaterials.push({ variableName : varName, displayName : displayName, description : description, tooltipExt : tooltipExt});
	var ind = MaterialsHelper.materialNames.length;
	MaterialsHelper.materialNames.push(varName);
	Materials.prototype[varName] = 0;
	return ind;
};
modding_ModTools.produce = function(city,varName,amount,ind) {
	if(ind == null) {
		ind = MaterialsHelper.findMaterialIndex(varName);
	}
	city.materials[varName] += amount;
	city.simulation.stats.materialProduction[ind][0] += amount;
};
modding_ModTools.consume = function(city,varName,amount,ind) {
	if(ind == null) {
		ind = MaterialsHelper.findMaterialIndex(varName);
	}
	city.materials[varName] -= amount;
	city.simulation.stats.materialUsed[ind][0] += amount;
};
modding_ModTools.onCityUpdate = function(func) {
	modding_ModTools.cityUpdatesFuncs.push(func);
};
modding_ModTools.onModsLoaded = function(func) {
	modding_ModTools.onModsLoadedFuncs.push(func);
};
modding_ModTools.onLoadStart = function(func) {
	modding_ModTools.onLoadStartFuncs.push(func);
};
modding_ModTools.onCityCreate = function(func) {
	modding_ModTools.cityCreateFuncs.push(func);
};
modding_ModTools._performOnModsLoaded = function(game) {
	Lambda.iter(modding_ModTools.onModsLoadedFuncs,function(func) {
		func(game);
	});
};
modding_ModTools._performOnCityUpdates = function(city,timeMod) {
	Lambda.iter(modding_ModTools.cityUpdatesFuncs,function(func) {
		func(city,timeMod);
	});
};
modding_ModTools._performOnLoadStarts = function(city) {
	Lambda.iter(modding_ModTools.onLoadStartFuncs,function(func) {
		func(city);
	});
};
modding_ModTools._performCityOnCreate = function(city) {
	Lambda.iter(modding_ModTools.cityCreateFuncs,function(func) {
		func(city);
	});
};
modding_ModTools._performOnSaveAny = function(city,queue,saveFuncs) {
	var value = saveFuncs.length;
	if(queue.size + 4 > queue.bytes.length) {
		var oldBytes = queue.bytes;
		var tmp = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
		queue.bytes = tmp;
		queue.bytes.blit(0,oldBytes,0,queue.size);
	}
	queue.bytes.setInt32(queue.size,value);
	queue.size += 4;
	Lambda.iter(saveFuncs,function(funcs) {
		queue.addString(funcs.modIdentifier);
		var value = funcs.version;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			var tmp = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes = tmp;
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var cur = queue.size;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			var tmp = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes = tmp;
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,0);
		queue.size += 4;
		funcs.onSave(city,queue);
		queue.bytes.setInt32(cur,queue.size);
	});
};
modding_ModTools._performOnSave = function(city,queue) {
	modding_ModTools._performOnSaveAny(city,queue,modding_ModTools.onGlobalSaveFuncs);
};
modding_ModTools._performOnSaveEarly = function(city,queue) {
	modding_ModTools._performOnSaveAny(city,queue,modding_ModTools.onGlobalSaveFuncsEarly);
};
modding_ModTools.addSaveData = function(modIdentifier,saveFunc,loadFunc,version) {
	if(version == null) {
		version = 0;
	}
	modding_ModTools.onGlobalSaveFuncs.push({ onSave : saveFunc, onLoad : loadFunc, modIdentifier : modIdentifier, version : version});
};
modding_ModTools.addSaveDataEarly = function(modIdentifier,saveFunc,loadFunc,version) {
	if(version == null) {
		version = 0;
	}
	modding_ModTools.onGlobalSaveFuncsEarly.push({ onSave : saveFunc, onLoad : loadFunc, modIdentifier : modIdentifier, version : version});
};
modding_ModTools.addStatBasedUnlock = function(elementClass,unlockFunc,fullUnlockFunc) {
	modding_ModTools.statBasedUnlockFuncs.push({ cityElement : elementClass, func : unlockFunc, fullFunc : fullUnlockFunc});
};
modding_ModTools.addBuildBasedUnlock = function(elementClass,unlockFunc,fullUnlockFunc) {
	modding_ModTools.buildBasedUnlockFuncs.push({ cityElement : elementClass, func : unlockFunc, fullFunc : fullUnlockFunc});
};
modding_ModTools._checkBuildBasedUnlocks = function(unlocks,pmPerType) {
	var _g = 0;
	var _g1 = modding_ModTools.buildBasedUnlockFuncs;
	while(_g < _g1.length) {
		var unlock = _g1[_g];
		++_g;
		if(unlock.func(pmPerType)) {
			unlocks.unlock(unlock.cityElement);
			if(unlock.fullFunc != null && unlock.fullFunc(pmPerType)) {
				unlocks.fullyUnlock(unlock.cityElement);
			}
		}
	}
};
modding_ModTools._checkStatBasedUnlocks = function(unlocks,city) {
	var _g = 0;
	var _g1 = modding_ModTools.statBasedUnlockFuncs;
	while(_g < _g1.length) {
		var unlock = _g1[_g];
		++_g;
		if(unlock.func(city)) {
			unlocks.unlock(unlock.cityElement);
			if(unlock.fullFunc != null && unlock.fullFunc(city)) {
				unlocks.fullyUnlock(unlock.cityElement);
			}
		}
	}
};
modding_ModTools._performOnLoadEarly = function(city,queue) {
	modding_ModTools._performOnLoadAny(city,queue,modding_ModTools.onGlobalSaveFuncsEarly);
};
modding_ModTools._performOnLoad = function(city,queue) {
	modding_ModTools._performOnLoadAny(city,queue,modding_ModTools.onGlobalSaveFuncs);
};
modding_ModTools._performOnLoadAny = function(city,queue,saveFuncs) {
	var intToRead = queue.bytes.getInt32(queue.readStart);
	queue.readStart += 4;
	var len = intToRead;
	var loadFuncs_h = Object.create(null);
	Lambda.iter(saveFuncs,function(funcs) {
		loadFuncs_h[funcs.modIdentifier] = funcs;
	});
	var _g = 0;
	var _g1 = len;
	while(_g < _g1) {
		var i = _g++;
		var modIdentifier = queue.readString();
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var modVer = intToRead;
		var intToRead1 = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var continueReadingOn = intToRead1;
		var funcInfo = loadFuncs_h[modIdentifier];
		if(funcInfo != null) {
			loadFuncs_h[modIdentifier].onLoad(city,queue,modVer);
		}
		queue.readStart = continueReadingOn;
	}
};
modding_ModTools.setModEnabled = function(mod,isEnabled) {
	var isIncludedNow = Settings.modsDisabled.indexOf(mod) != -1;
	if(isIncludedNow == !isEnabled) {
		return;
	}
	if(isEnabled) {
		HxOverrides.remove(Settings.modsDisabled,mod);
	} else {
		Settings.modsDisabled.push(mod);
	}
	Settings.save();
};
modding_ModTools.modIsEnabled = function(mod) {
	return Settings.modsDisabled.indexOf(mod) == -1;
};
