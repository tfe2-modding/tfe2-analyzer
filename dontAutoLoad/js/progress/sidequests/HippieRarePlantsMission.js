var progress_sidequests_HippieRarePlantsMission = $hxClasses["progress.sidequests.HippieRarePlantsMission"] = function(city,sidequests) {
	progress_Sidequest.call(this,city,sidequests);
};
progress_sidequests_HippieRarePlantsMission.__name__ = "progress.sidequests.HippieRarePlantsMission";
progress_sidequests_HippieRarePlantsMission.__super__ = progress_Sidequest;
progress_sidequests_HippieRarePlantsMission.prototype = $extend(progress_Sidequest.prototype,{
	get_tag: function() {
		return "Hippies";
	}
	,start: function() {
		this.sideQuests.showSidequestDialog(common_Localize.lo("hippierareplants_sidequest_title"),common_Localize.lo("hippierareplants_sidequest_description"));
	}
	,onComplete: function() {
		this.sideQuests.showSidequestFinishedDialog(common_Localize.lo("sidequest_complete") + " " + common_Localize.lo("hippierareplants_sidequest_title"),common_Localize.lo("hippierareplants_sidequest_finish_description"));
		this.city.progress.unlocks.unlock(policies_HippieLifestyle);
	}
	,getGoalHelp: function() {
		return { category : common_Localize.lo("hippierareplants_sidequest_title"), text : common_Localize.lo("hippierareplants_sidequest_quickDescription")};
	}
	,canStart: function() {
		return true;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		progress_Sidequest.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(progress_sidequests_HippieRarePlantsMission.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		progress_Sidequest.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: progress_sidequests_HippieRarePlantsMission
});
