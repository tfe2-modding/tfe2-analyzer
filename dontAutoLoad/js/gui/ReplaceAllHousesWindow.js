var gui_ReplaceAllHousesWindow = $hxClasses["gui.ReplaceAllHousesWindow"] = function() { };
gui_ReplaceAllHousesWindow.__name__ = "gui.ReplaceAllHousesWindow";
gui_ReplaceAllHousesWindow.create = function(city,gui,stage,$window) {
	gui_ReplaceAllHousesWindow.createWindow(city,gui,stage,$window);
};
gui_ReplaceAllHousesWindow.createWindow = function(city,gui,stage,$window) {
	$window.clear();
	gui.windowAddTitleText(common_Localize.lo("upgrade_basic_houses"));
	gui.windowAddInfoText(common_Localize.lo("upgrade_basic_houses_hint"));
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,2)));
	var allTypesDisplay = new gui_GUIContainer(gui,stage,$window);
	allTypesDisplay.direction = gui_GUIContainerDirection.Horizontal;
	gui.windowInner.addChild(allTypesDisplay);
	var buildingsInDisplay = 0;
	var _g = 0;
	var _g1 = city.progress.resources.buildingInfoArray;
	while(_g < _g1.length) {
		var building = [_g1[_g]];
		++_g;
		var name = "buildings." + building[0].className;
		var classToBuild = $hxClasses[name];
		var unlockState = city.progress.unlocks.getUnlockState(classToBuild);
		var sprName = Reflect.field(classToBuild,"spriteName");
		if(building[0].category == "Houses" && (unlockState == progress_UnlockState.Unlocked && building[0].showUnlockHint == null || unlockState == progress_UnlockState.Researched || unlockState == progress_UnlockState.Createable) && building[0].specialInfo.indexOf("rooftop") == -1 && building[0].residents != null && building[0].className != "NormalHouse") {
			++buildingsInDisplay;
			if(buildingsInDisplay > 9) {
				allTypesDisplay = new gui_GUIContainer(gui,stage,$window);
				allTypesDisplay.direction = gui_GUIContainerDirection.Horizontal;
				gui.windowInner.addChild(allTypesDisplay);
				buildingsInDisplay = 0;
			}
			var buildingButton = [];
			var buildingButton1 = buildingButton;
			var gui1 = gui;
			var createReplaceHousesStep2 = [null];
			createReplaceHousesStep2[0] = (function(createReplaceHousesStep2,building) {
				return function() {
					city.gui.createWindow($window);
					gui_ReplaceAllHousesWindowStep2.create(city,city.gui,city.gui.innerWindowStage,city.gui.windowInner,building[0]);
					city.gui.addWindowToStack(createReplaceHousesStep2[0]);
				};
			})(createReplaceHousesStep2,building);
			buildingButton1[0] = new gui_ImageButton(gui1,stage,allTypesDisplay,createReplaceHousesStep2[0],Resources.getTexture("" + sprName + "@0,0,20,20"),(function() {
				return function() {
					return false;
				};
			})(),(function(buildingButton,building) {
				return function() {
					gui.tooltip.setText(buildingButton[0],building[0].name);
				};
			})(buildingButton,building),building[0].buttonBack == "none" ? null : Resources.getTexture(building[0].buttonBack == null ? "" + sprName + "@44,0,20,20" : building[0].buttonBack));
			allTypesDisplay.addChild(buildingButton[0]);
		}
	}
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
	gui.windowAddBottomButtons();
};
