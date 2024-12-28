var progress_MetaGame = $hxClasses["progress.MetaGame"] = function(onLoadComplete) {
	this.unlockedAll = false;
	var _gthis = this;
	common_Storage.getItem("progressFile",function(error,result) {
		if(error == null && result != null) {
			_gthis.scenarioTimes = result;
			if(5 == 1) {
				if(Object.prototype.hasOwnProperty.call(_gthis.scenarioTimes.h,"theLostShip")) {
					common_KongTools.setStat("binaryWontheLostShip",1);
				}
				if(Object.prototype.hasOwnProperty.call(_gthis.scenarioTimes.h,"multipleWorlds")) {
					common_KongTools.setStat("binaryWonmultipleWorlds",1);
				}
			}
		} else {
			_gthis.scenarioTimes = new haxe_ds_StringMap();
		}
		onLoadComplete();
	});
	common_Storage.getItem("unlockedAllScenarios",function(error,result) {
		if(error == null && result != null) {
			_gthis.unlockedAll = result;
		}
	});
};
progress_MetaGame.__name__ = "progress.MetaGame";
progress_MetaGame.prototype = {
	unlockAll: function() {
		this.unlockedAll = true;
		common_Storage.setItem("unlockedAllScenarios",true,function() {
		});
	}
	,winScenario: function(scenario,time) {
		if(!Object.prototype.hasOwnProperty.call(this.scenarioTimes.h,scenario) || this.scenarioTimes.h[scenario] > time) {
			this.scenarioTimes.h[scenario] = time;
			if(5 == 1) {
				common_KongTools.setStat("win" + scenario,time);
				common_KongTools.setStat("binaryWon" + scenario,1);
			}
			this.saveProgress();
		}
	}
	,getScenarioTime: function(scenario) {
		if(!Object.prototype.hasOwnProperty.call(this.scenarioTimes.h,scenario)) {
			return null;
		}
		return this.scenarioTimes.h[scenario];
	}
	,hasWonScenario: function(scenario) {
		return Object.prototype.hasOwnProperty.call(this.scenarioTimes.h,scenario);
	}
	,saveProgress: function() {
		common_Storage.setItem("progressFile",this.scenarioTimes,function() {
		});
	}
	,__class__: progress_MetaGame
};
