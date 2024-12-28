var buildings_Workshop = $hxClasses["buildings.Workshop"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.totalKnowledgeGenerated = 0;
	this.totalMaterialUsed = 0;
	this.materialMade = 0;
	this.isProducingKnowledge = true;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_Workshop.__name__ = "buildings.Workshop";
buildings_Workshop.__super__ = buildings_Work;
buildings_Workshop.prototype = $extend(buildings_Work.prototype,{
	onBuild: function() {
		this.city.simulation.bonuses.machinePartsFactorySpeed *= 1.25;
	}
	,get_possibleBuildingModes: function() {
		return [buildingUpgrades_WorkshopMachineParts,buildingUpgrades_WorkshopKnowledge];
	}
	,get_possibleCityUpgrades: function() {
		return [cityUpgrades_BuildingRecycling,cityUpgrades_BuildingRecycling2,cityUpgrades_BuildingRecycling3];
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
			return;
		}
		if(this.workers.indexOf(citizen) == 0) {
			if(random_Random.getInt(5) < 4) {
				var modifyWithHappiness = false;
				var slowMove = true;
				if(slowMove == null) {
					slowMove = false;
				}
				if(modifyWithHappiness == null) {
					modifyWithHappiness = false;
				}
				citizen.moveAndWait(random_Random.getInt(4,8),random_Random.getInt(60,120),null,modifyWithHappiness,slowMove);
			} else {
				var modifyWithHappiness = false;
				var slowMove = true;
				if(slowMove == null) {
					slowMove = false;
				}
				if(modifyWithHappiness == null) {
					modifyWithHappiness = false;
				}
				citizen.moveAndWait(random_Random.getInt(11,14),random_Random.getInt(60,120),null,modifyWithHappiness,slowMove);
			}
		} else if(citizen.relativeY < 2) {
			citizen.changeFloor();
		} else if(random_Random.getInt(2) == 0) {
			var modifyWithHappiness = false;
			var slowMove = true;
			if(slowMove == null) {
				slowMove = false;
			}
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(3,6),random_Random.getInt(60,120),null,modifyWithHappiness,slowMove);
		} else {
			var modifyWithHappiness = false;
			var slowMove = true;
			if(slowMove == null) {
				slowMove = false;
			}
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(13,14),random_Random.getInt(60,120),null,modifyWithHappiness,slowMove);
		}
		if(this.isProducingKnowledge) {
			var newKnowledge = 0.15 * citizen.get_educationSpeedModifier() * this.city.simulation.boostManager.currentGlobalBoostAmount;
			this.city.materials.knowledge += newKnowledge;
			this.city.simulation.stats.materialProduction[10][0] += newKnowledge;
			this.totalKnowledgeGenerated += newKnowledge;
		} else if(this.city.materials.wood >= 1) {
			var convertedInto = 0.075 * citizen.get_educationSpeedModifier() * this.city.simulation.boostManager.currentGlobalBoostAmount;
			this.city.materials.machineParts += convertedInto;
			this.city.simulation.stats.materialProduction[3][0] += convertedInto;
			this.materialMade += convertedInto;
			var materialsUsed = convertedInto * 2;
			this.city.materials.wood -= materialsUsed;
			this.city.simulation.stats.materialUsed[1][0] += materialsUsed;
			this.totalMaterialUsed += materialsUsed;
		}
	}
	,update: function(timeMod) {
		buildings_Work.prototype.update.call(this,timeMod);
	}
	,destroy: function() {
		buildings_Work.prototype.destroy.call(this);
		this.city.simulation.bonuses.machinePartsFactorySpeed /= 1.25;
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Work.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("knowledge_gathered",[_gthis.totalKnowledgeGenerated | 0]) + " " + common_Localize.lo("wood_used_for_machine_parts",[_gthis.totalMaterialUsed | 0,_gthis.materialMade | 0]);
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_Workshop.saveDefinition);
		}
		var value = this.materialMade;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.totalMaterialUsed;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.totalKnowledgeGenerated;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		buildings_Work.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"materialMade")) {
			this.materialMade = loadMap.h["materialMade"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalMaterialUsed")) {
			this.totalMaterialUsed = loadMap.h["totalMaterialUsed"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalKnowledgeGenerated")) {
			this.totalKnowledgeGenerated = loadMap.h["totalKnowledgeGenerated"];
		}
	}
	,__class__: buildings_Workshop
});
