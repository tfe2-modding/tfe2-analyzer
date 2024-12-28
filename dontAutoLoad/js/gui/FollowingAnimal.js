var gui_FollowingAnimal = $hxClasses["gui.FollowingAnimal"] = function() { };
gui_FollowingAnimal.__name__ = "gui.FollowingAnimal";
gui_FollowingAnimal.createWindow = function(city,animal,clearWindowStack) {
	if(clearWindowStack == null) {
		clearWindowStack = true;
	}
	if(clearWindowStack) {
		city.gui.clearWindowStack();
	}
	city.gui.createWindow(animal);
	city.gui.setWindowPositioning(city.game.isMobile ? gui_WindowPosition.TopLeft : gui_WindowPosition.Top);
	var city1 = city;
	var animal1 = animal;
	var clearWindowStack1 = clearWindowStack;
	var tmp = function() {
		gui_FollowingAnimal.createWindow(city1,animal1,clearWindowStack1);
	};
	city.gui.setWindowReload(tmp);
	var city2 = city;
	var animal2 = animal;
	var clearWindowStack2 = clearWindowStack;
	var tmp = function() {
		gui_FollowingAnimal.createWindow(city2,animal2,clearWindowStack2);
	};
	city.gui.addWindowToStack(tmp);
	var windowTitle = common_Localize.lo("following_animal");
	city.gui.windowAddTitleText(windowTitle);
	city.gui.windowAddBottomButtons();
	city.viewIsControlled = true;
	var selectedSprite = Resources.makeSprite("spr_selectedfish");
	selectedSprite.anchor.set(0.5,1);
	city.furtherForegroundStage.addChild(selectedSprite);
	city.gui.windowOnLateUpdate = function() {
		if(animal.destroyed) {
			gui_FollowingAnimal.onanimalDie(city,animal,windowTitle);
			return;
		}
		var citizenPos = animal.getCityPosition();
		city.viewPos = new common_FPoint(citizenPos.x,citizenPos.y);
		selectedSprite.position.set(citizenPos.x,citizenPos.y);
		city.cityView.updateMovingView();
	};
	city.gui.windowOnDestroy = function() {
		city.viewIsControlled = false;
		city.cityView.isDraggingView = false;
		selectedSprite.destroy();
	};
	var point = animal.getCityPosition();
	var tmp = new common_FPoint(point.x,point.y);
	city.viewPos = tmp;
	city.cityView.updateMovingView();
};
gui_FollowingAnimal.onanimalDie = function(city,animal,windowTitle) {
	city.gui.clearWindowStack();
	city.gui.closeWindow();
	city.gui.createWindow();
	city.gui.windowAddTitleText(windowTitle);
	city.gui.windowInner.addChild(new gui_TextElement(city.gui.windowInner,city.gui.innerWindowStage,common_Localize.lo("cant_find_animal")));
	city.gui.windowAddBottomButtons();
};
