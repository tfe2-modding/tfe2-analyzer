var gui_CreditsWindow = $hxClasses["gui.CreditsWindow"] = function() { };
gui_CreditsWindow.__name__ = "gui.CreditsWindow";
gui_CreditsWindow.create = function(city,gui,stage,$window) {
	gui.windowAddTitleText(common_Localize.lo("credits"));
	$window.addChild(new gui_TextElement($window,stage,common_Localize.lo("game_by"),null,"Arial15"));
	$window.addChild(new gui_TextElement($window,stage,common_Localize.lo("music_by"),null,"Arial15"));
	$window.addChild(new gui_GUISpacing($window,new common_Point(2,6)));
	var localization_lo = common_Localize.lo("localized_by");
	if(localization_lo != "") {
		$window.addChild(new gui_TextElement($window,stage,common_Localize.lo("localized_by"),null,"Arial"));
		$window.addChild(new gui_GUISpacing($window,new common_Point(2,6)));
	}
	if(5 == 4) {
		$window.addChild(new gui_TextElement($window,stage,"Big thanks to CoolMath Games for their sponsorship!",null,"Arial"));
		$window.addChild(new gui_GUISpacing($window,new common_Point(2,6)));
	} else {
		var tmp = Main.isMobile;
	}
	$window.addChild(new gui_TextElement($window,stage,common_Localize.lo("credits_additional_sprites"),null,"Arial"));
	$window.addChild(new gui_TextElement($window,stage,common_Localize.lo("early_feedback"),null,"Arial"));
	$window.addChild(new gui_TextElement($window,stage,"Rocket launch sound: sandyrb (CC BY 4.0)",null,"Arial"));
	$window.addChild(new gui_GUISpacing($window,new common_Point(2,6)));
	$window.addChild(new gui_TextElement($window,stage,common_Localize.lo("credits_software"),null,"Arial15"));
	$window.addChild(new gui_TextElement($window,stage,common_Localize.lo("credits_software_1"),null,"Arial"));
	$window.addChild(new gui_TextElement($window,stage,common_Localize.lo("credits_software_2"),null,"Arial"));
	$window.addChild(new gui_TextElement($window,stage,"FileSaver.js; localForage; canvas-toBlob.js;",null,"Arial"));
	$window.addChild(new gui_TextElement($window,stage,"polygonal-ds; thx.color; pixi-sound",null,"Arial"));
	$window.addChild(new gui_GUISpacing($window,new common_Point(2,6)));
	$window.addChild(new gui_TextElement($window,stage,common_Localize.lo("thanks_for_playing"),null,"Arial"));
	if(5 == 4) {
		$window.addChild(new gui_TextElement($window,stage,"While you're here on CoolMath Games, also check out my other games circloO 1 & 2 and Stop the Darkness!",null,"Arial"));
	}
	if(Config.get_enableCrossPromo() && jsFunctions.crossPromoInited()) {
		var useFallBack = false;
		gui.windowAddBottomButtons([{ text : "Play More Games!", action : function() {
			jsFunctions.showCrossPromoDisplay(useFallBack);
		}}]);
	} else {
		gui.windowAddBottomButtons();
	}
};
