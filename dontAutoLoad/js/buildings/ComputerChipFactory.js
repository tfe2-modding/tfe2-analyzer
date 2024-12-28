var buildings_ComputerChipFactory = $hxClasses["buildings.ComputerChipFactory"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.materialsMadePerStepPerWorker = 0.0001;
	buildings_MaterialConvertingFactory.call(this,game,stage,bgStage,city,world,position,worldPosition,id,"spr_computerchipfactory_frames","spr_computerchipfactory_idle");
};
buildings_ComputerChipFactory.__name__ = "buildings.ComputerChipFactory";
buildings_ComputerChipFactory.__super__ = buildings_MaterialConvertingFactory;
buildings_ComputerChipFactory.prototype = $extend(buildings_MaterialConvertingFactory.prototype,{
	get_normalEfficiency: function() {
		return 7;
	}
	,get_walkThroughCanViewSelfInThisBuilding: function() {
		return false;
	}
	,get_possibleUpgrades: function() {
		return [buildingUpgrades_DieShrink];
	}
	,get_possibleBuildingModes: function() {
		return [buildingUpgrades_FactoryWorking,buildingUpgrades_RefinedStoneUsingFactoryDisabled];
	}
	,get_materialFrom: function() {
		return this.city.materials.refinedMetal;
	}
	,set_materialFrom: function(value) {
		var productionAmount = this.city.materials.refinedMetal - value;
		this.city.materials.refinedMetal -= productionAmount;
		this.city.simulation.stats.materialUsed[4][0] += productionAmount;
		return this.city.materials.refinedMetal;
	}
	,get_materialTo: function() {
		return this.city.materials.computerChips;
	}
	,set_materialTo: function(value) {
		var productionAmount = value - this.city.materials.computerChips;
		this.city.materials.computerChips += productionAmount;
		this.city.simulation.stats.materialProduction[5][0] += productionAmount;
		return this.city.materials.computerChips;
	}
	,get_bonusSpeed: function() {
		return (this.activeWorkers == 0 ? 1 : this.activeWorkersTotalEducation / this.activeWorkers) * this.city.upgrades.vars.computerChipFactorySpeed;
	}
	,onBuild: function() {
		this.city.progress.unlocks.unlock(buildingUpgrades_AIMining);
		this.city.progress.unlocks.unlock(buildingUpgrades_HeatedBed);
		this.city.progress.unlocks.unlock(buildings_Supercomputer);
		this.city.progress.unlocks.unlock(buildings_LivingResearchCenter);
		this.city.progress.unlocks.unlock(buildings_Teleporter);
		this.city.progress.unlocks.unlock(buildings_CuttingEdgeHome);
		this.city.progress.unlocks.fullyUnlock(buildings_Arcade);
		this.city.progress.unlocks.unlock(cityUpgrades_ChipBinning);
		this.city.progress.unlocks.unlock(buildingUpgrades_PickaxeTech);
		this.city.progress.unlocks.unlock(buildingUpgrades_FossilScanner);
		this.city.progress.unlocks.unlock(buildingUpgrades_PioneersHutUpgrade);
		this.city.progress.unlocks.unlock(buildingUpgrades_EnhancedAudio);
	}
	,workAnimation: function(citizen,timeMod) {
		if(citizen.relativeY != 10) {
			if(this.workers.indexOf(citizen) == 1) {
				citizen.setRelativePos(3,10);
			} else if(this.workers.indexOf(citizen) == 0) {
				var spd = citizen.pathWalkSpeed * timeMod;
				Citizen.shouldUpdateDraw = true;
				if(Math.abs(3 - citizen.relativeX) < spd) {
					citizen.relativeX = 3;
				} else {
					var num = 3 - citizen.relativeX;
					citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
				}
				citizen.setRelativeY(0);
			} else {
				var spd = citizen.pathWalkSpeed * timeMod;
				Citizen.shouldUpdateDraw = true;
				if(Math.abs(13 - citizen.relativeX) < spd) {
					citizen.relativeX = 13;
				} else {
					var num = 13 - citizen.relativeX;
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
			return common_Localize.lo("computer_chip_production",[_gthis.totalMaterialUsed | 0,_gthis.materialMade | 0]);
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_MaterialConvertingFactory.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_ComputerChipFactory.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_MaterialConvertingFactory.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_ComputerChipFactory
});
