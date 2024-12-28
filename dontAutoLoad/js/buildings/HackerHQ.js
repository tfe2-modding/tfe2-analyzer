var buildings_HackerHQ = $hxClasses["buildings.HackerHQ"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.timeToCheckBuildings = 0;
	this.currentMission = 0;
	this.manyTeleportAlpha = 0;
	this.eventPhase = 0;
	this.doingEvent = -1;
	this.lastEventDoneOnDay = 0;
	buildings_WorkWithHome.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 14;
	this.endTime = 3;
	this.workTimePreferenceMod = 0.3;
	this.boltSprite = new PIXI.Sprite(Resources.getTexture("spr_hackers_bolt"));
	this.boltSprite.position.set(position.x + 12,position.y + 11);
	stage.addChild(this.boltSprite);
	if(worldPosition.y == 0) {
		this.boltSprite.alpha = 0;
	}
};
buildings_HackerHQ.__name__ = "buildings.HackerHQ";
buildings_HackerHQ.__super__ = buildings_WorkWithHome;
buildings_HackerHQ.prototype = $extend(buildings_WorkWithHome.prototype,{
	positionSprites: function() {
		buildings_WorkWithHome.prototype.positionSprites.call(this);
		this.boltSprite.position.set(this.position.x + 12,this.position.y + 11);
		if(this.worldPosition.y == 0) {
			this.boltSprite.alpha = 0;
		}
	}
	,destroy: function() {
		this.boltSprite.destroy();
		buildings_WorkWithHome.prototype.destroy.call(this);
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_WorkWithHome.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.window,new common_Point(4,4)));
		var anySQ = false;
		if(this.currentMission == 11) {
			anySQ = gui_CurrentMissionsWindow.displaySidequestsWithTag(this.city,this.city.gui,this.city.gui.innerWindowStage,this.city.gui.windowInner,"Hackers");
		}
		if(!anySQ) {
			this.city.gui.windowAddInfoText(null,function() {
				return _gthis.missionGetTitle();
			},"Arial15");
			this.city.gui.windowAddInfoText(null,function() {
				return _gthis.missionGetText();
			});
		}
	}
	,missionGetTitle: function() {
		if(this.currentMission == 11) {
			return common_Localize.lo("thank_you");
		}
		return common_Localize.lo("current_task");
	}
	,missionGetText: function() {
		if(this.currentMission >= 11) {
			return common_Localize.lo("hackers_done");
		}
		if(this.workers.length != this.get_jobs()) {
			return common_Localize.lo("hackers_gather");
		}
		return common_Localize.lo("hacker_mission_" + this.currentMission);
	}
	,checkMissionCompletions: function() {
		var missionComplete = false;
		while(true) {
			missionComplete = false;
			switch(this.currentMission) {
			case 3:
				missionComplete = this.city.progress.unlocks.getUnlockState(buildingUpgrades_RefinedMetalsFactoryHack) == progress_UnlockState.Researched;
				if(missionComplete) {
					this.city.progress.unlocks.unlock(buildings_FactoryPub);
				}
				break;
			case 5:
				missionComplete = common_ArrayExtensions.any(this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("computerChips")],function(mt) {
					return mt >= 20;
				});
				if(missionComplete) {
					this.city.progress.unlocks.unlock(buildings_ScrapyardNightClub);
				}
				break;
			case 8:
				missionComplete = this.city.progress.unlocks.getUnlockState(buildingUpgrades_AutomaticWaterManagement) == progress_UnlockState.Researched;
				if(missionComplete) {
					this.city.progress.unlocks.unlock(buildings_HoloGameHall);
				}
				break;
			default:
			}
			if(this.timeToCheckBuildings <= 0 && this.currentMission != 3 && this.currentMission != 5 && this.currentMission != 8 && this.currentMission != 11) {
				var buildingsByType = this.city.getAmountOfPermanentsPerType();
				switch(this.currentMission) {
				case 0:
					if(buildingsByType.h["buildings.ExperimentationLab"] == null) {
						buildingsByType.h["buildings.ExperimentationLab"] = 0;
					}
					missionComplete = buildingsByType.h["buildings.Laboratory"] + buildingsByType.h["buildings.ExperimentationLab"] >= 20;
					if(missionComplete) {
						this.city.progress.unlocks.unlock(buildings_Library);
					}
					break;
				case 1:
					missionComplete = buildingsByType.h["buildings.Library"] >= 3;
					if(missionComplete) {
						this.city.progress.unlocks.unlock(buildings_TinkerersHome);
					}
					break;
				case 2:
					missionComplete = buildingsByType.h["buildings.TinkerersHome"] >= 5;
					if(missionComplete) {
						this.city.progress.unlocks.unlock(buildingUpgrades_RefinedMetalsFactoryHack);
					}
					break;
				case 4:
					missionComplete = buildingsByType.h["buildings.FactoryPub"] >= 1;
					break;
				case 6:
					missionComplete = buildingsByType.h["buildings.ScrapyardNightClub"] >= 7;
					if(missionComplete) {
						this.city.progress.unlocks.unlock(buildings_EscapeRoom);
					}
					break;
				case 7:
					missionComplete = buildingsByType.h["buildings.EscapeRoom"] >= 1;
					if(missionComplete) {
						this.city.progress.unlocks.unlock(buildingUpgrades_AutomaticWaterManagement);
					}
					break;
				case 9:
					missionComplete = buildingsByType.h["buildings.HoloGameHall"] >= 2;
					if(missionComplete) {
						this.city.progress.unlocks.unlock(buildings_Misdirector);
					}
					break;
				case 10:
					missionComplete = buildingsByType.h["buildings.Misdirector"] >= 1;
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
		if(((this.city.simulation.time.timeSinceStart | 0) / 60 | 0) % 24 >= 0 && ((this.city.simulation.time.timeSinceStart | 0) / 60 | 0) % 24 < 4) {
			var val = 4.0 - 4.0 * Math.abs(1.0 - this.city.simulation.time.timeSinceStart / 60 % 24 / 2.0);
			this.boltSprite.alpha = val < 0 ? 0 : val > 1 ? 1 : val;
		} else {
			this.boltSprite.alpha = 0;
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
			return;
		}
		this.doWalkAround(citizen);
	}
	,walkAround: function(citizen,stepsInBuilding) {
		this.doWalkAround(citizen);
	}
	,doWalkAround: function(citizen) {
		if(citizen.relativeY > 5) {
			if(random_Random.getInt(4) == 1 && citizen.relativeX > 5) {
				citizen.changeFloor();
			} else {
				citizen.moveAndWait(random_Random.fromArray(buildings_HackerHQ.walkAroundPositions),random_Random.getInt(60,120));
			}
		} else if(random_Random.getInt(4) == 1) {
			citizen.changeFloor();
		} else if(random_Random.getInt(3) == 1) {
			citizen.moveAndWait(random_Random.getInt(5,7),random_Random.getInt(90,150),null,false,false);
		} else {
			citizen.moveAndWait(random_Random.getInt(9,15),random_Random.getInt(60,150),null,false,false);
		}
	}
	,getGlobalGoal: function() {
		if(this.currentMission == 11) {
			return null;
		}
		return { category : common_Localize.lo("hackers_mission"), text : this.missionGetText()};
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_WorkWithHome.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_HackerHQ.saveDefinition);
		}
		var value = this.lastEventDoneOnDay;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.doingEvent;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.eventPhase;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"lastEventDoneOnDay")) {
			this.lastEventDoneOnDay = loadMap.h["lastEventDoneOnDay"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"doingEvent")) {
			this.doingEvent = loadMap.h["doingEvent"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"eventPhase")) {
			this.eventPhase = loadMap.h["eventPhase"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentMission")) {
			this.currentMission = loadMap.h["currentMission"];
		}
	}
	,__class__: buildings_HackerHQ
});
