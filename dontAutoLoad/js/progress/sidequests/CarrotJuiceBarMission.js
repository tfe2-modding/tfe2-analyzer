var progress_sidequests_CarrotJuiceBarMission = $hxClasses["progress.sidequests.CarrotJuiceBarMission"] = function(city,sidequests) {
	progress_Sidequest.call(this,city,sidequests);
};
progress_sidequests_CarrotJuiceBarMission.__name__ = "progress.sidequests.CarrotJuiceBarMission";
progress_sidequests_CarrotJuiceBarMission.__super__ = progress_Sidequest;
progress_sidequests_CarrotJuiceBarMission.prototype = $extend(progress_Sidequest.prototype,{
	start: function() {
		this.sideQuests.showSidequestDialog(common_Localize.lo("carrotjuice_sidequests_title"),common_Localize.lo("carrotjuice_sidequests_description"));
	}
	,update: function(timeMod) {
	}
	,onComplete: function() {
		this.sideQuests.showSidequestFinishedDialog(common_Localize.lo("sidequest_complete") + " " + common_Localize.lo("carrotjuice_sidequests_title"),common_Localize.lo("carrotjuice_sidequests_finish_description"));
		this.city.simulation.happiness.addBoost(simulation_HappinessBoost.withDuration(this.city.simulation.time,7200,10,common_Localize.lo("citizen_gratefulness_bonus")));
	}
	,getGoalHelp: function() {
		return { category : common_Localize.lo("carrotjuice_sidequests_title"), text : common_Localize.lo("carrotjuice_sidequests_quickDescription")};
	}
	,canStart: function() {
		if(this.city.simulation.citizens.length > 50 && this.city.progress.unlocks.getUnlockState(buildings_Pub) != progress_UnlockState.Locked) {
			return this.city.simulation.happiness.happiness > 50;
		} else {
			return false;
		}
	}
	,__class__: progress_sidequests_CarrotJuiceBarMission
});
