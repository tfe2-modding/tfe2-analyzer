var gui_CurrentMissionsWindow = $hxClasses["gui.CurrentMissionsWindow"] = function() { };
gui_CurrentMissionsWindow.__name__ = "gui.CurrentMissionsWindow";
gui_CurrentMissionsWindow.create = function(city,gui,stage,thisWindow) {
	var theHeader = gui.windowAddTitleText(common_Localize.lo("current_tasks"));
	var thereWereMoreMissions = true;
	var theText = new gui_TextElement(thisWindow,stage,null,function() {
		var goalTexts = city.progress.goalHelp.getCurrentGoalHelp();
		var fullGoalTexts = "";
		var _g = 0;
		while(_g < goalTexts.length) {
			var goalText = goalTexts[_g];
			++_g;
			if(fullGoalTexts != "") {
				fullGoalTexts += "\n\n";
			}
			fullGoalTexts += "- " + goalText.category + "\n" + goalText.text;
		}
		if(goalTexts.length != 1 != thereWereMoreMissions) {
			if(goalTexts.length == 1) {
				theHeader.setText(common_Localize.lo("current_task"));
			} else {
				theHeader.setText(common_Localize.lo("current_tasks"));
			}
			thereWereMoreMissions = goalTexts.length != 1;
		}
		if(fullGoalTexts == "") {
			fullGoalTexts = "---";
		}
		return fullGoalTexts;
	});
	thisWindow.addChild(theText);
	gui.windowAddBottomButtons();
};
gui_CurrentMissionsWindow.displaySidequestsWithTag = function(city,gui,stage,thisWindow,tag) {
	var getTexts = function() {
		var fullGoalTexts = "";
		var _g = 0;
		var _g1 = city.progress.sideQuests.sidequests;
		while(_g < _g1.length) {
			var sq = _g1[_g];
			++_g;
			if(sq.get_tag() != tag) {
				continue;
			}
			var thisHelp = sq.getGoalHelp();
			if(thisHelp != null) {
				if(fullGoalTexts != "") {
					fullGoalTexts += "\n\n";
				}
				fullGoalTexts += "- " + thisHelp.category + "\n" + thisHelp.text;
			}
		}
		return fullGoalTexts;
	};
	if(getTexts() == "") {
		return false;
	}
	var theText = new gui_TextElement(thisWindow,stage,null,getTexts);
	thisWindow.addChild(theText);
	return true;
};
