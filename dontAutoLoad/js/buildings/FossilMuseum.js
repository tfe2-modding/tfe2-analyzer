var buildings_FossilMuseum = $hxClasses["buildings.FossilMuseum"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.totalKnowledgeGenerated = 0;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 14;
	this.endTime = 23;
	this.workTimePreferenceMod = 0.5;
	this.isEntertainment = true;
};
buildings_FossilMuseum.__name__ = "buildings.FossilMuseum";
buildings_FossilMuseum.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_FossilMuseum.__super__ = buildings_Work;
buildings_FossilMuseum.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		return 0;
	}
	,get_isOpen: function() {
		if(this.workers.length >= 1 && common_ArrayExtensions.any(this.workers,function(w) {
			return w.currentAction == 0;
		})) {
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
	,onBuild: function() {
		buildings_Work.prototype.onBuild.call(this);
		common_Achievements.achieve("FOSSILIZED");
	}
	,positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
	}
	,beEntertained: function(citizen,timeMod) {
		var moveFunction = function() {
			if(citizen.relativeY < 5) {
				if(random_Random.getFloat() < 1) {
					var slowMove = true;
					if(slowMove == null) {
						slowMove = false;
					}
					var moveToX = random_Random.getInt(12,16);
					if(slowMove) {
						var citizen1 = citizen;
						var pool = pooling_Int32ArrayPool.pool;
						var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
						arr[0] = 12;
						arr[1] = 50;
						arr[2] = 4;
						arr[3] = moveToX;
						citizen1.setPath(arr,0,4,true);
					} else {
						var citizen1 = citizen;
						var pool = pooling_Int32ArrayPool.pool;
						var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
						arr[0] = 4;
						arr[1] = moveToX;
						citizen1.setPath(arr,0,2,true);
					}
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
				} else {
					var slowMove = true;
					if(slowMove == null) {
						slowMove = false;
					}
					if(slowMove) {
						var citizen1 = citizen;
						var pool = pooling_Int32ArrayPool.pool;
						var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
						arr[0] = 12;
						arr[1] = 50;
						arr[2] = 4;
						arr[3] = 6;
						citizen1.setPath(arr,0,4,true);
					} else {
						var citizen1 = citizen;
						var pool = pooling_Int32ArrayPool.pool;
						var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
						arr[0] = 4;
						arr[1] = 6;
						citizen1.setPath(arr,0,2,true);
					}
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
				}
			} else {
				var slowMove = true;
				if(slowMove == null) {
					slowMove = false;
				}
				var moveToX = random_Random.getInt(4,15);
				if(slowMove) {
					var citizen1 = citizen;
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
					arr[0] = 12;
					arr[1] = 50;
					arr[2] = 4;
					arr[3] = moveToX;
					citizen1.setPath(arr,0,4,true);
				} else {
					var citizen1 = citizen;
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = moveToX;
					citizen1.setPath(arr,0,2,true);
				}
				citizen.pathEndFunction = null;
				citizen.pathOnlyRelatedTo = citizen.inPermanent;
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
			citizen.educationLevel = Math.max(Math.min(citizen.educationLevel + 0.035,1.61),citizen.educationLevel);
			citizen.hasBuildingInited = true;
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
		} else {
			switch(this.workers.indexOf(citizen)) {
			case 0:
				var spd = citizen.pathWalkSpeed * timeMod;
				Citizen.shouldUpdateDraw = true;
				if(Math.abs(6 - citizen.relativeX) < spd) {
					citizen.relativeX = 6;
				} else {
					var num = 6 - citizen.relativeX;
					citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
				}
				var newKnowledge = 0.001 * this.city.simulation.bonuses.fossilsCollected * timeMod * this.city.simulation.happiness.actionSpeedModifier * citizen.get_educationSpeedModifier() * this.city.simulation.boostManager.currentGlobalBoostAmount * this.workers.length;
				this.city.materials.knowledge += newKnowledge;
				this.city.simulation.stats.materialProduction[10][0] += newKnowledge;
				this.totalKnowledgeGenerated += newKnowledge;
				break;
			case 1:
				citizen.moveAndWait(random_Random.getInt(12,16),random_Random.getInt(120,180),null,false,false);
				break;
			case 2:
				if(citizen.relativeY < 5) {
					citizen.changeFloor();
				} else {
					citizen.moveAndWait(random_Random.getInt(4,16),random_Random.getInt(120,180),null,false,false);
				}
				break;
			}
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Work.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("knowledge_gathered",[_gthis.totalKnowledgeGenerated | 0]);
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_FossilMuseum.saveDefinition);
		}
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalKnowledgeGenerated")) {
			this.totalKnowledgeGenerated = loadMap.h["totalKnowledgeGenerated"];
		}
	}
	,__class__: buildings_FossilMuseum
});
