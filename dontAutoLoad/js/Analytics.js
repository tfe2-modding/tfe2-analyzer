var Analytics = $hxClasses["Analytics"] = function() { };
Analytics.__name__ = "Analytics";
Analytics.init = function() {
	if(!Analytics.enabled) {
		return;
	}
	if(window.document.location.hostname == "localhost" || window.document.location.hostname == "127.0.0.1") {
		console.log("FloatingSpaceCities/Analytics.hx:20:","game is running locally");
		Config.enableCheats = true;
		return;
	}
	jsFunctions.loadJS("https://www.googletagmanager.com/gtag/js?id=UA-48290579-2",function() {
		Analytics.ready = true;
		jsFunctions.initGA();
		Analytics.sendEvent("game","playVersion",null,"VERSION1.1",true);
		Analytics.sendEvent("game","playOnSite",null,window.location.hostname,true);
		var _g = 0;
		var _g1 = Analytics.capturedErrors;
		while(_g < _g1.length) {
			var err = _g1[_g];
			++_g;
			jsFunctions.gaSendError(err);
		}
		Analytics.capturedErrors = [];
	});
	Analytics.useAltEarlyGame = true;
	Analytics.didABTest = false;
	if(Analytics.useAltEarlyGame) {
		Config.earlyGameFix1 = true;
		Config.earlyGameFix2 = true;
	}
};
Analytics.sendErrorEvent = function(errorMessage) {
	if(Analytics.errorsReported > 3) {
		return;
	}
	Analytics.errorsReported++;
	if(5 == 5) {
		errorMessage = "STEAM " + errorMessage;
		if(errorMessage.indexOf("/mods/") != -1) {
			return;
		}
	}
	var request = new haxe_http_HttpJs("https://wagtailgames.com/TheFinalEarth2/thefinalearth2_error_reporter.php");
	request.setPostData(errorMessage);
	request.request(true);
};
Analytics.sendEventFirebase = function(eventName,actionName,actionValue) {
	if(Analytics.enabledFirebase) {
		try {
			MediationTest.logFirebase(eventName,actionName,actionValue);
		} catch( _g ) {
		}
	}
};
Analytics.sendEvent = function(category,action,value,label,nonInteraction) {
	if(nonInteraction == null) {
		nonInteraction = false;
	}
	if(label == null) {
		label = "";
	}
	if(!Analytics.ready) {
		return;
	}
	jsFunctions.gaSendEvent(category,action,label,value,nonInteraction);
};
Analytics.update = function(timeMod) {
	Analytics.sessionTime += timeMod / 60;
	if(Analytics.sessionTime > 1800. && !Analytics.reportedLongPlaytime) {
		common_Storage.getItem("lptReported",function(err,res) {
			if(err == null) {
				if(res != "reported") {
					common_Storage.setItem("lptReported","reported",function() {
						Analytics.sendEvent("playtime",Analytics.didABTest ? Analytics.useAltEarlyGame ? "altEarlyGame" : "standardEarlyGame" : "noABTest");
					});
				}
			}
		});
		Analytics.reportedLongPlaytime = true;
	}
};
