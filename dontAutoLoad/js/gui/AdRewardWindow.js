var gui_AdRewardWindow = $hxClasses["gui.AdRewardWindow"] = function() { };
gui_AdRewardWindow.__name__ = "gui.AdRewardWindow";
gui_AdRewardWindow.create = function(city,gui,stage,thisWindow,extraReward,specialBoostText) {
	city.gui.windowAddTitleText(Config.hasRemoveAds() ? common_Localize.lo("boost_activated") : common_Localize.lo("thank_you_ex"));
	thisWindow.addChild(new gui_TextElement(thisWindow,stage,common_Localize.lo("boost_activated_description"),null,"Arial"));
	thisWindow.addChild(new gui_GUISpacing(thisWindow,new common_Point(2,6)));
	if(Settings.language == "en") {
		thisWindow.addChild(new gui_TextElement(thisWindow,stage,extraReward.text,null,"Arial15"));
	}
	var rewardContainer = new gui_MaterialsDisplay(extraReward.materials);
	var rewardHolder = new gui_ContainerHolder(city.gui.windowInner,city.gui.innerWindowStage,rewardContainer);
	thisWindow.addChild(rewardHolder);
	if(specialBoostText != "") {
		thisWindow.addChild(new gui_GUISpacing(thisWindow,new common_Point(2,6)));
		gui.windowAddInfoText(specialBoostText);
	}
	gui.windowAddBottomButtons();
};
