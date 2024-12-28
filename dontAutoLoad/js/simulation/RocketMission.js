var simulation_RocketMission = $hxClasses["simulation.RocketMission"] = function(city,launchPlatform) {
	this.associatedRocketOrRocketGoingDown = null;
	this.missionCompletionText = "";
	this.missionHasRocketGoingDown = false;
	this.ctsInts = [];
	this.crewMembersInts = [];
	this.currentCitizensToSend = 0;
	this.currentMaterialsToSend = new haxe_ds_StringMap();
	this.missionDuration = 3.1;
	this.returnTime = 0;
	this.startedMission = false;
	this.executingMission = false;
	this.crewMembersHippies = 0;
	this.crewMembersFeather = 0;
	this.crewMembersMiners = 0;
	this.crewMembersBiologists = 0;
	this.crewMembersNavigators = 0;
	this.crewMembersEngineers = 0;
	this.crewMembersExplorers = 0;
	this.maxCrewMembers = 4;
	this.city = city;
	this.destination = 0;
	this.crewMembers = [];
	this.citizensToSend = [];
	this.launchPlatform = launchPlatform;
};
simulation_RocketMission.__name__ = "simulation.RocketMission";
simulation_RocketMission.getDestinationFindPct = function(city,destination,onlyFunction) {
	if(onlyFunction == null) {
		onlyFunction = -1;
	}
	var allOptions = [];
	var unlocks = simulation_RocketMission.getUnlocks(city);
	if(destination == 0) {
		if(onlyFunction == -1 || onlyFunction == 0) {
			allOptions = allOptions.concat(unlocks.possibleBuildingUnlocksForExplorers);
		}
		if(onlyFunction == -1 || onlyFunction == 1) {
			allOptions = allOptions.concat(unlocks.possibleBuildingUnlocksForEngineers);
		}
		if(onlyFunction == -1 || onlyFunction == 2) {
			allOptions = allOptions.concat(unlocks.possibleBuildingUnlocksForBiologists);
		}
	} else if(destination == 1) {
		if(onlyFunction == -1 || onlyFunction == 0) {
			allOptions = allOptions.concat(unlocks.possibleBuildingUnlocksForExplorers2);
		}
		if(onlyFunction == -1 || onlyFunction == 1) {
			allOptions = allOptions.concat(unlocks.possibleBuildingUnlocksForEngineers2);
		}
		if(onlyFunction == -1 || onlyFunction == 2) {
			allOptions = allOptions.concat(unlocks.possibleBuildingUnlocksForBiologists2);
		}
	}
	var allOptionsCount = Lambda.count(allOptions,function(op) {
		return city.progress.unlocks.getUnlockState(op) != progress_UnlockState.Locked;
	});
	return allOptionsCount / allOptions.length;
};
simulation_RocketMission.getUnlocks = function(city) {
	var possibleBuildingUnlocksForExplorers = [buildings_UnderwaterHouse,cityUpgrades_RocketMissionCheaperRockets];
	if(city.cityMainFile == city.cityFile) {
		possibleBuildingUnlocksForExplorers.push(cityUpgrades_RocketSubCityRockWorld);
	}
	var possibleBuildingUnlocksForExplorers2 = [buildings_WizardHatCafe,buildings_AlienNightClub];
	if(city.cityMainFile == city.cityFile) {
		possibleBuildingUnlocksForExplorers2.push(cityUpgrades_RocketSubCityStrangeForests);
	}
	var possibleBuildingUnlocksForEngineers = [buildingUpgrades_RocketFuelFactoryEfficiency,cityUpgrades_RocketMissionSupercomputerUpgrade,buildingUpgrades_RefinedMetalFactoryEfficiency];
	var possibleBuildingUnlocksForEngineers2 = [buildingUpgrades_GrapheneFactoryImprovement,cityUpgrades_RocketTeleporterCostReductionFromWorld];
	var possibleBuildingUnlocksForBiologists = [buildings_OldestTreeIntheUniverse,cityUpgrades_RocketMissionRocketFuelFactoryUpgrade];
	var possibleBuildingUnlocksForBiologists2 = [buildings_OtherworldlyZoo,buildings_AlienFarm,buildings_OtherworldlyGardens];
	return { possibleBuildingUnlocksForExplorers : possibleBuildingUnlocksForExplorers, possibleBuildingUnlocksForExplorers2 : possibleBuildingUnlocksForExplorers2, possibleBuildingUnlocksForEngineers : possibleBuildingUnlocksForEngineers, possibleBuildingUnlocksForEngineers2 : possibleBuildingUnlocksForEngineers2, possibleBuildingUnlocksForBiologists : possibleBuildingUnlocksForBiologists, possibleBuildingUnlocksForBiologists2 : possibleBuildingUnlocksForBiologists2};
};
simulation_RocketMission.prototype = {
	get_totalCrewMembers: function() {
		return this.crewMembersExplorers + this.crewMembersEngineers + this.crewMembersNavigators + this.crewMembersBiologists + this.crewMembersMiners + this.crewMembersFeather + this.crewMembersHippies;
	}
	,update: function(timeMod) {
		var _gthis = this;
		if(this.launchPlatform.destroyed) {
			this.failMission();
			return;
		}
		if(this.startedMission) {
			var _g = 0;
			var _g1 = this.crewMembers;
			while(_g < _g1.length) {
				var citizen = _g1[_g];
				++_g;
				if(citizen.inTransportationThing == null) {
					citizen.setRelativeY(-10000);
				}
				citizen.actuallyUpdateDraw();
			}
			if(this.city.simulation.time.timeSinceStart / 1440 > this.returnTime) {
				if(!this.missionHasRocketGoingDown) {
					var rgd = new simulation_RocketGoingDown(this.city.simulation,this.city.farForegroundStage,this.launchPlatform.world,this,this.launchPlatform.worldPosition.x);
					this.city.simulation.rocketsGoingDown.push(rgd);
					this.missionHasRocketGoingDown = true;
					var _g = 0;
					var _g1 = this.crewMembers;
					while(_g < _g1.length) {
						var citizen = _g1[_g];
						++_g;
						citizen.setRelativeY(0);
						citizen.inTransportationThing = rgd;
					}
				}
			}
			return;
		}
		var allCitizensHere = true;
		var completelyUtterlyAndTotallyFailed = false;
		var _g = 0;
		var _g1 = this.crewMembers;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			if(citizen == null) {
				continue;
			}
			if(citizen.hasDied) {
				completelyUtterlyAndTotallyFailed = true;
			}
			if(citizen.get_age() >= 75 + citizen.dieAgeModifier - 2) {
				citizen.dieAgeModifier += 2;
			}
			citizen.entertainment.delayLookingForEntertainment();
			if(citizen.path != null || citizen.isRequestingPath) {
				if(citizen.currentAction == 2 && !citizen.isRequestingPath && !citizen.fullyBeingControlled && citizen.pathDestination != this.launchPlatform && citizen.home == null) {
					if(citizen.recyclePathArray) {
						pooling_Int32ArrayPool.returnToPool(citizen.path);
						citizen.recyclePathArray = false;
					}
					citizen.path = null;
					citizen.nextPathPos = -1;
					citizen.pathEnd = -1;
					citizen.currentPathAction = -2;
					if(!citizen.canViewSelfInBuilding) {
						citizen.delayCanViewSelfInBuilding = true;
					}
					citizen.canViewSelfInBuilding = true;
					citizen.verticalPathProgress = 0;
					citizen.pathEndFunction = null;
					citizen.requestingPathGoal = null;
					citizen.pathOnlyRelatedTo = null;
					citizen.pathWalkSpeed = 1;
					citizen.pathCanBeReconsidered = true;
					if(citizen.sprite.alpha > 0 && citizen.sprite.alpha < 1) {
						citizen.sprite.alpha = 1;
					}
				} else {
					allCitizensHere = false;
					continue;
				}
			}
			if(citizen.inPermanent == this.launchPlatform) {
				var x = citizen.spriteIndex % 15 + 3;
				var spd = citizen.pathWalkSpeed * timeMod;
				Citizen.shouldUpdateDraw = true;
				if(Math.abs(x - citizen.relativeX) < spd) {
					citizen.relativeX = x;
				} else {
					var num = x - citizen.relativeX;
					citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
				}
				citizen.actuallyUpdateDraw();
				citizen.beControlledBySpecial();
				continue;
			}
			if(!citizen.tryFinishWork(timeMod)) {
				allCitizensHere = false;
				continue;
			}
			var _this = citizen.entertainment;
			if(!(_this.citizen.inPermanent != null && _this.citizen.inPermanent.isBuilding && _this.citizen.inPermanent.isEntertainment ? _this.citizen.inPermanent.finishEntertainment(_this.citizen,timeMod) : true)) {
				allCitizensHere = false;
				continue;
			}
			if(citizen.hobby != null && citizen.hobby.isActive()) {
				allCitizensHere = false;
				continue;
			}
			if(citizen.fullyBeingControlled) {
				allCitizensHere = false;
				continue;
			}
			allCitizensHere = false;
			citizen.beControlledBySpecial();
			citizen.simulation.pathfinder.findPath(citizen,this.launchPlatform);
			citizen.pathOnFail = function() {
				_gthis.failMission();
			};
		}
		var _g = 0;
		var _g1 = this.citizensToSend;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			if(citizen == null) {
				continue;
			}
			if(citizen.hasDied) {
				continue;
			}
			if(citizen.get_age() >= 75 + citizen.dieAgeModifier - 2) {
				citizen.dieAgeModifier += 2;
			}
			citizen.entertainment.delayLookingForEntertainment();
			if(citizen.path != null || citizen.isRequestingPath) {
				if(citizen.currentAction == 2 && !citizen.isRequestingPath && !citizen.fullyBeingControlled && citizen.pathDestination != this.launchPlatform && citizen.home == null) {
					if(citizen.recyclePathArray) {
						pooling_Int32ArrayPool.returnToPool(citizen.path);
						citizen.recyclePathArray = false;
					}
					citizen.path = null;
					citizen.nextPathPos = -1;
					citizen.pathEnd = -1;
					citizen.currentPathAction = -2;
					if(!citizen.canViewSelfInBuilding) {
						citizen.delayCanViewSelfInBuilding = true;
					}
					citizen.canViewSelfInBuilding = true;
					citizen.verticalPathProgress = 0;
					citizen.pathEndFunction = null;
					citizen.requestingPathGoal = null;
					citizen.pathOnlyRelatedTo = null;
					citizen.pathWalkSpeed = 1;
					citizen.pathCanBeReconsidered = true;
					if(citizen.sprite.alpha > 0 && citizen.sprite.alpha < 1) {
						citizen.sprite.alpha = 1;
					}
				} else {
					allCitizensHere = false;
					continue;
				}
			}
			if(citizen.inPermanent == this.launchPlatform) {
				var x = citizen.spriteIndex % 15 + 3;
				var spd = citizen.pathWalkSpeed * timeMod;
				Citizen.shouldUpdateDraw = true;
				if(Math.abs(x - citizen.relativeX) < spd) {
					citizen.relativeX = x;
				} else {
					var num = x - citizen.relativeX;
					citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
				}
				citizen.actuallyUpdateDraw();
				citizen.beControlledBySpecial();
				continue;
			}
			if(!citizen.tryFinishWork(timeMod)) {
				allCitizensHere = false;
				continue;
			}
			var _this = citizen.entertainment;
			if(!(_this.citizen.inPermanent != null && _this.citizen.inPermanent.isBuilding && _this.citizen.inPermanent.isEntertainment ? _this.citizen.inPermanent.finishEntertainment(_this.citizen,timeMod) : true)) {
				allCitizensHere = false;
				continue;
			}
			if(citizen.hobby != null && citizen.hobby.isActive()) {
				allCitizensHere = false;
				continue;
			}
			if(citizen.fullyBeingControlled) {
				allCitizensHere = false;
				continue;
			}
			allCitizensHere = false;
			citizen.beControlledBySpecial();
			citizen.simulation.pathfinder.findPath(citizen,this.launchPlatform);
			citizen.pathOnFail = function() {
				_gthis.failMission();
			};
		}
		if(completelyUtterlyAndTotallyFailed) {
			this.failMission();
			return;
		}
		if(allCitizensHere) {
			if(!this.startedMission) {
				this.startedMission = true;
				var missionDurationActual = this.missionDuration * (1 - 0.1 * this.crewMembersNavigators - (this.crewMembersNavigators > 0 ? 0.1 : 0));
				this.returnTime = this.city.simulation.time.timeSinceStart / 1440 + missionDurationActual;
				this.city.game.audio.playSound(this.city.game.audio.rocketLaunchSound);
				this.launchPlatform.rocket.launch(this.city.getCityEdges().minY);
				var _g = 0;
				var _g1 = this.crewMembers;
				while(_g < _g1.length) {
					var citizen = _g1[_g];
					++_g;
					if(citizen != null) {
						citizen.fullyBeingControlled = true;
						citizen.inTransportationThing = this.launchPlatform.rocket;
						citizen.canViewSelfInBuilding = false;
						citizen.actuallyUpdateDraw();
					}
				}
				if(this.destination >= 10) {
					var sendToCity = this.destination - 11;
					if(this.city.progress.allCitiesInfo.subCitySentPeople[sendToCity] == null) {
						this.city.progress.allCitiesInfo.subCitySentPeople[sendToCity] = "";
					}
					var _g = 0;
					var _g1 = this.citizensToSend;
					while(_g < _g1.length) {
						var citizen = _g1[_g];
						++_g;
						if(citizen != null) {
							this.city.progress.allCitiesInfo.subCitySentPeople[sendToCity] += citizen.get_age() + "," + citizen.spriteIndex + "," + citizen.educationLevel + "," + citizen.dieAgeModifier + ";";
							citizen.fullyBeingControlled = false;
							citizen.stopBeControlledBySpecial();
							citizen.dynamicUnsavedVars.flyAwayInRocket = true;
							citizen.tryRemove(true);
						}
					}
					if(this.city.progress.allCitiesInfo.subCitySentResources[sendToCity] == null) {
						this.city.progress.allCitiesInfo.subCitySentResources[sendToCity] = new haxe_ds_StringMap();
					}
					if(this.currentMaterialsToSend.h["food"] != null && this.currentMaterialsToSend.h["food"] >= 0) {
						var actuallySend = Math.floor(Math.min(this.city.materials.food,this.currentMaterialsToSend.h["food"]));
						var _g = this.city.materials;
						_g.set_food(_g.food - actuallySend);
						if(this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["food"] == null) {
							this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["food"] = actuallySend;
						} else {
							var _g = this.city.progress.allCitiesInfo.subCitySentResources[sendToCity];
							var v = _g.h["food"] + actuallySend;
							_g.h["food"] = v;
						}
					}
					if(this.currentMaterialsToSend.h["wood"] != null && this.currentMaterialsToSend.h["wood"] >= 0) {
						var actuallySend = Math.floor(Math.min(this.city.materials.wood,this.currentMaterialsToSend.h["wood"]));
						this.city.materials.wood -= actuallySend;
						if(this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["wood"] == null) {
							this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["wood"] = actuallySend;
						} else {
							var _g = this.city.progress.allCitiesInfo.subCitySentResources[sendToCity];
							var v = _g.h["wood"] + actuallySend;
							_g.h["wood"] = v;
						}
					}
					if(this.currentMaterialsToSend.h["stone"] != null && this.currentMaterialsToSend.h["stone"] >= 0) {
						var actuallySend = Math.floor(Math.min(this.city.materials.stone,this.currentMaterialsToSend.h["stone"]));
						this.city.materials.stone -= actuallySend;
						if(this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["stone"] == null) {
							this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["stone"] = actuallySend;
						} else {
							var _g = this.city.progress.allCitiesInfo.subCitySentResources[sendToCity];
							var v = _g.h["stone"] + actuallySend;
							_g.h["stone"] = v;
						}
					}
					if(this.currentMaterialsToSend.h["machineParts"] != null && this.currentMaterialsToSend.h["machineParts"] >= 0) {
						var actuallySend = Math.floor(Math.min(this.city.materials.machineParts,this.currentMaterialsToSend.h["machineParts"]));
						this.city.materials.machineParts -= actuallySend;
						if(this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["machineParts"] == null) {
							this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["machineParts"] = actuallySend;
						} else {
							var _g = this.city.progress.allCitiesInfo.subCitySentResources[sendToCity];
							var v = _g.h["machineParts"] + actuallySend;
							_g.h["machineParts"] = v;
						}
					}
					if(this.currentMaterialsToSend.h["refinedMetal"] != null && this.currentMaterialsToSend.h["refinedMetal"] >= 0) {
						var actuallySend = Math.floor(Math.min(this.city.materials.refinedMetal,this.currentMaterialsToSend.h["refinedMetal"]));
						this.city.materials.refinedMetal -= actuallySend;
						if(this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["refinedMetal"] == null) {
							this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["refinedMetal"] = actuallySend;
						} else {
							var _g = this.city.progress.allCitiesInfo.subCitySentResources[sendToCity];
							var v = _g.h["refinedMetal"] + actuallySend;
							_g.h["refinedMetal"] = v;
						}
					}
					if(this.currentMaterialsToSend.h["computerChips"] != null && this.currentMaterialsToSend.h["computerChips"] >= 0) {
						var actuallySend = Math.floor(Math.min(this.city.materials.computerChips,this.currentMaterialsToSend.h["computerChips"]));
						this.city.materials.computerChips -= actuallySend;
						if(this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["computerChips"] == null) {
							this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["computerChips"] = actuallySend;
						} else {
							var _g = this.city.progress.allCitiesInfo.subCitySentResources[sendToCity];
							var v = _g.h["computerChips"] + actuallySend;
							_g.h["computerChips"] = v;
						}
					}
					if(this.currentMaterialsToSend.h["cacao"] != null && this.currentMaterialsToSend.h["cacao"] >= 0) {
						var actuallySend = Math.floor(Math.min(this.city.materials.cacao,this.currentMaterialsToSend.h["cacao"]));
						this.city.materials.cacao -= actuallySend;
						if(this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["cacao"] == null) {
							this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["cacao"] = actuallySend;
						} else {
							var _g = this.city.progress.allCitiesInfo.subCitySentResources[sendToCity];
							var v = _g.h["cacao"] + actuallySend;
							_g.h["cacao"] = v;
						}
					}
					if(this.currentMaterialsToSend.h["chocolate"] != null && this.currentMaterialsToSend.h["chocolate"] >= 0) {
						var actuallySend = Math.floor(Math.min(this.city.materials.chocolate,this.currentMaterialsToSend.h["chocolate"]));
						this.city.materials.chocolate -= actuallySend;
						if(this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["chocolate"] == null) {
							this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["chocolate"] = actuallySend;
						} else {
							var _g = this.city.progress.allCitiesInfo.subCitySentResources[sendToCity];
							var v = _g.h["chocolate"] + actuallySend;
							_g.h["chocolate"] = v;
						}
					}
					if(this.currentMaterialsToSend.h["graphene"] != null && this.currentMaterialsToSend.h["graphene"] >= 0) {
						var actuallySend = Math.floor(Math.min(this.city.materials.graphene,this.currentMaterialsToSend.h["graphene"]));
						this.city.materials.graphene -= actuallySend;
						if(this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["graphene"] == null) {
							this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["graphene"] = actuallySend;
						} else {
							var _g = this.city.progress.allCitiesInfo.subCitySentResources[sendToCity];
							var v = _g.h["graphene"] + actuallySend;
							_g.h["graphene"] = v;
						}
					}
					if(this.currentMaterialsToSend.h["rocketFuel"] != null && this.currentMaterialsToSend.h["rocketFuel"] >= 0) {
						var actuallySend = Math.floor(Math.min(this.city.materials.rocketFuel,this.currentMaterialsToSend.h["rocketFuel"]));
						this.city.materials.rocketFuel -= actuallySend;
						if(this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["rocketFuel"] == null) {
							this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["rocketFuel"] = actuallySend;
						} else {
							var _g = this.city.progress.allCitiesInfo.subCitySentResources[sendToCity];
							var v = _g.h["rocketFuel"] + actuallySend;
							_g.h["rocketFuel"] = v;
						}
					}
					var _g = 0;
					var _g1 = MaterialsHelper.modMaterials;
					while(_g < _g1.length) {
						var modMaterial = _g1[_g];
						++_g;
						var currentMaterial = modMaterial.variableName;
						if(this.currentMaterialsToSend.h[currentMaterial] != null && this.currentMaterialsToSend.h[currentMaterial] >= 0) {
							var actuallySend = Math.floor(Math.min(this.city.materials[currentMaterial],this.currentMaterialsToSend.h[currentMaterial]));
							this.city.materials[currentMaterial] -= actuallySend;
							if(this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h[currentMaterial] == null) {
								this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h[currentMaterial] = actuallySend;
							} else {
								var _g2 = currentMaterial;
								var _g3 = this.city.progress.allCitiesInfo.subCitySentResources[sendToCity];
								var v = _g3.h[_g2] + actuallySend;
								_g3.h[_g2] = v;
							}
						}
					}
					if(this.currentMaterialsToSend.h["knowledge"] != null && this.currentMaterialsToSend.h["knowledge"] >= 0) {
						var actuallySend = Math.floor(Math.min(this.city.materials.knowledge,this.currentMaterialsToSend.h["knowledge"]));
						this.city.materials.knowledge -= actuallySend;
						if(this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["knowledge"] == null) {
							this.city.progress.allCitiesInfo.subCitySentResources[sendToCity].h["knowledge"] = actuallySend;
						} else {
							var _g = this.city.progress.allCitiesInfo.subCitySentResources[sendToCity];
							var v = _g.h["knowledge"] + actuallySend;
							_g.h["knowledge"] = v;
						}
					}
				}
				this.associatedRocketOrRocketGoingDown = this.launchPlatform.rocket;
				this.launchPlatform.hasRocketType = -1;
				this.launchPlatform.rocket = null;
			}
		}
	}
	,completeMission: function() {
		this.city.simulation.rockets.removeMission(this);
		if(this.launchPlatform != null) {
			this.launchPlatform.currentMission = null;
		}
		var _g = 0;
		var _g1 = this.crewMembers;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			if(citizen != null) {
				citizen.fullyBeingControlled = false;
				citizen.inTransportationThing = null;
				citizen.stopBeControlledBySpecial();
			}
		}
		this.giveMissionReward();
		if(this.missionCompletionText != "") {
			this.city.gui.removeNotifyPanel();
			this.city.gui.notifyInPanel(common_Localize.lo("mission_complete"),this.missionCompletionText);
		}
	}
	,failMission: function() {
		this.city.simulation.rockets.removeMission(this);
		if(this.launchPlatform != null) {
			if(this.launchPlatform.currentMission == this) {
				this.launchPlatform.currentMission = null;
				if(this.launchPlatform.hasRocketType == 0) {
					this.launchPlatform.currentMission = new simulation_RocketMission(this.city,this.launchPlatform);
				}
				if(this.city.gui.window != null && this.city.gui.windowRelatedTo == this.launchPlatform) {
					this.city.gui.reloadWindow();
				}
			}
		}
		var _g = 0;
		var _g1 = this.crewMembers;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			if(citizen == null) {
				continue;
			}
			if(citizen.fullyBeingControlled || citizen.currentAction == 3) {
				if(citizen.inPermanent == this.launchPlatform) {
					citizen.fullyBeingControlled = false;
					citizen.inTransportationThing = null;
				}
				citizen.stopBeControlledBySpecial();
			}
		}
		var _g = 0;
		var _g1 = this.citizensToSend;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			if(citizen == null) {
				continue;
			}
			if(citizen.fullyBeingControlled || citizen.currentAction == 3) {
				if(citizen.inPermanent == this.launchPlatform) {
					citizen.fullyBeingControlled = false;
					citizen.inTransportationThing = null;
				}
				citizen.stopBeControlledBySpecial();
			}
		}
	}
	,startIfPossible: function() {
		var _gthis = this;
		var fuelCost = this.fuelCost();
		if(this.city.materials.rocketFuel < fuelCost) {
			return common_Localize.lo("mission_warning_too_little_fuel");
		}
		if(this.get_totalCrewMembers() < this.maxCrewMembers) {
			return common_Localize.lo("mission_warning_too_small_crew");
		}
		if(this.executingMission) {
			return common_Localize.lo("mission_warning_already_started");
		}
		if(this.destination >= 10) {
			if(this.currentMaterialsToSend.h["food"] != null && this.currentMaterialsToSend.h["food"] >= 0) {
				if(this.city.materials.food < this.currentMaterialsToSend.h["food"]) {
					return common_Localize.lo("dont_have_materials");
				}
			}
			if(this.currentMaterialsToSend.h["wood"] != null && this.currentMaterialsToSend.h["wood"] >= 0) {
				if(this.city.materials.wood < this.currentMaterialsToSend.h["wood"]) {
					return common_Localize.lo("dont_have_materials");
				}
			}
			if(this.currentMaterialsToSend.h["stone"] != null && this.currentMaterialsToSend.h["stone"] >= 0) {
				if(this.city.materials.stone < this.currentMaterialsToSend.h["stone"]) {
					return common_Localize.lo("dont_have_materials");
				}
			}
			if(this.currentMaterialsToSend.h["machineParts"] != null && this.currentMaterialsToSend.h["machineParts"] >= 0) {
				if(this.city.materials.machineParts < this.currentMaterialsToSend.h["machineParts"]) {
					return common_Localize.lo("dont_have_materials");
				}
			}
			if(this.currentMaterialsToSend.h["refinedMetal"] != null && this.currentMaterialsToSend.h["refinedMetal"] >= 0) {
				if(this.city.materials.refinedMetal < this.currentMaterialsToSend.h["refinedMetal"]) {
					return common_Localize.lo("dont_have_materials");
				}
			}
			if(this.currentMaterialsToSend.h["computerChips"] != null && this.currentMaterialsToSend.h["computerChips"] >= 0) {
				if(this.city.materials.computerChips < this.currentMaterialsToSend.h["computerChips"]) {
					return common_Localize.lo("dont_have_materials");
				}
			}
			if(this.currentMaterialsToSend.h["cacao"] != null && this.currentMaterialsToSend.h["cacao"] >= 0) {
				if(this.city.materials.cacao < this.currentMaterialsToSend.h["cacao"]) {
					return common_Localize.lo("dont_have_materials");
				}
			}
			if(this.currentMaterialsToSend.h["chocolate"] != null && this.currentMaterialsToSend.h["chocolate"] >= 0) {
				if(this.city.materials.chocolate < this.currentMaterialsToSend.h["chocolate"]) {
					return common_Localize.lo("dont_have_materials");
				}
			}
			if(this.currentMaterialsToSend.h["graphene"] != null && this.currentMaterialsToSend.h["graphene"] >= 0) {
				if(this.city.materials.graphene < this.currentMaterialsToSend.h["graphene"]) {
					return common_Localize.lo("dont_have_materials");
				}
			}
			if(this.currentMaterialsToSend.h["rocketFuel"] != null && this.currentMaterialsToSend.h["rocketFuel"] >= 0) {
				if(this.city.materials.rocketFuel < this.currentMaterialsToSend.h["rocketFuel"]) {
					return common_Localize.lo("dont_have_materials");
				}
			}
			var _g = 0;
			var _g1 = MaterialsHelper.modMaterials;
			while(_g < _g1.length) {
				var modMaterial = _g1[_g];
				++_g;
				var currentMaterial = modMaterial.variableName;
				if(this.currentMaterialsToSend.h[currentMaterial] != null && this.currentMaterialsToSend.h[currentMaterial] >= 0) {
					if(this.city.materials[currentMaterial] < this.currentMaterialsToSend.h[currentMaterial]) {
						return common_Localize.lo("dont_have_materials");
					}
				}
			}
			if(this.currentMaterialsToSend.h["knowledge"] != null && this.currentMaterialsToSend.h["knowledge"] >= 0) {
				if(this.city.materials.knowledge < this.currentMaterialsToSend.h["knowledge"]) {
					return common_Localize.lo("dont_have_materials");
				}
			}
		}
		var crewMemberTypes = [];
		var _g = 0;
		var _g1 = this.crewMembersExplorers;
		while(_g < _g1) {
			var _ = _g++;
			crewMemberTypes.push(buildings_ExplorationCentre);
		}
		var _g = 0;
		var _g1 = this.crewMembersEngineers;
		while(_g < _g1) {
			var _ = _g++;
			crewMemberTypes.push(buildings_ExperimentationLab);
		}
		var _g = 0;
		var _g1 = this.crewMembersNavigators;
		while(_g < _g1) {
			var _ = _g++;
			crewMemberTypes.push(buildings_Observatory);
		}
		var _g = 0;
		var _g1 = this.crewMembersBiologists;
		while(_g < _g1) {
			var _ = _g++;
			crewMemberTypes.push(buildings_HerbGarden);
		}
		var _g = 0;
		var _g1 = this.crewMembersMiners;
		while(_g < _g1) {
			var _ = _g++;
			crewMemberTypes.push(buildings_StoneMine);
		}
		var _g = 0;
		var _g1 = this.crewMembersFeather;
		while(_g < _g1) {
			var _ = _g++;
			crewMemberTypes.push(buildings_FeatherAlliance);
		}
		var _g = 0;
		var _g1 = this.crewMembersHippies;
		while(_g < _g1) {
			var _ = _g++;
			crewMemberTypes.push(buildings_BlossomHippieHQ);
		}
		this.crewMembers = [];
		var _g = 0;
		while(_g < crewMemberTypes.length) {
			var cm = crewMemberTypes[_g];
			++_g;
			var thisCrewMember = null;
			var youngestCrewMemberAge = 100000000.0;
			var nobodyFoundOfType = true;
			var _g1 = 0;
			var _g2 = this.city.permanents;
			while(_g1 < _g2.length) {
				var bld = _g2[_g1];
				++_g1;
				if(bld.is(cm)) {
					var workBuilding = bld;
					var _g3 = 0;
					var _g4 = workBuilding.workers;
					while(_g3 < _g4.length) {
						var worker = _g4[_g3];
						++_g3;
						if(this.crewMembers.indexOf(worker) == -1) {
							nobodyFoundOfType = false;
							if(worker.getShard() == this.launchPlatform.shardId && (thisCrewMember == null || worker.get_age() < youngestCrewMemberAge)) {
								thisCrewMember = worker;
								youngestCrewMemberAge = worker.get_age();
							}
						}
					}
				}
			}
			if(thisCrewMember == null) {
				if(nobodyFoundOfType) {
					return common_Localize.lo("mission_warning_no_crew_found_doesnt_exist");
				}
				return common_Localize.lo("mission_warning_no_crew_found");
			}
			this.crewMembers.push(thisCrewMember);
		}
		this.citizensToSend = [];
		if(this.destination >= 10) {
			var _g = [];
			var _g1 = 0;
			var _g2 = this.city.simulation.citizens;
			while(_g1 < _g2.length) {
				var v = _g2[_g1];
				++_g1;
				if(v.get_age() < 75 + v.dieAgeModifier + 2 && (v.home == null || !v.home.is(buildings_SecretSocietyHouse) && !v.home.is(buildings_HouseOfTheKeyFriends) && !v.home.is(buildings_BlossomHippieHQ) && !v.home.is(buildings_HackerHQ)) && _gthis.crewMembers.indexOf(v) == -1 && v.getShard() == _gthis.launchPlatform.shardId) {
					_g.push(v);
				}
			}
			var possibleCitizensToSend = _g;
			if(possibleCitizensToSend.length < this.currentCitizensToSend) {
				return common_Localize.lo("mission_warning_no_citizens_to_send_found");
			}
			var _g = 0;
			var _g1 = this.currentCitizensToSend;
			while(_g < _g1) {
				var i = _g++;
				var c = random_Random.fromArray(possibleCitizensToSend);
				if(c != null) {
					this.citizensToSend.push(c);
					HxOverrides.remove(possibleCitizensToSend,c);
				}
			}
		}
		var _g = 0;
		var _g1 = this.crewMembers;
		while(_g < _g1.length) {
			var thisCrewMember = _g1[_g];
			++_g;
			if(thisCrewMember.get_age() >= 75 + thisCrewMember.dieAgeModifier + 2) {
				thisCrewMember.dieAgeModifier += 0.1;
			}
		}
		this.city.materials.rocketFuel -= fuelCost;
		this.executingMission = true;
		this.city.simulation.rockets.addMission(this);
		return null;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		this.saveBasics(queue,shouldSaveDefinition);
		var value = this.crewMembers.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.crewMembers;
		while(_g < _g1.length) {
			var cm = _g1[_g];
			++_g;
			var value = this.city.simulation.citizens.indexOf(cm);
			if(queue.size + 4 > queue.bytes.length) {
				var oldBytes = queue.bytes;
				queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
				queue.bytes.blit(0,oldBytes,0,queue.size);
			}
			queue.bytes.setInt32(queue.size,value);
			queue.size += 4;
		}
		var value = this.citizensToSend.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.citizensToSend;
		while(_g < _g1.length) {
			var cts = _g1[_g];
			++_g;
			var value = this.city.simulation.citizens.indexOf(cts);
			if(queue.size + 4 > queue.bytes.length) {
				var oldBytes = queue.bytes;
				queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
				queue.bytes.blit(0,oldBytes,0,queue.size);
			}
			queue.bytes.setInt32(queue.size,value);
			queue.size += 4;
		}
	}
	,load: function(queue,definition) {
		this.loadBasics(queue,definition);
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var cmLength = intToRead;
		this.crewMembersInts = [];
		var _g = 0;
		var _g1 = cmLength;
		while(_g < _g1) {
			var i = _g++;
			var tmp = this.crewMembersInts;
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			tmp.push(intToRead);
		}
		if(queue.version >= 54) {
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var ctsLength = intToRead;
			this.ctsInts = [];
			var _g = 0;
			var _g1 = ctsLength;
			while(_g < _g1) {
				var i = _g++;
				var tmp = this.ctsInts;
				var intToRead = queue.bytes.getInt32(queue.readStart);
				queue.readStart += 4;
				tmp.push(intToRead);
			}
		}
		if(this.executingMission) {
			this.city.simulation.rockets.addMission(this);
		}
	}
	,afterLoad: function() {
		var _g = 0;
		var _g1 = this.crewMembersInts;
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			this.crewMembers.push(this.city.simulation.citizens[i]);
		}
		var _g = 0;
		var _g1 = this.ctsInts;
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			var c = this.city.simulation.citizens[i];
			if(c != null) {
				this.citizensToSend.push(c);
			}
		}
		if(this.startedMission) {
			var _g = 0;
			var _g1 = this.crewMembers;
			while(_g < _g1.length) {
				var crewMember = _g1[_g];
				++_g;
				crewMember.fullyBeingControlled = true;
			}
		}
	}
	,giveMissionReward: function() {
		var _gthis = this;
		if(this.destination >= 10) {
			this.missionCompletionText = "";
			return;
		}
		if(this.destination == 9) {
			var fa = Lambda.find(this.city.permanents,function(pm) {
				return pm.is(buildings_FeatherAlliance);
			});
			if(fa != null) {
				fa.currentMission = 6;
				this.city.progress.unlocks.unlock(buildings_Mansion);
				var thisScenario = "RocketExploreFeather";
				if(this.city.subCities.length == 0 && this.city.possibleSubCities.length == 0) {
					this.city.gui.showTutorialArrowsSwitchCity();
				}
				if(this.city.subCities.indexOf(thisScenario) == -1 && this.city.possibleSubCities.indexOf(thisScenario) == -1) {
					this.city.possibleSubCities.push(thisScenario);
				}
				this.city.gui.refreshCityInfo();
			}
			this.missionCompletionText = common_Localize.lo("feather_result");
			return;
		}
		if(this.destination == 8) {
			var sq = this.city.progress.sideQuests.findSidequestWithType(progress_sidequests_HippieRocketMission);
			this.city.progress.sideQuests.completeSidequest(sq);
			var nsq = new progress_sidequests_HippieRarePlantsMission(this.city,this.city.progress.sideQuests);
			nsq.start();
			this.city.progress.sideQuests.sidequests.push(nsq);
			return;
		}
		var foundAnything = false;
		var unlocks = simulation_RocketMission.getUnlocks(this.city);
		var buildingUnlockArrayChosen = [];
		var unlockThis = null;
		var crewMemberChosen = random_Random.getInt(this.maxCrewMembers);
		var crewMemberType = 0;
		if(crewMemberChosen < this.crewMembersExplorers) {
			crewMemberType = 0;
		} else {
			crewMemberChosen -= this.crewMembersExplorers;
			if(crewMemberChosen < this.crewMembersEngineers) {
				crewMemberType = 1;
			} else {
				crewMemberChosen -= this.crewMembersEngineers;
				if(crewMemberChosen < this.crewMembersNavigators) {
					crewMemberType = 2;
				} else {
					crewMemberChosen -= this.crewMembersNavigators;
					if(crewMemberChosen < this.crewMembersBiologists) {
						crewMemberType = 3;
					} else {
						crewMemberChosen -= this.crewMembersBiologists;
						if(crewMemberChosen < this.crewMembersMiners) {
							crewMemberType = 4;
						}
					}
				}
			}
		}
		if(this.destination == 0) {
			switch(crewMemberType) {
			case 0:
				buildingUnlockArrayChosen = unlocks.possibleBuildingUnlocksForExplorers;
				break;
			case 1:
				buildingUnlockArrayChosen = unlocks.possibleBuildingUnlocksForEngineers;
				break;
			case 3:
				buildingUnlockArrayChosen = unlocks.possibleBuildingUnlocksForBiologists;
				break;
			}
		} else {
			switch(crewMemberType) {
			case 0:
				buildingUnlockArrayChosen = unlocks.possibleBuildingUnlocksForExplorers2;
				break;
			case 1:
				buildingUnlockArrayChosen = unlocks.possibleBuildingUnlocksForEngineers2;
				break;
			case 3:
				buildingUnlockArrayChosen = unlocks.possibleBuildingUnlocksForBiologists2;
				break;
			}
		}
		var _g = [];
		var _g1 = 0;
		var _g2 = buildingUnlockArrayChosen;
		while(_g1 < _g2.length) {
			var v = _g2[_g1];
			++_g1;
			if(_gthis.city.progress.unlocks.getUnlockState(v) == progress_UnlockState.Locked) {
				_g.push(v);
			}
		}
		buildingUnlockArrayChosen = _g;
		if(buildingUnlockArrayChosen.length > 0) {
			unlockThis = random_Random.fromArray(buildingUnlockArrayChosen);
			if(unlockThis == buildings_OtherworldlyGardens && this.city.progress.unlocks.getUnlockState(buildings_OtherworldlyZoo) == progress_UnlockState.Locked) {
				unlockThis = buildings_OtherworldlyZoo;
			}
		}
		if(this.destination == 0 && this.crewMembersExplorers > 0 && this.city.progress.story.storyName == "rocketLaunch" && this.city.progress.unlocks.getUnlockState(cityUpgrades_RocketSubCityRockWorld) == progress_UnlockState.Locked) {
			unlockThis = cityUpgrades_RocketSubCityRockWorld;
		}
		this.missionCompletionText = "";
		if(unlockThis != null) {
			this.missionCompletionText = common_Localize.lo("rocket_unlock_" + unlockThis.__name__.split(".").pop()) + " ";
			this.city.progress.unlocks.unlock(unlockThis);
			this.city.progress.unlocks.fullyUnlock(unlockThis);
			var upgradeName = unlockThis.__name__;
			if(StringTools.startsWith(upgradeName,"cityUpgrades")) {
				var info = Resources.cityUpgradesInfo.h[upgradeName];
				if(info.knowledge == 0) {
					this.city.upgrades.addUpgrade(Type.createInstance(unlockThis,[]));
				}
				this.city.gui.reloadWindow();
			}
		}
		if(this.crewMembersMiners > 0) {
			var minerFind = random_Random.getFloat(1);
			var mult = this.destination == 1 ? 3 : 1;
			if(minerFind < 0.025 * this.crewMembersMiners * mult) {
				var stoneNum = random_Random.getInt(this.crewMembersMiners * 1000 * mult,this.crewMembersMiners * 2000 * mult);
				this.missionCompletionText += common_Localize.lo("rocket_reward_fossils",[stoneNum]);
				this.city.materials.knowledge += 10000;
				this.city.simulation.stats.materialProduction[10][0] += 10000;
				this.city.materials.stone += stoneNum;
				this.city.simulation.stats.materialProduction[2][0] += stoneNum;
				this.city.simulation.bonuses.fossilsCollected++;
			} else if(minerFind < 0.05 * this.crewMembersMiners) {
				var refinedMetalsNum = random_Random.getInt(this.crewMembersMiners * 500 * mult,this.crewMembersMiners * 1500 * mult);
				this.missionCompletionText += common_Localize.lo("rocket_reward_refinedmetals",[refinedMetalsNum]);
				this.city.materials.refinedMetal += refinedMetalsNum;
				this.city.simulation.stats.materialProduction[4][0] += refinedMetalsNum;
			} else {
				var stoneNum = random_Random.getInt(this.crewMembersMiners * 5000 * mult,this.crewMembersMiners * 15000 * mult);
				this.missionCompletionText += common_Localize.lo("rocket_reward_stone",[stoneNum]);
				this.city.materials.stone += stoneNum;
				this.city.simulation.stats.materialProduction[2][0] += stoneNum;
			}
			foundAnything = true;
		}
		if(this.missionCompletionText == "") {
			this.missionCompletionText = common_Localize.lo("mission_completed_nothing_found");
		}
	}
	,fuelCost: function() {
		switch(this.destination) {
		case 0:
			return 2000 - 250 * this.crewMembersNavigators - (this.crewMembersNavigators >= 1 ? 500 : 0);
		case 1:
			return 10000 - 1500 * this.crewMembersNavigators - (this.crewMembersNavigators >= 1 ? 2000 : 0);
		case 8:
			return 15000;
		case 9:
			return 50000;
		default:
			return 500;
		}
	}
	,saveBasics: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(simulation_RocketMission.saveDefinition);
		}
		var value = this.destination;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.crewMembersExplorers;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.crewMembersEngineers;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.crewMembersNavigators;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.crewMembersBiologists;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.crewMembersMiners;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.crewMembersFeather;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.crewMembersHippies;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.executingMission;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.startedMission;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.returnTime;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.missionDuration;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		queue.addString(haxe_Serializer.run(this.currentMaterialsToSend));
		var value = this.currentCitizensToSend;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.missionHasRocketGoingDown;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
	}
	,loadBasics: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"destination")) {
			this.destination = loadMap.h["destination"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"crewMembersExplorers")) {
			this.crewMembersExplorers = loadMap.h["crewMembersExplorers"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"crewMembersEngineers")) {
			this.crewMembersEngineers = loadMap.h["crewMembersEngineers"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"crewMembersNavigators")) {
			this.crewMembersNavigators = loadMap.h["crewMembersNavigators"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"crewMembersBiologists")) {
			this.crewMembersBiologists = loadMap.h["crewMembersBiologists"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"crewMembersMiners")) {
			this.crewMembersMiners = loadMap.h["crewMembersMiners"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"crewMembersFeather")) {
			this.crewMembersFeather = loadMap.h["crewMembersFeather"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"crewMembersHippies")) {
			this.crewMembersHippies = loadMap.h["crewMembersHippies"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"executingMission")) {
			this.executingMission = loadMap.h["executingMission"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"startedMission")) {
			this.startedMission = loadMap.h["startedMission"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"returnTime")) {
			this.returnTime = loadMap.h["returnTime"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"missionDuration")) {
			this.missionDuration = loadMap.h["missionDuration"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentMaterialsToSend")) {
			this.currentMaterialsToSend = loadMap.h["currentMaterialsToSend"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentCitizensToSend")) {
			this.currentCitizensToSend = loadMap.h["currentCitizensToSend"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"missionHasRocketGoingDown")) {
			this.missionHasRocketGoingDown = loadMap.h["missionHasRocketGoingDown"];
		}
	}
	,__class__: simulation_RocketMission
};
