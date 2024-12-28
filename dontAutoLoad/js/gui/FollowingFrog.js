var gui_FollowingFrog = $hxClasses["gui.FollowingFrog"] = function() { };
gui_FollowingFrog.__name__ = "gui.FollowingFrog";
gui_FollowingFrog.createWindow = function(city,frog,clearWindowStack) {
	if(clearWindowStack == null) {
		clearWindowStack = true;
	}
	if(clearWindowStack) {
		city.gui.clearWindowStack();
	}
	city.gui.createWindow(frog);
	city.gui.setWindowPositioning(city.game.isMobile ? gui_WindowPosition.TopLeft : gui_WindowPosition.Top);
	var city1 = city;
	var frog1 = frog;
	var clearWindowStack1 = clearWindowStack;
	var tmp = function() {
		gui_FollowingFrog.createWindow(city1,frog1,clearWindowStack1);
	};
	city.gui.setWindowReload(tmp);
	var city2 = city;
	var frog2 = frog;
	var clearWindowStack2 = clearWindowStack;
	var tmp = function() {
		gui_FollowingFrog.createWindow(city2,frog2,clearWindowStack2);
	};
	city.gui.addWindowToStack(tmp);
	var windowTitle = common_Localize.lo("following_frog");
	city.gui.windowAddTitleText(windowTitle);
	city.gui.windowAddBottomButtons();
	city.viewIsControlled = true;
	var selectedSprite = Resources.makeSprite("spr_selectedfish");
	selectedSprite.anchor.set(0.5,0.5);
	city.furtherForegroundStage.addChild(selectedSprite);
	city.gui.windowOnLateUpdate = function() {
		if(frog.destroyed) {
			gui_FollowingFrog.onFrogDie(city,frog,windowTitle);
			return;
		}
		var citizenPos = frog.getCityPosition();
		city.viewPos = new common_FPoint(citizenPos.x,citizenPos.y);
		selectedSprite.position.set(citizenPos.x,citizenPos.y);
		city.cityView.updateMovingView();
	};
	city.gui.windowOnDestroy = function() {
		city.viewIsControlled = false;
		city.cityView.isDraggingView = false;
		selectedSprite.destroy();
	};
	city.viewPos = frog.getCityPosition();
	city.cityView.updateMovingView();
	common_Achievements.achieve("FOLLOW_FROG");
};
gui_FollowingFrog.onFrogDie = function(city,frog,windowTitle) {
	city.gui.clearWindowStack();
	city.gui.closeWindow();
	city.gui.createWindow();
	city.gui.windowAddTitleText(windowTitle);
	city.gui.windowInner.addChild(new gui_TextElement(city.gui.windowInner,city.gui.innerWindowStage,common_Localize.lo("cant_find_frog")));
	city.gui.windowAddBottomButtons();
};
