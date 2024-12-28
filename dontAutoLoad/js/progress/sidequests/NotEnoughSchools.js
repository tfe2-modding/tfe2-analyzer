var progress_sidequests_NotEnoughSchools = $hxClasses["progress.sidequests.NotEnoughSchools"] = function(city,sidequests) {
	progress_Sidequest.call(this,city,sidequests);
};
progress_sidequests_NotEnoughSchools.__name__ = "progress.sidequests.NotEnoughSchools";
progress_sidequests_NotEnoughSchools.__super__ = progress_Sidequest;
progress_sidequests_NotEnoughSchools.prototype = $extend(progress_Sidequest.prototype,{
	start: function() {
		this.sideQuests.showSidequestDialog(common_Localize.lo("school_sidequest_title"),common_Localize.lo("school_sidequest_description"));
	}
	,update: function(timeMod) {
		if(this.city.simulation.happiness.schoolHappiness >= 99.999) {
			this.sideQuests.completeSidequest(this);
			this.sideQuests.showSidequestFinishedDialog(common_Localize.lo("sidequest_complete") + " " + common_Localize.lo("school_sidequest_title"),common_Localize.lo("school_sidequest_finish_description"));
			this.city.simulation.happiness.addBoost(simulation_HappinessBoost.withDuration(this.city.simulation.time,4320,10,common_Localize.lo("citizen_gratefulness_bonus")));
		}
	}
	,getGoalHelp: function() {
		return { category : common_Localize.lo("school_sidequest_title"), text : common_Localize.lo("school_sidequest_quickDescription")};
	}
	,canStart: function() {
		if(this.city.simulation.citizens.length > 100 && this.city.simulation.happiness.schoolHappiness < 50) {
			return this.city.simulation.stats.children > 30;
		} else {
			return false;
		}
	}
	,__class__: progress_sidequests_NotEnoughSchools
});
