var buildings_GrapheneFactory = $hxClasses["buildings.GrapheneFactory"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.usesNoStone = false;
	this.materialMade = 0;
	this.totalKnowledgeUsed = 0;
	this.totalStoneUsed = 0;
	this.materialsMadePerStepPerWorker = 0.000125;
	this.efficiency = this.get_normalEfficiencyKnowledge();
	buildings_Factory.call(this,game,stage,bgStage,city,world,position,worldPosition,id,"spr_graphenefactory_frames","spr_graphenefactory_idle");
	this.connectionSprite = null;
};
buildings_GrapheneFactory.__name__ = "buildings.GrapheneFactory";
buildings_GrapheneFactory.__super__ = buildings_Factory;
buildings_GrapheneFactory.prototype = $extend(buildings_Factory.prototype,{
	get_normalEfficiencyKnowledge: function() {
		return 10;
	}
	,get_normalEfficiencyStone: function() {
		return 1;
	}
	,get_walkThroughCanViewSelfInThisBuilding: function() {
		return false;
	}
	,get_possibleUpgrades: function() {
		return [buildingUpgrades_GrapheneFactoryImprovement];
	}
	,get_possibleBuildingModes: function() {
		return [buildingUpgrades_FactoryWorking,buildingUpgrades_FactoryDisabled];
	}
	,get_bonusSpeed: function() {
		if(this.activeWorkers == 0) {
			return 1;
		} else {
			return this.activeWorkersTotalEducation / this.activeWorkers;
		}
	}
	,possiblyBeActive: function(timeMod) {
		if(this.city.materials.knowledge >= 1 && (this.usesNoStone || this.city.materials.stone >= 1)) {
			var convertedInto = timeMod * this.materialsMadePerStepPerWorker * this.activeWorkers * this.city.simulation.happiness.actionSpeedModifier * this.get_bonusSpeed() * this.city.simulation.boostManager.currentGlobalBoostAmount;
			this.city.materials.graphene += convertedInto;
			this.city.simulation.stats.materialProduction[8][0] += convertedInto;
			this.materialMade += convertedInto;
			var materialsUsed = convertedInto * this.efficiency;
			this.city.materials.knowledge -= materialsUsed;
			this.city.simulation.stats.materialUsed[10][0] += materialsUsed;
			this.totalKnowledgeUsed += materialsUsed;
			if(!this.usesNoStone) {
				var stoneUsed = convertedInto;
				this.city.materials.stone -= stoneUsed;
				this.city.simulation.stats.materialUsed[2][0] += stoneUsed;
				this.totalStoneUsed += stoneUsed;
			}
			return true;
		}
		return false;
	}
	,canShowActiveTextures: function() {
		if(this.usesNoStone || this.city.materials.stone >= 3) {
			return this.city.materials.knowledge >= 3;
		} else {
			return false;
		}
	}
	,workAnimation: function(citizen,timeMod) {
		var ind = this.workers.indexOf(citizen);
		if(ind == 1) {
			citizen.setRelativePos(3,0);
		} else if(ind == 0) {
			citizen.setRelativePos(15,0);
		} else if(ind == 2) {
			citizen.setRelativePos(11,10);
		} else {
			citizen.setRelativePos(15,10);
		}
	}
	,onCityChange: function() {
		if(this.leftBuilding != null && this.leftBuilding.is(buildings_StoneTeleporter)) {
			if(this.connectionSprite == null) {
				this.connectionSprite = new PIXI.Sprite(Resources.getTexture("spr_stoneteleporter_graphenefactory_connection"));
				this.city.justAboveCityStage.addChild(this.connectionSprite);
			}
			this.connectionSprite.position.set(this.position.x - 3,this.position.y + 1);
			this.usesNoStone = true;
		} else if(this.connectionSprite != null) {
			this.connectionSprite.destroy();
			this.connectionSprite = null;
			this.usesNoStone = false;
		}
	}
	,destroy: function() {
		if(this.connectionSprite != null) {
			this.connectionSprite.destroy();
			this.connectionSprite = null;
		}
		buildings_Factory.prototype.destroy.call(this);
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Factory.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("graphene_sheets_production",[_gthis.totalKnowledgeUsed | 0,_gthis.totalStoneUsed | 0,_gthis.materialMade | 0]);
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Factory.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_GrapheneFactory.saveDefinition);
		}
		var value = this.totalStoneUsed;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.totalKnowledgeUsed;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.materialMade;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		buildings_Factory.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalStoneUsed")) {
			this.totalStoneUsed = loadMap.h["totalStoneUsed"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalKnowledgeUsed")) {
			this.totalKnowledgeUsed = loadMap.h["totalKnowledgeUsed"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"materialMade")) {
			this.materialMade = loadMap.h["materialMade"];
		}
	}
	,__class__: buildings_GrapheneFactory
});
