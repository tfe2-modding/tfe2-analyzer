var common_MobileApplicationLifecycleManager = $hxClasses["common.MobileApplicationLifecycleManager"] = function() { };
common_MobileApplicationLifecycleManager.__name__ = "common.MobileApplicationLifecycleManager";
common_MobileApplicationLifecycleManager.update = function(timeMod) {
	common_MobileApplicationLifecycleManager.lastPlannedUnfocusOn -= timeMod;
};
common_MobileApplicationLifecycleManager.shouldShowPause = function() {
	return common_MobileApplicationLifecycleManager.lastPlannedUnfocusOn < 0;
};
common_MobileApplicationLifecycleManager.registerPlannedFocusLoss = function() {
	common_MobileApplicationLifecycleManager.lastPlannedUnfocusOn = 300;
};
