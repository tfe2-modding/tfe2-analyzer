var buildings_ExperimentationLab = $hxClasses["buildings.ExperimentationLab"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.bottomPipeSprite = null;
	this.topPipeSprite = null;
	this.materialsMadePerStepPerWorker = 0.0023;
	buildings_MaterialConvertingFactory.call(this,game,stage,bgStage,city,world,position,worldPosition,id,this.get_idleFrames(),this.get_idleFrames());
};
buildings_ExperimentationLab.__name__ = "buildings.ExperimentationLab";
buildings_ExperimentationLab.__super__ = buildings_MaterialConvertingFactory;
buildings_ExperimentationLab.prototype = $extend(buildings_MaterialConvertingFactory.prototype,{
	get_normalEfficiency: function() {
		return 0.2;
	}
	,get_walkThroughCanViewSelfInThisBuilding: function() {
		return false;
	}
	,get_possibleUpgrades: function() {
		return [buildingUpgrades_UltimateScrewdriver];
	}
	,get_possibleBuildingModes: function() {
		return [buildingUpgrades_LabWorking,buildingUpgrades_LabDisabled];
	}
	,get_materialFrom: function() {
		return this.city.materials.machineParts;
	}
	,set_materialFrom: function(value) {
		var productionAmount = this.city.materials.machineParts - value;
		this.city.materials.machineParts -= productionAmount;
		this.city.simulation.stats.materialUsed[3][0] += productionAmount;
		return this.city.materials.machineParts;
	}
	,get_materialTo: function() {
		return this.city.materials.knowledge;
	}
	,set_materialTo: function(value) {
		var productionAmount = value - this.city.materials.knowledge;
		this.city.materials.knowledge += productionAmount;
		this.city.simulation.stats.materialProduction[10][0] += productionAmount;
		return this.city.materials.knowledge;
	}
	,get_idleFrames: function() {
		return "spr_experimentationlab_idle";
	}
	,get_bonusSpeed: function() {
		if(this.activeWorkers == 0) {
			return 1;
		} else {
			return this.activeWorkersTotalEducation / this.activeWorkers;
		}
	}
	,destroy: function() {
		buildings_MaterialConvertingFactory.prototype.destroy.call(this);
		if(this.topPipeSprite != null) {
			this.topPipeSprite.destroy();
		}
		if(this.bottomPipeSprite != null) {
			this.bottomPipeSprite.destroy();
		}
	}
	,workAnimation: function(citizen,timeMod) {
		if(citizen.relativeY != 10) {
			if(this.workers.indexOf(citizen) == 0) {
				citizen.setRelativePos(4,10);
			} else {
				citizen.setRelativePos(3,0);
			}
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_MaterialConvertingFactory.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("knowledge_production_from_machine_parts",[_gthis.totalMaterialUsed | 0,_gthis.materialMade | 0]);
		});
	}
	,canShowActiveTextures: function() {
		return false;
	}
	,onCityChange: function() {
		if(this.bottomBuilding != null && this.bottomBuilding.is(buildings_RefinedMetalFactory) && !this.bottomBuilding.is(buildings_FactoryPub)) {
			if(this.bottomPipeSprite == null) {
				this.bottomPipeSprite = new PIXI.Sprite(Resources.getTexture("spr_experimentationlab_pipe_bottom"));
				this.city.justAboveCityStage.addChild(this.bottomPipeSprite);
			}
			this.bottomPipeSprite.position.set(this.position.x + 7,this.position.y + 17);
		} else if(this.bottomPipeSprite != null) {
			this.bottomPipeSprite.destroy();
			this.bottomPipeSprite = null;
		}
		if(this.topBuilding != null && this.topBuilding.is(buildings_RefinedMetalFactory) && !this.topBuilding.is(buildings_FactoryPub)) {
			if(this.topPipeSprite == null) {
				this.topPipeSprite = new PIXI.Sprite(Resources.getTexture("spr_experimentationlab_pipe_top"));
				this.city.justAboveCityStage.addChild(this.topPipeSprite);
			}
			this.topPipeSprite.position.set(this.position.x + 10,this.position.y - 11);
		} else if(this.topPipeSprite != null) {
			this.topPipeSprite.destroy();
			this.topPipeSprite = null;
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_MaterialConvertingFactory.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_ExperimentationLab.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_MaterialConvertingFactory.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_ExperimentationLab
});
