var mobileSpecific_PremiumWall = $hxClasses["mobileSpecific.PremiumWall"] = function() { };
mobileSpecific_PremiumWall.__name__ = "mobileSpecific.PremiumWall";
mobileSpecific_PremiumWall.showPremiumWall = function(gui,relatedBuildingInfo,city) {
	gui.createWindow("premiumWall");
	var adLimit = 0;
	if(relatedBuildingInfo != null) {
		gui.windowAddTitleText(relatedBuildingInfo.name);
		var name = "buildings." + relatedBuildingInfo.className;
		var thisClass = $hxClasses[name];
		adLimit = city.progress.unlocks.getLimitedUnlockNumber(thisClass);
		if(adLimit == null) {
			adLimit = 0;
		}
	}
	gui.windowAddInfoText(adLimit > 0 ? common_Localize.lo("ad_watch_limited_exceeded") : common_Localize.lo("get_premium_to_unlock"));
	var watchAdButton = null;
	var getPremiumButton = new gui_TextButton(gui,gui.innerWindowStage,gui.windowInner,function() {
		gui_infoWindows_StoreInfo.createWindow(gui);
	},common_Localize.lo("get_premium"));
	gui.windowInner.addChild(getPremiumButton);
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	if(relatedBuildingInfo != null) {
		var numPerAd = mobileSpecific_PremiumWall.getLimitedUnlockNumberPerAdForBuilding(relatedBuildingInfo);
		if(numPerAd > 0) {
			var name = "buildings." + relatedBuildingInfo.className;
			var thisClass = $hxClasses[name];
			if(adLimit == 0) {
				gui.windowAddInfoText(common_Localize.lo("or_watch_ad_limited",[numPerAd]));
			}
			watchAdButton = new gui_TextButton(gui,gui.innerWindowStage,gui.windowInner,function() {
				if(5 == 8) {
					common_AdHelper.showRewardedInterstitial(function() {
						Analytics.sendEventFirebase("rewarded_complete","rewarded_type",relatedBuildingInfo.className);
						city.progress.unlocks.addLimitedUnlockNumber(thisClass,numPerAd);
						city.progress.unlocks.fullyUnlock(thisClass);
						city.gui.refreshCategoryBuildingsShown();
						city.progress.unlocks.checkBuildRelatedUnlocks();
						if(city.gui.window != null && city.gui.windowRelatedTo == "premiumWall") {
							city.gui.closeWindow();
						}
					},function() {
						gui.showSimpleWindow(common_Localize.lo("ad_failed_to_load"),"",true);
					},false);
				} else {
					city.progress.unlocks.addLimitedUnlockNumber(thisClass,numPerAd);
					city.progress.unlocks.fullyUnlock(thisClass);
					city.gui.refreshCategoryBuildingsShown();
					city.progress.unlocks.checkBuildRelatedUnlocks();
					if(city.gui.window != null && city.gui.windowRelatedTo == "premiumWall") {
						city.gui.closeWindow();
					}
				}
			},adLimit > 0 ? common_Localize.lo("watch_ad_more",[numPerAd]) : common_Localize.lo("watch_ad",[numPerAd]));
			gui.windowInner.addChild(watchAdButton);
			gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
		}
	}
	gui.windowAddBottomButtons();
	getPremiumButton.fillWidth();
	if(watchAdButton != null) {
		watchAdButton.fillWidth();
	}
};
mobileSpecific_PremiumWall.getLimitedUnlockNumberPerAdForBuilding = function(relatedBuildingInfo) {
	var numPerAd = 0;
	if(relatedBuildingInfo.className == "TrainStation") {
		numPerAd = 5;
	}
	if(relatedBuildingInfo.className == "LandingSiteTunnel") {
		numPerAd = 3;
	}
	if(relatedBuildingInfo.className == "SpaceShipTunnel") {
		numPerAd = 10;
	}
	return numPerAd;
};
