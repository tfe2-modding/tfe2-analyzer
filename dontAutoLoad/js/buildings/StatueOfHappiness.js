var buildings_StatueOfHappiness = $hxClasses["buildings.StatueOfHappiness"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_Park.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.currentTexture = 0;
	this.parkSprite.texture = this.parkTextures[this.currentTexture];
};
buildings_StatueOfHappiness.__name__ = "buildings.StatueOfHappiness";
buildings_StatueOfHappiness.__super__ = buildings_Park;
buildings_StatueOfHappiness.prototype = $extend(buildings_Park.prototype,{
	get_myParkTextures: function() {
		return "spr_statueofhappiness";
	}
	,get_changePlantsText: function() {
		return common_Localize.lo("change_statue");
	}
	,get_entertainmentType: function() {
		return 3;
	}
	,get_baseEntertainmentCapacity: function() {
		return 80;
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
			queue.addString(buildings_StatueOfHappiness.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_Park.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_StatueOfHappiness
});
