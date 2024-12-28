var buildings_PollardWillowPlantation = $hxClasses["buildings.PollardWillowPlantation"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_TreePlantation.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_PollardWillowPlantation.__name__ = "buildings.PollardWillowPlantation";
buildings_PollardWillowPlantation.__super__ = buildings_TreePlantation;
buildings_PollardWillowPlantation.prototype = $extend(buildings_TreePlantation.prototype,{
	get_treesTextureName: function() {
		return "spr_treeplantation_pollardwillow_trees";
	}
	,get_treesGrowTexturesName: function() {
		return "spr_treeplantation_pollardwillow_trees";
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_TreePlantation.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_PollardWillowPlantation.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_TreePlantation.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_PollardWillowPlantation
});
