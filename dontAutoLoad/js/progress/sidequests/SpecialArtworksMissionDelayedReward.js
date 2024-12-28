var progress_sidequests_SpecialArtworksMissionDelayedReward = $hxClasses["progress.sidequests.SpecialArtworksMissionDelayedReward"] = function(city,sidequests) {
	progress_Sidequest.call(this,city,sidequests);
};
progress_sidequests_SpecialArtworksMissionDelayedReward.__name__ = "progress.sidequests.SpecialArtworksMissionDelayedReward";
progress_sidequests_SpecialArtworksMissionDelayedReward.__super__ = progress_Sidequest;
progress_sidequests_SpecialArtworksMissionDelayedReward.prototype = $extend(progress_Sidequest.prototype,{
	get_isInstant: function() {
		return true;
	}
	,start: function() {
	}
	,onComplete: function() {
		var prevSidequest = this.city.progress.sideQuests.findCompletedSidequestWithType(progress_sidequests_SpecialArtworksMission);
		if(prevSidequest != null) {
			this.sideQuests.showSidequestFinishedDialog(common_Localize.lo("specialartworks_sidequest_title"),common_Localize.lo("specialartworksdelayedreward_description",[prevSidequest.associatedCitizen]));
		}
		this.city.simulation.happiness.addBoost(simulation_HappinessBoost.withDuration(this.city.simulation.time,7200,10,common_Localize.lo("citizen_gratefulness_bonus")));
	}
	,canStart: function() {
		if(this.city.simulation.citizens.length > 150 && this.city.progress.sideQuests.findCompletedSidequestWithType(progress_sidequests_SpecialArtworksMission) != null && this.city.progress.sideQuests.findCompletedSidequestWithType(progress_sidequests_SpecialArtworksMission).completionTime + 43200 < this.city.simulation.time.timeSinceStart) {
			return common_ArrayExtensions.any(this.city.permanents,function(p) {
				if(p.is(buildings_ModernArtMuseum)) {
					return p.currentTexture == -1;
				} else {
					return false;
				}
			});
		} else {
			return false;
		}
	}
	,__class__: progress_sidequests_SpecialArtworksMissionDelayedReward
});
