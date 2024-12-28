var mobileSpecific_Premium = $hxClasses["mobileSpecific.Premium"] = function() { };
mobileSpecific_Premium.__name__ = "mobileSpecific.Premium";
mobileSpecific_Premium.init = function(game,onDone) {
	var onDone2 = function() {
		CordovaStore.setHasProductCallback(function(purchaseID) {
			mobileSpecific_Premium.savedPurchases.h[purchaseID] = true;
			if(purchaseID == "premium") {
				mobileSpecific_Premium.premiumInfoLoadedStore = true;
			}
			if(purchaseID == "full_version_pass") {
				mobileSpecific_Premium.premiumInfoLoadedStorePass = true;
			}
		},function(purchases) {
			if(game.state != null && game.state.get_publicGUI() != null && purchases.indexOf("full_version_pass") == -1) {
				var onDone2 = game.state.get_publicGUI();
				var onDone21 = common_Localize.lo("thanks_very_much") + " ";
				var f = mobileSpecific_Premium.getBoughtText;
				var result = new Array(purchases.length);
				var _g = 0;
				var _g1 = purchases.length;
				while(_g < _g1) {
					var i = _g++;
					result[i] = f(purchases[i]);
				}
				onDone2.showSimpleWindow(onDone21 + result.join(" "),null,true);
				if(((game.state.get_publicGUI()) instanceof gui_CityGUI)) {
					var cityGUI = game.state.get_publicGUI();
					cityGUI.pauseForWindow();
				}
			}
		},function() {
			mobileSpecific_Premium.save();
		},function(purchaseID) {
			mobileSpecific_Premium.savedPurchases.h[purchaseID] = false;
			if(purchaseID == "premium") {
				mobileSpecific_Premium.premiumInfoLoadedStore = true;
			}
			if(purchaseID == "full_version_pass") {
				mobileSpecific_Premium.premiumInfoLoadedStorePass = true;
			}
			mobileSpecific_Premium.save();
		});
	};
	if(5 != 8) {
		mobileSpecific_Premium.premiumInfoLoaded = true;
		onDone();
		return;
	}
	common_Storage.getItem("tfe2_iap",function(err,theSave) {
		if(err == null && theSave != null && typeof(theSave) == "string") {
			mobileSpecific_Premium.savedPurchases = haxe_Unserializer.run(theSave);
		}
		mobileSpecific_Premium.premiumInfoLoaded = true;
		onDone();
		onDone2();
	});
};
mobileSpecific_Premium.getBoughtText = function(productName) {
	switch(productName) {
	case "premium":
		return common_Localize.lo("premium_activated");
	case "premium_upgrade":
		return common_Localize.lo("premium_upgrade_activated");
	case "remove_ads":
		return common_Localize.lo("remove_ads_activated");
	default:
		return "";
	}
};
mobileSpecific_Premium.save = function() {
	common_Storage.setItem("tfe2_iap",haxe_Serializer.run(mobileSpecific_Premium.savedPurchases),function() {
	});
};
mobileSpecific_Premium.hasSpecific = function(productName) {
	return mobileSpecific_Premium.savedPurchases.h[productName] == true;
};
mobileSpecific_Premium.has = function(productName) {
	switch(productName) {
	case "premium":
		if(!(mobileSpecific_Premium.hasSpecific("premium") || mobileSpecific_Premium.hasSpecific("premium_upgrade"))) {
			return mobileSpecific_Premium.hasSpecific("full_version_pass");
		} else {
			return true;
		}
		break;
	case "remove_ads":
		if(!(mobileSpecific_Premium.hasSpecific("remove_ads") || mobileSpecific_Premium.hasSpecific("premium") || mobileSpecific_Premium.hasSpecific("premium_upgrade"))) {
			return mobileSpecific_Premium.hasSpecific("full_version_pass");
		} else {
			return true;
		}
		break;
	default:
		return false;
	}
};
