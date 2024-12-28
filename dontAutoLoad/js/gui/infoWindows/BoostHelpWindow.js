var gui_infoWindows_BoostHelpWindow = $hxClasses["gui.infoWindows.BoostHelpWindow"] = function() { };
gui_infoWindows_BoostHelpWindow.__name__ = "gui.infoWindows.BoostHelpWindow";
gui_infoWindows_BoostHelpWindow.createWindow = function(city,doBoost,clearWindowStack) {
	if(clearWindowStack == null) {
		clearWindowStack = true;
	}
	if(clearWindowStack) {
		city.gui.clearWindowStack();
	}
	city.gui.createWindow("boost");
	city.gui.clearWindowStack();
	var city1 = city;
	var doBoost1 = doBoost;
	var clearWindowStack1 = clearWindowStack;
	var tmp = function() {
		gui_infoWindows_BoostHelpWindow.createWindow(city1,doBoost1,clearWindowStack1);
	};
	city.gui.setWindowReload(tmp);
	var city2 = city;
	var doBoost2 = doBoost;
	var clearWindowStack2 = clearWindowStack;
	var tmp = function() {
		gui_infoWindows_BoostHelpWindow.createWindow(city2,doBoost2,clearWindowStack2);
	};
	city.gui.addWindowToStack(tmp);
	var windowTitle = common_Localize.lo("boost");
	city.gui.windowAddTitleText(windowTitle);
	city.gui.windowAddInfoText(common_Localize.lo("boost_use_case") + "\n" + common_Localize.lo("boost_earn_extra_reward"));
	var stage = city.gui.innerWindowStage;
	var parent = city.gui.windowInner;
	var getAmount = function() {
		return common_Localize.lo("boost");
	};
	var isActive = function() {
		return false;
	};
	var onHover = function() {
	};
	var textureName = "spr_icon_boost";
	var infoButton = new gui_ContainerButtonWithProgress(city.gui,stage,parent,doBoost,isActive,onHover,"spr_button",10526880,16777215,function() {
		return -1;
	});
	infoButton.container.fillSecondarySize = true;
	var extraSpacing = city.gui.game.isMobile ? 3 : 0;
	var extraSpacingText = 2;
	infoButton.container.padding = { left : 2 + extraSpacing, right : extraSpacing + 3, top : extraSpacing + 2, bottom : extraSpacing + 1};
	infoButton.container.updateSize();
	infoButton.container.addChild(new gui_ContainerHolder(infoButton.container,stage,new PIXI.Sprite(Resources.getTexture(textureName))));
	infoButton.container.addChild(new gui_TextElement(infoButton.container,stage,null,getAmount,"Arial15",{ left : 1 + extraSpacingText, right : 0, top : 2, bottom : 0}));
	parent.addChild(infoButton);
};
