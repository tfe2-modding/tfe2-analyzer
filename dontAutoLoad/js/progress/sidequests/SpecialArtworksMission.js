var progress_sidequests_SpecialArtworksMission = $hxClasses["progress.sidequests.SpecialArtworksMission"] = function(city,sidequests) {
	progress_Sidequest.call(this,city,sidequests);
};
progress_sidequests_SpecialArtworksMission.__name__ = "progress.sidequests.SpecialArtworksMission";
progress_sidequests_SpecialArtworksMission.__super__ = progress_Sidequest;
progress_sidequests_SpecialArtworksMission.prototype = $extend(progress_Sidequest.prototype,{
	start: function() {
		this.associatedCitizen = this.getEligibleCitizen();
		if(this.associatedCitizen == null) {
			this.associatedCitizen = "";
		}
		this.sideQuests.showSidequestDialog(common_Localize.lo("specialartworks_sidequest_title"),common_Localize.lo("specialartworks_sidequest_description",[this.associatedCitizen]));
	}
	,onComplete: function() {
		this.sideQuests.showSidequestFinishedDialog(common_Localize.lo("sidequest_complete") + " " + common_Localize.lo("specialartworks_sidequest_title"),common_Localize.lo("specialartworks_sidequest_finish_description",[this.associatedCitizen]));
	}
	,getGoalHelp: function() {
		return { category : common_Localize.lo("specialartworks_sidequest_title"), text : common_Localize.lo("specialartworks_sidequest_quickDescription",[this.associatedCitizen])};
	}
	,getEligibleCitizen: function() {
		var _g = 0;
		var _g1 = this.city.simulation.citizens;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c.get_age() >= 30 && c.get_age() <= 40) {
				if(c.nameIndex < Resources.citizenNames.length) {
					return Resources.citizenNames[c.nameIndex];
				} else {
					return common_StringExtensions.firstToUpper(common_Localize.lo("citizen"));
				}
			}
		}
		return null;
	}
	,canStart: function() {
		if(this.city.simulation.citizens.length > 150 && this.getEligibleCitizen() != null && this.city.simulation.happiness.happiness > 40) {
			if(this.city.getAmountOfPermanentsPerType().h["buildings.ModernArtMuseum"] != null) {
				return this.city.getAmountOfPermanentsPerType().h["buildings.ModernArtMuseum"] >= 1;
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
			queue.addString(progress_sidequests_SpecialArtworksMission.saveDefinition);
		}
		queue.addString(this.associatedCitizen);
	}
	,load: function(queue,definition) {
		progress_Sidequest.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"associatedCitizen")) {
			this.associatedCitizen = loadMap.h["associatedCitizen"];
		}
	}
	,__class__: progress_sidequests_SpecialArtworksMission
});
