var cityActions_CityHighlightBuildingsOfType = $hxClasses["cityActions.CityHighlightBuildingsOfType"] = function() { };
cityActions_CityHighlightBuildingsOfType.__name__ = "cityActions.CityHighlightBuildingsOfType";
cityActions_CityHighlightBuildingsOfType.doHighlight = function(city,buildingType) {
	var highlightTextures = Resources.getTexturesByWidth("spr_hoverhint",22);
	city.setHoverHightlight(function(pm) {
		if(pm.is(buildingType)) {
			var thisBuilding = pm;
			var anyUpgrade = false;
			var _g = 0;
			var _g1 = thisBuilding.get_possibleUpgrades();
			while(_g < _g1.length) {
				var ug = [_g1[_g]];
				++_g;
				if(city.progress.unlocks.getUnlockState(ug[0]) == progress_UnlockState.Locked) {
					continue;
				}
				var this1 = Resources.buildingUpgradesInfo;
				var key = ug[0].__name__;
				var info = this1.h[key];
				var materialsToPay = Materials.fromBuildingUpgradesInfo(info);
				if(!common_ArrayExtensions.any(thisBuilding.upgrades,(function(ug) {
					return function(bu) {
						return js_Boot.getClass(bu) == ug[0];
					};
				})(ug))) {
					anyUpgrade = true;
					if(city.materials.canAfford(materialsToPay)) {
						return highlightTextures[2];
					}
				}
			}
			var _g = 0;
			var _g1 = thisBuilding.get_possibleCityUpgrades();
			while(_g < _g1.length) {
				var cu = [_g1[_g]];
				++_g;
				if(city.progress.unlocks.getUnlockState(cu[0]) == progress_UnlockState.Locked) {
					continue;
				}
				var this1 = Resources.cityUpgradesInfo;
				var key = cu[0].__name__;
				var info = this1.h[key];
				var materialsToPay = city.upgrades.getCurrentCost(info);
				if(!common_ArrayExtensions.any(city.upgrades.upgrades,(function(cu) {
					return function(thisCU) {
						return js_Boot.getClass(thisCU) == cu[0];
					};
				})(cu))) {
					anyUpgrade = true;
					if(city.materials.canAfford(materialsToPay)) {
						return highlightTextures[2];
					}
				}
			}
			if(anyUpgrade) {
				return highlightTextures[1];
			} else {
				return highlightTextures[0];
			}
		}
		city.progress.resetCtrlToHightlightHint();
		return null;
	},6735360);
};
cityActions_CityHighlightBuildingsOfType.findLeastUpgraded = function(city,buildingType) {
	var foundBuilding = null;
	var leastUpgrades = 10000;
	var _g = 0;
	var _g1 = city.permanents;
	while(_g < _g1.length) {
		var pm = _g1[_g];
		++_g;
		if(pm.isBuilding) {
			var thisBuilding = pm;
			if(thisBuilding.is(buildingType)) {
				if(thisBuilding.upgrades.length < leastUpgrades) {
					leastUpgrades = thisBuilding.upgrades.length;
					foundBuilding = thisBuilding;
				}
			}
		}
	}
	return foundBuilding;
};
