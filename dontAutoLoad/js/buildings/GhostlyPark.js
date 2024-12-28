var buildings_GhostlyPark = $hxClasses["buildings.GhostlyPark"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_Park.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_GhostlyPark.__name__ = "buildings.GhostlyPark";
buildings_GhostlyPark.__super__ = buildings_Park;
buildings_GhostlyPark.prototype = $extend(buildings_Park.prototype,{
	get_myParkTextures: function() {
		return "spr_spiderweb";
	}
	,get_changePlantsText: function() {
		return common_Localize.lo("change_decoration");
	}
	,get_entertainmentType: function() {
		return 1;
	}
	,get_baseEntertainmentCapacity: function() {
		return 30;
	}
	,get_isOpen: function() {
		var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
		if(!(this1 >= 20)) {
			return this1 < 8.0;
		} else {
			return true;
		}
	}
	,get_numberOfLockedParkTextures: function() {
		return 0;
	}
	,get_canChangeBuildingColor: function() {
		return false;
	}
	,postLoad: function() {
		this.parkSprite.texture = this.parkTextures[this.currentTexture];
		this.bgStage.isInvalid = true;
		this.changeMainTexture("spr_indoorpark_dark");
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Park.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_GhostlyPark.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_Park.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		this.postLoad();
	}
	,__class__: buildings_GhostlyPark
});
