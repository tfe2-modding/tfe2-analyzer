var buildings_FeatherAlliance = $hxClasses["buildings.FeatherAlliance"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.timeToCheckBuildings = 0;
	this.currentMission = 0;
	buildings_WorkWithHome.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 12;
	this.endTime = 2;
	this.workTimePreferenceMod = 0.3;
};
buildings_FeatherAlliance.__name__ = "buildings.FeatherAlliance";
buildings_FeatherAlliance.__super__ = buildings_WorkWithHome;
buildings_FeatherAlliance.prototype = $extend(buildings_WorkWithHome.prototype,{
	addWindowInfoLines: function() {
		var _gthis = this;
		buildings_WorkWithHome.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return _gthis.missionGetTitle();
		},"Arial15");
		this.city.gui.windowAddInfoText(null,function() {
			return _gthis.missionGetText();
		});
	}
	,missionGetTitle: function() {
		if(this.currentMission == 8) {
			return common_Localize.lo("thank_you");
		}
		return common_Localize.lo("current_task");
	}
	,missionGetText: function() {
		if(this.currentMission >= 8) {
			return common_Localize.lo("feather_alliance_done");
		}
		if(this.workers.length != this.get_jobs()) {
			return common_Localize.lo("jobs_filled_featheralliance");
		}
		return common_Localize.lo("feather_alliance_mission_" + this.currentMission);
	}
	,checkMissionCompletions: function() {
		var missionComplete = false;
		while(true) {
			missionComplete = false;
			if(this.currentMission == 0) {
				missionComplete = common_ArrayExtensions.any(this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("graphene")],function(mt) {
					return mt >= 100;
				});
			} else if(this.currentMission == 1) {
				missionComplete = simulation_RocketMission.getDestinationFindPct(this.city,0) > 0.9999;
				if(missionComplete) {
					this.city.progress.unlocks.unlock(buildings_RooftopPark);
				}
			} else if(this.currentMission == 4) {
				missionComplete = simulation_RocketMission.getDestinationFindPct(this.city,1) > 0.9999;
			} else if(this.currentMission == 3) {
				missionComplete = this.city.progress.unlocks.getUnlockState(buildingUpgrades_TheMachineUpgrade) == progress_UnlockState.Researched;
			} else if(this.currentMission < 8 && this.timeToCheckBuildings <= 0) {
				var buildingsByType = this.city.getAmountOfPermanentsPerType();
				switch(this.currentMission) {
				case 2:
					missionComplete = buildingsByType.h["buildings.RooftopPark"] >= 10;
					if(missionComplete) {
						this.city.progress.unlocks.unlock(buildingUpgrades_TheMachineUpgrade);
					}
					break;
				case 6:
					missionComplete = buildingsByType.h["buildings.Mansion"] >= 2;
					if(missionComplete) {
						this.city.progress.unlocks.unlock(buildings_IntergalacticLibrary);
					}
					break;
				case 7:
					missionComplete = buildingsByType.h["buildings.IntergalacticLibrary"] >= 1;
					break;
				}
				this.timeToCheckBuildings = 30;
			}
			if(missionComplete) {
				this.currentMission += 1;
				this.timeToCheckBuildings = 0;
				this.city.progress.goalHelp.updateHasBuildingGoal();
			}
			if(!missionComplete) {
				break;
			}
		}
	}
	,update: function(timeMod) {
		buildings_WorkWithHome.prototype.update.call(this,timeMod);
		this.checkMissionCompletions();
		this.timeToCheckBuildings -= timeMod;
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
			return;
		}
		this.walkAround(citizen,150);
	}
	,walkAround: function(citizen,stepsInBuilding) {
		var r = random_Random.getInt(5);
		if(r == 0 && stepsInBuilding > 120) {
			citizen.changeFloorAndWaitRandom(30,60);
		} else if(r == 1 && citizen.relativeY < 5) {
			citizen.moveAndWait(random_Random.getInt(3,7),random_Random.getInt(30,60),null,false,false);
		} else if(r == 2) {
			citizen.moveAndWait(random_Random.getInt(12,13),random_Random.getInt(30,60),null,false,false);
		} else {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 8;
			arr[1] = random_Random.getInt(90,120);
			citizen.setPath(arr,0,2,true);
			citizen.pathEndFunction = null;
			citizen.pathOnlyRelatedTo = citizen.inPermanent;
		}
	}
	,getGlobalGoal: function() {
		if(this.currentMission == 8) {
			return null;
		}
		return { category : common_Localize.lo("feather_alliance_mission"), text : this.missionGetText()};
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_WorkWithHome.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_FeatherAlliance.saveDefinition);
		}
		var value = this.currentMission;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue,definition) {
		buildings_WorkWithHome.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentMission")) {
			this.currentMission = loadMap.h["currentMission"];
		}
	}
	,__class__: buildings_FeatherAlliance
});
