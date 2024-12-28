var gui_infoWindows_FindBuildingsOfType = $hxClasses["gui.infoWindows.FindBuildingsOfType"] = function() { };
gui_infoWindows_FindBuildingsOfType.__name__ = "gui.infoWindows.FindBuildingsOfType";
gui_infoWindows_FindBuildingsOfType.createWindow = function(city,clearWindowStack) {
	if(clearWindowStack == null) {
		clearWindowStack = true;
	}
	if(clearWindowStack) {
		city.gui.clearWindowStack();
	}
	city.gui.createWindow("highlight_buildings");
	var city1 = city;
	var clearWindowStack1 = clearWindowStack;
	var tmp = function() {
		gui_infoWindows_FindBuildingsOfType.createWindow(city1,clearWindowStack1);
	};
	city.gui.setWindowReload(tmp);
	var _g = ($_=city.gui,$bind($_,$_.reloadWindow));
	var city2 = city;
	var clearWindowStack2 = clearWindowStack;
	var createWindowFunc = function() {
		gui_infoWindows_FindBuildingsOfType.createWindow(city2,clearWindowStack2);
	};
	var tmp = function() {
		_g(createWindowFunc);
	};
	city.windowRelatedOnBuildOrDestroy = tmp;
	city.gui.window.onDestroy = function() {
		city.windowRelatedOnBuildOrDestroy = null;
	};
	var city3 = city;
	var clearWindowStack3 = clearWindowStack;
	var tmp = function() {
		gui_infoWindows_FindBuildingsOfType.createWindow(city3,clearWindowStack3);
	};
	city.gui.addWindowToStack(tmp);
	var windowTitle = common_Localize.lo("highlight_buildings");
	city.gui.windowAddTitleText(windowTitle);
	var isFirst = true;
	var _g1 = 0;
	var _g2 = Resources.buildingCategoriesInfo;
	while(_g1 < _g2.length) {
		var category = _g2[_g1];
		++_g1;
		var topSpacing = new gui_GUISpacing(city.gui.windowInner,new common_Point(2,isFirst ? 0 : 6));
		city.gui.windowInner.addChild(topSpacing);
		var ge = city.gui.windowAddInfoText(common_Localize.lo("categories/" + category.name + ".name"),null,"Arial15");
		var categoryUI = new gui_GUIContainer(city.gui,city.gui.innerWindowStage,city.gui.windowInner);
		categoryUI.direction = gui_GUIContainerDirection.Horizontal;
		city.gui.windowInner.addChild(categoryUI);
		var noBuildingInCategory = true;
		var numBuildings = 0;
		var _g3 = 0;
		var _g4 = city.progress.resources.buildingInfoArray;
		while(_g3 < _g4.length) {
			var building = [_g4[_g3]];
			++_g3;
			var name = "buildings." + building[0].className;
			var classToBuild = [$hxClasses[name]];
			var unlockState = city.progress.unlocks.getUnlockState(classToBuild[0]);
			var sprName = Reflect.field(classToBuild[0],"spriteName");
			var buildingNeedsUnlock = (building[0].showUnlockHint != null || building[0].specialInfo.indexOf("premium") != -1) && unlockState == progress_UnlockState.Unlocked;
			if(building[0].category == category.name && (unlockState == progress_UnlockState.Unlocked && !buildingNeedsUnlock || unlockState == progress_UnlockState.Researched || unlockState == progress_UnlockState.Createable)) {
				var buildingFindButton = [];
				buildingFindButton[0] = new gui_ImageButton(city.gui,city.gui.innerWindowStage,city.gui.windowInner,(function(classToBuild,building) {
					return function() {
						gui_infoWindows_FindBuildingsOfTypeActive.createWindow(city,classToBuild[0],building[0],false);
						cityActions_CityHighlightBuildingsOfType.doHighlight(city,classToBuild[0]);
					};
				})(classToBuild,building),Resources.getTexture(sprName + "@0,0,20,20"),(function() {
					return function() {
						return false;
					};
				})(),(function(buildingFindButton,classToBuild,building) {
					return function() {
						city.gui.tooltip.setText(buildingFindButton[0],building[0].name);
						cityActions_CityHighlightBuildingsOfType.doHighlight(city,classToBuild[0]);
					};
				})(buildingFindButton,classToBuild,building),building[0].buttonBack == "none" ? null : Resources.getTexture(building[0].buttonBack == null ? "" + sprName + "@44,0,20,20" : building[0].buttonBack));
				categoryUI.addChild(buildingFindButton[0]);
				noBuildingInCategory = false;
				++numBuildings;
				if(numBuildings > 8) {
					categoryUI = new gui_GUIContainer(city.gui,city.gui.innerWindowStage,city.gui.windowInner);
					categoryUI.direction = gui_GUIContainerDirection.Horizontal;
					city.gui.windowInner.addChild(categoryUI);
					numBuildings = 0;
				}
			}
		}
		if(noBuildingInCategory) {
			city.gui.windowInner.removeChild(topSpacing,false);
			city.gui.windowInner.removeChild(categoryUI,false);
			city.gui.windowInner.removeChild(ge,true);
		} else {
			isFirst = false;
		}
	}
	var extraSpacing = new gui_GUISpacing(city.gui.windowInner,new common_Point(2,6));
	city.gui.windowInner.addChild(extraSpacing);
	city.gui.windowAddBottomButtons();
};
