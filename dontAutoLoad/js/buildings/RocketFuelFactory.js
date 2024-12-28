var buildings_RocketFuelFactory = $hxClasses["buildings.RocketFuelFactory"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.currentMaterialUsed = 0;
	this.materialsMadePerStepPerWorker = 0.001;
	buildings_MaterialConvertingFactory.call(this,game,stage,bgStage,city,world,position,worldPosition,id,this.get_animationFrames(),this.get_idleFrames());
};
buildings_RocketFuelFactory.__name__ = "buildings.RocketFuelFactory";
buildings_RocketFuelFactory.__super__ = buildings_MaterialConvertingFactory;
buildings_RocketFuelFactory.prototype = $extend(buildings_MaterialConvertingFactory.prototype,{
	get_normalEfficiency: function() {
		return 1.0;
	}
	,get_walkThroughCanViewSelfInThisBuilding: function() {
		return false;
	}
	,get_possibleUpgrades: function() {
		return [buildingUpgrades_RocketFuelFactoryEfficiency];
	}
	,get_possibleBuildingModes: function() {
		return [buildingUpgrades_FactoryUsingFood,buildingUpgrades_FactoryUsingWood,buildingUpgrades_FactoryDisabled];
	}
	,get_materialFrom: function() {
		if(this.currentMaterialUsed == 0) {
			return this.city.materials.food;
		} else {
			return this.city.materials.wood;
		}
	}
	,set_materialFrom: function(value) {
		if(this.currentMaterialUsed == 0) {
			var productionAmount = this.city.materials.food - value;
			var _g = this.city.materials;
			_g.set_food(_g.food - productionAmount);
			this.city.simulation.stats.materialUsed[0][0] += productionAmount;
		} else {
			var productionAmount = this.city.materials.wood - value;
			this.city.materials.wood -= productionAmount;
			this.city.simulation.stats.materialUsed[1][0] += productionAmount;
		}
		if(this.currentMaterialUsed == 0) {
			return this.city.materials.food;
		} else {
			return this.city.materials.wood;
		}
	}
	,get_materialTo: function() {
		return this.city.materials.rocketFuel;
	}
	,set_materialTo: function(value) {
		var productionAmount = value - this.city.materials.rocketFuel;
		this.city.materials.rocketFuel += productionAmount;
		this.city.simulation.stats.materialProduction[9][0] += productionAmount;
		return this.city.materials.rocketFuel;
	}
	,get_animationFrames: function() {
		return "spr_rocketfuelfactory_frames";
	}
	,get_idleFrames: function() {
		return "spr_rocketfuelfactory_idle";
	}
	,get_bonusSpeed: function() {
		return 1 + this.city.upgrades.vars.fasterRocketFuelFactory;
	}
	,onBuild: function() {
	}
	,workAnimation: function(citizen,timeMod) {
		if(citizen.relativeY != 10) {
			if(this.workers.indexOf(citizen) == 0) {
				citizen.setRelativePos(15,10);
			} else {
				citizen.setRelativePos(12,0);
			}
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_MaterialConvertingFactory.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("rocket_fuel_made",[_gthis.totalMaterialUsed | 0,_gthis.materialMade | 0]);
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_MaterialConvertingFactory.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_RocketFuelFactory.saveDefinition);
		}
		var value = this.currentMaterialUsed;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue,definition) {
		buildings_MaterialConvertingFactory.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentMaterialUsed")) {
			this.currentMaterialUsed = loadMap.h["currentMaterialUsed"];
		}
	}
	,__class__: buildings_RocketFuelFactory
});
