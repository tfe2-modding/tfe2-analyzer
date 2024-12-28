var gui_infoWindows_FindBuildingsOfTypeActive = $hxClasses["gui.infoWindows.FindBuildingsOfTypeActive"] = function() { };
gui_infoWindows_FindBuildingsOfTypeActive.__name__ = "gui.infoWindows.FindBuildingsOfTypeActive";
gui_infoWindows_FindBuildingsOfTypeActive.createWindow = function(city,buildingType,building,clearWindowStack) {
	if(clearWindowStack == null) {
		clearWindowStack = true;
	}
	if(clearWindowStack) {
		city.gui.clearWindowStack();
	}
	city.gui.createWindow(buildingType);
	city.gui.setWindowPositioning(city.game.isMobile ? gui_WindowPosition.TopLeft : gui_WindowPosition.Top);
	var city1 = city;
	var buildingType1 = buildingType;
	var building1 = building;
	var clearWindowStack1 = clearWindowStack;
	var tmp = function() {
		gui_infoWindows_FindBuildingsOfTypeActive.createWindow(city1,buildingType1,building1,clearWindowStack1);
	};
	city.gui.setWindowReload(tmp);
	var city2 = city;
	var buildingType2 = buildingType;
	var building2 = building;
	var clearWindowStack2 = clearWindowStack;
	var tmp = function() {
		gui_infoWindows_FindBuildingsOfTypeActive.createWindow(city2,buildingType2,building2,clearWindowStack2);
	};
	city.gui.addWindowToStack(tmp);
	var windowTitle = common_Localize.lo("highlighting",[building.name]);
	city.gui.windowAddTitleText(windowTitle);
	var addedButtons = city.gui.windowAddBottomButtons([{ text : common_Localize.lo("select_any"), action : function() {
		var foundBuilding = cityActions_CityHighlightBuildingsOfType.findLeastUpgraded(city,buildingType);
		if(foundBuilding != null) {
			foundBuilding.showWindow();
		}
	}}]);
	city.gui.windowOnLateUpdate = function() {
		cityActions_CityHighlightBuildingsOfType.doHighlight(city,buildingType);
	};
};
