var progress_Story = $hxClasses["progress.Story"] = function(city,storyName) {
	if(storyName == null) {
		storyName = "theLostShip";
	}
	this.goalTimer = 0;
	this.justInvitedPeople = false;
	this.disableRocket = false;
	this.hiddenBoost = false;
	this.disableDestroy = false;
	this.disableDying = false;
	this.city = city;
	this.storyInfo = Resources.storiesInfo.h[storyName];
	this.storyName = storyName;
	common_Localize.translateStory(this.storyName,this.storyInfo);
	this.plannings = [];
	this.scriptedParts = [];
	if(storyName == "rocketLaunch") {
		city.progress.resources.buildingInfo.h["buildings.Supercomputer"].knowledge = 10000;
	}
};
progress_Story.__name__ = "progress.Story";
progress_Story.prototype = {
	get_speedUpStartNights: function() {
		if(this.storyInfo.speedUpStartNights == null) {
			return false;
		} else {
			return this.storyInfo.speedUpStartNights;
		}
	}
	,start: function() {
		this.city.materials.add(Materials.fromStoryMaterials(this.storyInfo.initialMaterials));
		if(this.storyInfo.lockPermanents != null) {
			var _g = 0;
			var _g1 = this.storyInfo.lockPermanents;
			while(_g < _g1.length) {
				var pm = _g1[_g];
				++_g;
				this.city.progress.unlocks.lock($hxClasses["buildings." + pm]);
			}
		}
		if(this.storyInfo.lockAllPermanents == true) {
			this.city.progress.unlocks.unlockedDecorationTab = false;
			this.city.progress.unlocks.unlockedBuildingModeButton = false;
			this.city.progress.unlocks.unlockedManagementOptions = false;
			this.city.progress.unlocks.unlockedCustomHouses = false;
			var _g = 0;
			var _g1 = this.city.progress.resources.buildingInfoArray;
			while(_g < _g1.length) {
				var pm = _g1[_g];
				++_g;
				var name = "buildings." + pm.className;
				this.city.progress.unlocks.lock($hxClasses[name]);
			}
		}
		if(this.storyInfo.startGoal != "") {
			this.startGoal(this.findGoal(this.storyInfo.startGoal));
		}
		if(this.storyInfo.viewYFromBottom != null) {
			this.city.fixViewBottom(this.city.game.isMobile && this.storyInfo.viewYMobi != null ? this.storyInfo.viewYMobi : this.storyInfo.viewYFromBottom);
			this.city.resize();
			this.city.fixViewBottom(null);
		}
		if(this.city.game.isMobile && this.storyInfo.mobileViewStartX != null) {
			this.city.viewPos.x = this.storyInfo.mobileViewStartX;
			this.city.resize();
		}
		if(this.storyInfo.viewStartX != null) {
			this.city.viewPos.x = this.storyInfo.viewStartX;
			this.city.resize();
		}
		if(this.storyName == "cityofthekey" || this.city.progress.ruleset == progress_Ruleset.KeyCity) {
			this.city.simulation.happiness.createGloryOfTheKey();
		}
		if(this.storyName == "hippiecommune") {
			this.city.progress.unlocks.unlock(policies_HippieLifestyle);
			this.city.policies.addPolicy(new policies_HippieLifestyle());
		}
		this.doOnStartOrLoadStoryChanges();
	}
	,doOnStartOrLoadStoryChanges: function() {
		if(this.storyInfo.skyColors != null) {
			this.city.simulation.time.skyColors = this.storyInfo.skyColors.map(function(c) {
				return { time : c.time, color : common_ColorExtensions.toHexInt(thx_color_Rgbxa.toRgb(thx_color_Color.parse(c.color)))};
			});
		}
		if(this.storyInfo.buildingCostChanges != null) {
			var _g = 0;
			var _g1 = this.storyInfo.buildingCostChanges;
			while(_g < _g1.length) {
				var costChange = _g1[_g];
				++_g;
				if(costChange.food != null) {
					this.city.progress.resources.buildingInfo.h["buildings." + costChange.className].food = costChange.food;
				}
				if(costChange.wood != null) {
					this.city.progress.resources.buildingInfo.h["buildings." + costChange.className].wood = costChange.wood;
				}
				if(costChange.stone != null) {
					this.city.progress.resources.buildingInfo.h["buildings." + costChange.className].stone = costChange.stone;
				}
				if(costChange.machineParts != null) {
					this.city.progress.resources.buildingInfo.h["buildings." + costChange.className].machineParts = costChange.machineParts;
				}
				if(costChange.refinedMetal != null) {
					this.city.progress.resources.buildingInfo.h["buildings." + costChange.className].refinedMetal = costChange.refinedMetal;
				}
				if(costChange.computerChips != null) {
					this.city.progress.resources.buildingInfo.h["buildings." + costChange.className].computerChips = costChange.computerChips;
				}
				if(costChange.cacao != null) {
					this.city.progress.resources.buildingInfo.h["buildings." + costChange.className].cacao = costChange.cacao;
				}
				if(costChange.chocolate != null) {
					this.city.progress.resources.buildingInfo.h["buildings." + costChange.className].chocolate = costChange.chocolate;
				}
				if(costChange.graphene != null) {
					this.city.progress.resources.buildingInfo.h["buildings." + costChange.className].graphene = costChange.graphene;
				}
				if(costChange.rocketFuel != null) {
					this.city.progress.resources.buildingInfo.h["buildings." + costChange.className].rocketFuel = costChange.rocketFuel;
				}
				var _g2 = 0;
				var _g3 = MaterialsHelper.modMaterials;
				while(_g2 < _g3.length) {
					var modMaterial = _g3[_g2];
					++_g2;
					var currentMaterial = modMaterial.variableName;
					if(costChange[currentMaterial] != null) {
						this.city.progress.resources.buildingInfo.h["buildings." + costChange.className][currentMaterial] = costChange[currentMaterial];
					}
				}
				if(costChange.knowledge != null) {
					this.city.progress.resources.buildingInfo.h["buildings." + costChange.className].knowledge = costChange.knowledge;
				}
			}
		}
	}
	,update: function(timeMod) {
		if(this.city.displayOnly && this.storyInfo.viewYFromBottom != null) {
			this.city.fixViewBottom(this.city.game.isMobile && this.storyInfo.viewYMobi != null ? this.storyInfo.viewYMobi : this.storyInfo.viewYFromBottom);
			this.city.resize();
			this.city.fixViewBottom(null);
		}
		if(this.currentGoal != null && this.city.gui.windowRelatedTo != this) {
			if(this.currentGoal.options != null) {
				var _g = 0;
				var _g1 = this.currentGoal.options.length;
				while(_g < _g1) {
					var i = _g++;
					var option = this.currentGoal.options[i];
					if(this.goalOptionComplete(option)) {
						Analytics.sendEvent("story","goal_complete",null,this.storyName + "-" + this.currentGoal.name + "-" + i);
						Analytics.sendEventFirebase("goal_complete","goal",this.storyName + "-" + this.currentGoal.name + "-" + i);
						if(option.nextGoal != "" && option.nextGoal != null) {
							this.startGoal(this.findGoal(option.nextGoal));
						} else {
							this.currentGoal = null;
						}
						break;
					}
				}
			} else if(this.goalComplete(this.currentGoal)) {
				Analytics.sendEvent("story","goal_complete",null,this.storyName + "-" + this.currentGoal.name);
				Analytics.sendEventFirebase("goal_complete","goal",this.storyName + "-" + this.currentGoal.name);
				if(this.currentGoal.name != this.storyInfo.startGoal) {
					if(5 == 6) {
						if(this.currentGoal.name == "Win") {
							PokiSDK.happyTime(1);
						} else {
							PokiSDK.happyTime(0.3);
						}
					}
				}
				if(this.currentGoal.nextGoal != "" && this.currentGoal.nextGoal != null) {
					this.startGoal(this.findGoal(this.currentGoal.nextGoal));
				} else {
					this.currentGoal = null;
				}
			}
		}
		this.updatePlannings();
		var i = this.scriptedParts.length;
		while(--i >= 0) this.scriptedParts[i].update(timeMod);
		this.goalTimer += timeMod;
	}
	,updatePlannings: function() {
		var i = this.plannings.length;
		while(--i >= 0) {
			var planning = this.plannings[i];
			if(planning.plan.length > planning.nextEventToHandle) {
				var nextPlanItem = planning.plan[planning.nextEventToHandle];
				if(planning.timeStart + nextPlanItem.time < this.city.simulation.time.timeSinceStart / 60) {
					this.executePlannedEvent(nextPlanItem);
					planning.nextEventToHandle += 1;
				}
			}
			if(planning.plan.length <= planning.nextEventToHandle) {
				this.plannings.splice(i,1);
			}
		}
	}
	,executePlannedEvent: function(event) {
		switch(event.type) {
		case "BuildBridgeFeather":
			var bridgeInfo = Lambda.find(Resources.bridgesInfo,function(bi) {
				return "WoodenBridge" == bi.className;
			});
			var name = "miscCityElements." + bridgeInfo.className;
			var newBridge = Type.createInstance($hxClasses[name],[this.city,new common_Point(-20,120)]);
			newBridge.cycleSprite();
			this.city.miscCityElements.addElement(newBridge);
			this.city.connections.updateCityConnections();
			this.city.simulation.updatePathfinder(true);
			var name = "miscCityElements." + bridgeInfo.className;
			this.city.progress.unlocks.research($hxClasses[name]);
			break;
		case "FreeAutoUpgradeForFarms":
			var upgrade1 = buildingUpgrades_FarmingResearch;
			var upgrade2 = buildingUpgrades_TreePlantationResearch;
			var _g = [];
			var _g1 = 0;
			var _g2 = this.city.permanents;
			while(_g1 < _g2.length) {
				var v = _g2[_g1];
				++_g1;
				if(v.is(buildings_Laboratory) && v.getEffectsOfAdjecentBuildings("farm") > 0 && !common_ArrayExtensions.any(v.upgrades,function(up) {
					return js_Boot.__instanceof(up,upgrade1);
				})) {
					_g.push(v);
				}
			}
			var relevantLabs1 = _g;
			var _g = [];
			var _g1 = 0;
			var _g2 = this.city.permanents;
			while(_g1 < _g2.length) {
				var v = _g2[_g1];
				++_g1;
				if(v.is(buildings_Laboratory) && (v.leftBuilding != null && v.leftBuilding.is(buildings_TreePlantation) || v.rightBuilding != null && v.rightBuilding.is(buildings_TreePlantation) || v.topBuilding != null && v.topBuilding.is(buildings_TreePlantation) || v.bottomBuilding != null && v.bottomBuilding.is(buildings_TreePlantation)) && !common_ArrayExtensions.any(v.upgrades,function(up) {
					return js_Boot.__instanceof(up,upgrade2);
				})) {
					_g.push(v);
				}
			}
			var relevantLabs2 = _g;
			var _g = 0;
			while(_g < relevantLabs1.length) {
				var building = relevantLabs1[_g];
				++_g;
				building.upgrades.push(Type.createInstance(upgrade1,[building.stage,this.city.cityMidStage,building.bgStage,building]));
			}
			var _g = 0;
			while(_g < relevantLabs2.length) {
				var building = relevantLabs2[_g];
				++_g;
				building.upgrades.push(Type.createInstance(upgrade2,[building.stage,this.city.cityMidStage,building.bgStage,building]));
			}
			break;
		case "ScriptedStoryPart":
			var scriptedStoryPartEvent = event;
			var name = "progress.scriptedStoryParts." + scriptedStoryPartEvent.className;
			var newSSP = Type.createInstance($hxClasses[name],[this.city,this]);
			newSSP.initialize(scriptedStoryPartEvent);
			this.scriptedParts.push(newSSP);
			break;
		case "SpawnCitizens":
			var spawnCitizensEvent = event;
			this.spawnCitizens(this.city.worlds[spawnCitizensEvent.world],spawnCitizensEvent);
			break;
		case "SpawnCitizensFlyingSaucer":
			var spawnCitizensEvent = event;
			this.city.simulation.citizenSpawners.push(new simulation_SpawnFlyingSaucer(this.city.simulation,this.city.farForegroundStage,this.city.worlds[spawnCitizensEvent.world],spawnCitizensEvent,spawnCitizensEvent.toXIndex));
			break;
		}
	}
	,getDesiredGoalHighlights: function() {
		if(this.currentGoal == null || this.currentGoal.subGoals == null) {
			return [];
		}
		var highlights = [];
		var _g = 0;
		var _g1 = this.currentGoal.subGoals;
		while(_g < _g1.length) {
			var subGoal = _g1[_g];
			++_g;
			if(!this.subGoalComplete(subGoal)) {
				switch(subGoal.type) {
				case "BuildPermanents":
					var buildPermanentsGoal = subGoal;
					var className = buildPermanentsGoal.permanentToBuildClass;
					if(!StringTools.startsWith(className,"buildings.") && !StringTools.startsWith(className,"worldResources.")) {
						className = "buildings." + className;
					}
					highlights.push($hxClasses[className]);
					break;
				case "PerformBuildingUpgrades":case "SetBuildingMode":
					var performBuildingUpgradesGoal = subGoal;
					var className1 = performBuildingUpgradesGoal.upgradeClass;
					if(!StringTools.startsWith(className1,"buildingUpgrades.")) {
						className1 = "buildingUpgrades." + className1;
					}
					highlights.push($hxClasses[className1]);
					break;
				case "PerformCityUpgrade":
					var performBuildingUpgradesGoal1 = subGoal;
					var className2 = performBuildingUpgradesGoal1.upgradeClass;
					if(!StringTools.startsWith(className2,"cityUpgrades.")) {
						className2 = "cityUpgrades." + className2;
					}
					highlights.push($hxClasses[className2]);
					break;
				}
			}
		}
		return highlights;
	}
	,goalComplete: function(goal) {
		if(goal.subGoals == null) {
			return false;
		}
		var allComplete = true;
		var _g = 0;
		var _g1 = goal.subGoals;
		while(_g < _g1.length) {
			var subGoal = _g1[_g];
			++_g;
			if(!this.subGoalComplete(subGoal)) {
				allComplete = false;
			}
		}
		return allComplete;
	}
	,goalOptionComplete: function(option) {
		var allComplete = true;
		var _g = 0;
		var _g1 = option.subGoals;
		while(_g < _g1.length) {
			var subGoal = _g1[_g];
			++_g;
			if(!this.subGoalComplete(subGoal)) {
				allComplete = false;
			}
		}
		return allComplete;
	}
	,subGoalComplete: function(goal) {
		switch(goal.type) {
		case "Build3Bridges":
			return Lambda.count(this.city.miscCityElements.allMiscElements,function(ce) {
				return ce.is(miscCityElements_Bridge);
			}) >= 3;
		case "BuildFloatingPlatform":
			return Lambda.count(this.city.miscCityElements.allMiscElements,function(ce) {
				return ce.is(miscCityElements_FloatingPlatform);
			}) >= 1;
		case "BuildPermanents":
			var buildPermanentsGoal = goal;
			var className = buildPermanentsGoal.permanentToBuildClass;
			if(!StringTools.startsWith(className,"buildings.") && !StringTools.startsWith(className,"worldResources.")) {
				className = "buildings." + className;
			}
			var countFunc = buildPermanentsGoal.needsExactClass != null && buildPermanentsGoal.needsExactClass ? function(pm) {
				var c = js_Boot.getClass(pm);
				return c.__name__ == className;
			} : function(pm) {
				return pm.is($hxClasses[className]);
			};
			if(buildPermanentsGoal.onWorld != null) {
				var world = this.city.worlds[buildPermanentsGoal.onWorld];
				var oldCountFunc = countFunc;
				countFunc = function(pm) {
					if(oldCountFunc(pm)) {
						return pm.world == world;
					} else {
						return false;
					}
				};
			} else if(buildPermanentsGoal.notOnWorld != null) {
				var world1 = this.city.worlds[buildPermanentsGoal.notOnWorld];
				var oldCountFunc1 = countFunc;
				countFunc = function(pm) {
					if(oldCountFunc1(pm)) {
						return pm.world != world1;
					} else {
						return false;
					}
				};
			}
			return Lambda.count(this.city.permanents,countFunc) >= buildPermanentsGoal.amount;
		case "BuildRocket":
			var launchPlatform = Lambda.find(this.city.permanents,function(pm) {
				return pm.is(buildings_RocketLaunchPlatform);
			});
			if(launchPlatform != null) {
				return launchPlatform.rocket != null;
			}
			return false;
		case "BuildUpgradedLabsNextToEcoFarms":
			var cnt = Lambda.count(this.city.permanents,function(pm) {
				if(pm.is(buildings_Laboratory) && pm.getEffectsOfAdjecentBuildings("farm") > 0) {
					return common_ArrayExtensions.any(pm.upgrades,function(up) {
						return ((up) instanceof buildingUpgrades_FarmingResearch);
					});
				} else {
					return false;
				}
			});
			return cnt >= 3;
		case "CompleteHackerMissions":
			var hackerMissionsGoal = goal;
			var _g = 0;
			var _g1 = this.city.permanents;
			while(_g < _g1.length) {
				var pm = _g1[_g];
				++_g;
				if(pm.is(buildings_HackerHQ)) {
					var hackerHQ = pm;
					return hackerHQ.currentMission >= hackerMissionsGoal.amount;
				}
			}
			return false;
		case "CompleteSecretSocietyMissions":
			var secretSocietyMissionGoal = goal;
			var _g = 0;
			var _g1 = this.city.permanents;
			while(_g < _g1.length) {
				var pm = _g1[_g];
				++_g;
				if(pm.is(buildings_SecretSocietyHouse)) {
					var secretSocietyHQ = pm;
					return secretSocietyHQ.currentMission >= secretSocietyMissionGoal.amount;
				}
			}
			return false;
		case "ExploreAlienRuins":
			var _g = 0;
			var _g1 = this.city.worlds;
			while(_g < _g1.length) {
				var world2 = _g1[_g];
				++_g;
				var _g2 = 0;
				var _g3 = world2.permanents;
				while(_g2 < _g3.length) {
					var pm = _g3[_g2];
					++_g2;
					if(pm.length >= 1 && pm[0] != null && pm[0].is(worldResources_ComputerAlienRuins)) {
						var car = pm[0];
						return car.explored >= 99.99;
					}
				}
			}
			return false;
		case "ExploredWithResearchSpacecraft":
			var _g = 0;
			var _g1 = this.city.permanents;
			while(_g < _g1.length) {
				var pm = _g1[_g];
				++_g;
				if(pm.is(buildings_ResearchBot)) {
					var ad = pm;
					return ad.timeWorking >= 540;
				}
			}
			return false;
		case "GatherMaterials":
			var gatherMaterialsGoal = goal;
			if(gatherMaterialsGoal.materials.food != null) {
				if(this.city.materials.food < gatherMaterialsGoal.materials.food) {
					return false;
				}
			}
			if(gatherMaterialsGoal.materials.wood != null) {
				if(this.city.materials.wood < gatherMaterialsGoal.materials.wood) {
					return false;
				}
			}
			if(gatherMaterialsGoal.materials.stone != null) {
				if(this.city.materials.stone < gatherMaterialsGoal.materials.stone) {
					return false;
				}
			}
			if(gatherMaterialsGoal.materials.machineParts != null) {
				if(this.city.materials.machineParts < gatherMaterialsGoal.materials.machineParts) {
					return false;
				}
			}
			if(gatherMaterialsGoal.materials.refinedMetal != null) {
				if(this.city.materials.refinedMetal < gatherMaterialsGoal.materials.refinedMetal) {
					return false;
				}
			}
			if(gatherMaterialsGoal.materials.computerChips != null) {
				if(this.city.materials.computerChips < gatherMaterialsGoal.materials.computerChips) {
					return false;
				}
			}
			if(gatherMaterialsGoal.materials.cacao != null) {
				if(this.city.materials.cacao < gatherMaterialsGoal.materials.cacao) {
					return false;
				}
			}
			if(gatherMaterialsGoal.materials.chocolate != null) {
				if(this.city.materials.chocolate < gatherMaterialsGoal.materials.chocolate) {
					return false;
				}
			}
			if(gatherMaterialsGoal.materials.graphene != null) {
				if(this.city.materials.graphene < gatherMaterialsGoal.materials.graphene) {
					return false;
				}
			}
			if(gatherMaterialsGoal.materials.rocketFuel != null) {
				if(this.city.materials.rocketFuel < gatherMaterialsGoal.materials.rocketFuel) {
					return false;
				}
			}
			var _g = 0;
			var _g1 = MaterialsHelper.modMaterials;
			while(_g < _g1.length) {
				var modMaterial = _g1[_g];
				++_g;
				var currentMaterial = modMaterial.variableName;
				if(gatherMaterialsGoal.materials[currentMaterial] != null) {
					if(this.city.materials[currentMaterial] < gatherMaterialsGoal.materials[currentMaterial]) {
						return false;
					}
				}
			}
			if(gatherMaterialsGoal.materials.knowledge != null) {
				if(this.city.materials.knowledge < gatherMaterialsGoal.materials.knowledge) {
					return false;
				}
			}
			return true;
		case "GloryGoal":
			if(this.city.simulation.happiness.gloryOfTheKey != null) {
				return this.city.simulation.happiness.gloryOfTheKey.gloryOfTheKeyHappiness >= 99.99;
			} else {
				return false;
			}
			break;
		case "HousingCapacity":
			var houseCapGoal = goal;
			return this.city.simulation.stats.houseCapacity >= houseCapGoal.amount;
		case "HousingCapacityEnough":
			var houseCapGoal = goal;
			return this.city.simulation.stats.peopleWithHome >= this.city.simulation.stats.people;
		case "InvitePeople":
			return this.justInvitedPeople;
		case "MinimumCitizens":
			var citizenGoal = goal;
			return this.city.simulation.citizens.length >= citizenGoal.number;
		case "MinimumHappiness":
			var happinessGoal = goal;
			return Math.min(this.city.simulation.happiness.happinessExBoosts,this.city.simulation.happiness.happiness) >= happinessGoal.happiness;
		case "MinimumHappinessIncBoosts":
			var happinessGoal = goal;
			return this.city.simulation.happiness.happiness >= happinessGoal.happiness;
		case "OneWithNatureGoal":
			return this.city.simulation.happiness.oneWithNatureHappiness >= 99.99;
		case "OrganizeFestival":
			return this.city.simulation.festivalManager.currentFestival() != null;
		case "PerformBuildingUpgrades":
			var performBuildingUpgradesGoal = goal;
			var className1 = performBuildingUpgradesGoal.upgradeClass;
			if(!StringTools.startsWith(className1,"buildingUpgrades.")) {
				className1 = "buildingUpgrades." + className1;
			}
			var classType = $hxClasses[className1];
			var total = Lambda.count(this.city.permanents,function(pm) {
				if(pm.isBuilding) {
					return common_ArrayExtensions.any(pm.upgrades,function(up) {
						return js_Boot.__instanceof(up,classType);
					});
				} else {
					return false;
				}
			});
			return total >= performBuildingUpgradesGoal.amount;
		case "PerformCityUpgrade":
			var performCityUpgradeGoal = goal;
			var className1 = performCityUpgradeGoal.upgradeClass;
			if(!StringTools.startsWith(className1,"cityUpgrades.")) {
				className1 = "cityUpgrades." + className1;
			}
			var classType1 = $hxClasses[className1];
			var total = Lambda.count(this.city.upgrades.upgrades,function(cu) {
				return js_Boot.__instanceof(cu,classType1);
			});
			return total >= 1;
		case "ProductionGoal":
			var produceMaterialsGoal = goal;
			if(produceMaterialsGoal.materials.food != null) {
				if(!common_ArrayExtensions.any(this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("food")],function(mt) {
					return mt >= produceMaterialsGoal.materials.food;
				})) {
					return false;
				}
			}
			if(produceMaterialsGoal.materials.wood != null) {
				if(!common_ArrayExtensions.any(this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("wood")],function(mt) {
					return mt >= produceMaterialsGoal.materials.wood;
				})) {
					return false;
				}
			}
			if(produceMaterialsGoal.materials.stone != null) {
				if(!common_ArrayExtensions.any(this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("stone")],function(mt) {
					return mt >= produceMaterialsGoal.materials.stone;
				})) {
					return false;
				}
			}
			if(produceMaterialsGoal.materials.machineParts != null) {
				if(!common_ArrayExtensions.any(this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("machineParts")],function(mt) {
					return mt >= produceMaterialsGoal.materials.machineParts;
				})) {
					return false;
				}
			}
			if(produceMaterialsGoal.materials.refinedMetal != null) {
				if(!common_ArrayExtensions.any(this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("refinedMetal")],function(mt) {
					return mt >= produceMaterialsGoal.materials.refinedMetal;
				})) {
					return false;
				}
			}
			if(produceMaterialsGoal.materials.computerChips != null) {
				if(!common_ArrayExtensions.any(this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("computerChips")],function(mt) {
					return mt >= produceMaterialsGoal.materials.computerChips;
				})) {
					return false;
				}
			}
			if(produceMaterialsGoal.materials.cacao != null) {
				if(!common_ArrayExtensions.any(this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("cacao")],function(mt) {
					return mt >= produceMaterialsGoal.materials.cacao;
				})) {
					return false;
				}
			}
			if(produceMaterialsGoal.materials.chocolate != null) {
				if(!common_ArrayExtensions.any(this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("chocolate")],function(mt) {
					return mt >= produceMaterialsGoal.materials.chocolate;
				})) {
					return false;
				}
			}
			if(produceMaterialsGoal.materials.graphene != null) {
				if(!common_ArrayExtensions.any(this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("graphene")],function(mt) {
					return mt >= produceMaterialsGoal.materials.graphene;
				})) {
					return false;
				}
			}
			if(produceMaterialsGoal.materials.rocketFuel != null) {
				if(!common_ArrayExtensions.any(this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("rocketFuel")],function(mt) {
					return mt >= produceMaterialsGoal.materials.rocketFuel;
				})) {
					return false;
				}
			}
			var _g = 0;
			var _g1 = MaterialsHelper.modMaterials;
			while(_g < _g1.length) {
				var modMaterial = _g1[_g];
				++_g;
				var currentMaterial = [modMaterial.variableName];
				if(produceMaterialsGoal.materials[currentMaterial[0]] != null) {
					if(!common_ArrayExtensions.any(this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex(currentMaterial[0])],(function(currentMaterial) {
						return function(mt) {
							return mt >= produceMaterialsGoal.materials[currentMaterial[0]];
						};
					})(currentMaterial))) {
						return false;
					}
				}
			}
			if(produceMaterialsGoal.materials.knowledge != null) {
				if(!common_ArrayExtensions.any(this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("knowledge")],function(mt) {
					return mt >= produceMaterialsGoal.materials.knowledge;
				})) {
					return false;
				}
			}
			return true;
		case "SetBuildingMode":
			var setBuildingModeGoal = goal;
			var className1 = setBuildingModeGoal.upgradeClass;
			if(!StringTools.startsWith(className1,"buildingUpgrades.")) {
				className1 = "buildingUpgrades." + className1;
			}
			var classType2 = $hxClasses[className1];
			var total = Lambda.count(this.city.permanents,function(pm) {
				if(pm.isBuilding && pm.buildingMode != null) {
					return js_Boot.__instanceof(pm.buildingMode,classType2);
				} else {
					return false;
				}
			});
			return total >= setBuildingModeGoal.amount;
		case "Wait":
			var waitGoal = goal;
			if(this.goalTimer > waitGoal.waitTime) {
				return true;
			}
			return false;
		case "WaitForDecryption":
			var _g = 0;
			var _g1 = this.city.permanents;
			while(_g < _g1.length) {
				var pm = _g1[_g];
				++_g;
				if(pm.is(buildings_AlienDecryptor)) {
					var ad = pm;
					return ad.timeWorking >= 1440;
				}
			}
			return false;
		}
		return false;
	}
	,findGoal: function(goalName) {
		return Lambda.find(this.storyInfo.goals,function(g) {
			return g.name == goalName;
		});
	}
	,startGoal: function(goal) {
		var _gthis = this;
		var actuallyStart = function() {
			_gthis.currentGoal = goal;
			_gthis.goalTimer = 0;
			if(goal.flags != null) {
				_gthis.handleFlagsChanges(goal.flags);
			}
			if(StringTools.startsWith(goal.name,"Win")) {
				_gthis.city.game.metaGame.winScenario(_gthis.storyName,_gthis.city.simulation.time.timeSinceStart | 0);
			}
			if(goal.name == "NowArrivingRegularly") {
				var _g = $bind(_gthis,_gthis.showGoalText);
				var actuallyStart = function() {
					_g();
				};
				_gthis.city.gui.triggerPremiumUpsellExperienceIfDesired("mid_first_scenario",actuallyStart);
			} else if(goal.text != "" || goal.title != "") {
				_gthis.showGoalText();
			}
			if(goal.unlocks != null) {
				var _g1 = 0;
				var _g2 = goal.unlocks;
				while(_g1 < _g2.length) {
					var className = _g2[_g1];
					++_g1;
					if(className == "decorations") {
						_gthis.city.progress.unlocks.unlockedDecorationTab = true;
					} else if(className == "buildingModes") {
						_gthis.city.progress.unlocks.unlockedBuildingModeButton = true;
					} else if(className == "managementOptions") {
						_gthis.city.progress.unlocks.unlockedManagementOptions = true;
					} else if(className == "customHouses") {
						_gthis.city.progress.unlocks.unlockedCustomHouses = true;
					} else if(StringTools.startsWith(className,"buildingUpgrades.")) {
						var name = "buildingUpgrades." + className.split(".")[1];
						_gthis.city.progress.unlocks.unlock($hxClasses[name]);
					} else if(StringTools.startsWith(className,"cityUpgrades.")) {
						var name1 = "cityUpgrades." + className.split(".")[1];
						_gthis.city.progress.unlocks.unlock($hxClasses[name1]);
					} else if(StringTools.startsWith(className,"worldResources.")) {
						var name2 = "worldResources." + className.split(".")[1];
						_gthis.city.progress.unlocks.unlock($hxClasses[name2]);
					} else {
						_gthis.city.progress.unlocks.unlock($hxClasses["buildings." + className]);
					}
				}
			}
			if(goal.tempLocks != null) {
				var _g1 = 0;
				var _g2 = goal.tempLocks;
				while(_g1 < _g2.length) {
					var className = _g2[_g1];
					++_g1;
					if(className == "customHouses") {
						_gthis.city.progress.unlocks.unlockedCustomHouses = false;
					} else {
						_gthis.city.progress.unlocks.lock($hxClasses["buildings." + className]);
					}
				}
			}
			if(goal.researches != null) {
				var _g1 = 0;
				var _g2 = goal.researches;
				while(_g1 < _g2.length) {
					var className = _g2[_g1];
					++_g1;
					_gthis.city.progress.unlocks.research($hxClasses["buildings." + className],false);
				}
			}
			if(goal.planning != null) {
				_gthis.plannings.push({ goalName : goal.name, plan : goal.planning, nextEventToHandle : 0, timeStart : _gthis.city.simulation.time.timeSinceStart / 60});
			}
			_gthis.city.gui.clearTutorial();
			_gthis.city.postCreateBuilder = null;
			if(goal.showTutorial != null) {
				if(goal.showTutorial == 1) {
					_gthis.city.gui.showTutorialArrows1();
					_gthis.city.postCreateBuilder = function() {
						_gthis.city.builder.fixBuilder(_gthis.city.worlds[0],2);
					};
				} else if(goal.showTutorial == 2) {
					var closeWarning = _gthis.city.gui.showWindowCloseWarning(120);
					_gthis.city.gui.showTutorialArrows2(closeWarning);
				} else if(goal.showTutorial == 101) {
					var closeWarning = _gthis.city.gui.showWindowCloseWarning(120);
					_gthis.city.gui.showTutorialArrowsBuildStoneMine(closeWarning);
				} else if(goal.showTutorial == 3) {
					_gthis.city.gui.showTutorialArrows3();
				} else if(goal.showTutorial == 4) {
					_gthis.city.gui.showTutorialArrows4();
				} else if(goal.showTutorial == 4001) {
					_gthis.city.gui.showTutorialArrowsInviteCitizens();
				} else if(goal.showTutorial == 4002 && 5 == 8 && !Config.hasPremium()) {
					_gthis.city.gui.showTutorialArrowsBoost();
				}
			}
		};
		if(5 != 8 || goal.nextGoal == "" || goal.name == this.storyInfo.startGoal || goal.name == "Start" || goal.name == "BuildStoneMine" || goal.name == "GatherWoodAndStone" || goal.name == "BuildIndoorFarmAndHouse" || goal.name == "SpawnMorePeople" || goal.name == "NowArrivingRegularly" || goal.name == "StoneMineUpgrade" || goal.name == "Happiness" || goal.name == "GetMinHappiness") {
			actuallyStart();
		} else {
			this.city.game.waitAndShowAd(common_Localize.lo("task_complete"),actuallyStart);
		}
	}
	,goalFactionGetSprite: function(factionName) {
		switch(factionName) {
		case "hippies":
			return "spr_icon_blossomhippies";
		case "key":
			return "spr_icon_key";
		}
		return "";
	}
	,goalAddFaction: function(factionName) {
		var factionInfo = new gui_GUIContainer(this.city.gui,this.city.gui.innerWindowStage,this.city.gui.windowInner);
		var spr = new PIXI.Sprite(Resources.getTexture(this.goalFactionGetSprite(factionName)));
		factionInfo.addChild(new gui_ContainerHolder(factionInfo,this.city.gui.innerWindowStage,spr,{ top : -1, bottom : 0, left : 0, right : 2}));
		factionInfo.addChild(new gui_TextElement(factionInfo,this.city.gui.innerWindowStage,common_Localize.lo("faction_" + factionName),null,"Arial10"));
		this.city.gui.windowInner.addChild(factionInfo);
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,2)));
	}
	,showGoalText: function(tldr) {
		if(tldr == null) {
			tldr = false;
		}
		var _gthis = this;
		var goal = this.currentGoal;
		this.city.gui.createWindow(this);
		if(goal.title != null && goal.title != "") {
			this.city.gui.windowAddTitleText(goal.title);
		}
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,1)));
		var text = "";
		var goalText = goal.text;
		if(Config.isLimitedDemo && goal.flags != null && goal.flags.demoText != null) {
			goalText += goal.flags.demoText;
		}
		var commandStart = goalText.indexOf("[");
		var isAddingText = true;
		var goalComplete = this.goalComplete(goal);
		while(commandStart != -1) {
			if(isAddingText) {
				text += HxOverrides.substr(goalText,0,commandStart);
			}
			goalText = HxOverrides.substr(goalText,commandStart + 1,null);
			var commandEnd = goalText.indexOf("]");
			var command = HxOverrides.substr(goalText,0,commandEnd);
			goalText = HxOverrides.substr(goalText,commandEnd + 1,null);
			if(command == "n") {
				isAddingText = !goalComplete;
			} else if(command == "c") {
				isAddingText = goalComplete;
			} else if(command == "mobi") {
				isAddingText = this.city.game.isMobile;
			} else if(command == "nonmobi") {
				isAddingText = !this.city.game.isMobile;
			} else if(command == "nmobi") {
				isAddingText = !goalComplete && this.city.game.isMobile;
			} else if(command == "nnonmobi") {
				isAddingText = !goalComplete && !this.city.game.isMobile;
			} else if(command == "/") {
				isAddingText = true;
			} else if(command == "d") {
				var _this = this.city.simulation.time;
				text += "" + (1 + ((_this.timeSinceStart | 0) / 1440 | 0) == 1 ? common_Localize.lo("one_day") : common_Localize.lo("n_days",[1 + ((_this.timeSinceStart | 0) / 1440 | 0)])) + ", " + (((_this.timeSinceStart | 0) / 60 | 0) % 24 == 1 ? common_Localize.lo("one_hour") : common_Localize.lo("n_hours",[((_this.timeSinceStart | 0) / 60 | 0) % 24])) + ", " + common_Localize.lo("and") + (" " + ((_this.timeSinceStart | 0) % 60 == 1 ? common_Localize.lo("one_minute") : common_Localize.lo("n_minutes",[(_this.timeSinceStart | 0) % 60])));
			} else if(StringTools.startsWith(command,"faction=")) {
				if(text != "") {
					this.city.gui.windowAddInfoText(tldr ? goal.tldr : text);
					this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,8)));
				}
				var factionName = HxOverrides.substr(command,"faction=".length,null);
				this.goalAddFaction(factionName);
				text = "";
			}
			commandStart = goalText.indexOf("[");
		}
		if(isAddingText) {
			text += goalText;
		}
		if(goal.name == "Win" && this.storyName == "hackersandaliens" && 5 == 4) {
			text += " Get the Extended Version on Steam to unlock it!";
		}
		this.city.gui.windowAddInfoText(tldr ? goal.tldr : text);
		this.city.gui.pauseForWindow();
		var hasTldrButton = goal.tldr != null;
		var bottomButtonsList = [];
		if(hasTldrButton) {
			bottomButtonsList.push({ text : tldr ? "Too short?" : "tl;dr?", action : function() {
				_gthis.showGoalText(!tldr);
			}});
		}
		if(StringTools.startsWith(goal.name,"Win")) {
			if(Config.isLimitedDemo) {
				bottomButtonsList.push({ text : "Wishlist the Full Version Now!", action : function() {
					greenworks.activateGameOverlayToWebPage("https://store.steampowered.com/app/1180130/The_Final_Earth_2/");
				}});
			}
			var premiumUpsellTriggered = false;
			if(goal.nextStory != null && goal.nextStory != "" && progress_StoryLoader.hasCompletedRequirements(this.city.game,Lambda.find(Resources.allStoriesInfo,function(sd) {
				return sd.link == goal.nextStory;
			}))) {
				bottomButtonsList.push({ text : common_Localize.lo("next_scenario"), action : function() {
					premiumUpsellTriggered = true;
					_gthis.city.gui.triggerPremiumUpsellExperienceIfDesired("post_scenario",function() {
						var _gthis1 = _gthis.city.game;
						var _gthis2 = _gthis.city.gui;
						var tmp = common_Localize.lo("save_slot_choice");
						var _g = ($_=_gthis.city.game,$bind($_,$_.newCity));
						var storyName = goal.nextStory;
						gui_SaveLoadWindows.createSaveWindow(_gthis1,_gthis2,tmp,function(saveFileName) {
							_g(storyName,saveFileName);
						});
						if((5 == 6 || 5 == 9) && Config.hadFullStepWithInput) {
							common_AdHelper.showNonRewardedInterstitialIfAllowed();
						}
					});
				}});
			} else {
				bottomButtonsList.push({ text : common_Localize.lo("new_city"), action : function() {
					premiumUpsellTriggered = true;
					_gthis.city.gui.triggerPremiumUpsellExperienceIfDesired("post_scenario",function() {
						gui_MainMenuGUI.createNewScenarioWindow(_gthis.city.game,_gthis.city.gui);
					});
				}});
			}
			this.city.gui.windowOnDestroy = function() {
				if(goal.name == "Win" && !premiumUpsellTriggered) {
					_gthis.city.gui.triggerPremiumUpsellExperienceIfDesired("post_scenario");
					if(_gthis.storyName != "theLostShip") {
						_gthis.city.gui.triggerPremiumUpsellExperienceIfDesiredForMobile("post_scenario");
					}
				}
			};
		}
		var bottomButtons = this.city.gui.windowAddBottomButtons(bottomButtonsList,null,function() {
			_gthis.city.gui.goPreviousWindow();
		});
		if(hasTldrButton && !tldr && bottomButtons.length > 0) {
			bottomButtons[0].onHover = function() {
				_gthis.city.gui.tooltip.setText(_gthis,"Want a shorter version?");
			};
		}
	}
	,makeWorlds: function(game,cityStage,cityMidStage,cityBgStage) {
		var _g = 0;
		var _g1 = this.storyInfo.worlds;
		while(_g < _g1.length) {
			var worldToMake = _g1[_g];
			++_g;
			var newWorld = new World(game,this.city,cityStage,cityMidStage,cityBgStage,common_Rectangle.fromStoryRect(worldToMake.rect),worldToMake.seed,worldToMake.appearance);
			this.city.worlds.push(newWorld);
			var _g2 = 0;
			var _g3 = worldToMake.worldResources;
			while(_g2 < _g3.length) {
				var worldResourceToMake = _g3[_g2];
				++_g2;
				var name = "worldResources." + worldResourceToMake.className;
				newWorld.createWorldResource($hxClasses[name],worldResourceToMake.position);
			}
			var _g4 = 0;
			var _g5 = worldToMake.buildingStacks;
			while(_g4 < _g5.length) {
				var buildingToMake = _g5[_g4];
				++_g4;
				var _g6 = 0;
				var _g7 = buildingToMake.classNames;
				while(_g6 < _g7.length) {
					var className = _g7[_g6];
					++_g6;
					if(className == "NULL") {
						newWorld.permanents[buildingToMake.position].push(null);
						continue;
					}
					var fullClassName = "buildings." + className;
					if(className == "LandedExplorationShip_mirrored") {
						fullClassName = "buildings.LandedExplorationShip";
					}
					if(className == "FuturisticHome_mirrored") {
						fullClassName = "buildings.FuturisticHome";
					}
					if(className == "Loft_mirrored") {
						fullClassName = "buildings.Loft";
					}
					var mirrored = false;
					var decor = 0;
					if(className.indexOf("*") != -1) {
						var splitName = className.split("*");
						var splitName2 = splitName[1].split(".");
						mirrored = splitName2[0] == "true";
						decor = Std.parseInt(splitName2[1]);
						fullClassName = "buildings." + splitName[0];
					}
					var bld = newWorld.build($hxClasses[fullClassName],buildingToMake.position);
					if(className == "LandedExplorationShip_mirrored") {
						bld.mirror();
					}
					if(className == "FuturisticHome_mirrored") {
						bld.mirror();
					}
					if(className == "Loft_mirrored") {
						bld.mirror();
					}
					if(mirrored || decor != 0) {
						bld.customize(decor,mirrored);
					}
					bld.postCreate();
				}
			}
			if(worldToMake.decoration != null) {
				var _g8 = 0;
				var _g9 = newWorld.permanents.length;
				while(_g8 < _g9) {
					var i = _g8++;
					newWorld.setDecoration(worldToMake.decoration,i);
				}
			}
			if(worldToMake.decorations != null) {
				var _g10 = 0;
				var _g11 = worldToMake.decorations;
				while(_g10 < _g11.length) {
					var newDecoration = _g11[_g10];
					++_g10;
					newWorld.setDecoration(newDecoration.spriteName,newDecoration.position);
				}
			}
			var _g12 = 0;
			var _g13 = worldToMake.citizens;
			while(_g12 < _g13.length) {
				var spawn = _g13[_g12];
				++_g12;
				this.spawnCitizens(newWorld,spawn);
			}
			if(worldToMake.unbuildableAliens != null && worldToMake.unbuildableAliens) {
				newWorld.setUnbuildableAliens();
			}
			if(worldToMake.protectedKey != null && worldToMake.protectedKey) {
				newWorld.setProtectedKey();
			}
		}
		if(this.storyInfo.generatorScripts != null) {
			var _g = 0;
			var _g1 = this.storyInfo.generatorScripts;
			while(_g < _g1.length) {
				var gs = _g1[_g];
				++_g;
				progress_GenerateWorld.doGenerate(gs.name,gs.args,this.city,this.storyInfo,cityStage,cityMidStage,cityBgStage);
			}
		}
	}
	,spawnCitizens: function(onWorld,spawn) {
		var _g = 0;
		var _g1 = spawn.amount;
		while(_g < _g1) {
			var i = _g++;
			var age = spawn.ageRangeMin;
			if(spawn.ageRangeMin != spawn.ageRangeMax) {
				age = random_Random.getFloat(spawn.ageRangeMin,spawn.ageRangeMax);
			}
			var startX = null;
			if(spawn.minX != null && spawn.maxX != null) {
				startX = spawn.minX == spawn.maxX ? spawn.minX : random_Random.getInt(spawn.minX,spawn.maxX);
			}
			this.city.simulation.createCitizen(onWorld,age,null,startX);
		}
	}
	,handleFlagsChanges: function(flags) {
		if(flags.disableDying != null) {
			this.disableDying = flags.disableDying;
		}
		if(flags.disableDestroy != null) {
			this.disableDestroy = flags.disableDestroy;
		}
		if(flags.happinessEnthusiasmLevel != null) {
			this.city.simulation.happiness.happinessEnthusiasmLevel = flags.happinessEnthusiasmLevel;
		}
		if(flags.hiddenBoost != null) {
			this.hiddenBoost = flags.hiddenBoost;
		}
		if(flags.disableRewardedAd != null && this.city.simulation.boostManager != null) {
			this.city.simulation.boostManager.disableRewardedAd = flags.disableRewardedAd;
		}
		if(flags.setBuildableAliens != null) {
			var _g = 0;
			var _g1 = this.city.worlds;
			while(_g < _g1.length) {
				var world = _g1[_g];
				++_g;
				world.makeBuildableAliens();
			}
		}
		if(flags.unlockAchievementWithStoryPrefix != null) {
			common_Achievements.achieve("STORY_" + flags.unlockAchievementWithStoryPrefix);
		}
		if(flags.ruleset != null) {
			var tmp = Type.createEnum(progress_Ruleset,flags.ruleset,null);
			this.city.progress.ruleset = tmp;
			this.city.progress.allCitiesInfo.allCityRuleset = this.city.progress.ruleset;
			if(this.city.progress.ruleset == progress_Ruleset.KeyCity) {
				var po = Lambda.find(this.city.policies.policies,function(po) {
					return ((po) instanceof policies_HippieLifestyle);
				});
				if(po != null) {
					this.city.policies.removePolicy(po);
				}
				this.city.simulation.happiness.createGloryOfTheKey();
			}
		}
		if(flags.betrayedHippies) {
			this.city.progress.allCitiesInfo.betrayedHippies = true;
		}
		if(flags.disableRocket != null) {
			this.disableRocket = flags.disableRocket;
		}
	}
	,save: function(queue) {
		this.saveBasics(queue);
		queue.addString(this.currentGoal == null ? "" : this.currentGoal.name);
		var value = this.plannings.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.plannings;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			queue.addString(p.goalName);
			var value = p.nextEventToHandle;
			if(queue.size + 4 > queue.bytes.length) {
				var oldBytes = queue.bytes;
				queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
				queue.bytes.blit(0,oldBytes,0,queue.size);
			}
			queue.bytes.setInt32(queue.size,value);
			queue.size += 4;
			var value1 = p.timeStart;
			if(queue.size + 8 > queue.bytes.length) {
				var oldBytes1 = queue.bytes;
				queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
				queue.bytes.blit(0,oldBytes1,0,queue.size);
			}
			queue.bytes.setDouble(queue.size,value1);
			queue.size += 8;
		}
		var value = this.scriptedParts.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.scriptedParts;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			var c = js_Boot.getClass(p);
			queue.addString(c.__name__);
			p.save(queue);
		}
	}
	,load: function(queue) {
		this.loadBasics(queue);
		this.storyInfo = Resources.storiesInfo.h[this.storyName];
		var currentGoalName = queue.readString();
		this.currentGoal = currentGoalName == "" ? null : this.findGoal(currentGoalName);
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var planningAmount = intToRead;
		var _g = 0;
		var _g1 = planningAmount;
		while(_g < _g1) {
			var i = _g++;
			var goalName = queue.readString();
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var nextEventToHandle = intToRead;
			var floatToRead = queue.bytes.getDouble(queue.readStart);
			queue.readStart += 8;
			var timeSinceStart = floatToRead;
			this.plannings.push({ goalName : goalName, plan : this.findGoal(goalName).planning, nextEventToHandle : nextEventToHandle, timeStart : timeSinceStart});
		}
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var scriptedPartsLen = intToRead;
		var _g = 0;
		var _g1 = scriptedPartsLen;
		while(_g < _g1) {
			var i = _g++;
			var name = queue.readString();
			var p = Type.createInstance($hxClasses[name],[this.city,this]);
			p.load(queue);
			this.scriptedParts.push(p);
		}
		if(currentGoalName == "" || currentGoalName == "Win") {
			if(this.storyName == "theLostShip") {
				common_KongTools.setStat("binaryWontheLostShip",1);
			} else if(this.storyName == "multipleWorlds") {
				common_KongTools.setStat("binaryWontheLostShip",1);
				common_KongTools.setStat("binaryWonmultipleWorlds",1);
			}
		}
		this.doOnStartOrLoadStoryChanges();
	}
	,canHaveUnlimitedResources: function() {
		return this.currentGoal == null;
	}
	,canHaveExtraResources: function() {
		if(this.storyInfo.extraResourcesDisabled != null) {
			return !this.storyInfo.extraResourcesDisabled;
		} else {
			return true;
		}
	}
	,saveBasics: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(progress_Story.saveDefinition);
		}
		queue.addString(this.storyName);
		var value = this.disableDying;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.disableDestroy;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.hiddenBoost;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.disableRocket;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.goalTimer;
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"storyName")) {
			this.storyName = loadMap.h["storyName"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"disableDying")) {
			this.disableDying = loadMap.h["disableDying"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"disableDestroy")) {
			this.disableDestroy = loadMap.h["disableDestroy"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"hiddenBoost")) {
			this.hiddenBoost = loadMap.h["hiddenBoost"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"disableRocket")) {
			this.disableRocket = loadMap.h["disableRocket"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"goalTimer")) {
			this.goalTimer = loadMap.h["goalTimer"];
		}
	}
	,__class__: progress_Story
};
