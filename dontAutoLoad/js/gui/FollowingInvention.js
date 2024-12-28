var gui_FollowingInvention = $hxClasses["gui.FollowingInvention"] = function() { };
gui_FollowingInvention.__name__ = "gui.FollowingInvention";
gui_FollowingInvention.createWindow = function(city,invention,clearWindowStack) {
	if(clearWindowStack == null) {
		clearWindowStack = true;
	}
	if(clearWindowStack) {
		city.gui.clearWindowStack();
	}
	city.gui.createWindow(invention);
	city.gui.setWindowPositioning(city.game.isMobile ? gui_WindowPosition.TopLeft : gui_WindowPosition.Top);
	var city1 = city;
	var invention1 = invention;
	var clearWindowStack1 = clearWindowStack;
	var tmp = function() {
		gui_FollowingInvention.createWindow(city1,invention1,clearWindowStack1);
	};
	city.gui.setWindowReload(tmp);
	var city2 = city;
	var invention2 = invention;
	var clearWindowStack2 = clearWindowStack;
	var tmp = function() {
		gui_FollowingInvention.createWindow(city2,invention2,clearWindowStack2);
	};
	city.gui.addWindowToStack(tmp);
	var windowTitle = common_Localize.lo("hacker_school_invention");
	city.gui.windowAddTitleText(windowTitle,null,Resources.getTexture("spr_hackers_bolt_icon"));
	invention.windowAddInfo(city.gui);
	city.gui.windowAddInfoText(null,function() {
		return common_Localize.lo("durability",[Math.floor(invention.lifetime / (60 / city.simulation.time.minutesPerTick))]);
	});
	city.gui.windowAddBottomButtons();
	city.viewIsControlled = true;
	var selectedSprite = Resources.makeSprite(invention.get_followingSprite());
	selectedSprite.anchor.set(0.5,1);
	city.furtherForegroundStage.addChild(selectedSprite);
	city.gui.windowOnLateUpdate = function() {
		if(invention.destroyed) {
			gui_FollowingInvention.onInventionDestroy(city,invention,windowTitle);
			return;
		}
		var citizenPos = invention.getCityPosition();
		city.viewPos = new common_FPoint(citizenPos.x,citizenPos.y);
		selectedSprite.position.set(citizenPos.x + invention.get_followingSpriteOffset(),citizenPos.y + 1);
		city.cityView.updateMovingView();
	};
	city.gui.windowOnDestroy = function() {
		city.viewIsControlled = false;
		city.cityView.isDraggingView = false;
		selectedSprite.destroy();
	};
	var point = invention.getCityPosition();
	var tmp = new common_FPoint(point.x,point.y);
	city.viewPos = tmp;
	city.cityView.updateMovingView();
};
gui_FollowingInvention.onInventionDestroy = function(city,invention,windowTitle) {
	city.gui.clearWindowStack();
	city.gui.closeWindow();
	city.gui.createWindow();
	city.gui.windowAddTitleText(windowTitle);
	city.gui.windowInner.addChild(new gui_TextElement(city.gui.windowInner,city.gui.innerWindowStage,common_Localize.lo("invention_no_longer_exists")));
	city.gui.windowAddBottomButtons();
};
