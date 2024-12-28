var buildings_VolunteersCenter = $hxClasses["buildings.VolunteersCenter"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.noGarden = false;
	this.noFarm = false;
	this.totalKnowledgeGenerated = 0;
	this.totalFoodGenerated = 0;
	this.totalWoodGenerated = 0;
	this.totalStoneGenerated = 0;
	this.woodCutPerActionBoost = 1;
	this.stoneMinedPerActionBoost = 1;
	buildings_BlueCollarWork.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 7;
};
buildings_VolunteersCenter.__name__ = "buildings.VolunteersCenter";
buildings_VolunteersCenter.__super__ = buildings_BlueCollarWork;
buildings_VolunteersCenter.prototype = $extend(buildings_BlueCollarWork.prototype,{
	get_stoneMinedPerAction: function() {
		return 0.3 * this.stoneMinedPerActionBoost;
	}
	,get_possibleUpgrades: function() {
		return [buildingUpgrades_BetterVolunteersTools];
	}
	,onBuild: function() {
		buildings_BlueCollarWork.prototype.onBuild.call(this);
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		var _gthis = this;
		if(shouldStopWorking) {
			if(!citizen.hasWorkTools) {
				citizen.currentAction = 2;
			} else if(citizen.inPermanent == this) {
				citizen.moveAndWait(4,20,function() {
					citizen.hasWorkTools = false;
				});
			} else {
				citizen.simulation.pathfinder.findPath(citizen,this);
				citizen.pathOnFail = null;
			}
			return;
		}
		var workType = citizen.dynamicUnsavedVars.volunteerWorkType;
		if(workType == null || citizen.dynamicUnsavedVars.volunteerWorkTypeDay != 1 + ((this.city.simulation.time.timeSinceStart | 0) / 1440 | 0)) {
			workType = -1;
		}
		if(workType == -1 && citizen.inPermanent != null && citizen.inPermanent != this) {
			if(citizen.inPermanent.is(worldResources_Rock) || citizen.inPermanent.is(buildings_StoneTeleporter)) {
				workType = 0;
			} else if(citizen.inPermanent.is(buildings_TreePlantation)) {
				workType = 1;
			} else if(citizen.inPermanent.is(buildings_EcoFarm)) {
				workType = 2;
			} else if(citizen.inPermanent.is(buildings_Park) || citizen.inPermanent.is(buildings_BotanicalGardens)) {
				workType = 3;
			}
		}
		if(workType == -1) {
			workType = random_Random.getInt(4);
			if(workType == 2 && this.noFarm) {
				workType = random_Random.getInt(2);
			}
			citizen.dynamicUnsavedVars.volunteerWorkType = workType;
			citizen.dynamicUnsavedVars.volunteerWorkTypeDay = 1 + ((this.city.simulation.time.timeSinceStart | 0) / 1440 | 0);
		}
		if(workType == 0) {
			this.doBlueCollarJob(citizen,timeMod,shouldStopWorking,[worldResources_Rock,buildings_StoneTeleporter],function(rock) {
				var finalStoneMineAction = _gthis.get_stoneMinedPerAction() * _gthis.city.upgrades.vars.stoneMiningSpeed;
				var _this = _gthis.city.simulation;
				var finalStoneMineAction1 = finalStoneMineAction * (Config.earlyGameFix1 && _this.citizens.length < 30 ? 1.3 - 0.3 * (_this.citizens.length / 60) : 1) * _gthis.city.simulation.boostManager.currentGlobalBoostAmount;
				_gthis.city.materials.stone += finalStoneMineAction1;
				_gthis.city.simulation.stats.materialProduction[2][0] += finalStoneMineAction1;
				rock.materialsLeft -= finalStoneMineAction1;
				_gthis.totalStoneGenerated += finalStoneMineAction1;
			},90,120);
		}
		if(workType == 1) {
			this.doBlueCollarJob(citizen,timeMod,shouldStopWorking,[buildings_TreePlantation],function(forest) {
				var _this = _gthis.city.simulation;
				var finalWoodCutPerAction = 0.3 * _gthis.woodCutPerActionBoost * (_gthis.city.progress.story.hiddenBoost && _gthis.city.materials.wood <= 6 ? 1.75 : 1) * (Config.earlyGameFix1 && _this.citizens.length < 30 ? 1.3 - 0.3 * (_this.citizens.length / 60) : 1) * _gthis.city.simulation.boostManager.currentGlobalBoostAmount;
				_gthis.city.materials.wood += finalWoodCutPerAction;
				_gthis.city.simulation.stats.materialProduction[1][0] += finalWoodCutPerAction;
				forest.materialsLeft -= finalWoodCutPerAction;
				_gthis.totalWoodGenerated += finalWoodCutPerAction;
			},60,90);
		}
		if(workType == 2) {
			if(citizen.inPermanent != null && citizen.inPermanent.is(buildings_EcoFarm)) {
				var foodNow = this.city.materials.food;
				var woodNow = this.city.materials.wood;
				var val = this.position.x + this.position.y;
				citizen.inPermanent.workExternal(citizen,timeMod,false,(this.workers.indexOf(citizen) + (val < 0 ? -val : val)) % 3);
				this.totalFoodGenerated += foodNow - this.city.materials.food;
				this.totalWoodGenerated += woodNow - this.city.materials.wood;
			} else {
				var notRateLimited = this.city.simulation.permanentFinder.canPerformQuery();
				if(notRateLimited) {
					var nearestResourceGatherPlace = this.city.simulation.permanentFinder.query(this,function(pm) {
						return pm.is(buildings_EcoFarm);
					},null,null,null,200);
					if(nearestResourceGatherPlace == null) {
						this.noFarm = true;
					}
					if(!this.noFarm) {
						citizen.simulation.pathfinder.findPath(citizen,nearestResourceGatherPlace);
						citizen.pathOnFail = null;
					} else {
						citizen.dynamicUnsavedVars.volunteerWorkType = null;
					}
				}
			}
		}
		if(workType == 3) {
			if(citizen.inPermanent != null && (citizen.inPermanent.is(buildings_Park) || citizen.inPermanent.is(buildings_BotanicalGardens))) {
				buildings_buildingBehaviours_ParkWalk.beEntertainedPark((citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).leftBuilding,(citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).rightBuilding,citizen);
				var newKnowledge = 0.1875 * this.city.simulation.happiness.actionSpeedModifier * this.city.simulation.bonuses.labSpeed * citizen.get_educationSpeedModifier() * this.city.simulation.boostManager.currentGlobalBoostAmount;
				this.city.materials.knowledge += newKnowledge;
				this.city.simulation.stats.materialProduction[10][0] += newKnowledge;
				this.totalKnowledgeGenerated += newKnowledge;
			} else {
				var notRateLimited = this.city.simulation.permanentFinder.canPerformQuery();
				if(notRateLimited) {
					var nearestResourceGatherPlace = this.city.simulation.permanentFinder.query(this,function(pm) {
						if(!pm.is(buildings_Park)) {
							return pm.is(buildings_BotanicalGardens);
						} else {
							return true;
						}
					},null,null,null,200);
					if(nearestResourceGatherPlace == null) {
						this.noGarden = true;
					}
					if(!this.noGarden) {
						citizen.simulation.pathfinder.findPath(citizen,nearestResourceGatherPlace);
						citizen.pathOnFail = null;
					} else {
						citizen.dynamicUnsavedVars.volunteerWorkType = null;
					}
				}
			}
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_BlueCollarWork.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("volunteers_center_explain_extra");
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("wood_cut_amount",[_gthis.totalWoodGenerated | 0]);
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("stone_mined_amount",[_gthis.totalStoneGenerated | 0]);
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("food_gathered",[_gthis.totalFoodGenerated | 0]);
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("knowledge_gathered",[_gthis.totalKnowledgeGenerated | 0]);
		});
	}
	,invalidatePathfindingRelatedInfo: function() {
		buildings_BlueCollarWork.prototype.invalidatePathfindingRelatedInfo.call(this);
		this.noFarm = false;
		this.noGarden = false;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_BlueCollarWork.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_VolunteersCenter.saveDefinition);
		}
		var value = this.totalStoneGenerated;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.totalWoodGenerated;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.totalFoodGenerated;
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
		buildings_BlueCollarWork.prototype.load.call(this,queue);
		if(queue.version < 70) {
			return;
		}
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalStoneGenerated")) {
			this.totalStoneGenerated = loadMap.h["totalStoneGenerated"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalWoodGenerated")) {
			this.totalWoodGenerated = loadMap.h["totalWoodGenerated"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalFoodGenerated")) {
			this.totalFoodGenerated = loadMap.h["totalFoodGenerated"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalKnowledgeGenerated")) {
			this.totalKnowledgeGenerated = loadMap.h["totalKnowledgeGenerated"];
		}
	}
	,__class__: buildings_VolunteersCenter
});
