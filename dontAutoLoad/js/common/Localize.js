var common_Localize = $hxClasses["common.Localize"] = function() { };
common_Localize.__name__ = "common.Localize";
common_Localize.init = function(game) {
	common_Localize.game = game;
};
common_Localize.loadLanguage = function(langName,asDefault,then,thenFail) {
	common_LocalizeLoader.load(langName,function(success,langFile) {
		if(!success) {
			thenFail();
			return;
		}
		if(asDefault) {
			common_Localize.defaultLocalizations = langFile;
		} else {
			common_Localize.localizations = langFile;
		}
		if(!asDefault) {
			graphics_BitmapText.languageDependentFontMap = null;
			var _g = 0;
			var _g1 = Resources.customLanguagesInfo;
			while(_g < _g1.length) {
				var cl = _g1[_g];
				++_g;
				if(cl.code == langName && cl.fonts != null) {
					graphics_BitmapText.languageDependentFontMap = cl.fonts;
				}
			}
		}
		then();
	});
};
common_Localize.translateFiles = function(extraArray) {
	var buildingInfo = haxe_ds_StringMap.keysIterator(Resources.buildingInfo.h);
	while(buildingInfo.hasNext()) {
		var buildingInfo1 = buildingInfo.next();
		var thisInfo = Resources.buildingInfo.h[buildingInfo1];
		var className = thisInfo.className;
		var key = "buildinginfo.json/" + className + ".";
		if(common_Localize.loExists(key + "name") || thisInfo.name == null) {
			thisInfo.name = common_Localize.lo(key + "name");
		}
		if(common_Localize.loExists(key + "description") || thisInfo.description == null) {
			thisInfo.description = common_Localize.lo(key + "description");
		}
		if(thisInfo.tooltipBottomIconInfo != null) {
			var _g = 0;
			var _g1 = thisInfo.tooltipBottomIconInfo.length;
			while(_g < _g1) {
				var i = _g++;
				if(common_Localize.loExists(key + "tooltipBottomIconInfo_" + i) || thisInfo.tooltipBottomIconInfo[i].text == null) {
					thisInfo.tooltipBottomIconInfo[i].text = common_Localize.lo(key + "tooltipBottomIconInfo_" + i);
				}
			}
		}
		var showUnlockHint = common_Localize.lo(key + "showUnlockHint");
		if(showUnlockHint != null && showUnlockHint != "!!! missing text !!!") {
			thisInfo.showUnlockHint = showUnlockHint;
		}
	}
	if(extraArray != null) {
		var _g = 0;
		while(_g < extraArray.length) {
			var thisInfo = extraArray[_g];
			++_g;
			var className = thisInfo.className;
			var key = "buildinginfo.json/" + className + ".";
			if(common_Localize.loExists(key + "name") || thisInfo.name == null) {
				thisInfo.name = common_Localize.lo(key + "name");
			}
			if(common_Localize.loExists(key + "description") || thisInfo.description == null) {
				thisInfo.description = common_Localize.lo(key + "description");
			}
			if(thisInfo.tooltipBottomIconInfo != null) {
				var _g1 = 0;
				var _g2 = thisInfo.tooltipBottomIconInfo.length;
				while(_g1 < _g2) {
					var i = _g1++;
					if(common_Localize.loExists(key + "tooltipBottomIconInfo_" + i) || thisInfo.tooltipBottomIconInfo[i].text == null) {
						thisInfo.tooltipBottomIconInfo[i].text = common_Localize.lo(key + "tooltipBottomIconInfo_" + i);
					}
				}
			}
			var showUnlockHint = common_Localize.lo(key + "showUnlockHint");
			if(showUnlockHint != null && showUnlockHint != "!!! missing text !!!") {
				thisInfo.showUnlockHint = showUnlockHint;
			}
		}
	}
	var buildingUpgradeInfo = haxe_ds_StringMap.keysIterator(Resources.buildingUpgradesInfo.h);
	while(buildingUpgradeInfo.hasNext()) {
		var buildingUpgradeInfo1 = buildingUpgradeInfo.next();
		var thisInfo = Resources.buildingUpgradesInfo.h[buildingUpgradeInfo1];
		var className = thisInfo.className;
		var key = "buildingUpgradesInfo.json/" + className + ".";
		if(common_Localize.loExists(key + "name") || thisInfo.name == null) {
			thisInfo.name = common_Localize.lo(key + "name");
		}
		if(common_Localize.loExists(key + "description") || thisInfo.description == null) {
			thisInfo.description = common_Localize.lo(key + "description");
		}
	}
	var _g = 0;
	var _g1 = Resources.worldResourcesInfo;
	while(_g < _g1.length) {
		var wr = _g1[_g];
		++_g;
		var className = wr.className;
		var key = "buildableWorldResourcesInfo.json/" + className + ".";
		if(common_Localize.loExists(key + "name") || wr.name == null) {
			wr.name = common_Localize.lo(key + "name");
		}
		if(common_Localize.loExists(key + "description") || wr.description == null) {
			wr.description = common_Localize.lo(key + "description");
		}
	}
	var _g = 0;
	var _g1 = Resources.bridgesInfo;
	while(_g < _g1.length) {
		var bi = _g1[_g];
		++_g;
		var className = bi.className;
		var key = "bridgesInfo.json/" + className + ".";
		if(common_Localize.loExists(key + "name") || bi.name == null) {
			bi.name = common_Localize.lo(key + "name");
		}
		if(common_Localize.loExists(key + "description") || bi.description == null) {
			bi.description = common_Localize.lo(key + "description");
		}
	}
	var _g = 0;
	var _g1 = Resources.buildingCategoriesInfo;
	while(_g < _g1.length) {
		var bc = _g1[_g];
		++_g;
		if(common_Localize.loExists("categories/" + bc.name + ".name") || bc.displayName == null && bc.name == null) {
			bc.displayName = common_Localize.lo("categories/" + bc.name + ".name");
		} else {
			bc.displayName = bc.name;
		}
		if(common_Localize.loExists("categories/" + bc.name + ".description") || bc.description == null) {
			bc.description = common_Localize.lo("categories/" + bc.name + ".description");
		}
	}
	var _g = 0;
	var _g1 = Resources.decorationsInfo;
	while(_g < _g1.length) {
		var dc = _g1[_g];
		++_g;
		if(common_Localize.loExists("decorationsInfo.json/" + dc.textureName + ".name") || dc.name == null) {
			dc.name = common_Localize.lo("decorationsInfo.json/" + dc.textureName + ".name");
		}
		if(common_Localize.loExists("decorationsInfo.json/" + dc.textureName + ".description") || dc.description == null) {
			dc.description = common_Localize.lo("decorationsInfo.json/" + dc.textureName + ".description");
		}
		if(dc.description == "!!! missing text !!!") {
			dc.description = null;
		}
	}
	var cu = haxe_ds_StringMap.valueIterator(Resources.cityUpgradesInfo.h);
	while(cu.hasNext()) {
		var cu1 = cu.next();
		var className = cu1.className;
		var key = "cityUpgradesInfo.json/" + className + ".";
		if(common_Localize.loExists(key + "name") || cu1.name == null) {
			cu1.name = common_Localize.lo(key + "name");
		}
		if(common_Localize.loExists(key + "description") || cu1.description == null) {
			cu1.description = common_Localize.lo(key + "description");
		}
	}
	var cu = haxe_ds_StringMap.valueIterator(Resources.policiesInfo.h);
	while(cu.hasNext()) {
		var cu1 = cu.next();
		var className = cu1.className;
		var key = "policiesInfo.json/" + className + ".";
		if(common_Localize.loExists(key + "name") || cu1.name == null) {
			cu1.name = common_Localize.lo(key + "name");
		}
		if(common_Localize.loExists(key + "description") || cu1.description == null) {
			cu1.description = common_Localize.lo(key + "description");
		}
	}
	var _g = 0;
	var _g1 = Resources.allStoriesInfo;
	while(_g < _g1.length) {
		var st = _g1[_g];
		++_g;
		var key = "stories.json/" + st.link + ".";
		if(common_Localize.loExists(key + "name") || st.name == null) {
			st.name = common_Localize.lo(key + "name");
		}
		if(common_Localize.loExists(key + "description") || st.description == null) {
			st.description = common_Localize.lo(key + "description");
		}
	}
};
common_Localize.translateStory = function(storyName,story) {
	var key = storyName + ".json/";
	var _g = 0;
	var _g1 = story.goals;
	while(_g < _g1.length) {
		var goal = _g1[_g];
		++_g;
		var qtlo = key + goal.name + ".quickText";
		if(common_Localize.loExists(qtlo)) {
			goal.quickText = common_Localize.lo(qtlo);
		} else {
			goal.quickText = "";
		}
		if(goal.text == "Welcome to this Free Play Scenario!\nA few citizens are already here. Some more will arrive over the coming days.") {
			goal.text = common_Localize.lo("FreePlay.FreePlayStart.text");
		} else if(common_Localize.loExists(key + goal.name + ".text") || goal.text == null) {
			goal.text = common_Localize.lo(key + goal.name + ".text");
		}
		var title = common_Localize.lo(key + goal.name + ".title");
		if(title != "!!! missing text !!!") {
			goal.title = title;
		}
		if(goal.planning != null) {
			var _g2 = 0;
			var _g3 = goal.planning;
			while(_g2 < _g3.length) {
				var plan = _g3[_g2];
				++_g2;
				if(plan.type == "ScriptedStoryPart") {
					var scriptedStoryPartEvent = plan;
					if(scriptedStoryPartEvent.className == "SpawnCitizensRegularly") {
						var spawnRegularly = plan;
						if(spawnRegularly.afterDoneMessage == "All the people from your ship have now arrived. Of course, your population can still grow through their offspring.") {
							spawnRegularly.afterDoneMessage = common_Localize.lo("FreePlay.FreePlayStart.planning.afterDoneMessage");
						} else if(spawnRegularly.afterDoneMessage == "All the people from your previous city have now arrived. Of course, your population can still grow through their offspring.") {
							spawnRegularly.afterDoneMessage = common_Localize.lo("previous_city_arrived");
						} else if(spawnRegularly.afterDoneMessage == "The people who wanted to move here have now all arrived. Of course, your population can still grow through their offspring.") {
							spawnRegularly.afterDoneMessage = common_Localize.lo("moved_here_arrived");
						}
					}
				}
			}
		}
	}
};
common_Localize.loExists = function(key) {
	var text = common_Localize.localizations.h[key];
	if(text == null) {
		text = common_Localize.defaultLocalizations.h[key];
		if(text == null) {
			return false;
		}
	}
	return true;
};
common_Localize.lo = function(key,args) {
	var text = common_Localize.localizations.h[key];
	if(text == null) {
		text = common_Localize.defaultLocalizations.h[key];
		if(text == null) {
			text = "!!! missing text !!!";
		}
	}
	if(text.indexOf("[") != -1) {
		text = StringTools.replace(text,"[tap]",common_Localize.game.textHelper.clickOrTap(false));
		text = StringTools.replace(text,"[Tap]",common_Localize.game.textHelper.clickOrTap(true));
	}
	if(args != null) {
		var _g = 0;
		var _g1 = args.length;
		while(_g < _g1) {
			var i = _g++;
			var arg = args[i];
			text = StringTools.replace(text,"[" + i + "]",arg);
		}
	}
	return StringTools.replace(text,"\\n","\n");
};
