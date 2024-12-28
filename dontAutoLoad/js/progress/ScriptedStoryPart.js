var progress_ScriptedStoryPart = $hxClasses["progress.ScriptedStoryPart"] = function(city,story) {
	this.city = city;
	this.simulation = city.simulation;
	this.story = story;
};
progress_ScriptedStoryPart.__name__ = "progress.ScriptedStoryPart";
progress_ScriptedStoryPart.prototype = {
	update: function(timeMod) {
	}
	,initialize: function($with) {
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(progress_ScriptedStoryPart.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: progress_ScriptedStoryPart
};
