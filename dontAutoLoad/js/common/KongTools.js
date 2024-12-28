var common_KongTools = $hxClasses["common.KongTools"] = function() { };
common_KongTools.__name__ = "common.KongTools";
common_KongTools.init = function() {
	jsFunctions.loadJS("site-specific/kong/quickKong.js",function() {
		try {
			QuickKong.doInitKong();
			common_KongTools.kongJSLoaded = true;
		} catch( _g ) {
		}
	});
};
common_KongTools.reportHappiness = function(happiness) {
	if(happiness > common_KongTools.highestHappinessKnown) {
		common_KongTools.highestHappinessKnown = happiness;
		common_KongTools.statTimeout = 60;
	}
	if(common_KongTools.statTimeout <= 0 && common_KongTools.highestHappinessKnown > common_KongTools.highestHappinessReported && common_KongTools.kongJSLoaded) {
		QuickKong.setStat("happiness",common_KongTools.highestHappinessKnown);
		common_KongTools.highestHappinessReported = common_KongTools.highestHappinessKnown;
		common_KongTools.statTimeout = 120;
	}
};
common_KongTools.setStat = function(statName,statAmount) {
	if(common_KongTools.kongJSLoaded) {
		QuickKong.setStat(statName,statAmount);
	}
};
common_KongTools.update = function() {
	if(common_KongTools.statTimeout > 0) {
		common_KongTools.statTimeout -= 1;
	}
};
