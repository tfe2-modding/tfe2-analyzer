var buildings_SecretSocietyHouse = $hxClasses["buildings.SecretSocietyHouse"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.isScenarioVariant = false;
	this.givenStatueReward = false;
	this.timeToCheckBuildings = 0;
	this.currentMission = 0;
	this.ownLibrary = null;
	this.ownPub = null;
	this.manyTeleportAlpha = 0;
	this.eventPhase = 0;
	this.doingEvent = -1;
	this.lastEventDoneOnDay = 0;
	buildings_WorkWithHome.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 12;
	this.endTime = 2;
	this.workTimePreferenceMod = 0.3;
	this.isScenarioVariant = city.progress.story.storyName == "cityofthekey";
};
buildings_SecretSocietyHouse.__name__ = "buildings.SecretSocietyHouse";
buildings_SecretSocietyHouse.__super__ = buildings_WorkWithHome;
buildings_SecretSocietyHouse.prototype = $extend(buildings_WorkWithHome.prototype,{
	onBuild: function() {
		this.city.progress.unlocks.unlock(cityUpgrades_SecretiveLiving);
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_WorkWithHome.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.window,new common_Point(4,4)));
		var anySQ = false;
		if(this.currentMission == 8) {
			anySQ = gui_CurrentMissionsWindow.displaySidequestsWithTag(this.city,this.city.gui,this.city.gui.innerWindowStage,this.city.gui.windowInner,"SecretSociety");
		}
		if(!this.isScenarioVariant && !anySQ) {
			this.city.gui.windowAddInfoText(null,function() {
				return _gthis.missionGetTitle();
			},"Arial15");
			this.city.gui.windowAddInfoText(null,function() {
				return _gthis.missionGetText();
			});
		}
	}
	,missionGetTitle: function() {
		if(this.currentMission == 8) {
			return common_Localize.lo("thank_you");
		}
		return common_Localize.lo("current_task");
	}
	,missionGetText: function() {
		if(this.currentMission >= 8) {
			return common_Localize.lo("forever_grateful");
		}
		if(this.workers.length != this.get_jobs()) {
			return common_Localize.lo("jobs_filled_secretsociety");
		}
		return common_Localize.lo("secret_society_mission_" + this.currentMission);
	}
	,checkMissionCompletions: function() {
		var missionComplete = false;
		while(true) {
			missionComplete = false;
			switch(this.currentMission) {
			case 0:
				missionComplete = common_ArrayExtensions.any(this.city.upgrades.upgrades,function(cu) {
					return ((cu) instanceof cityUpgrades_SecretiveLiving);
				});
				break;
			case 1:
				missionComplete = common_ArrayExtensions.any(this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("wood")],function(mt) {
					return mt >= 1000;
				});
				break;
			case 6:
				missionComplete = common_ArrayExtensions.any(this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("knowledge")],function(mt) {
					return mt >= 1000;
				});
				if(missionComplete) {
					this.city.progress.unlocks.unlock(buildings_TheMachine);
				}
				break;
			}
			if(this.currentMission != 0 && this.currentMission != 1 && this.currentMission != 6 && this.currentMission < 8 && this.timeToCheckBuildings <= 0) {
				var buildingsByType = this.city.getAmountOfPermanentsPerType();
				switch(this.currentMission) {
				case 2:
					missionComplete = buildingsByType.h["buildings.BotanicalGardens"] >= 50;
					if(missionComplete) {
						this.city.progress.unlocks.unlock(buildings_StatueGarden);
					}
					break;
				case 3:
					missionComplete = buildingsByType.h["buildings.StatueGarden"] >= 12;
					break;
				case 4:
					missionComplete = buildingsByType.h["buildings.Teleporter"] >= 7;
					if(missionComplete) {
						this.city.progress.unlocks.unlock(buildings_Villa);
					}
					break;
				case 5:
					missionComplete = buildingsByType.h["buildings.Villa"] >= 5;
					break;
				case 7:
					missionComplete = buildingsByType.h["buildings.TheMachine"] >= 1;
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
		if(this.doingEvent == 1 && this.eventPhase >= 1) {
			if(this.manyTeleportAlpha < 1) {
				this.manyTeleportAlpha += 0.05;
				var _g = 0;
				var _g1 = this.workers;
				while(_g < _g1.length) {
					var worker = _g1[_g];
					++_g;
					worker.sprite.alpha = this.manyTeleportAlpha;
				}
			} else {
				this.doingEvent = -1;
				this.eventPhase = 0;
				var _g = 0;
				var _g1 = this.workers;
				while(_g < _g1.length) {
					var worker = _g1[_g];
					++_g;
					worker.sprite.alpha = 1;
				}
			}
		}
		if(!this.isScenarioVariant) {
			this.checkMissionCompletions();
		}
		this.timeToCheckBuildings -= timeMod;
		if(!this.givenStatueReward) {
			var _g = 0;
			var _g1 = this.workers;
			while(_g < _g1.length) {
				var worker = _g1[_g];
				++_g;
				if(worker.get_age() >= 500) {
					if(!this.givenStatueReward) {
						this.city.progress.unlocks.unlock(buildings_StatueOfTheKey);
					}
					this.givenStatueReward = true;
				}
			}
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		var _gthis = this;
		if(this.doingEvent != -1) {
			if(this.doingEvent == 1) {
				if(this.eventPhase == 0) {
					if(common_ArrayExtensions.all(this.workers,function(w) {
						if(w.inPermanent != null && w.inPermanent.is(buildings_Teleporter) && w.relativeX == w.inPermanent.teleportX && w.path == null) {
							return !w.isRequestingPath;
						} else {
							return false;
						}
					})) {
						this.eventPhase = 1;
						var _g = 0;
						var _g1 = this.workers;
						while(_g < _g1.length) {
							var worker = _g1[_g];
							++_g;
							var inPermanent = worker.inPermanent;
							if(inPermanent != null) {
								inPermanent.createTeleportParticle("spr_teleporter_ray_key");
								inPermanent.timesUsed += 1;
							}
							worker.onWorld = this.world;
							worker.setRelativePos(random_Random.getInt(this.world.rect.width - 2),0);
							worker.inPermanent = null;
							worker.addToOnWorldStage();
							worker.sprite.alpha = 0;
							this.manyTeleportAlpha = 0;
						}
					} else if(citizen.inPermanent == null || !citizen.inPermanent.is(buildings_Teleporter)) {
						var manyTeleportTeleporter = this.city.simulation.permanentFinder.quickQueryForCitizen(citizen,function(pm) {
							return pm.is(buildings_Teleporter);
						},"secretSocietyTeleporterQuery" + this.id,3);
						if(manyTeleportTeleporter == null) {
							this.doingEvent = -1;
						} else {
							citizen.simulation.pathfinder.findPath(citizen,manyTeleportTeleporter);
							citizen.pathOnFail = null;
						}
					} else {
						var x = citizen.inPermanent.teleportX;
						var spd = citizen.pathWalkSpeed * timeMod;
						Citizen.shouldUpdateDraw = true;
						if(Math.abs(x - citizen.relativeX) < spd) {
							citizen.relativeX = x;
						} else {
							var num = x - citizen.relativeX;
							citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
						}
					}
				}
				return;
			}
			if(this.doingEvent == 2) {
				if(citizen.inPermanent != null && citizen.inPermanent == this.ownPub) {
					var thisPub = citizen.inPermanent;
					if(thisPub.markingTexture == "") {
						thisPub.setMarking("spr_pub_marking_key");
					}
					if(((this.city.simulation.time.timeSinceStart | 0) / 60 | 0) % 24 >= 5 && ((this.city.simulation.time.timeSinceStart | 0) / 60 | 0) % 24 < 10) {
						this.doingEvent = -1;
					} else {
						thisPub.beEntertained(citizen,timeMod);
					}
					return;
				}
				var thereAreNoPubs = true;
				if(this.ownPub != null && this.ownPub.destroyed) {
					this.ownPub = null;
				}
				if(this.ownPub == null) {
					var _g = 0;
					var _g1 = this.city.permanents;
					while(_g < _g1.length) {
						var pm = _g1[_g];
						++_g;
						if(pm.is(buildings_Pub)) {
							var thisPub = pm;
							if(thisPub.markingTexture == "spr_pub_marking_key") {
								this.ownPub = thisPub;
								break;
							}
							thereAreNoPubs = false;
						}
					}
				}
				if(this.ownPub == null && !thereAreNoPubs) {
					var newOwnPub = this.city.simulation.permanentFinder.quickQueryForCitizen(citizen,function(pm) {
						if(pm.is(buildings_Pub)) {
							return pm.markingTexture == "";
						} else {
							return false;
						}
					},"secretSocietyPub" + this.id,3);
					if(newOwnPub == null) {
						this.doingEvent = -1;
					} else {
						this.ownPub = newOwnPub;
					}
				}
				if(this.ownPub != null) {
					citizen.simulation.pathfinder.findPath(citizen,this.ownPub);
					citizen.pathOnFail = function() {
						_gthis.doingEvent = -1;
					};
				}
				return;
			}
		}
		if(this.doingEvent == 3) {
			if(citizen.inPermanent != null && citizen.inPermanent.is(buildings_LibraryOfTheKey)) {
				if(((this.city.simulation.time.timeSinceStart | 0) / 60 | 0) % 24 >= 0 && ((this.city.simulation.time.timeSinceStart | 0) / 60 | 0) % 24 < 4) {
					this.doingEvent = -1;
				} else {
					citizen.inPermanent.beEntertained(citizen,timeMod);
				}
				return;
			}
			if(this.ownLibrary != null && this.ownLibrary.destroyed) {
				this.ownLibrary = null;
			}
			if(this.ownLibrary == null) {
				var _g = 0;
				var _g1 = this.city.permanents;
				while(_g < _g1.length) {
					var pm = _g1[_g];
					++_g;
					if(pm.is(buildings_LibraryOfTheKey)) {
						this.ownLibrary = pm;
					}
				}
			}
			if(this.ownLibrary != null) {
				citizen.simulation.pathfinder.findPath(citizen,this.ownLibrary);
				citizen.pathOnFail = function() {
					_gthis.doingEvent = -1;
				};
			} else {
				this.doingEvent = -1;
			}
			return;
		}
		if(citizen.inPermanent != this) {
			citizen.simulation.pathfinder.findPath(citizen,this);
			citizen.pathOnFail = null;
			return;
		}
		if(shouldStopWorking) {
			citizen.currentAction = 2;
			return;
		}
		this.walkAround(citizen,150);
		if(((this.city.simulation.time.timeSinceStart | 0) / 60 | 0) % 24 > 15) {
			if(1 + ((this.city.simulation.time.timeSinceStart | 0) / 1440 | 0) > this.lastEventDoneOnDay) {
				this.doingEvent = random_Random.getInt(1,4);
				if(this.doingEvent == 1 && (this.world.rect.height == 0 || this.world.surfaceShardId != this.shardId)) {
					this.doingEvent = 2;
				}
				if(this.doingEvent == 3 && this.city.getAmountOfPermanentsPerType().h["buildings.LibraryOfTheKey"] < 1) {
					this.doingEvent = 2;
				}
				this.eventPhase = 0;
				this.lastEventDoneOnDay = 1 + ((this.city.simulation.time.timeSinceStart | 0) / 1440 | 0);
			}
		}
	}
	,walkAround: function(citizen,stepsInBuilding) {
		var r = random_Random.getInt(5);
		if(r == 0 && stepsInBuilding > 120) {
			citizen.changeFloorAndWaitRandom(30,60);
		} else if(r == 1 || r == 2 && citizen.relativeY < 5) {
			citizen.moveAndWait(random_Random.getInt(3,7),random_Random.getInt(30,60),null,false,false);
		} else if(r == 2) {
			citizen.moveAndWait(random_Random.getInt(12,16),random_Random.getInt(30,60),null,false,false);
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
		if(this.isScenarioVariant) {
			return null;
		}
		return { category : common_Localize.lo("secret_society_mission"), text : this.missionGetText()};
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_WorkWithHome.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_SecretSocietyHouse.saveDefinition);
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
	,__class__: buildings_SecretSocietyHouse
});
