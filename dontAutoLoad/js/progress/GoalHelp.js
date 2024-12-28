var progress_GoalHelp = $hxClasses["progress.GoalHelp"] = function(city) {
	this.neverUpdatedBuildingGoal = true;
	this.knowsHasBuildingGoalHelp = false;
	this.city = city;
};
progress_GoalHelp.__name__ = "progress.GoalHelp";
progress_GoalHelp.prototype = {
	getCurrentGoalHelp: function() {
		var goalHelp = [];
		if(this.city.progress.story != null && this.city.progress.story.currentGoal != null && this.city.progress.story.currentGoal.quickText != "") {
			goalHelp.push({ category : common_Localize.lo("main_goal"), text : this.city.progress.story.currentGoal.quickText});
		}
		var currentBuildingGoalHelps = this.getCurrentBuildingGoalHelp();
		var _g = 0;
		while(_g < currentBuildingGoalHelps.length) {
			var bg = currentBuildingGoalHelps[_g];
			++_g;
			goalHelp.push(bg);
		}
		var _g = 0;
		var _g1 = this.city.progress.sideQuests.sidequests;
		while(_g < _g1.length) {
			var sq = _g1[_g];
			++_g;
			var thisHelp = sq.getGoalHelp();
			if(thisHelp != null) {
				goalHelp.push(thisHelp);
			}
		}
		return goalHelp;
	}
	,getCurrentBuildingGoalHelp: function() {
		var goalHelp = [];
		var _g = 0;
		var _g1 = this.city.permanents;
		while(_g < _g1.length) {
			var pm = _g1[_g];
			++_g;
			if(pm.is(Building)) {
				var bld = pm;
				var buildingGlobalGoal = bld.getGlobalGoal();
				if(buildingGlobalGoal != null) {
					goalHelp.push(buildingGlobalGoal);
				}
			}
		}
		return goalHelp;
	}
	,updateHasBuildingGoal: function() {
		this.knowsHasBuildingGoalHelp = this.getCurrentBuildingGoalHelp().length > 0;
	}
	,hasCurrentGoalHelp: function() {
		if(this.city.progress.story != null && this.city.progress.story.currentGoal != null && this.city.progress.story.currentGoal.quickText != "") {
			return true;
		}
		var _g = 0;
		var _g1 = this.city.progress.sideQuests.sidequests;
		while(_g < _g1.length) {
			var sq = _g1[_g];
			++_g;
			var goalHelp = sq.getGoalHelp();
			if(goalHelp != null) {
				return true;
			}
		}
		if(this.neverUpdatedBuildingGoal) {
			this.updateHasBuildingGoal();
			this.neverUpdatedBuildingGoal = false;
		}
		return this.knowsHasBuildingGoalHelp;
	}
	,__class__: progress_GoalHelp
};
