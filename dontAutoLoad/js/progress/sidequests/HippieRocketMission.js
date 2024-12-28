var progress_sidequests_HippieRocketMission = $hxClasses["progress.sidequests.HippieRocketMission"] = function(city,sidequests) {
	progress_Sidequest.call(this,city,sidequests);
};
progress_sidequests_HippieRocketMission.__name__ = "progress.sidequests.HippieRocketMission";
progress_sidequests_HippieRocketMission.__super__ = progress_Sidequest;
progress_sidequests_HippieRocketMission.prototype = $extend(progress_Sidequest.prototype,{
	get_tag: function() {
		return "Hippies";
	}
	,start: function() {
		this.sideQuests.showSidequestDialog(common_Localize.lo("hippierocketmission_sidequest_title"),common_Localize.lo("hippierocketmission_sidequest_description"));
	}
	,onComplete: function() {
	}
	,getGoalHelp: function() {
		return { category : common_Localize.lo("hippierocketmission_sidequest_title"), text : common_Localize.lo("hippierocketmission_sidequest_quickDescription")};
	}
	,canStart: function() {
		if(this.city.getAmountOfPermanentsPerType().h["buildings.BlossomHippieHQ"] != null && this.city.getAmountOfPermanentsPerType().h["buildings.BlossomHippieHQ"] >= 1 && (this.city.getAmountOfPermanentsPerType().h["buildings.FestivalHQ"] != null && this.city.getAmountOfPermanentsPerType().h["buildings.FestivalHQ"] >= 1) && (this.city.getAmountOfPermanentsPerType().h["buildings.OtherworldlyZoo"] != null && this.city.getAmountOfPermanentsPerType().h["buildings.OtherworldlyZoo"] >= 1)) {
			if(this.city.getAmountOfPermanentsPerType().h["buildings.RocketLaunchPlatform"] != null) {
				return this.city.getAmountOfPermanentsPerType().h["buildings.RocketLaunchPlatform"] >= 1;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		progress_Sidequest.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(progress_sidequests_HippieRocketMission.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		progress_Sidequest.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: progress_sidequests_HippieRocketMission
});
