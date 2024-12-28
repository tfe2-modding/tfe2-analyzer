var gui_infoWindows_GDPRWindow = $hxClasses["gui.infoWindows.GDPRWindow"] = function() { };
gui_infoWindows_GDPRWindow.__name__ = "gui.infoWindows.GDPRWindow";
gui_infoWindows_GDPRWindow.createWindow = function(gui,changesApplyOnReload) {
	var bg = new PIXI.Graphics();
	bg.beginFill(2626656);
	bg.drawRect(0,0,gui.game.rect.width + 10,gui.game.rect.height + 10);
	bg.endFill();
	gui.stage.addChild(bg);
	gui.createWindow("gdpr_dialog",null,5);
	if(((gui) instanceof gui_CityGUI)) {
		var cityGUI = gui;
		cityGUI.pauseForWindow();
	}
	var gui1 = gui;
	var changesApplyOnReload1 = changesApplyOnReload;
	var tmp = function() {
		gui_infoWindows_GDPRWindow.createWindow(gui1,changesApplyOnReload1);
	};
	gui.setWindowReload(tmp);
	var gui2 = gui;
	var changesApplyOnReload2 = changesApplyOnReload;
	var tmp = function() {
		gui_infoWindows_GDPRWindow.createWindow(gui2,changesApplyOnReload2);
	};
	gui.addWindowToStack(tmp);
	gui.windowReloadOnResize = true;
	gui.windowCapturesAllInput = true;
	gui.windowCanBeClosed = false;
	gui.windowOnDestroy = function() {
		if(bg != null) {
			bg.destroy();
			bg = null;
		}
	};
	var val2 = gui.game.rect.width - 40;
	var ww = val2 < 300 ? val2 : 300;
	gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,common_Localize.lo("gdpr_description_1"),null,null,null,ww,true));
	gui.windowAddInfoTextClickable(function() {
		window.open("https://florianvanstrien.nl/TheFinalEarth2/privacy.html","_blank");
	},"[blue]" + common_Localize.lo("more_info"));
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,10)));
	gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,common_Localize.lo("gdpr_description_2"),null,null,null,ww,true));
	if(changesApplyOnReload) {
		gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,common_Localize.lo("changes_apply_on_reload"),null,null,null,ww,true));
	}
	var addedButtons = gui.windowAddBottomButtons([{ text : common_Localize.lo("gdpr_option_reject"), action : function() {
		Settings.euAdConsentStatus = 0;
		Settings.save();
		common_AdHelper.showEUConsent = 0;
		common_AdHelper.afterSettingConsent();
		gui.goPreviousWindow();
	}, buttonTexture : "spr_button_gray"}],common_Localize.lo("gdpr_option_accept"),function() {
		Settings.euAdConsentStatus = 1;
		common_AdHelper.showEUConsent = 0;
		Settings.save();
		common_AdHelper.afterSettingConsent();
		gui.goPreviousWindow();
	});
	var _g = 0;
	while(_g < addedButtons.length) {
		var button = addedButtons[_g];
		++_g;
		button.extraWidth = (gui.windowInner.rect.width / 2 | 0) - button.rect.width;
		button.setText();
	}
	addedButtons[0].bitmapText.set_tint(4210752);
	addedButtons[1].buttonPatch.tint = 8454016;
	addedButtons[1].buttonPatch.updateSprites();
};
