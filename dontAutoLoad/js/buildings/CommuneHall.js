var buildings_CommuneHall = $hxClasses["buildings.CommuneHall"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.bldMode = 0;
	this.totalKnowledgeGenerated = 0;
	this.totalFoodConsumed = 0;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 13;
	this.endTime = 23.5;
	this.workTimePreferenceMod = 0.5;
	this.isEntertainment = true;
};
buildings_CommuneHall.__name__ = "buildings.CommuneHall";
buildings_CommuneHall.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_CommuneHall.__super__ = buildings_Work;
buildings_CommuneHall.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		return this.workers.length * 50;
	}
	,get_isOpen: function() {
		if(this.workers.length >= 1 && this.workers[0].currentAction == 0) {
			var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
			var start = this.startTime - this.workTimePreferenceMod;
			if(start < 23) {
				if(this1 >= start) {
					return this1 < 23;
				} else {
					return false;
				}
			} else if(!(this1 >= start)) {
				return this1 < 23;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}
	,get_entertainmentType: function() {
		return 0;
	}
	,get_secondaryEntertainmentTypes: function() {
		return null;
	}
	,get_minimumNormalTimeToSpend: function() {
		return 2;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 6;
	}
	,get_minimumEntertainmentGroupSatisfy: function() {
		return 1;
	}
	,get_maximumEntertainmentGroupSatisfy: function() {
		return 3;
	}
	,get_entertainmentQuality: function() {
		return 100;
	}
	,get_isOpenForExistingVisitors: function() {
		return this.get_isOpen();
	}
	,finishEntertainment: function(citizen,timeMod) {
		return true;
	}
	,get_possibleBuildingModes: function() {
		return [buildingUpgrades_FreeThinkers,buildingUpgrades_WellFedThinkers];
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
			return;
		}
		var newKnowledge = (this.bldMode == 1 ? 0.00321 : 0.00121) * timeMod * this.city.simulation.happiness.actionSpeedModifier * citizen.get_educationSpeedModifier() * this.city.simulation.boostManager.currentGlobalBoostAmount;
		if(this.bldMode == 1) {
			var foodConsumption = 0.5 * newKnowledge;
			if(this.city.materials.food > foodConsumption) {
				var _g = this.city.materials;
				_g.set_food(_g.food - foodConsumption);
				this.city.simulation.stats.materialUsed[0][0] += foodConsumption;
				this.totalFoodConsumed += foodConsumption;
				this.city.materials.knowledge += newKnowledge;
				this.city.simulation.stats.materialProduction[10][0] += newKnowledge;
				this.totalKnowledgeGenerated += newKnowledge;
			}
		} else {
			this.city.materials.knowledge += newKnowledge;
			this.city.simulation.stats.materialProduction[10][0] += newKnowledge;
			this.totalKnowledgeGenerated += newKnowledge;
		}
		var ind = this.workers.indexOf(citizen);
		switch(ind) {
		case 0:
			if(random_Random.getInt(180) == 1) {
				citizen.moveAndWait(random_Random.getInt(3,5),random_Random.getInt(60,90),null,false,false);
			} else {
				var spd = citizen.pathWalkSpeed * timeMod;
				Citizen.shouldUpdateDraw = true;
				if(Math.abs(6 - citizen.relativeX) < spd) {
					citizen.relativeX = 6;
				} else {
					var num = 6 - citizen.relativeX;
					citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
				}
			}
			break;
		case 1:
			if(random_Random.getInt(180) == 1) {
				citizen.moveAndWait(random_Random.getInt(14,16),random_Random.getInt(60,90),null,false,false);
			} else {
				var spd = citizen.pathWalkSpeed * timeMod;
				Citizen.shouldUpdateDraw = true;
				if(Math.abs(11 - citizen.relativeX) < spd) {
					citizen.relativeX = 11;
				} else {
					var num = 11 - citizen.relativeX;
					citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
				}
			}
			break;
		case 2:
			if(citizen.relativeY < 5) {
				citizen.changeFloor();
			} else if(random_Random.getInt(120) == 1) {
				citizen.moveAndWait(random_Random.getInt(13,15),random_Random.getInt(60,90),null,false,false);
			} else {
				var spd = citizen.pathWalkSpeed * timeMod;
				Citizen.shouldUpdateDraw = true;
				if(Math.abs(3 - citizen.relativeX) < spd) {
					citizen.relativeX = 3;
				} else {
					var num = 3 - citizen.relativeX;
					citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
				}
			}
			break;
		}
	}
	,beEntertained: function(citizen,timeMod) {
		var modifyWithHappiness = false;
		var slowMove = true;
		if(slowMove == null) {
			slowMove = false;
		}
		if(modifyWithHappiness == null) {
			modifyWithHappiness = false;
		}
		citizen.moveAndWait(random_Random.getInt(3,16),random_Random.getInt(30,50),null,modifyWithHappiness,slowMove);
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Work.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("food_consumed_knowledge_generated",[_gthis.totalKnowledgeGenerated | 0,_gthis.totalFoodConsumed | 0]);
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_CommuneHall.saveDefinition);
		}
		var value = this.totalFoodConsumed;
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalFoodConsumed")) {
			this.totalFoodConsumed = loadMap.h["totalFoodConsumed"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalKnowledgeGenerated")) {
			this.totalKnowledgeGenerated = loadMap.h["totalKnowledgeGenerated"];
		}
	}
	,__class__: buildings_CommuneHall
});
