var buildings_ChristmasTree = $hxClasses["buildings.ChristmasTree"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_Park.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.currentTexture = 0;
	this.parkSprite.texture = this.parkTextures[this.currentTexture];
};
buildings_ChristmasTree.__name__ = "buildings.ChristmasTree";
buildings_ChristmasTree.__super__ = buildings_Park;
buildings_ChristmasTree.prototype = $extend(buildings_Park.prototype,{
	get_myParkTextures: function() {
		return "spr_christmastree";
	}
	,get_changePlantsText: function() {
		return "";
	}
	,get_entertainmentType: function() {
		return 1;
	}
	,get_baseEntertainmentCapacity: function() {
		return 50;
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
			queue.addString(buildings_ChristmasTree.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_Park.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_ChristmasTree
});
