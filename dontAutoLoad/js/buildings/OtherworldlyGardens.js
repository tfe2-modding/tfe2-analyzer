var buildings_OtherworldlyGardens = $hxClasses["buildings.OtherworldlyGardens"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.justBuiltG = false;
	this.hiddenAnimalHere = false;
	buildings_BotanicalGardens.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.gardenTextureSets = [2,2,2,2];
	this.drawer.verticalCompatibility = 1;
};
buildings_OtherworldlyGardens.__name__ = "buildings.OtherworldlyGardens";
buildings_OtherworldlyGardens.__super__ = buildings_BotanicalGardens;
buildings_OtherworldlyGardens.prototype = $extend(buildings_BotanicalGardens.prototype,{
	get_myParkTextures: function() {
		return "spr_otherworldlyplants_high";
	}
	,get_entertainmentType: function() {
		return 1;
	}
	,get_baseEntertainmentCapacity: function() {
		return 45;
	}
	,buildingIsSimilar: function(otherBuilding) {
		return otherBuilding.is(buildings_OtherworldlyGardens);
	}
	,postLoad: function() {
		buildings_BotanicalGardens.prototype.postLoad.call(this);
	}
	,onBuild: function() {
		buildings_BotanicalGardens.prototype.onBuild.call(this);
		this.justBuiltG = true;
	}
	,postCreate: function() {
		buildings_BotanicalGardens.prototype.postCreate.call(this);
		if(this.justBuiltG) {
			if(!this.is(buildings_OtherworldlyGardensDome)) {
				if(this.bottomBuilding == null || !this.bottomBuilding.is(buildings_OtherworldlyGardens)) {
					this.city.simulation.animals.animals.push(new simulation_Animal(this.city,this.city.aboveCitizensInBuildingStage,this,10));
				} else {
					this.hiddenAnimalHere = true;
				}
			}
			this.justBuiltG = false;
		}
	}
	,onCityChange: function() {
		buildings_BotanicalGardens.prototype.onCityChange.call(this);
		if(this.hiddenAnimalHere && (this.bottomBuilding == null || !this.bottomBuilding.is(buildings_OtherworldlyGardens)) && !this.is(buildings_OtherworldlyGardensDome)) {
			this.city.simulation.animals.animals.push(new simulation_Animal(this.city,this.city.aboveCitizensInBuildingStage,this,10,8));
			this.hiddenAnimalHere = false;
		}
	}
	,isTree: function() {
		return false;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_BotanicalGardens.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_OtherworldlyGardens.saveDefinition);
		}
		var value = this.hiddenAnimalHere;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
	}
	,load: function(queue,definition) {
		buildings_BotanicalGardens.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"hiddenAnimalHere")) {
			this.hiddenAnimalHere = loadMap.h["hiddenAnimalHere"];
		}
		this.postLoad();
	}
	,__class__: buildings_OtherworldlyGardens
});
