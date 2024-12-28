var gui_FollowingFish = $hxClasses["gui.FollowingFish"] = function() { };
gui_FollowingFish.__name__ = "gui.FollowingFish";
gui_FollowingFish.createWindow = function(city,fish,clearWindowStack) {
	if(clearWindowStack == null) {
		clearWindowStack = true;
	}
	if(clearWindowStack) {
		city.gui.clearWindowStack();
	}
	city.gui.createWindow(fish);
	city.gui.setWindowPositioning(city.game.isMobile ? gui_WindowPosition.TopLeft : gui_WindowPosition.Top);
	var city1 = city;
	var fish1 = fish;
	var clearWindowStack1 = clearWindowStack;
	var tmp = function() {
		gui_FollowingFish.createWindow(city1,fish1,clearWindowStack1);
	};
	city.gui.setWindowReload(tmp);
	var city2 = city;
	var fish2 = fish;
	var clearWindowStack2 = clearWindowStack;
	var tmp = function() {
		gui_FollowingFish.createWindow(city2,fish2,clearWindowStack2);
	};
	city.gui.addWindowToStack(tmp);
	var windowTitle = common_Localize.lo("following_fish");
	city.gui.windowAddTitleText(windowTitle);
	city.gui.windowAddBottomButtons();
	city.viewIsControlled = true;
	var selectedSprite = Resources.makeSprite("spr_selectedfish");
	selectedSprite.anchor.set(0.5,0.5);
	city.furtherForegroundStage.addChild(selectedSprite);
	city.gui.windowOnLateUpdate = function() {
		if(fish.destroyed) {
			gui_FollowingFish.onFishDie(city,fish,windowTitle);
			return;
		}
		var citizenPos = fish.getCityPosition();
		city.viewPos = new common_FPoint(citizenPos.x,citizenPos.y);
		selectedSprite.position.set(citizenPos.x,citizenPos.y);
		city.cityView.updateMovingView();
	};
	city.gui.windowOnDestroy = function() {
		city.viewIsControlled = false;
		city.cityView.isDraggingView = false;
		selectedSprite.destroy();
	};
	var point = fish.getCityPosition();
	var tmp = new common_FPoint(point.x,point.y);
	city.viewPos = tmp;
	city.cityView.updateMovingView();
	common_Achievements.achieve("FOLLOW_FISH");
};
gui_FollowingFish.onFishDie = function(city,fish,windowTitle) {
	city.gui.clearWindowStack();
	city.gui.closeWindow();
	city.gui.createWindow();
	city.gui.windowAddTitleText(windowTitle);
	city.gui.windowInner.addChild(new gui_TextElement(city.gui.windowInner,city.gui.innerWindowStage,common_Localize.lo("cant_find_fish")));
	city.gui.windowAddBottomButtons();
};
