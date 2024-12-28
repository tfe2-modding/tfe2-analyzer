var buildings_MachinePartsFactory = $hxClasses["buildings.MachinePartsFactory"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.materialsMadePerStepPerWorker = 0.0015;
	buildings_MaterialConvertingFactory.call(this,game,stage,bgStage,city,world,position,worldPosition,id,"spr_machinepartsfactory_frames","spr_machinepartsfactory_idle");
};
buildings_MachinePartsFactory.__name__ = "buildings.MachinePartsFactory";
buildings_MachinePartsFactory.__super__ = buildings_MaterialConvertingFactory;
buildings_MachinePartsFactory.prototype = $extend(buildings_MaterialConvertingFactory.prototype,{
	get_normalEfficiency: function() {
		return 3;
	}
	,get_walkThroughCanViewSelfInThisBuilding: function() {
		return false;
	}
	,get_possibleUpgrades: function() {
		return [buildingUpgrades_MachinePartsFactoryEfficiency];
	}
	,get_possibleBuildingModes: function() {
		return [buildingUpgrades_FactoryWorking,buildingUpgrades_MachinePartsFactoryTurbo,buildingUpgrades_StoneUsingFactoryDisabled];
	}
	,get_materialFrom: function() {
		return this.city.materials.stone;
	}
	,set_materialFrom: function(value) {
		var productionAmount = this.city.materials.stone - value;
		this.city.materials.stone -= productionAmount;
		this.city.simulation.stats.materialUsed[2][0] += productionAmount;
		return this.city.materials.stone;
	}
	,get_materialTo: function() {
		return this.city.materials.machineParts;
	}
	,set_materialTo: function(value) {
		var productionAmount = value - this.city.materials.machineParts;
		this.city.materials.machineParts += productionAmount;
		this.city.simulation.stats.materialProduction[3][0] += productionAmount;
		return this.city.materials.machineParts;
	}
	,get_bonusSpeed: function() {
		return this.city.simulation.bonuses.machinePartsFactorySpeed;
	}
	,onBuild: function() {
		buildings_MaterialConvertingFactory.prototype.onBuild.call(this);
		this.city.progress.unlocks.unlock(buildings_MechanicalHouse);
	}
	,workAnimation: function(citizen,timeMod) {
		if(citizen.relativeY != 10) {
			if(this.workers.indexOf(citizen) == 0) {
				citizen.setRelativePos(12,10);
			} else {
				citizen.setRelativePos(15,10);
			}
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_MaterialConvertingFactory.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return "" + (_gthis.totalMaterialUsed | 0) + " stone used to make " + (_gthis.materialMade | 0) + " machine parts.";
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_MaterialConvertingFactory.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_MachinePartsFactory.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_MaterialConvertingFactory.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_MachinePartsFactory
});
