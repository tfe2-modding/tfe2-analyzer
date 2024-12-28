var buildings_RefinedMetalFactory = $hxClasses["buildings.RefinedMetalFactory"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.materialsMadePerStepPerWorkerNorm = 0.001;
	this.efficiencyNorm = 5.0;
	this.materialsMadePerStepPerWorker = this.materialsMadePerStepPerWorkerNorm;
	buildings_MaterialConvertingFactory.call(this,game,stage,bgStage,city,world,position,worldPosition,id,this.get_animationFrames(),this.get_idleFrames());
};
buildings_RefinedMetalFactory.__name__ = "buildings.RefinedMetalFactory";
buildings_RefinedMetalFactory.__super__ = buildings_MaterialConvertingFactory;
buildings_RefinedMetalFactory.prototype = $extend(buildings_MaterialConvertingFactory.prototype,{
	get_normalEfficiency: function() {
		return 5.0;
	}
	,get_walkThroughCanViewSelfInThisBuilding: function() {
		return false;
	}
	,get_possibleUpgrades: function() {
		return [buildingUpgrades_RefinedMetalFactoryEfficiency];
	}
	,get_possibleBuildingModes: function() {
		return [buildingUpgrades_FactoryWorking,buildingUpgrades_RefinedMetalsFactoryHack,buildingUpgrades_StoneUsingFactoryDisabled];
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
		return this.city.materials.refinedMetal;
	}
	,set_materialTo: function(value) {
		var productionAmount = value - this.city.materials.refinedMetal;
		this.city.materials.refinedMetal += productionAmount;
		this.city.simulation.stats.materialProduction[4][0] += productionAmount;
		return this.city.materials.refinedMetal;
	}
	,get_animationFrames: function() {
		return "spr_refinedmetalfactory_frames";
	}
	,get_idleFrames: function() {
		return "spr_refinedmetalfactory_idle";
	}
	,onBuild: function() {
		this.city.progress.unlocks.unlock(buildings_HyperElevator);
		this.city.progress.unlocks.unlock(buildings_ComputerResearchCenter);
		this.city.progress.unlocks.fullyUnlock(buildings_MedicalClinic);
		this.city.progress.unlocks.fullyUnlock(buildings_ModernArtMuseum);
		this.city.progress.unlocks.unlock(buildings_SpaciousHouse);
		this.city.progress.unlocks.unlock(buildings_StoneResearchCenter);
	}
	,workAnimation: function(citizen,timeMod) {
		if(citizen.relativeY != 10) {
			if(this.workers.indexOf(citizen) == 0) {
				citizen.setRelativePos(3,10);
			} else {
				var spd = citizen.pathWalkSpeed * timeMod;
				Citizen.shouldUpdateDraw = true;
				if(Math.abs(3 - citizen.relativeX) < spd) {
					citizen.relativeX = 3;
				} else {
					var num = 3 - citizen.relativeX;
					citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
				}
				citizen.setRelativeY(0);
			}
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_MaterialConvertingFactory.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("refinded_metals_made",[_gthis.totalMaterialUsed | 0,_gthis.materialMade | 0]);
		});
	}
	,onCityChange: function() {
		this.efficiency = this.efficiencyNorm;
		this.materialsMadePerStepPerWorker = this.materialsMadePerStepPerWorkerNorm;
		if(this.bottomBuilding != null && this.bottomBuilding.is(buildings_ExperimentationLab)) {
			this.efficiency -= 0.5;
			this.materialsMadePerStepPerWorker += 0.0001;
		}
		if(this.topBuilding != null && this.topBuilding.is(buildings_ExperimentationLab)) {
			this.efficiency -= 0.5;
			this.materialsMadePerStepPerWorker += 0.0001;
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_MaterialConvertingFactory.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_RefinedMetalFactory.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_MaterialConvertingFactory.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_RefinedMetalFactory
});
