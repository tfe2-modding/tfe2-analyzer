var Citizen = $hxClasses["Citizen"] = function(city,simulation,foregroundStage,inBuildingStage,inBuildingStageNonParticle,adultTextures,childrenTextures,onWorld,worldX,startAge,startInPermanent) {
	if(startAge == null) {
		startAge = 0;
	}
	this.impossibleToReachWorldSurfaceForWorld = null;
	this.lastMorningCommuteTime = -1;
	this.dynamicUnsavedVars = { };
	this.likesNightclubs = false;
	this.hasDied = false;
	this.hobby = null;
	this.isForcedHome = false;
	this.tempId = 0;
	this.wantsNightEntertainmentIn = 0;
	this.pathStartTime = 0;
	this.pathCanBeReconsidered = true;
	this.recyclePathArray = false;
	this.pathWalkSpeed = 1;
	this.pathOnlyRelatedTo = null;
	this.pathEndFunction = null;
	this.currentPathActionTimerXY = 0;
	this.verticalPathProgress = 0;
	this.delayCanViewSelfInBuilding = false;
	this.canViewSelfInBuilding = true;
	this.currentPathAction = -2;
	this.inBuildingSince = 0;
	this.inPermanent = null;
	this.accessorySprite = null;
	this.educationLevel = 0;
	this.lastInfrequentUpdateAge = 0;
	this.hasWorkTools = false;
	this.currentAction = 2;
	this.hasBuildingInited = false;
	this.city = city;
	this.simulation = simulation;
	this.spriteIndexActual = random_Random.getInt(childrenTextures.length - 2);
	this.nameIndex = random_Random.getInt(1,Resources.citizenNames.length == 0 ? 8000 : Resources.citizenNames.length);
	if(Resources.citizenNames.length >= this.nameIndex && Resources.citizenNames[this.nameIndex] == "Waldo") {
		this.spriteIndexActual = childrenTextures.length - 1;
	}
	if(Resources.citizenNames.length >= this.nameIndex && Resources.citizenNames[this.nameIndex] == "Dracula") {
		this.spriteIndexActual = childrenTextures.length - 2;
	}
	this.spriteIndex = this.spriteIndexActual + (this.nameIndex << 14);
	this.onWorld = onWorld;
	this.relativeX = worldX;
	this.relativeY = 0;
	this.foregroundStage = foregroundStage;
	this.inBuildingStageNonParticle = inBuildingStageNonParticle;
	this.inBuildingStage = inBuildingStage;
	this.adultTextures = adultTextures;
	this.childrenTextures = childrenTextures;
	simulation.houseAssigner.shouldUpdateHouses = true;
	simulation.schoolAssigner.schoolsShouldBeUpdated = true;
	this.bornOn = simulation.time.timeSinceStart - startAge * 1440;
	this.lastInfrequentUpdateAge = this.get_age();
	this.dieAgeModifier = random_Random.getInt(-5,5);
	this.setPreferences();
	this.addedToStage = null;
	this.sprite = new PIXI.Sprite();
	this.setCurrentTexture();
	Citizen.spriteCitizens.set(this.sprite,this);
	this.sprite.anchor.y = 1;
	if(!Game.isLoading && this.get_age() >= 16) {
		this.addToWorkers();
	}
	if(startInPermanent != null) {
		if(this.inPermanent != null) {
			this.inPermanent.onCitizenLeave(this,startInPermanent);
		}
		this.inBuildingSince = this.city.simulation.time.timeSinceStart;
		this.inPermanent = startInPermanent;
		this.hasBuildingInited = false;
		this.set_drawOnStage(inBuildingStage);
		this.canViewSelfInBuilding = false;
	} else {
		this.set_drawOnStage(foregroundStage);
	}
	this.entertainment = new simulation_CitizenEntertainment(this);
	this.wantsNightEntertainmentIn = random_Random.getInt(5);
	this.pathWalkSpeed = 1;
	this.inBuildingSince = city.simulation.time.timeSinceStart;
	this.actuallyUpdateDraw();
};
Citizen.__name__ = "Citizen";
Citizen.prototype = {
	get_stepsInBuilding: function() {
		return (this.city.simulation.time.timeSinceStart - this.inBuildingSince) / this.city.simulation.time.minutesPerTick;
	}
	,get_worldX: function() {
		return (this.inPermanent == null ? 0 : this.inPermanent.worldPosition.x * 20) + this.relativeX;
	}
	,get_workTimePreference: function() {
		return this.actualWorkTimePreference * (this.job == null ? 1 : this.job.workTimePreferenceMod);
	}
	,get_educationSpeedModifier: function() {
		return 1 + this.educationLevel / 2;
	}
	,get_age: function() {
		return (this.simulation.time.timeSinceStart - this.bornOn) / 1440;
	}
	,set_drawOnStage: function(val) {
		var prevVal = this.drawOnStage;
		this.drawOnStage = val;
		if(prevVal != val) {
			this.sprite.alpha = 1;
		}
		return this.drawOnStage;
	}
	,setHobby: function(hobby) {
		this.hobby = hobby;
		this.likesNightclubs = false;
	}
	,postLoad: function() {
		var f = this.relativeX;
		if(isNaN(f)) {
			this.relativeX = 0;
		}
		var f = this.dieAgeModifier;
		if(isNaN(f)) {
			this.dieAgeModifier = 0;
		}
		this.entertainment.setAgeRelatedEntertainment();
	}
	,afterLoad: function() {
		if((this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null) != null && !(this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null).get_walkThroughCanViewSelfInThisBuilding()) {
			this.canViewSelfInBuilding = false;
		}
		this.actuallyUpdateDraw();
	}
	,tryRemove: function(forSendAway) {
		if(forSendAway == null) {
			forSendAway = false;
		}
		if(this.fullyBeingControlled) {
			return;
		}
		if(this.currentAction == 3) {
			return;
		}
		if(!forSendAway) {
			this.city.simulation.babyMaker.onCitizenDeath();
		}
		HxOverrides.remove(this.simulation.jobAssigner.citizensWithoutJob,this);
		if(this.job != null) {
			HxOverrides.remove(this.job.workers,this);
			this.simulation.jobAssigner.buildingsHaveWork = true;
		}
		if(this.home != null) {
			HxOverrides.remove(this.home.residents,this);
			this.simulation.houseAssigner.shouldUpdateHouses = true;
		}
		if(this.school != null) {
			HxOverrides.remove(this.school.students,this);
			this.simulation.schoolAssigner.schoolsShouldBeUpdated = true;
		}
		if(this.addedToStage != null) {
			this.swapRemoveFromStage();
		}
		Citizen.spriteCitizens.remove(this.sprite);
		this.sprite.destroy({ children : true});
		HxOverrides.remove(this.simulation.citizens,this);
		HxOverrides.remove(this.simulation.hackerSchoolBonuses.citizens,this);
		if(this.hobby != null) {
			this.hobby.onDie();
		}
		this.hasDied = true;
		if(this.isForcedHome) {
			HxOverrides.remove(this.simulation.houseAssigner.citizensWithFixedHomes,this);
		}
	}
	,setPreferences: function() {
		this.actualWorkTimePreference = random_Random.getFloat(-1,1);
		this.likesNightclubs = this.spriteIndex % 5 == 0 ? false : true;
	}
	,shouldWorkNow: function() {
		if(this.job != null) {
			var this1 = this.simulation.time.timeSinceStart / 60 % 24;
			var start = this.job.startTime + this.get_workTimePreference();
			var end = (this.job.endTime + this.get_workTimePreference() + this.city.policies.vars.workTimeChange) % 24;
			if(start < end) {
				if(this1 >= start) {
					return this1 < end;
				} else {
					return false;
				}
			} else if(!(this1 >= start)) {
				return this1 < end;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}
	,shouldSchoolNow: function() {
		if(this.school != null) {
			var this1 = this.simulation.time.timeSinceStart / 60 % 24;
			var start = this.school.schoolStartTime;
			var end = this.school.schoolEndTime;
			if(start < end) {
				if(this1 >= start) {
					return this1 < end;
				} else {
					return false;
				}
			} else if(!(this1 >= start)) {
				return this1 < end;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}
	,updateDailyLife: function(timeMod) {
		var time = this.simulation.time.timeSinceStart / 60 % 24;
		if(this.currentAction == 0) {
			var tmp = this.job;
			var start = this.job.startTime + this.get_workTimePreference();
			var end = this.job.endTime + this.get_workTimePreference() + this.city.policies.vars.workTimeChange;
			tmp.work(this,timeMod,!(start < end ? time >= start && time < end : time >= start || time < end));
		} else if(this.currentAction == 1) {
			var start = this.school.schoolStartTime;
			var end = this.school.schoolEndTime;
			if(start < end ? time >= start && time < end : time >= start || time < end) {
				this.school.beAtSchool(this,timeMod);
			} else {
				this.currentAction = 2;
			}
		} else if(this.hobby != null && this.hobby.isActive()) {
			this.hobby.update(timeMod);
		} else if(this.currentAction != 3) {
			if(this.shouldWorkNow()) {
				if(this.inPermanent == this.job) {
					this.currentAction = 0;
				} else {
					var tmp;
					if(this.simulation.pathfinder.mayRequestPathNow(this.inPermanent)) {
						var _this = this.entertainment;
						tmp = _this.citizen.inPermanent != null && _this.citizen.inPermanent.isBuilding && _this.citizen.inPermanent.isEntertainment ? _this.citizen.inPermanent.finishEntertainment(_this.citizen,timeMod) : true;
					} else {
						tmp = false;
					}
					if(tmp) {
						this.simulation.pathfinder.findPathCombined(this,this.job.get_firstBuildingToGoTo());
					}
				}
			} else if(this.shouldSchoolNow()) {
				if(this.inPermanent == this.school) {
					this.currentAction = 1;
				} else {
					var tmp;
					if(this.simulation.pathfinder.mayRequestPathNow(this.inPermanent)) {
						var _this = this.entertainment;
						tmp = _this.citizen.inPermanent != null && _this.citizen.inPermanent.isBuilding && _this.citizen.inPermanent.isEntertainment ? _this.citizen.inPermanent.finishEntertainment(_this.citizen,timeMod) : true;
					} else {
						tmp = false;
					}
					if(tmp) {
						if(this.school.workers.length == 0) {
							this.leaveSchool();
						} else {
							this.simulation.pathfinder.findPathCombined(this,this.school);
						}
					}
				}
			} else {
				var busy = this.entertainment.updateEntertainment(timeMod);
				if(!busy) {
					var tmp;
					if(this.home != null) {
						if(this.job == null) {
							var start = 8 + this.get_workTimePreference();
							var end = 21 + this.get_workTimePreference();
							tmp = !(start < end ? time >= start && time < end : time >= start || time < end);
						} else {
							tmp = true;
						}
					} else {
						tmp = false;
					}
					if(tmp) {
						if(this.inPermanent != this.home) {
							if(this.simulation.pathfinder.mayRequestPathNow(this.inPermanent)) {
								this.simulation.pathfinder.findPathCombined(this,this.home);
							}
						} else {
							var startTime;
							var endTime;
							if(this.job == null) {
								startTime = 8;
								endTime = 21;
							} else {
								startTime = this.job.startTime;
								endTime = this.job.endTime;
							}
							var this1 = this.simulation.time.timeSinceStart / 60 % 24;
							var this2 = startTime;
							var newTime = this2;
							newTime += this.get_workTimePreference() - 1;
							newTime %= 24;
							var start = newTime;
							var this2 = endTime;
							var newTime = this2;
							newTime += this.get_workTimePreference() + 1;
							newTime %= 24;
							var end = newTime;
							if((start < end ? this1 >= start && this1 < end : this1 >= start || this1 < end) || this.get_stepsInBuilding() < 240) {
								this.canViewSelfInBuilding = true;
								this.home.walkAround(this,this.get_stepsInBuilding());
							} else {
								this.canViewSelfInBuilding = false;
							}
						}
					} else {
						this.wander(timeMod);
					}
				}
			}
		}
	}
	,stopWork: function() {
		this.currentAction = 2;
	}
	,tryFinishWork: function(timeMod) {
		if(this.currentAction == 0) {
			this.job.work(this,timeMod,true);
		}
		return this.currentAction != 0;
	}
	,evictFromHome: function() {
		if(this.home == null) {
			return;
		}
		HxOverrides.remove(this.home.residents,this);
		this.home = null;
		this.simulation.houseAssigner.shouldUpdateHouses = true;
		if(this.isForcedHome) {
			HxOverrides.remove(this.simulation.houseAssigner.citizensWithFixedHomes,this);
			this.isForcedHome = false;
		}
	}
	,beControlledBySpecial: function() {
		this.currentAction = 3;
	}
	,stopBeControlledBySpecial: function() {
		this.currentAction = 2;
	}
	,leaveSchool: function() {
		if(this.school == null) {
			return;
		}
		HxOverrides.remove(this.school.students,this);
		this.school = null;
		this.simulation.schoolAssigner.schoolsShouldBeUpdated = true;
		if(this.currentAction == 1) {
			this.currentAction = 2;
		}
	}
	,loseJob: function(instantReplace) {
		if(instantReplace == null) {
			instantReplace = false;
		}
		if(this.job == null) {
			return;
		}
		HxOverrides.remove(this.job.workers,this);
		this.job = null;
		if(!instantReplace) {
			this.simulation.jobAssigner.buildingsHaveWork = true;
			this.simulation.jobAssigner.citizensWithoutJob.push(this);
		}
		this.hasWorkTools = false;
		if(this.currentAction == 0) {
			this.currentAction = 2;
		}
	}
	,infrequentUpdate: function() {
		this.setCurrentTexture();
		if(this.lastInfrequentUpdateAge < 16 && this.get_age() >= 16) {
			if(this.job == null) {
				this.addToWorkers();
			} else if(this.school != null) {
				this.leaveSchool();
			}
		}
		this.lastInfrequentUpdateAge = this.get_age();
		if(this.get_age() >= 75 + this.dieAgeModifier && !this.city.progress.story.disableDying) {
			this.tryRemove();
		}
		var notInFestival = true;
		var _g = 0;
		var _g1 = this.city.simulation.festivalManager.festivals;
		while(_g < _g1.length) {
			var fest = _g1[_g];
			++_g;
			if(fest.isInvolvedWithFestival(this)) {
				notInFestival = false;
			}
		}
		if(this.path != null && this.pathCanBeReconsidered && notInFestival) {
			var shouldActuallyWorkNow = this.currentAction != 0 && this.shouldWorkNow();
			var shouldActuallySchoolNow = this.currentAction != 1 && this.shouldSchoolNow();
			if((shouldActuallyWorkNow && this.pathDestination != this.job || shouldActuallySchoolNow && this.pathDestination != this.school) && (this.pathDestination == null || !this.pathDestination.is(buildings_RocketLaunchPlatform))) {
				var resetCanViewSelfInBuilding = false;
				if(resetCanViewSelfInBuilding == null) {
					resetCanViewSelfInBuilding = true;
				}
				if(this.recyclePathArray) {
					pooling_Int32ArrayPool.returnToPool(this.path);
					this.recyclePathArray = false;
				}
				this.path = null;
				this.nextPathPos = -1;
				this.pathEnd = -1;
				this.currentPathAction = -2;
				if(resetCanViewSelfInBuilding) {
					if(!this.canViewSelfInBuilding) {
						this.delayCanViewSelfInBuilding = true;
					}
					this.canViewSelfInBuilding = true;
				}
				this.verticalPathProgress = 0;
				this.pathEndFunction = null;
				this.requestingPathGoal = null;
				this.pathOnlyRelatedTo = null;
				this.pathWalkSpeed = 1;
				this.pathCanBeReconsidered = true;
				if(this.sprite.alpha > 0 && this.sprite.alpha < 1) {
					this.sprite.alpha = 1;
				}
			}
		}
	}
	,addToWorkers: function() {
		this.simulation.jobAssigner.citizensWithoutJob.push(this);
		this.simulation.jobAssigner.buildingsHaveWork = true;
		if(this.school != null) {
			this.leaveSchool();
		}
	}
	,midDayUpdate: function() {
		if(this.wantsNightEntertainmentIn > 0) {
			this.wantsNightEntertainmentIn--;
		}
		this.dieAgeModifier += 0.2 * (this.simulation.happiness.medicalHappiness / 100.0) + 0.05 * (this.simulation.happiness.specializedMedicalHappiness / 100.0);
		if(this.city.simulation.happiness.happiness < 10 && this.home == null && this.city.materials.food < 1) {
			if(this.job == null) {
				this.dieAgeModifier -= 10;
			}
			this.dieAgeModifier -= 1;
		}
		if(this.home != null) {
			this.dieAgeModifier += this.home.yearsToLiveLongerPerYearIfLivingHere;
		}
		this.dieAgeModifier += this.city.upgrades.vars.extendAgeBy;
		this.impossibleToReachWorldSurfaceForWorld = null;
	}
	,updatePath: function(timeMod) {
		var _gthis = this;
		if(this.currentPathAction >= -1) {
			if(this.currentPathAction == -1) {
				while(this.path[this.nextPathPos] == 12) {
					this.pathWalkSpeed = 1 * this.path[this.nextPathPos + 1] / 100;
					this.nextPathPos += 2;
				}
				this.currentPathAction = this.path[this.nextPathPos];
				if(this.currentPathAction == 0 || this.currentPathAction == 1 || this.currentPathAction == 9) {
					this.canViewSelfInBuilding = false;
					Citizen.shouldUpdateDraw = true;
				} else if(this.pathOnlyRelatedTo == null && (this.currentPathAction != 4 && this.currentPathAction != 8)) {
					this.canViewSelfInBuilding = (this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null) != null ? this.inPermanent.get_walkThroughCanViewSelfInThisBuilding() : true;
					Citizen.shouldUpdateDraw = true;
				}
				if(this.currentPathAction <= 1 && this.relativeY > 0) {
					this.verticalPathProgress = this.relativeY * (this.currentPathAction - 0.5) * -2;
					this.relativeY = 0;
				} else if(this.currentPathAction != 4 && this.currentPathAction != 8 && this.currentPathAction != 9 && this.currentPathAction != 17) {
					this.relativeY = 0;
				}
				this.currentPathActionTimerXY = 0;
				if(this.currentPathAction == 5 || this.currentPathAction == 7 || this.currentPathAction == 11 || this.currentPathAction >= 13 && this.currentPathAction <= 16) {
					this.currentPathActionPermanent = this.city.findPermanentByID(this.path[this.nextPathPos + 1]);
				} else if(this.currentPathAction == 4 || this.currentPathAction == 9 || this.currentPathAction == 8 || this.currentPathAction == 17) {
					this.currentPathActionTimerXY = this.path[this.nextPathPos + 1];
				}
			}
			var reachedActionGoal = false;
			switch(this.currentPathAction) {
			case 0:
				this.verticalPathProgress += timeMod;
				if(this.verticalPathProgress >= 20) {
					var permanent = (this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null).topBuilding;
					if(this.inPermanent != null) {
						this.inPermanent.onCitizenLeave(this,permanent);
					}
					this.inBuildingSince = this.city.simulation.time.timeSinceStart;
					this.inPermanent = permanent;
					this.hasBuildingInited = false;
					this.verticalPathProgress -= 20;
					reachedActionGoal = true;
				}
				break;
			case 1:
				this.verticalPathProgress += timeMod;
				if(this.verticalPathProgress >= 20) {
					var permanent = (this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null).bottomBuilding;
					if(this.inPermanent != null) {
						this.inPermanent.onCitizenLeave(this,permanent);
					}
					this.inBuildingSince = this.city.simulation.time.timeSinceStart;
					this.inPermanent = permanent;
					this.hasBuildingInited = false;
					this.verticalPathProgress -= 20;
					reachedActionGoal = true;
				}
				break;
			case 2:
				this.relativeX -= timeMod * this.pathWalkSpeed;
				if(this.relativeX < -2) {
					var permanent = (this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null).leftBuilding;
					if(this.inPermanent != null) {
						this.inPermanent.onCitizenLeave(this,permanent);
					}
					this.inBuildingSince = this.city.simulation.time.timeSinceStart;
					this.inPermanent = permanent;
					this.hasBuildingInited = false;
					this.onWorld = this.inPermanent.world;
					this.relativeX += 20;
					reachedActionGoal = true;
				} else {
					Citizen.shouldUpdateDraw = true;
				}
				break;
			case 3:
				this.relativeX += timeMod * this.pathWalkSpeed;
				if(this.relativeX > 20) {
					var permanent = (this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null).rightBuilding;
					if(this.inPermanent != null) {
						this.inPermanent.onCitizenLeave(this,permanent);
					}
					this.inBuildingSince = this.city.simulation.time.timeSinceStart;
					this.inPermanent = permanent;
					this.hasBuildingInited = false;
					this.onWorld = this.inPermanent.world;
					this.relativeX -= 20;
					reachedActionGoal = true;
				} else {
					Citizen.shouldUpdateDraw = true;
				}
				break;
			case 4:
				var x = this.currentPathActionTimerXY;
				var spd = this.pathWalkSpeed * timeMod;
				Citizen.shouldUpdateDraw = true;
				if(Math.abs(x - this.relativeX) < spd) {
					this.relativeX = x;
					reachedActionGoal = true;
				} else {
					var num = x - this.relativeX;
					this.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
					reachedActionGoal = false;
				}
				break;
			case 5:
				if(this.inPermanent != null) {
					if(this.inPermanent != null && this.inPermanent.isBuilding) {
						var x = (this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null).doorX;
						var spd = this.pathWalkSpeed * timeMod;
						Citizen.shouldUpdateDraw = true;
						var tmp;
						if(Math.abs(x - this.relativeX) < spd) {
							this.relativeX = x;
							tmp = true;
						} else {
							var num = x - this.relativeX;
							this.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
							tmp = false;
						}
						if(tmp) {
							if(this.inPermanent != null && this.inPermanent.isBuilding) {
								var building = this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null;
								this.relativeX = building.worldPosition.x * 20 + building.doorX;
							} else {
								this.relativeX += this.inPermanent.worldPosition.x * 20;
							}
							if(this.inPermanent != null) {
								this.inPermanent.onCitizenLeave(this,null);
							}
							this.inBuildingSince = this.city.simulation.time.timeSinceStart;
							this.set_drawOnStage(this.foregroundStage);
							this.inPermanent = null;
							this.relativeY = 0;
							Citizen.shouldUpdateDraw = true;
						}
					} else {
						if(this.inPermanent != null && this.inPermanent.isBuilding) {
							var building = this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null;
							this.relativeX = building.worldPosition.x * 20 + building.doorX;
						} else {
							this.relativeX += this.inPermanent.worldPosition.x * 20;
						}
						if(this.inPermanent != null) {
							this.inPermanent.onCitizenLeave(this,null);
						}
						this.inBuildingSince = this.city.simulation.time.timeSinceStart;
						this.set_drawOnStage(this.foregroundStage);
						this.inPermanent = null;
						this.relativeY = 0;
						Citizen.shouldUpdateDraw = true;
					}
				} else if(this.currentPathActionPermanent.isBuilding) {
					var currentPathActionBuilding = this.currentPathActionPermanent;
					var x = currentPathActionBuilding.worldPosition.x * 20 + currentPathActionBuilding.doorX;
					var spd = this.pathWalkSpeed * timeMod;
					Citizen.shouldUpdateDraw = true;
					if(Math.abs(x - this.relativeX) < spd) {
						this.relativeX = x;
						reachedActionGoal = true;
					} else {
						var num = x - this.relativeX;
						this.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
						reachedActionGoal = false;
					}
					if(reachedActionGoal) {
						var permanent = this.currentPathActionPermanent;
						if(this.inPermanent != null) {
							this.inPermanent.onCitizenLeave(this,permanent);
						}
						this.inBuildingSince = this.city.simulation.time.timeSinceStart;
						this.inPermanent = permanent;
						this.hasBuildingInited = false;
						this.set_drawOnStage(this.inBuildingStage);
						this.relativeX = currentPathActionBuilding.doorX;
					}
				} else {
					var permanentX = this.currentPathActionPermanent.worldPosition.x * 20;
					var num = permanentX + 10. - this.relativeX;
					this.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * (timeMod * this.pathWalkSpeed);
					if(this.relativeX > permanentX && this.relativeX < permanentX + 20 - 2) {
						var permanent = this.currentPathActionPermanent;
						if(this.inPermanent != null) {
							this.inPermanent.onCitizenLeave(this,permanent);
						}
						this.inBuildingSince = this.city.simulation.time.timeSinceStart;
						this.inPermanent = permanent;
						this.hasBuildingInited = false;
						this.relativeX -= this.inPermanent.worldPosition.x * 20;
						reachedActionGoal = true;
					}
				}
				Citizen.shouldUpdateDraw = true;
				break;
			case 7:
				if(this.currentPathActionTimerXY > 0) {
					this.currentPathActionTimerXY += 0.1 * timeMod;
					if(this.currentPathActionTimerXY >= 1) {
						this.sprite.alpha = 1;
						if(this.inPermanent.is(buildings_Misdirector)) {
							var resetCanViewSelfInBuilding = true;
							if(resetCanViewSelfInBuilding == null) {
								resetCanViewSelfInBuilding = true;
							}
							if(this.recyclePathArray) {
								pooling_Int32ArrayPool.returnToPool(this.path);
								this.recyclePathArray = false;
							}
							this.path = null;
							this.nextPathPos = -1;
							this.pathEnd = -1;
							this.currentPathAction = -2;
							if(resetCanViewSelfInBuilding) {
								if(!this.canViewSelfInBuilding) {
									this.delayCanViewSelfInBuilding = true;
								}
								this.canViewSelfInBuilding = true;
							}
							this.verticalPathProgress = 0;
							this.pathEndFunction = null;
							this.requestingPathGoal = null;
							this.pathOnlyRelatedTo = null;
							this.pathWalkSpeed = 1;
							this.pathCanBeReconsidered = true;
							if(this.sprite.alpha > 0 && this.sprite.alpha < 1) {
								this.sprite.alpha = 1;
							}
							this.waitAndMoveAndWaitRandom(30,45,3,16,120,180,null,false,true);
							this.pathCanBeReconsidered = false;
							var misdirector = this.inPermanent;
							misdirector.giveReward();
						} else {
							reachedActionGoal = true;
						}
					} else {
						this.sprite.alpha = this.currentPathActionTimerXY;
					}
				} else if(!this.city.simulation.operatingCost.teleportersEnabled) {
					var resetCanViewSelfInBuilding = true;
					if(resetCanViewSelfInBuilding == null) {
						resetCanViewSelfInBuilding = true;
					}
					if(this.recyclePathArray) {
						pooling_Int32ArrayPool.returnToPool(this.path);
						this.recyclePathArray = false;
					}
					this.path = null;
					this.nextPathPos = -1;
					this.pathEnd = -1;
					this.currentPathAction = -2;
					if(resetCanViewSelfInBuilding) {
						if(!this.canViewSelfInBuilding) {
							this.delayCanViewSelfInBuilding = true;
						}
						this.canViewSelfInBuilding = true;
					}
					this.verticalPathProgress = 0;
					this.pathEndFunction = null;
					this.requestingPathGoal = null;
					this.pathOnlyRelatedTo = null;
					this.pathWalkSpeed = 1;
					this.pathCanBeReconsidered = true;
					if(this.sprite.alpha > 0 && this.sprite.alpha < 1) {
						this.sprite.alpha = 1;
					}
				} else {
					var x = this.inPermanent.teleportX;
					var spd = this.pathWalkSpeed * timeMod;
					Citizen.shouldUpdateDraw = true;
					var tmp;
					if(Math.abs(x - this.relativeX) < spd) {
						this.relativeX = x;
						tmp = true;
					} else {
						var num = x - this.relativeX;
						this.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
						tmp = false;
					}
					if(tmp) {
						this.inPermanent.createTeleportParticle();
						this.inPermanent.timesUsed += 1;
						if(this.city.misdirector != null && this.city.misdirector.get_misdirectChance() > 0 && random_Random.getFloat() < this.city.misdirector.get_misdirectChance()) {
							this.currentPathActionPermanent = this.city.misdirector;
						}
						var permanent = this.currentPathActionPermanent;
						if(this.inPermanent != null) {
							this.inPermanent.onCitizenLeave(this,permanent);
						}
						this.inBuildingSince = this.city.simulation.time.timeSinceStart;
						this.inPermanent = permanent;
						this.hasBuildingInited = false;
						this.inPermanent.timesUsedTo += 1;
						this.onWorld = this.currentPathActionPermanent.world;
						this.relativeX = this.inPermanent.teleportX;
						this.currentPathActionTimerXY = 0.1 * timeMod;
						this.sprite.alpha = this.currentPathActionTimerXY;
					}
				}
				Citizen.shouldUpdateDraw = true;
				break;
			case 8:
				this.currentPathActionTimerXY -= timeMod;
				reachedActionGoal = this.currentPathActionTimerXY <= 0.5 * (timeMod - 0.6666666666666666666);
				break;
			case 9:
				var spd = timeMod;
				if(Math.abs(this.currentPathActionTimerXY - this.relativeY) < spd) {
					this.relativeY = this.currentPathActionTimerXY;
					reachedActionGoal = true;
				} else {
					var num = this.currentPathActionTimerXY - this.relativeY;
					this.relativeY += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
				}
				Citizen.shouldUpdateDraw = true;
				break;
			case 10:
				reachedActionGoal = true;
				break;
			case 11:
				if(this.inPermanent == this.currentPathActionPermanent) {
					reachedActionGoal = true;
				} else {
					var inLandingSite = this.inPermanent;
					var destination = this.currentPathActionPermanent;
					if(inLandingSite.currentlyLandedSaucer != null && (inLandingSite.currentlyLandedSaucer.destination == destination || inLandingSite.currentlyLandedSaucer.destination.estimatedFlyingDistanceTo(destination) < inLandingSite.estimatedFlyingDistanceTo(destination))) {
						var fs = inLandingSite.currentlyLandedSaucer;
						fs.addPassenger(this);
						this.fullyBeingControlled = true;
						this.canViewSelfInBuilding = false;
						this.inTransportationThing = fs;
						if(inLandingSite.currentlyLandedSaucer.destination != destination) {
							if(inLandingSite.estimatedFlyingDistanceTo(destination) < inLandingSite.estimatedFlyingDistanceTo(inLandingSite.currentlyLandedSaucer.destination)) {
								var route = this.simulation.flyingPathfinder.findRoute(inLandingSite,destination);
								if(route != null) {
									fs.setDestination(destination,route);
								}
							}
						}
					} else if(inLandingSite.hasFlyingSaucer) {
						var route = this.simulation.flyingPathfinder.findRoute(inLandingSite,destination);
						if(route != null) {
							var fs = new simulation_FlyingSaucer(this.simulation,this.city.aboveCitizensInBuildingStage,route,inLandingSite,this.currentPathActionPermanent);
							this.simulation.flyingSaucers.push(fs);
							fs.addPassenger(this);
							this.fullyBeingControlled = true;
							this.canViewSelfInBuilding = false;
							this.inTransportationThing = fs;
							this.inPermanent.removeFlyingSaucer();
							var halfWidth = 10. | 0;
							this.relativeX = random_Random.getInt(halfWidth - 3,halfWidth + 4);
						} else {
							if(this.recyclePathArray) {
								pooling_Int32ArrayPool.returnToPool(this.path);
								this.recyclePathArray = false;
							}
							this.path = null;
							this.nextPathPos = -1;
							this.pathEnd = -1;
							this.currentPathAction = -2;
							if(!this.canViewSelfInBuilding) {
								this.delayCanViewSelfInBuilding = true;
							}
							this.canViewSelfInBuilding = true;
							this.verticalPathProgress = 0;
							this.pathEndFunction = null;
							this.requestingPathGoal = null;
							this.pathOnlyRelatedTo = null;
							this.pathWalkSpeed = 1;
							this.pathCanBeReconsidered = true;
							if(this.sprite.alpha > 0 && this.sprite.alpha < 1) {
								this.sprite.alpha = 1;
							}
							return;
						}
					} else {
						this.relativeY = -1;
					}
				}
				Citizen.shouldUpdateDraw = true;
				break;
			case 12:
				break;
			case 13:
				var diff = 20 * (this.currentPathActionPermanent.worldPosition.y - this.inPermanent.worldPosition.y);
				if(this.inPermanent == this.currentPathActionPermanent) {
					if(this.currentPathActionTimerXY > 3) {
						if(this.nextPathPos + 2 < this.pathEnd) {
							if(this.path[this.nextPathPos + 2] == 0 || this.path[this.nextPathPos + 2] == 1) {
								var x = this.relativeX > 10 ? 18 : 0;
								var spd = this.pathWalkSpeed * timeMod;
								Citizen.shouldUpdateDraw = true;
								var tmp;
								if(Math.abs(x - this.relativeX) < spd) {
									this.relativeX = x;
									tmp = true;
								} else {
									var num = x - this.relativeX;
									this.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
									tmp = false;
								}
								if(tmp) {
									reachedActionGoal = true;
								}
							} else {
								reachedActionGoal = true;
							}
						} else {
							reachedActionGoal = true;
						}
					} else {
						this.currentPathActionTimerXY += timeMod;
					}
				} else if(this.currentPathActionTimerXY > 0) {
					if(Math.abs(this.verticalPathProgress) < Math.abs(diff)) {
						this.verticalPathProgress += timeMod * 20 * (diff > 0 ? 1 : diff < 0 ? -1 : 0);
						this.canViewSelfInBuilding = false;
					}
					if(Math.abs(this.verticalPathProgress) >= Math.abs(diff)) {
						if(this.currentPathActionPermanent.openDoor()) {
							var permanent = this.currentPathActionPermanent;
							if(this.inPermanent != null) {
								this.inPermanent.onCitizenLeave(this,permanent);
							}
							this.inBuildingSince = this.city.simulation.time.timeSinceStart;
							this.inPermanent = permanent;
							this.hasBuildingInited = false;
							this.inPermanent.timesUsedTo += 1;
							this.verticalPathProgress = 0;
							this.canViewSelfInBuilding = true;
							this.relativeX += random_Random.getInt(-2,3);
						}
					}
				} else {
					this.canViewSelfInBuilding = true;
					var spd = this.pathWalkSpeed * timeMod;
					Citizen.shouldUpdateDraw = true;
					var tmp;
					if(Math.abs(9. - this.relativeX) < spd) {
						this.relativeX = 9.;
						tmp = true;
					} else {
						var num = 9. - this.relativeX;
						this.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
						tmp = false;
					}
					if(tmp) {
						if(this.inPermanent.openDoor()) {
							this.inPermanent.timesUsed += 1;
							this.currentPathActionTimerXY = 1;
							this.canViewSelfInBuilding = false;
						}
					}
				}
				Citizen.shouldUpdateDraw = true;
				break;
			case 14:
				if(this.inPermanent == this.currentPathActionPermanent) {
					this.currentPathActionTimerXY -= timeMod;
					if(this.currentPathActionTimerXY < 0) {
						reachedActionGoal = true;
						this.inPermanent.timesUsedTo += 1;
					}
					Citizen.shouldUpdateDraw = true;
				} else {
					this.currentPathActionTimerXY = 5 * timeMod;
					var cityX = this.getCityPosition().x;
					if(this.currentPathActionPermanent.position.x < cityX) {
						var trainStation = this.inPermanent;
						if(trainStation.rightTrainStation == null) {
							var trainHere = this.simulation.trainsByBuildingRight.h[trainStation.__id__];
							if(trainHere != null) {
								var spd = this.pathWalkSpeed * timeMod;
								Citizen.shouldUpdateDraw = true;
								var tmp;
								if(Math.abs(9 - this.relativeX) < spd) {
									this.relativeX = 9;
									tmp = true;
								} else {
									var num = 9 - this.relativeX;
									this.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
									tmp = false;
								}
								if(tmp && trainHere.isStopped < 5) {
									trainHere.addPassenger(_gthis,_gthis.currentPathActionPermanent);
									_gthis.fullyBeingControlled = true;
									_gthis.canViewSelfInBuilding = false;
									_gthis.inTransportationThing = trainHere;
									_gthis.inPermanent.timesUsed += 1;
								}
							} else {
								var x = 9 + this.spriteIndex % 13 - 6;
								var spd = this.pathWalkSpeed * timeMod;
								Citizen.shouldUpdateDraw = true;
								var tmp;
								if(Math.abs(x - this.relativeX) < spd) {
									this.relativeX = x;
									tmp = true;
								} else {
									var num = x - this.relativeX;
									this.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
									tmp = false;
								}
								if(tmp) {
									trainStation.requestedStopRight = true;
								}
							}
							this.relativeY = 0;
						} else {
							var trainHere = this.simulation.trainsByBuildingLeft.h[trainStation.__id__];
							if(trainHere != null) {
								var spd = this.pathWalkSpeed * timeMod;
								Citizen.shouldUpdateDraw = true;
								var tmp;
								if(Math.abs(9 - this.relativeX) < spd) {
									this.relativeX = 9;
									tmp = true;
								} else {
									var num = 9 - this.relativeX;
									this.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
									tmp = false;
								}
								if(tmp && trainHere.isStopped < 5) {
									trainHere.addPassenger(_gthis,_gthis.currentPathActionPermanent);
									_gthis.fullyBeingControlled = true;
									_gthis.canViewSelfInBuilding = false;
									_gthis.inTransportationThing = trainHere;
									_gthis.inPermanent.timesUsed += 1;
								}
							} else {
								var x = 9 + this.spriteIndex % 13 - 6;
								var spd = this.pathWalkSpeed * timeMod;
								Citizen.shouldUpdateDraw = true;
								var tmp;
								if(Math.abs(x - this.relativeX) < spd) {
									this.relativeX = x;
									tmp = true;
								} else {
									var num = x - this.relativeX;
									this.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
									tmp = false;
								}
								if(tmp) {
									trainStation.requestedStopLeft = true;
								}
							}
							this.relativeY = 10;
						}
					} else {
						this.relativeY = 0;
						var trainStation = this.inPermanent;
						var trainHere = this.simulation.trainsByBuildingRight.h[trainStation.__id__];
						if(trainHere != null) {
							var spd = this.pathWalkSpeed * timeMod;
							Citizen.shouldUpdateDraw = true;
							var tmp;
							if(Math.abs(9 - this.relativeX) < spd) {
								this.relativeX = 9;
								tmp = true;
							} else {
								var num = 9 - this.relativeX;
								this.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
								tmp = false;
							}
							if(tmp && trainHere.isStopped < 5) {
								trainHere.addPassenger(_gthis,_gthis.currentPathActionPermanent);
								_gthis.fullyBeingControlled = true;
								_gthis.canViewSelfInBuilding = false;
								_gthis.inTransportationThing = trainHere;
								_gthis.inPermanent.timesUsed += 1;
							}
						} else {
							var x = 9 + this.spriteIndex % 13 - 6;
							var spd = this.pathWalkSpeed * timeMod;
							Citizen.shouldUpdateDraw = true;
							var tmp;
							if(Math.abs(x - this.relativeX) < spd) {
								this.relativeX = x;
								tmp = true;
							} else {
								var num = x - this.relativeX;
								this.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
								tmp = false;
							}
							if(tmp) {
								trainStation.requestedStopRight = true;
							}
						}
					}
				}
				break;
			case 15:
				var targetX = this.currentPathActionPermanent.position.x - this.inPermanent.position.x;
				this.relativeX -= timeMod * this.pathWalkSpeed;
				var val = -Math.abs((targetX + 20) / -2 + this.relativeX) - targetX / 2 - 10;
				this.relativeY = val < 0 ? 0 : val > 5 ? 5 : val;
				if(this.relativeX < 0) {
					this.canViewSelfInBuilding = true;
				}
				if(this.relativeX < targetX + 20 - 2) {
					var permanent = this.currentPathActionPermanent;
					if(this.inPermanent != null) {
						this.inPermanent.onCitizenLeave(this,permanent);
					}
					this.inBuildingSince = this.city.simulation.time.timeSinceStart;
					this.inPermanent = permanent;
					this.hasBuildingInited = false;
					this.onWorld = this.inPermanent.world;
					this.relativeX -= targetX;
					reachedActionGoal = true;
				} else {
					Citizen.shouldUpdateDraw = true;
				}
				break;
			case 16:
				var targetX = this.currentPathActionPermanent.position.x - this.inPermanent.position.x;
				this.relativeX += timeMod * this.pathWalkSpeed;
				var val = -Math.abs((targetX - 20) / 2 - (this.relativeX - 20)) + targetX / 2 - 10;
				this.relativeY = val < 0 ? 0 : val > 5 ? 5 : val;
				if(this.relativeX > 20) {
					this.canViewSelfInBuilding = true;
				}
				if(this.relativeX > targetX) {
					var permanent = this.currentPathActionPermanent;
					if(this.inPermanent != null) {
						this.inPermanent.onCitizenLeave(this,permanent);
					}
					this.inBuildingSince = this.city.simulation.time.timeSinceStart;
					this.inPermanent = permanent;
					this.hasBuildingInited = false;
					this.onWorld = this.inPermanent.world;
					this.relativeX -= targetX;
					reachedActionGoal = true;
				} else {
					Citizen.shouldUpdateDraw = true;
				}
				break;
			case 17:
				var spd = timeMod;
				if(Math.abs(this.currentPathActionTimerXY - this.relativeY) < spd) {
					this.relativeY = this.currentPathActionTimerXY;
					reachedActionGoal = true;
				} else {
					var num = this.currentPathActionTimerXY - this.relativeY;
					this.relativeY += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
				}
				Citizen.shouldUpdateDraw = true;
				break;
			}
			if(reachedActionGoal) {
				if(this.nextPathPos + 2 >= this.pathEnd) {
					var pathEnd = _gthis.pathEndFunction;
					var resetCanViewSelfInBuilding = true;
					if(resetCanViewSelfInBuilding == null) {
						resetCanViewSelfInBuilding = true;
					}
					if(_gthis.recyclePathArray) {
						pooling_Int32ArrayPool.returnToPool(_gthis.path);
						_gthis.recyclePathArray = false;
					}
					_gthis.path = null;
					_gthis.nextPathPos = -1;
					_gthis.pathEnd = -1;
					_gthis.currentPathAction = -2;
					if(resetCanViewSelfInBuilding) {
						if(!_gthis.canViewSelfInBuilding) {
							_gthis.delayCanViewSelfInBuilding = true;
						}
						_gthis.canViewSelfInBuilding = true;
					}
					_gthis.verticalPathProgress = 0;
					_gthis.pathEndFunction = null;
					_gthis.requestingPathGoal = null;
					_gthis.pathOnlyRelatedTo = null;
					_gthis.pathWalkSpeed = 1;
					_gthis.pathCanBeReconsidered = true;
					if(_gthis.sprite.alpha > 0 && _gthis.sprite.alpha < 1) {
						_gthis.sprite.alpha = 1;
					}
					if(pathEnd != null) {
						pathEnd();
					}
					if(_gthis.inPermanent != null && _gthis.inPermanent == _gthis.job && _gthis.currentAction != 0 && _gthis.shouldWorkNow()) {
						_gthis.lastMorningCommuteTime = _gthis.city.simulation.time.timeSinceStart - _gthis.pathStartTime;
					}
				} else {
					this.nextPathPos += 2;
					this.currentPathAction = -1;
					if(this.path[this.nextPathPos] == 13) {
						while(this.nextPathPos + 2 < this.pathEnd && this.path[this.nextPathPos + 2] == 13) this.nextPathPos += 2;
					}
					if(this.path[this.nextPathPos] == 14) {
						while(this.nextPathPos + 2 < this.pathEnd && this.path[this.nextPathPos + 2] == 14) this.nextPathPos += 2;
					}
					if(this.path[this.nextPathPos] == 10) {
						if(this.nextPathPos + 2 >= this.pathEnd) {
							var pathEnd = _gthis.pathEndFunction;
							var resetCanViewSelfInBuilding = true;
							if(resetCanViewSelfInBuilding == null) {
								resetCanViewSelfInBuilding = true;
							}
							if(_gthis.recyclePathArray) {
								pooling_Int32ArrayPool.returnToPool(_gthis.path);
								_gthis.recyclePathArray = false;
							}
							_gthis.path = null;
							_gthis.nextPathPos = -1;
							_gthis.pathEnd = -1;
							_gthis.currentPathAction = -2;
							if(resetCanViewSelfInBuilding) {
								if(!_gthis.canViewSelfInBuilding) {
									_gthis.delayCanViewSelfInBuilding = true;
								}
								_gthis.canViewSelfInBuilding = true;
							}
							_gthis.verticalPathProgress = 0;
							_gthis.pathEndFunction = null;
							_gthis.requestingPathGoal = null;
							_gthis.pathOnlyRelatedTo = null;
							_gthis.pathWalkSpeed = 1;
							_gthis.pathCanBeReconsidered = true;
							if(_gthis.sprite.alpha > 0 && _gthis.sprite.alpha < 1) {
								_gthis.sprite.alpha = 1;
							}
							if(pathEnd != null) {
								pathEnd();
							}
							if(_gthis.inPermanent != null && _gthis.inPermanent == _gthis.job && _gthis.currentAction != 0 && _gthis.shouldWorkNow()) {
								_gthis.lastMorningCommuteTime = _gthis.city.simulation.time.timeSinceStart - _gthis.pathStartTime;
							}
						} else {
							this.canViewSelfInBuilding = true;
							this.nextPathPos += 2;
						}
					}
				}
				Citizen.shouldUpdateDraw = true;
			}
		}
	}
	,leavePermanent: function(timeMod) {
		if(this.inPermanent != null && this.inPermanent.isBuilding) {
			var x = (this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null).doorX;
			var spd = this.pathWalkSpeed * timeMod;
			Citizen.shouldUpdateDraw = true;
			var tmp;
			if(Math.abs(x - this.relativeX) < spd) {
				this.relativeX = x;
				tmp = true;
			} else {
				var num = x - this.relativeX;
				this.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
				tmp = false;
			}
			if(tmp) {
				if(this.inPermanent != null && this.inPermanent.isBuilding) {
					var building = this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null;
					this.relativeX = building.worldPosition.x * 20 + building.doorX;
				} else {
					this.relativeX += this.inPermanent.worldPosition.x * 20;
				}
				if(this.inPermanent != null) {
					this.inPermanent.onCitizenLeave(this,null);
				}
				this.inBuildingSince = this.city.simulation.time.timeSinceStart;
				this.set_drawOnStage(this.foregroundStage);
				this.inPermanent = null;
				this.relativeY = 0;
				Citizen.shouldUpdateDraw = true;
			}
		} else {
			if(this.inPermanent != null && this.inPermanent.isBuilding) {
				var building = this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null;
				this.relativeX = building.worldPosition.x * 20 + building.doorX;
			} else {
				this.relativeX += this.inPermanent.worldPosition.x * 20;
			}
			if(this.inPermanent != null) {
				this.inPermanent.onCitizenLeave(this,null);
			}
			this.inBuildingSince = this.city.simulation.time.timeSinceStart;
			this.set_drawOnStage(this.foregroundStage);
			this.inPermanent = null;
			this.relativeY = 0;
			Citizen.shouldUpdateDraw = true;
		}
	}
	,instantLeavePermanent: function() {
		if(this.inPermanent != null && this.inPermanent.isBuilding) {
			var building = this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null;
			this.relativeX = building.worldPosition.x * 20 + building.doorX;
		} else {
			this.relativeX += this.inPermanent.worldPosition.x * 20;
		}
		if(this.inPermanent != null) {
			this.inPermanent.onCitizenLeave(this,null);
		}
		this.inBuildingSince = this.city.simulation.time.timeSinceStart;
		this.set_drawOnStage(this.foregroundStage);
		this.inPermanent = null;
		this.relativeY = 0;
		Citizen.shouldUpdateDraw = true;
	}
	,moveTowardsX: function(x,timeMod) {
		var spd = this.pathWalkSpeed * timeMod;
		Citizen.shouldUpdateDraw = true;
		if(Math.abs(x - this.relativeX) < spd) {
			this.relativeX = x;
			return true;
		} else {
			var num = x - this.relativeX;
			this.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
			return false;
		}
	}
	,setRelativePos: function(x,y) {
		if(x != this.relativeX || y != this.relativeY) {
			this.relativeX = x;
			this.relativeY = y;
			Citizen.shouldUpdateDraw = true;
		}
	}
	,setRelativeY: function(y) {
		this.relativeY = y;
		Citizen.shouldUpdateDraw = true;
	}
	,setRelativeX: function(x) {
		this.relativeX = x;
		Citizen.shouldUpdateDraw = true;
	}
	,wait: function(time,then) {
		var pool = pooling_Int32ArrayPool.pool;
		var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
		arr[0] = 8;
		arr[1] = time;
		this.setPath(arr,0,2,true);
		this.pathEndFunction = then;
		this.pathOnlyRelatedTo = this.inPermanent;
	}
	,waitRandom: function(timeMin,timeMax,then) {
		var pool = pooling_Int32ArrayPool.pool;
		var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
		arr[0] = 8;
		arr[1] = random_Random.getInt(timeMin,timeMax);
		this.setPath(arr,0,2,true);
		this.pathEndFunction = then;
		this.pathOnlyRelatedTo = this.inPermanent;
	}
	,wander: function(timeMod) {
		if(this.inPermanent == null) {
			var val2 = (this.relativeX | 0) - 100;
			var val1 = (this.relativeX | 0) + 100;
			var val21 = this.onWorld.rect.width - 2;
			this.moveAndWait(random_Random.getInt(val2 > 0 ? val2 : 0,val21 < val1 ? val21 : val1),random_Random.getInt(30,60),null,false,false);
		} else {
			this.goDownTowardsWorldSurface(timeMod);
		}
	}
	,goDownTowardsWorldSurface: function(timeMod) {
		if(this.inPermanent.worldPosition.y == 0 && this.inPermanent.world != null && this.inPermanent.world.rect.height > 0) {
			if(this.inPermanent != null && this.inPermanent.isBuilding) {
				var x = (this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null).doorX;
				var spd = this.pathWalkSpeed * timeMod;
				Citizen.shouldUpdateDraw = true;
				var tmp;
				if(Math.abs(x - this.relativeX) < spd) {
					this.relativeX = x;
					tmp = true;
				} else {
					var num = x - this.relativeX;
					this.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
					tmp = false;
				}
				if(tmp) {
					if(this.inPermanent != null && this.inPermanent.isBuilding) {
						var building = this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null;
						this.relativeX = building.worldPosition.x * 20 + building.doorX;
					} else {
						this.relativeX += this.inPermanent.worldPosition.x * 20;
					}
					if(this.inPermanent != null) {
						this.inPermanent.onCitizenLeave(this,null);
					}
					this.inBuildingSince = this.city.simulation.time.timeSinceStart;
					this.set_drawOnStage(this.foregroundStage);
					this.inPermanent = null;
					this.relativeY = 0;
					Citizen.shouldUpdateDraw = true;
				}
			} else {
				if(this.inPermanent != null && this.inPermanent.isBuilding) {
					var building = this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null;
					this.relativeX = building.worldPosition.x * 20 + building.doorX;
				} else {
					this.relativeX += this.inPermanent.worldPosition.x * 20;
				}
				if(this.inPermanent != null) {
					this.inPermanent.onCitizenLeave(this,null);
				}
				this.inBuildingSince = this.city.simulation.time.timeSinceStart;
				this.set_drawOnStage(this.foregroundStage);
				this.inPermanent = null;
				this.relativeY = 0;
				Citizen.shouldUpdateDraw = true;
			}
			this.impossibleToReachWorldSurfaceForWorld = null;
		} else {
			if(this.impossibleToReachWorldSurfaceForWorld == this.onWorld) {
				return;
			}
			var perm = this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null;
			var arr = [];
			while(perm.worldPosition.y != 0) {
				if(perm.bottomBuilding == null) {
					var lb = perm.leftBuilding;
					if(lb != null) {
						arr.push(2);
						arr.push(0);
						perm = perm.leftBuilding;
					} else if(perm.rightBuilding != null) {
						arr.push(3);
						arr.push(0);
						perm = perm.rightBuilding;
					}
				}
				if(perm.bottomBuilding != null) {
					arr.push(1);
					arr.push(0);
					perm = perm.bottomBuilding;
				} else {
					arr = [];
					this.impossibleToReachWorldSurfaceForWorld = this.onWorld;
					break;
				}
			}
			if(arr.length > 0) {
				this.setPath(new Int32Array(arr),0,arr.length);
			}
		}
	}
	,move: function(x,then,slowMove) {
		if(slowMove == null) {
			slowMove = false;
		}
		if(slowMove) {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
			arr[0] = 12;
			arr[1] = 50;
			arr[2] = 4;
			arr[3] = x;
			this.setPath(arr,0,4,true);
		} else {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 4;
			arr[1] = x;
			this.setPath(arr,0,2,true);
		}
		this.pathEndFunction = then;
		this.pathOnlyRelatedTo = this.inPermanent;
	}
	,moveRandom: function(xMin,xMax,then,slowMove) {
		if(slowMove == null) {
			slowMove = false;
		}
		var moveToX = random_Random.getInt(xMin,xMax);
		if(slowMove) {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
			arr[0] = 12;
			arr[1] = 50;
			arr[2] = 4;
			arr[3] = moveToX;
			this.setPath(arr,0,4,true);
		} else {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 4;
			arr[1] = moveToX;
			this.setPath(arr,0,2,true);
		}
		this.pathEndFunction = then;
		this.pathOnlyRelatedTo = this.inPermanent;
	}
	,moveTowardsRandomInWorldCoords: function(xMin,xMax,then) {
		var moveToX = random_Random.getInt(xMin,xMax);
		if(this.inPermanent != null) {
			var moveDiff = moveToX - this.relativeX - this.inPermanent.position.x;
			if(moveDiff < -this.relativeX) {
				if((this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null).leftBuilding != null) {
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
					arr[0] = 2;
					arr[1] = 0;
					arr[2] = 4;
					arr[3] = 18;
					this.setPath(arr,0,4,true);
				} else {
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 0;
					this.setPath(arr,0,2,true);
					this.pathEndFunction = null;
					this.pathOnlyRelatedTo = this.inPermanent;
				}
			} else if(moveDiff >= 20 - this.relativeX) {
				if((this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null).rightBuilding != null) {
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
					arr[0] = 3;
					arr[1] = 0;
					arr[2] = 4;
					arr[3] = 0;
					this.setPath(arr,0,4,true);
				} else {
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 18;
					this.setPath(arr,0,2,true);
					this.pathEndFunction = null;
					this.pathOnlyRelatedTo = this.inPermanent;
				}
			} else {
				var x = Math.floor(moveDiff + this.relativeX);
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
				arr[0] = 4;
				arr[1] = x;
				this.setPath(arr,0,2,true);
				this.pathEndFunction = null;
				this.pathOnlyRelatedTo = this.inPermanent;
			}
			this.pathEndFunction = then;
		} else {
			var moveToX = random_Random.getInt(xMin - this.onWorld.rect.x,xMax - this.onWorld.rect.x);
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 4;
			arr[1] = moveToX;
			this.setPath(arr,0,2,true);
			this.pathEndFunction = then;
			this.pathOnlyRelatedTo = this.inPermanent;
		}
	}
	,moveAndWaitRandom: function(xMin,xMax,timeMin,timeMax,then,modifyWithHappiness,slowMove) {
		if(slowMove == null) {
			slowMove = false;
		}
		if(modifyWithHappiness == null) {
			modifyWithHappiness = false;
		}
		this.moveAndWait(random_Random.getInt(xMin,xMax),random_Random.getInt(timeMin,timeMax),then,modifyWithHappiness,slowMove);
	}
	,moveAndWait: function(x,time,then,modifyWithHappiness,slowMove) {
		if(slowMove == null) {
			slowMove = false;
		}
		if(modifyWithHappiness == null) {
			modifyWithHappiness = false;
		}
		if(modifyWithHappiness) {
			time = time / this.simulation.happiness.actionSpeedModifier | 0;
		}
		if(slowMove) {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[6].length > 0 ? pool[6].splice(pool[6].length - 1,1)[0] : new Int32Array(6);
			arr[0] = 12;
			arr[1] = 50;
			arr[2] = 4;
			arr[3] = x;
			arr[4] = 8;
			arr[5] = time;
			this.setPath(arr,0,6,true);
		} else {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
			arr[0] = 4;
			arr[1] = x;
			arr[2] = 8;
			arr[3] = time;
			this.setPath(arr,0,4,true);
		}
		this.pathEndFunction = then;
		this.pathOnlyRelatedTo = this.inPermanent;
	}
	,waitAndMoveAndWaitRandom: function(timeMin1,timeMin2,xMin,xMax,timeMin,timeMax,then,modifyWithHappiness,slowMove) {
		if(slowMove == null) {
			slowMove = false;
		}
		if(modifyWithHappiness == null) {
			modifyWithHappiness = false;
		}
		var time1 = random_Random.getInt(timeMin1,timeMin2);
		var time2 = random_Random.getInt(timeMin,timeMax);
		var x = random_Random.getInt(xMin,xMax);
		if(modifyWithHappiness) {
			time1 = time1 / this.simulation.happiness.actionSpeedModifier | 0;
			time2 = time2 / this.simulation.happiness.actionSpeedModifier | 0;
		}
		if(slowMove) {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[8].length > 0 ? pool[8].splice(pool[8].length - 1,1)[0] : new Int32Array(8);
			arr[0] = 8;
			arr[1] = time1;
			arr[2] = 12;
			arr[3] = 50;
			arr[4] = 4;
			arr[5] = x;
			arr[6] = 8;
			arr[7] = time2;
			this.setPath(arr,0,8,true);
		} else {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[6].length > 0 ? pool[6].splice(pool[6].length - 1,1)[0] : new Int32Array(6);
			arr[0] = 8;
			arr[1] = time1;
			arr[2] = 4;
			arr[3] = x;
			arr[4] = 8;
			arr[5] = time2;
			this.setPath(arr,0,6,true);
		}
		this.pathEndFunction = then;
		this.pathOnlyRelatedTo = this.inPermanent;
	}
	,changeFloorAndMoveRandom: function(xMin,xMax,then) {
		var yTo = this.isAtGroundLevel() ? 10 : 0;
		var pool = pooling_Int32ArrayPool.pool;
		var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
		arr[0] = 9;
		arr[1] = yTo;
		arr[2] = 4;
		arr[3] = random_Random.getInt(xMin,xMax);
		this.setPath(arr,0,4,true);
		this.pathEndFunction = then;
		this.pathOnlyRelatedTo = this.inPermanent;
	}
	,isAtGroundLevel: function() {
		return this.relativeY < 5;
	}
	,isAtBottomFloor: function() {
		return this.relativeY < 5;
	}
	,changeFloor: function(then) {
		var yTo = this.isAtGroundLevel() ? 10 : 0;
		var pool = pooling_Int32ArrayPool.pool;
		var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
		arr[0] = 9;
		arr[1] = yTo;
		this.setPath(arr,0,2,true);
		this.pathEndFunction = then;
		this.pathOnlyRelatedTo = this.inPermanent;
	}
	,changeFloorAndWait: function(waitTime,then) {
		var yTo = this.relativeY == 0 ? 10 : 0;
		var pool = pooling_Int32ArrayPool.pool;
		var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
		arr[0] = 9;
		arr[1] = yTo;
		arr[2] = 8;
		arr[3] = waitTime;
		this.setPath(arr,0,4,true);
		this.pathEndFunction = then;
		this.pathOnlyRelatedTo = this.inPermanent;
	}
	,changeFloorAndWaitRandom: function(minTime,maxTime,then) {
		var yTo = this.relativeY == 0 ? 10 : 0;
		var pool = pooling_Int32ArrayPool.pool;
		var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
		arr[0] = 9;
		arr[1] = yTo;
		arr[2] = 8;
		arr[3] = random_Random.getInt(minTime,maxTime);
		this.setPath(arr,0,4,true);
		this.pathEndFunction = then;
		this.pathOnlyRelatedTo = this.inPermanent;
	}
	,resetPath: function(resetCanViewSelfInBuilding) {
		if(resetCanViewSelfInBuilding == null) {
			resetCanViewSelfInBuilding = true;
		}
		if(this.recyclePathArray) {
			pooling_Int32ArrayPool.returnToPool(this.path);
			this.recyclePathArray = false;
		}
		this.path = null;
		this.nextPathPos = -1;
		this.pathEnd = -1;
		this.currentPathAction = -2;
		if(resetCanViewSelfInBuilding) {
			if(!this.canViewSelfInBuilding) {
				this.delayCanViewSelfInBuilding = true;
			}
			this.canViewSelfInBuilding = true;
		}
		this.verticalPathProgress = 0;
		this.pathEndFunction = null;
		this.requestingPathGoal = null;
		this.pathOnlyRelatedTo = null;
		this.pathWalkSpeed = 1;
		this.pathCanBeReconsidered = true;
		if(this.sprite.alpha > 0 && this.sprite.alpha < 1) {
			this.sprite.alpha = 1;
		}
	}
	,swapRemoveFromStage: function() {
		var currentLastSprite = this.addedToStage.children[this.addedToStage.children.length - 1];
		this.addedToStage.children[this.stageChildIndex] = currentLastSprite;
		Citizen.spriteCitizens.h[currentLastSprite.__id__].stageChildIndex = this.stageChildIndex;
		this.addedToStage.children[this.addedToStage.children.length - 1] = this.sprite;
		this.addedToStage.removeChildAt(this.addedToStage.children.length - 1);
	}
	,actuallyUpdateDraw: function() {
		if(this.inPermanent != null) {
			if(this.inPermanent != null && this.inPermanent.isBuilding) {
				if(this.sprite.alpha == 0 || this.sprite.alpha == 1) {
					this.sprite.alpha = this.canViewSelfInBuilding && !this.delayCanViewSelfInBuilding ? 1 : 0;
				}
				this.sprite.position.set(this.inPermanent.position.x + this.relativeX,this.inPermanent.position.y + 20 - this.relativeY - 1);
			} else {
				this.sprite.position.set(this.inPermanent.position.x + this.relativeX,this.inPermanent.position.y + 20 - this.relativeY);
			}
		} else {
			this.sprite.position.set(this.onWorld.rect.x + this.relativeX,this.onWorld.rect.y - this.relativeY);
		}
		this.updateCull();
	}
	,uncull: function() {
		if(this.addedToStage == null && this.drawOnStage != null) {
			this.stageChildIndex = this.drawOnStage.children.length;
			this.drawOnStage.addChild(this.sprite);
			this.addedToStage = this.drawOnStage;
		}
	}
	,updateCull: function() {
		var newStage;
		if(this.sprite.x >= this.city.cityCullX && this.sprite.y >= this.city.cityCullY && this.sprite.x < this.city.cityCullX2 && this.sprite.y < this.city.cityCullY2) {
			newStage = this.drawOnStage;
		} else {
			newStage = null;
		}
		if(newStage != this.addedToStage) {
			if(this.addedToStage != null) {
				this.swapRemoveFromStage();
			}
			if(newStage != null) {
				this.stageChildIndex = newStage.children.length;
				newStage.addChild(this.sprite);
			}
			this.addedToStage = newStage;
		}
	}
	,addToOnWorldStage: function() {
		this.set_drawOnStage(this.foregroundStage);
	}
	,addToWithAccessoryStage: function() {
		this.set_drawOnStage(this.inBuildingStageNonParticle);
	}
	,addToCorrectStage: function() {
		this.set_drawOnStage(this.inPermanent != null && this.inPermanent.isBuilding ? this.accessorySprite != null ? this.inBuildingStageNonParticle : this.inBuildingStage : this.foregroundStage);
	}
	,findPath: function(goal,onFail) {
		this.simulation.pathfinder.findPath(this,goal);
		this.pathOnFail = onFail;
	}
	,findPathCombined: function(goal,onFail) {
		this.simulation.pathfinder.findPathCombined(this,goal);
		this.pathOnFail = onFail;
	}
	,findPathEntertainment: function(maxDistance,entertainmentTypeBit) {
		this.simulation.pathfinder.findPathEntertainment(this,maxDistance,entertainmentTypeBit);
		this.pathOnFail = null;
	}
	,setPath: function(path,pathStartPos,pathLength,recyclePathArray) {
		if(recyclePathArray == null) {
			recyclePathArray = false;
		}
		if(this.path != null) {
			console.log("FloatingSpaceCities/Citizen.hx:1564:","overwriting path");
			console.log("FloatingSpaceCities/Citizen.hx:1564:",this);
		}
		if(path[pathStartPos] == -1) {
			this.isRequestingPath = false;
			if(this.requestingPathGoal == this.home) {
				this.evictFromHome();
			} else if(this.requestingPathGoal == this.job) {
				this.loseJob();
			} else if(this.requestingPathGoal == this.school) {
				this.leaveSchool();
			}
			if(this.pathOnFail != null) {
				this.pathOnFail();
			}
			var resetCanViewSelfInBuilding = false;
			if(resetCanViewSelfInBuilding == null) {
				resetCanViewSelfInBuilding = true;
			}
			if(this.recyclePathArray) {
				pooling_Int32ArrayPool.returnToPool(this.path);
				this.recyclePathArray = false;
			}
			this.path = null;
			this.nextPathPos = -1;
			this.pathEnd = -1;
			this.currentPathAction = -2;
			if(resetCanViewSelfInBuilding) {
				if(!this.canViewSelfInBuilding) {
					this.delayCanViewSelfInBuilding = true;
				}
				this.canViewSelfInBuilding = true;
			}
			this.verticalPathProgress = 0;
			this.pathEndFunction = null;
			this.requestingPathGoal = null;
			this.pathOnlyRelatedTo = null;
			this.pathWalkSpeed = 1;
			this.pathCanBeReconsidered = true;
			if(this.sprite.alpha > 0 && this.sprite.alpha < 1) {
				this.sprite.alpha = 1;
			}
			return;
		}
		this.pathDestination = this.requestingPathGoal;
		var resetCanViewSelfInBuilding = false;
		if(resetCanViewSelfInBuilding == null) {
			resetCanViewSelfInBuilding = true;
		}
		if(this.recyclePathArray) {
			pooling_Int32ArrayPool.returnToPool(this.path);
			this.recyclePathArray = false;
		}
		this.path = null;
		this.nextPathPos = -1;
		this.pathEnd = -1;
		this.currentPathAction = -2;
		if(resetCanViewSelfInBuilding) {
			if(!this.canViewSelfInBuilding) {
				this.delayCanViewSelfInBuilding = true;
			}
			this.canViewSelfInBuilding = true;
		}
		this.verticalPathProgress = 0;
		this.pathEndFunction = null;
		this.requestingPathGoal = null;
		this.pathOnlyRelatedTo = null;
		this.pathWalkSpeed = 1;
		this.pathCanBeReconsidered = true;
		if(this.sprite.alpha > 0 && this.sprite.alpha < 1) {
			this.sprite.alpha = 1;
		}
		if(pathLength != 0) {
			this.path = path;
			this.nextPathPos = pathStartPos;
			this.currentPathAction = -1;
			this.pathEnd = pathStartPos + pathLength;
			if(this.inPermanent != null && (this.relativeX < 0 || this.relativeX > 18)) {
				if(this.path[this.nextPathPos] != 15 && this.path[this.nextPathPos] != 16) {
					var val = this.relativeX;
					this.relativeX = val < 0 ? 0 : val > 18 ? 18 : val;
				}
			}
		}
		this.isRequestingPath = false;
		this.recyclePathArray = recyclePathArray;
		this.pathStartTime = this.city.simulation.time.timeSinceStart;
	}
	,setPathWithEnd: function(path,pathStartPos,pathLength,then,recyclePathArray) {
		if(recyclePathArray == null) {
			recyclePathArray = false;
		}
		this.setPath(path,pathStartPos,pathLength,recyclePathArray);
		this.pathEndFunction = then;
	}
	,setCurrentTexture: function() {
		var tmp = this.get_age() < 16 ? this.childrenTextures[this.spriteIndexActual] : this.adultTextures[this.spriteIndexActual];
		this.sprite.texture = tmp;
		this.actualSpriteHeight = this.get_age() < 16 ? 4 : this.spriteIndexActual == 6 || this.spriteIndexActual == 12 || this.spriteIndexActual == 16 || this.spriteIndexActual == 20 || this.spriteIndexActual == 26 ? 4 : 5;
	}
	,load: function(queue,definition) {
		this.loadBasics(queue,definition);
		this.updateSpriteAndNameIndexInfo();
	}
	,updateSpriteAndNameIndexInfo: function() {
		this.nameIndex = this.spriteIndex >> 14;
		this.spriteIndexActual = this.spriteIndex - (this.nameIndex << 14);
		if(this.nameIndex == 0) {
			this.nameIndex = random_Random.getInt(1,8000);
		}
		if(this.spriteIndexActual >= this.adultTextures.length - 2) {
			this.spriteIndexActual = random_Random.getInt(this.childrenTextures.length - 2);
			this.spriteIndex = this.spriteIndexActual + (this.nameIndex << 14);
		}
		if(Resources.citizenNames.length >= this.nameIndex && Resources.citizenNames[this.nameIndex] == "Waldo") {
			this.spriteIndexActual = this.childrenTextures.length - 1;
		}
		if(Resources.citizenNames.length >= this.nameIndex && Resources.citizenNames[this.nameIndex] == "Dracula") {
			this.spriteIndexActual = this.childrenTextures.length - 2;
		}
		this.likesNightclubs = this.spriteIndex % 5 == 0 ? false : true;
		this.setCurrentTexture();
	}
	,changeNameIfInFile: function(newName) {
		if(Resources.citizenNames.length == 0) {
			return;
		}
		var id_ = Resources.citizenNames.indexOf("Dracula");
		this.nameIndex = id_;
		this.spriteIndex = this.spriteIndexActual + (id_ << 14);
	}
	,afterLoadingInPermanent: function() {
		if(this.inPermanent != null && (this.relativeX < 0 || this.relativeX > 20)) {
			this.relativeY = 5;
		}
		if(this.inPermanent == null && (this.onWorld != null && this.onWorld.rect.height == 0)) {
			this.onWorld = Lambda.find(this.city.worlds,function(w) {
				return w.rect.y > 0;
			});
			this.setRelativeX(0);
		}
		this.addToCorrectStage();
		this.actuallyUpdateDraw();
		if(this.school == null && this.currentAction == 1) {
			this.currentAction = 2;
		}
	}
	,goToPermanent: function(permanent) {
		if(this.inPermanent != null) {
			this.inPermanent.onCitizenLeave(this,permanent);
		}
		this.inBuildingSince = this.city.simulation.time.timeSinceStart;
		this.inPermanent = permanent;
		this.hasBuildingInited = false;
	}
	,goToPermanentLocal: function(permanent) {
		this.inPermanent = permanent;
	}
	,educate: function(amount,cap) {
		this.educationLevel = Math.max(Math.min(this.educationLevel + amount,cap),this.educationLevel);
	}
	,getCityPosition: function() {
		var returnPoint = new common_FPoint(0,0);
		if(this.fullyBeingControlled && this.inTransportationThing != null) {
			returnPoint = new common_FPoint(this.inTransportationThing.position.x + this.inTransportationThing.get_citizenOffset().x,this.inTransportationThing.position.y + this.inTransportationThing.get_citizenOffset().y);
		} else if(this.inPermanent != null) {
			returnPoint.x = this.inPermanent.position.x + this.relativeX;
			if((this.inPermanent != null && this.inPermanent.isBuilding ? this.inPermanent : null) != null) {
				returnPoint.y = this.inPermanent.position.y + 20 - this.relativeY - 1;
			} else {
				returnPoint.y = this.inPermanent.position.y + 20 - this.relativeY;
			}
		} else {
			var _this = this.onWorld.rect;
			var _this_x = _this.x;
			var _this_y = _this.y;
			var _this_x1 = _this_x;
			var _this_y1 = _this_y;
			var otherPoint_x = this.relativeX;
			var otherPoint_y = -this.relativeY;
			returnPoint = new common_FPoint(_this_x1 + otherPoint_x,_this_y1 + otherPoint_y);
		}
		if(this.path != null) {
			if(this.currentPathAction == 0) {
				returnPoint.y -= this.verticalPathProgress;
			} else if(this.currentPathAction == 1) {
				returnPoint.y += this.verticalPathProgress;
			}
		}
		return returnPoint;
	}
	,getShard: function() {
		if(this.inPermanent != null) {
			return this.inPermanent.shardId;
		}
		return this.onWorld.surfaceShardId;
	}
	,onClick: function() {
		var _gthis = this;
		gui_FollowingCitizen.createWindow(this.city,this);
		if(!this.city.simulation.bonuses.waldoFound && Resources.citizenNames.length > this.nameIndex && Resources.citizenNames[this.nameIndex] == "Waldo") {
			var newKnowledge = Math.floor(10 + 0.05 * this.city.simulation.citizens.length);
			this.city.materials.knowledge += newKnowledge;
			this.city.simulation.stats.materialProduction[10][0] += newKnowledge;
			this.city.simulation.bonuses.waldoFound = true;
			var createWaldoWindow = function() {
				_gthis.city.gui.showSimpleWindow(common_Localize.lo("waldo_found",[newKnowledge]),null,true);
			};
			createWaldoWindow();
			this.city.gui.addWindowToStack(createWaldoWindow);
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(Citizen.saveDefinition);
		}
		var value = this.hasBuildingInited;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.spriteIndex;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.relativeX;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.bornOn;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.currentAction;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.hasWorkTools;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.lastInfrequentUpdateAge;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.dieAgeModifier;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.educationLevel;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.actualWorkTimePreference;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,loadBasics: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"hasBuildingInited")) {
			this.hasBuildingInited = loadMap.h["hasBuildingInited"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"spriteIndex")) {
			this.spriteIndex = loadMap.h["spriteIndex"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"relativeX")) {
			this.relativeX = loadMap.h["relativeX"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"bornOn")) {
			this.bornOn = loadMap.h["bornOn"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentAction")) {
			this.currentAction = loadMap.h["currentAction"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"hasWorkTools")) {
			this.hasWorkTools = loadMap.h["hasWorkTools"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"lastInfrequentUpdateAge")) {
			this.lastInfrequentUpdateAge = loadMap.h["lastInfrequentUpdateAge"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"dieAgeModifier")) {
			this.dieAgeModifier = loadMap.h["dieAgeModifier"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"educationLevel")) {
			this.educationLevel = loadMap.h["educationLevel"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"actualWorkTimePreference")) {
			this.actualWorkTimePreference = loadMap.h["actualWorkTimePreference"];
		}
		this.postLoad();
	}
	,__class__: Citizen
};
