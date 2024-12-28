var progress_sidequests_SecretLibraryMission = $hxClasses["progress.sidequests.SecretLibraryMission"] = function(city,sidequests) {
	progress_Sidequest.call(this,city,sidequests);
};
progress_sidequests_SecretLibraryMission.__name__ = "progress.sidequests.SecretLibraryMission";
progress_sidequests_SecretLibraryMission.__super__ = progress_Sidequest;
progress_sidequests_SecretLibraryMission.prototype = $extend(progress_Sidequest.prototype,{
	get_tag: function() {
		return "SecretSociety";
	}
	,start: function() {
		this.sideQuests.showSidequestDialog(common_Localize.lo("secret_library_title"),common_Localize.lo("secret_library_description"));
	}
	,update: function(timeMod) {
	}
	,onComplete: function() {
		this.sideQuests.showSidequestFinishedDialog(common_Localize.lo("sidequest_complete") + " " + common_Localize.lo("secret_library_title"),common_Localize.lo("secret_library_finish_description"));
	}
	,getGoalHelp: function() {
		return { category : common_Localize.lo("secret_library_title"), text : common_Localize.lo("secret_library_quickDescription")};
	}
	,canStart: function() {
		if(this.city.getAmountOfPermanentsPerType().h["buildings.TheMachine"] != null && this.city.getAmountOfPermanentsPerType().h["buildings.TheMachine"] >= 1 && Lambda.find(this.city.permanents,function(p) {
			return p.is(buildings_TheMachine);
		}).totalMaterialReward.wood > 1000) {
			if(this.city.getAmountOfPermanentsPerType().h["buildings.LibraryOfTheKey"] != null) {
				return this.city.getAmountOfPermanentsPerType().h["buildings.LibraryOfTheKey"] < 1;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}
	,__class__: progress_sidequests_SecretLibraryMission
});
