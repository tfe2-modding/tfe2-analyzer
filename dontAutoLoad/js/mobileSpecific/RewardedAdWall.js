var mobileSpecific_RewardedAdWall = $hxClasses["mobileSpecific.RewardedAdWall"] = function() { };
mobileSpecific_RewardedAdWall.__name__ = "mobileSpecific.RewardedAdWall";
mobileSpecific_RewardedAdWall.rewardedOrPremiumGate = function(gui,tryText,completeKey,unlockTime,onComplete) {
	if(Config.hasPremium()) {
		onComplete();
	} else {
		var onHasAdwallInfo = function() {
			if(mobileSpecific_RewardedAdWall.adWallInfo.h[completeKey] != null && new Date().getTime() < mobileSpecific_RewardedAdWall.adWallInfo.h[completeKey]) {
				onComplete();
			} else {
				mobileSpecific_RewardedAdWall.showAdWall(gui,tryText,completeKey,unlockTime,onComplete);
			}
		};
		if(mobileSpecific_RewardedAdWall.adWallInfo != null) {
			onHasAdwallInfo();
		} else {
			common_Storage.getItem("tfe2_adwalls",function(err,saved) {
				if(err != null || saved == null) {
					mobileSpecific_RewardedAdWall.adWallInfo = new haxe_ds_StringMap();
				} else {
					mobileSpecific_RewardedAdWall.adWallInfo = haxe_Unserializer.run(saved);
				}
				onHasAdwallInfo();
			});
		}
	}
};
mobileSpecific_RewardedAdWall.showAdWall = function(gui,tryText,completeKey,unlockTime,onComplete) {
	gui.createWindow();
	gui.windowAddInfoText(tryText);
	var getPremiumButton = new gui_TextButton(gui,gui.innerWindowStage,gui.windowInner,function() {
		gui_infoWindows_StoreInfo.createWindow(gui);
	},common_Localize.lo("get_premium"));
	gui.windowInner.addChild(getPremiumButton);
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	var watchAdButton = new gui_TextButton(gui,gui.innerWindowStage,gui.windowInner,function() {
		common_AdHelper.showRewardedInterstitial(function() {
			Analytics.sendEventFirebase("rewarded_complete","rewarded_type",completeKey);
			var endTime = new Date().getTime() + unlockTime * 60 * 1000;
			mobileSpecific_RewardedAdWall.adWallInfo.h[completeKey] = endTime;
			var str = haxe_Serializer.run(mobileSpecific_RewardedAdWall.adWallInfo);
			common_Storage.setItem("tfe2_adwalls",str,function() {
			});
			onComplete();
		},function() {
			gui.showSimpleWindow(common_Localize.lo("ad_failed_to_load"),"",true);
		},false);
	},common_Localize.lo("watch_ad_temp_unlock"));
	gui.windowInner.addChild(watchAdButton);
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
	gui.windowAddBottomButtons();
	getPremiumButton.fillWidth();
	watchAdButton.fillWidth();
};
