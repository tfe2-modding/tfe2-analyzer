var buildings_RarePlantsPark = $hxClasses["buildings.RarePlantsPark"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_Park.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_RarePlantsPark.__name__ = "buildings.RarePlantsPark";
buildings_RarePlantsPark.__super__ = buildings_Park;
buildings_RarePlantsPark.prototype = $extend(buildings_Park.prototype,{
	get_myParkTextures: function() {
		return "spr_rarealienplants";
	}
	,get_entertainmentType: function() {
		return 1;
	}
	,get_baseEntertainmentCapacity: function() {
		return 45;
	}
	,get_numberOfLockedParkTextures: function() {
		return 0;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Park.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_RarePlantsPark.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_Park.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_RarePlantsPark
});
