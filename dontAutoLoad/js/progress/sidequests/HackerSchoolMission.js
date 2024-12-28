var progress_sidequests_HackerSchoolMission = $hxClasses["progress.sidequests.HackerSchoolMission"] = function(city,sidequests) {
	progress_Sidequest.call(this,city,sidequests);
};
progress_sidequests_HackerSchoolMission.__name__ = "progress.sidequests.HackerSchoolMission";
progress_sidequests_HackerSchoolMission.__super__ = progress_Sidequest;
progress_sidequests_HackerSchoolMission.prototype = $extend(progress_Sidequest.prototype,{
	get_tag: function() {
		return "Hackers";
	}
	,start: function() {
		this.sideQuests.showSidequestDialog(common_Localize.lo("buildinginfo.json/HackerSchool.name"),common_Localize.lo("hacker_school_description"));
		this.city.progress.unlocks.unlock(buildings_HackerSchool);
	}
	,update: function(timeMod) {
	}
	,onComplete: function() {
		this.sideQuests.showSidequestFinishedDialog(common_Localize.lo("sidequest_complete") + " " + common_Localize.lo("buildinginfo.json/HackerSchool.name"),common_Localize.lo("hacker_school_finish_description"));
	}
	,getGoalHelp: function() {
		return { category : common_Localize.lo("buildinginfo.json/HackerSchool.name"), text : common_Localize.lo("hacker_school_quickDescription")};
	}
	,canStart: function() {
		if(this.city.getAmountOfPermanentsPerType().h["buildings.Misdirector"] != null && this.city.getAmountOfPermanentsPerType().h["buildings.Misdirector"] >= 1 && Lambda.find(this.city.permanents,function(p) {
			return p.is(buildings_Misdirector);
		}).knowledgeGenerated > 200) {
			if(this.city.getAmountOfPermanentsPerType().h["buildings.HackerSchool"] != null) {
				return this.city.getAmountOfPermanentsPerType().h["buildings.HackerSchool"] < 1;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}
	,__class__: progress_sidequests_HackerSchoolMission
});
