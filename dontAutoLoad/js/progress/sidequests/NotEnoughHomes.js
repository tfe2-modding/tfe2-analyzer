var progress_sidequests_NotEnoughHomes = $hxClasses["progress.sidequests.NotEnoughHomes"] = function(city,sidequests) {
	progress_Sidequest.call(this,city,sidequests);
};
progress_sidequests_NotEnoughHomes.__name__ = "progress.sidequests.NotEnoughHomes";
progress_sidequests_NotEnoughHomes.__super__ = progress_Sidequest;
progress_sidequests_NotEnoughHomes.prototype = $extend(progress_Sidequest.prototype,{
	start: function() {
		this.sideQuests.showSidequestDialog(common_Localize.lo("homes_sidequest_title"),common_Localize.lo("homes_sidequest_description"));
	}
	,update: function(timeMod) {
		if(this.city.simulation.stats.peopleWithHome >= this.city.simulation.stats.people) {
			this.sideQuests.completeSidequest(this);
			this.sideQuests.showSidequestFinishedDialog(common_Localize.lo("sidequest_complete") + " " + common_Localize.lo("homes_sidequest_title"),common_Localize.lo("homes_sidequest_finish_description"));
			this.city.simulation.happiness.addBoost(simulation_HappinessBoost.withDuration(this.city.simulation.time,4320,10,common_Localize.lo("citizen_gratefulness_bonus")));
		}
	}
	,getGoalHelp: function() {
		return { category : common_Localize.lo("homes_sidequest_title"), text : common_Localize.lo("homes_sidequest_quickDescription")};
	}
	,canStart: function() {
		if(this.city.simulation.citizens.length < 100 && this.city.simulation.stats.peopleWithHome <= this.city.simulation.stats.people - 10) {
			return this.city.materials.food > 2;
		} else {
			return false;
		}
	}
	,__class__: progress_sidequests_NotEnoughHomes
});
