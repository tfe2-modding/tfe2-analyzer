var buildings_SuperheatedRefinery = $hxClasses["buildings.SuperheatedRefinery"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.spriteOverMachinePartsFactoryRight = null;
	this.spriteOverMachinePartsFactoryBottom = null;
	this.spriteOverMachinePartsFactoryLeft = null;
	this.spriteOverMachinePartsFactoryTop = null;
	this.materialsMadePerStepPerWorkerNorm = 0.00075;
	this.efficiencyNorm = 5.0;
	this.materialsMadePerStepPerWorker = this.materialsMadePerStepPerWorkerNorm;
	buildings_MaterialConvertingFactory.call(this,game,stage,bgStage,city,world,position,worldPosition,id,this.get_animationFrames(),this.get_idleFrames());
};
buildings_SuperheatedRefinery.__name__ = "buildings.SuperheatedRefinery";
buildings_SuperheatedRefinery.__super__ = buildings_MaterialConvertingFactory;
buildings_SuperheatedRefinery.prototype = $extend(buildings_MaterialConvertingFactory.prototype,{
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
		return "spr_superheatedrefinery_frames";
	}
	,get_idleFrames: function() {
		return "spr_superheatedrefinery_idle";
	}
	,destroy: function() {
		buildings_MaterialConvertingFactory.prototype.destroy.call(this);
		if(this.spriteOverMachinePartsFactoryTop != null) {
			this.spriteOverMachinePartsFactoryTop.destroy();
		}
		this.spriteOverMachinePartsFactoryTop = null;
		if(this.spriteOverMachinePartsFactoryLeft != null) {
			this.spriteOverMachinePartsFactoryLeft.destroy();
		}
		this.spriteOverMachinePartsFactoryLeft = null;
		if(this.spriteOverMachinePartsFactoryBottom != null) {
			this.spriteOverMachinePartsFactoryBottom.destroy();
		}
		this.spriteOverMachinePartsFactoryBottom = null;
		if(this.spriteOverMachinePartsFactoryRight != null) {
			this.spriteOverMachinePartsFactoryRight.destroy();
		}
		this.spriteOverMachinePartsFactoryRight = null;
	}
	,workAnimation: function(citizen,timeMod) {
		if(citizen.relativeY != 10) {
			if(this.workers.indexOf(citizen) == 0) {
				citizen.setRelativePos(14,10);
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
			return common_Localize.lo("refinded_metals_made",[_gthis.totalMaterialUsed | 0,_gthis.materialMade | 0]);
		});
	}
	,onCityChange: function() {
		this.efficiency = this.efficiencyNorm;
		this.materialsMadePerStepPerWorker = this.materialsMadePerStepPerWorkerNorm;
		if(this.bottomBuilding != null && this.bottomBuilding.is(buildings_MachinePartsFactory)) {
			this.materialsMadePerStepPerWorker += 0.0001125;
			if(this.spriteOverMachinePartsFactoryBottom == null) {
				this.spriteOverMachinePartsFactoryBottom = Resources.makeSprite("spr_superheatedrefinery_bottom");
				this.city.justAboveCityStage.addChild(this.spriteOverMachinePartsFactoryBottom);
			}
			this.spriteOverMachinePartsFactoryBottom.position.set(this.position.x + 5,this.position.y + 17);
		} else if(this.spriteOverMachinePartsFactoryBottom != null) {
			this.spriteOverMachinePartsFactoryBottom.destroy();
			this.spriteOverMachinePartsFactoryBottom = null;
		}
		if(this.topBuilding != null && this.topBuilding.is(buildings_MachinePartsFactory)) {
			this.materialsMadePerStepPerWorker += 0.0001125;
			if(this.spriteOverMachinePartsFactoryTop == null) {
				this.spriteOverMachinePartsFactoryTop = Resources.makeSprite("spr_superheatedrefinery_top");
				this.city.justAboveCityStage.addChild(this.spriteOverMachinePartsFactoryTop);
			}
			this.spriteOverMachinePartsFactoryTop.position.set(this.position.x + 3,this.position.y - 3);
		} else if(this.spriteOverMachinePartsFactoryTop != null) {
			this.spriteOverMachinePartsFactoryTop.destroy();
			this.spriteOverMachinePartsFactoryTop = null;
		}
		if(this.leftBuilding != null && this.leftBuilding.is(buildings_MachinePartsFactory)) {
			this.materialsMadePerStepPerWorker += 0.0001125;
			if(this.spriteOverMachinePartsFactoryLeft == null) {
				this.spriteOverMachinePartsFactoryLeft = Resources.makeSprite("spr_superheatedrefinery_left");
				this.city.justAboveCityStage.addChild(this.spriteOverMachinePartsFactoryLeft);
			}
			this.spriteOverMachinePartsFactoryLeft.position.set(this.position.x - 3,this.position.y + 1);
		} else if(this.spriteOverMachinePartsFactoryLeft != null) {
			this.spriteOverMachinePartsFactoryLeft.destroy();
			this.spriteOverMachinePartsFactoryLeft = null;
		}
		if(this.rightBuilding != null && this.rightBuilding.is(buildings_MachinePartsFactory)) {
			this.materialsMadePerStepPerWorker += 0.0001125;
			if(this.spriteOverMachinePartsFactoryRight == null) {
				this.spriteOverMachinePartsFactoryRight = Resources.makeSprite("spr_superheatedrefinery_right");
				this.city.justAboveCityStage.addChild(this.spriteOverMachinePartsFactoryRight);
			}
			this.spriteOverMachinePartsFactoryRight.position.set(this.position.x + 13,this.position.y + 5);
		} else if(this.spriteOverMachinePartsFactoryRight != null) {
			this.spriteOverMachinePartsFactoryRight.destroy();
			this.spriteOverMachinePartsFactoryRight = null;
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_MaterialConvertingFactory.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_SuperheatedRefinery.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_MaterialConvertingFactory.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_SuperheatedRefinery
});
