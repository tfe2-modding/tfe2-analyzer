var common_AdHelper = $hxClasses["common.AdHelper"] = function() { };
common_AdHelper.__name__ = "common.AdHelper";
common_AdHelper.init = function(game) {
	var tmp = null;
	common_AdHelper.provider = tmp;
	if(5 == 6) {
		common_AdHelper.adExpireTime = 0;
	} else if(5 == 9) {
		common_AdHelper.adExpireTime = 0;
	} else if(5 == 7) {
		common_AdHelper.adExpireTime = common_AdHelper.standardAdExpireTime;
		common_AdHelper.adCapRemaining = 3;
	} else if(5 == 8) {
		common_AdHelper.adExpireTime = 7200;
	}
};
common_AdHelper.prepare = function(afterPrepare) {
	afterPrepare();
};
common_AdHelper.afterSettingConsent = function() {
	common_AdHelper.provider.afterSettingConsent();
};
common_AdHelper.update = function(timeMod) {
	if(common_AdHelper.adExpireTime >= 0) {
		common_AdHelper.adExpireTime -= timeMod;
	}
	if(Config.isMoreAdsTest) {
		common_AdHelper.adExpireTime = -1;
	}
	if(common_AdHelper.adExpireTimeRewarded >= 0) {
		common_AdHelper.adExpireTimeRewarded -= timeMod;
	}
	if(common_AdHelper.initialWaitTime >= 0) {
		if(common_AdHelper.afterPrepareFunction != null && common_AdHelper.showEUConsent >= 0 && mobileSpecific_Premium.premiumInfoLoadedStore && mobileSpecific_Premium.premiumInfoLoadedStorePass) {
			if(Config.hasPremium()) {
				common_AdHelper.showEUConsent = 0;
			}
			common_AdHelper.afterPrepareFunction();
			common_AdHelper.afterPrepareFunction = null;
			common_AdHelper.initialWaitTime = -1;
			return;
		}
		common_AdHelper.initialWaitTime -= timeMod;
		if(common_AdHelper.initialWaitTime < 0 && common_AdHelper.afterPrepareFunction != null) {
			if(Config.hasPremium()) {
				common_AdHelper.showEUConsent = 0;
			}
			common_AdHelper.afterPrepareFunction();
			common_AdHelper.afterPrepareFunction = null;
		}
	}
};
common_AdHelper.cityUpdate = function(city,mouse) {
};
common_AdHelper.adAvailableInterstitial = function() {
	return common_AdHelper.provider.adAvailableInterstitial();
};
common_AdHelper.adAvailableRewarded = function() {
	if(common_AdHelper.provider.adAvailableRewarded() && common_AdHelper.adExpireTimeRewarded <= 0) {
		return false;
	} else {
		return false;
	}
};
common_AdHelper.showRewardedInterstitial = function(onDone,onFail,skipIfRemoveAds) {
	if(skipIfRemoveAds == null) {
		skipIfRemoveAds = false;
	}
	var failCalled = false;
	var failFunction = function() {
		if(failCalled) {
			return;
		}
		failCalled = true;
		common_AdHelper.adExpireTime = -1;
		common_AdHelper.adExpireTimeRewarded = -1;
		onFail();
	};
	common_AdHelper.adExpireTimeRewarded += common_AdHelper.minTimeBetweenRewarded;
	var result = common_AdHelper.provider.showRewardedInterstitial(onDone,failFunction);
	if(!result) {
		failFunction();
	}
	common_AdHelper.adExpireTime = Math.min(Math.max(common_AdHelper.adExpireTime,common_AdHelper.minTimeBetweenRewarded),common_AdHelper.standardAdExpireTime);
};
common_AdHelper.showNonRewardedInterstitialAlways = function() {
	if(Config.hasRemoveAds()) {
		return;
	}
	if(common_AdHelper.provider == null) {
		return;
	}
	if(common_AdHelper.provider.showNonRewardedInterstitialIfAllowed()) {
		common_AdHelper.adExpireTime += common_AdHelper.standardAdExpireTime;
		common_AdHelper.noAdShown = false;
	}
};
common_AdHelper.showNonRewardedInterstitialIfAllowed = function(alsoIfFirst) {
	if(alsoIfFirst == null) {
		alsoIfFirst = false;
	}
	if(Config.hasRemoveAds()) {
		return;
	}
	if(common_AdHelper.provider == null) {
		return;
	}
	if(common_AdHelper.adExpireTime <= 0 || common_AdHelper.noAdShown && alsoIfFirst) {
		if(common_AdHelper.provider.showNonRewardedInterstitialIfAllowed()) {
			common_AdHelper.adExpireTime += common_AdHelper.standardAdExpireTime;
			common_AdHelper.noAdShown = false;
		}
	}
};
common_AdHelper.canShowBanner = function() {
	if(Config.hasRemoveAds()) {
		return false;
	}
	if(common_AdHelper.provider == null) {
		return false;
	}
	return common_AdHelper.provider.canShowBanner();
};
common_AdHelper.showBanner = function() {
	common_AdHelper.provider.showBanner();
};
common_AdHelper.hideBanner = function() {
	common_AdHelper.provider.hideBanner();
};
