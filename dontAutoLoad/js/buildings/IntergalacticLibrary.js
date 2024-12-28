var buildings_IntergalacticLibrary = $hxClasses["buildings.IntergalacticLibrary"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.knowledgeSoFar = 0;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 13;
	this.endTime = 23;
	this.workTimePreferenceMod = 0.5;
	this.isEntertainment = true;
};
buildings_IntergalacticLibrary.__name__ = "buildings.IntergalacticLibrary";
buildings_IntergalacticLibrary.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_IntergalacticLibrary.__super__ = buildings_Work;
buildings_IntergalacticLibrary.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		return 0;
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
		return 5;
	}
	,get_secondaryEntertainmentTypes: function() {
		return null;
	}
	,get_minimumNormalTimeToSpend: function() {
		return 2;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 5;
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
	,get_knowledgePerDay: function() {
		return 0.05 * (this.workers.length / 3) * common_ArrayExtensions.sum(this.city.progress.allCitiesInfo.subCityPops);
	}
	,get_possibleCityUpgrades: function() {
		return [cityUpgrades_GeneEditing,cityUpgrades_LibraryAllowDuplicates,cityUpgrades_ConnectedMachines];
	}
	,onBuild: function() {
		buildings_Work.prototype.onBuild.call(this);
		common_Achievements.achieve("INTERGALACTIC_LIBRARY");
	}
	,positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
	}
	,beEntertained: function(citizen,timeMod) {
		var moveFunction = function() {
			if(citizen.relativeY < 5) {
				citizen.moveAndWait(random_Random.getInt(3,7),random_Random.getInt(30,60),null,false,false);
			} else {
				citizen.moveAndWait(random_Random.getInt(3,16),random_Random.getInt(30,60),null,false,false);
			}
		};
		if(random_Random.getInt(2) == 1) {
			citizen.changeFloor(moveFunction);
		} else {
			var citizen1 = citizen;
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 8;
			arr[1] = random_Random.getInt(120,180);
			citizen1.setPath(arr,0,2,true);
			citizen.pathEndFunction = moveFunction;
			citizen.pathOnlyRelatedTo = citizen.inPermanent;
		}
		if(!citizen.hasBuildingInited) {
			citizen.educationLevel = Math.max(Math.min(citizen.educationLevel + 0.033,1.81),citizen.educationLevel);
			citizen.hasBuildingInited = true;
		}
	}
	,update: function(timeMod) {
		var addKnowledge = timeMod * (this.get_knowledgePerDay() / (1440 / this.city.simulation.time.minutesPerTick)) * this.city.simulation.boostManager.currentGlobalBoostAmount;
		this.city.materials.knowledge += addKnowledge;
		this.city.simulation.stats.materialProduction[10][0] += addKnowledge;
		this.knowledgeSoFar += addKnowledge;
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking && this.city.simulation.time.timeSinceStart / 60 % 24 > 23) {
			citizen.currentAction = 2;
		} else {
			switch(this.workers.indexOf(citizen)) {
			case 0:
				var spd = citizen.pathWalkSpeed * timeMod;
				Citizen.shouldUpdateDraw = true;
				if(Math.abs(15 - citizen.relativeX) < spd) {
					citizen.relativeX = 15;
				} else {
					var num = 15 - citizen.relativeX;
					citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
				}
				break;
			case 1:
				if(citizen.relativeY < 5) {
					citizen.changeFloor();
				} else {
					var spd = citizen.pathWalkSpeed * timeMod;
					Citizen.shouldUpdateDraw = true;
					if(Math.abs(7 - citizen.relativeX) < spd) {
						citizen.relativeX = 7;
					} else {
						var num = 7 - citizen.relativeX;
						citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
					}
				}
				break;
			case 2:
				if(citizen.relativeY < 5) {
					citizen.changeFloor();
				} else {
					var spd = citizen.pathWalkSpeed * timeMod;
					Citizen.shouldUpdateDraw = true;
					if(Math.abs(14 - citizen.relativeX) < spd) {
						citizen.relativeX = 14;
					} else {
						var num = 14 - citizen.relativeX;
						citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
					}
				}
				break;
			}
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Work.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("knowledge_gathered_per_day",[_gthis.get_knowledgePerDay() | 0]);
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("knowledge_gathered_so_far",[_gthis.knowledgeSoFar | 0]);
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_IntergalacticLibrary.saveDefinition);
		}
		var value = this.knowledgeSoFar;
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"knowledgeSoFar")) {
			this.knowledgeSoFar = loadMap.h["knowledgeSoFar"];
		}
	}
	,__class__: buildings_IntergalacticLibrary
});
