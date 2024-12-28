var buildings_BlossomHippieHQ = $hxClasses["buildings.BlossomHippieHQ"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.isScenarioVariant = false;
	this.canLeaveForBG = 0;
	this.eventBotanicalGardens = null;
	this.timeToCheckBuildings = 0;
	this.currentMission = 0;
	this.eventPhase = 0;
	this.doingEvent = -1;
	this.lastEventDoneOnDay = 0;
	buildings_WorkWithHome.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 11;
	this.endTime = 23;
	this.workTimePreferenceMod = 0.3;
	this.isScenarioVariant = city.progress.story.storyName == "hippiecommune";
};
buildings_BlossomHippieHQ.__name__ = "buildings.BlossomHippieHQ";
buildings_BlossomHippieHQ.__super__ = buildings_WorkWithHome;
buildings_BlossomHippieHQ.prototype = $extend(buildings_WorkWithHome.prototype,{
	positionSprites: function() {
		buildings_WorkWithHome.prototype.positionSprites.call(this);
	}
	,tryDestroy: function(warnIfNot) {
		if(warnIfNot == null) {
			warnIfNot = true;
		}
		if(this.city.progress.story.storyName == "hippiecommune" && this.city.progress.ruleset == progress_Ruleset.HippieCity) {
			if(warnIfNot) {
				this.city.gui.showSimpleWindow(common_Localize.lo("hippie_forbidden"),null,true,true);
			}
			return false;
		}
		return buildings_WorkWithHome.prototype.tryDestroy.call(this,warnIfNot);
	}
	,destroy: function() {
		buildings_WorkWithHome.prototype.destroy.call(this);
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_WorkWithHome.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.window,new common_Point(4,4)));
		var anySQ = false;
		if(this.currentMission == 8) {
			anySQ = gui_CurrentMissionsWindow.displaySidequestsWithTag(this.city,this.city.gui,this.city.gui.innerWindowStage,this.city.gui.windowInner,"Hippies");
		}
		if(!anySQ && !this.isScenarioVariant) {
			this.city.gui.windowAddInfoText(null,function() {
				return _gthis.missionGetTitle();
			},"Arial15");
			this.city.gui.windowAddInfoText(null,function() {
				return _gthis.missionGetText();
			});
		} else if(this.isScenarioVariant && this.city.progress.ruleset == progress_Ruleset.KeyCity && this.city.progress.allCitiesInfo.betrayedHippies) {
			this.city.gui.windowAddInfoText(common_Localize.lo("hippies_betrayed"));
		}
	}
	,createMainWindowPart: function() {
		var _gthis = this;
		buildings_WorkWithHome.prototype.createMainWindowPart.call(this);
		var skipButtonExists = false;
		var skipButton = null;
		var guiSpacing = null;
		var buttonContainer = new gui_GUIContainer(this.city.gui,this.city.gui.innerWindowStage,this.city.gui.windowInner);
		buttonContainer.direction = gui_GUIContainerDirection.Vertical;
		this.city.gui.windowInner.addChild(buttonContainer);
		buttonContainer.onUpdate = function() {
			if(_gthis.currentMission == 2) {
				if(!skipButtonExists) {
					skipButtonExists = true;
					skipButton = new gui_TextButton(_gthis.city.gui,_gthis.city.gui.innerWindowStage,buttonContainer,function() {
						if(_gthis.currentMission == 2 && _gthis.city.materials.canAfford(new Materials(0,0,10000))) {
							_gthis.currentMission = 3;
							_gthis.city.progress.unlocks.unlock(buildings_FarmHouse);
							var _g = _gthis.city.materials;
							_g.set_food(_g.food - 10000);
						} else {
							var showWarningWindow = function() {
								_gthis.city.gui.showSimpleWindow(common_Localize.lo("cant_afford"),null,true);
							};
							showWarningWindow();
							_gthis.city.gui.addWindowToStack(showWarningWindow);
						}
					},common_Localize.lo("bribe_hippies_option"));
					buttonContainer.addChild(skipButton);
					guiSpacing = buttonContainer.addChild(new gui_GUISpacing(buttonContainer,new common_Point(4,4)));
				}
			} else if(skipButtonExists) {
				buttonContainer.removeChild(skipButton);
				skipButtonExists = false;
				buttonContainer.removeChild(guiSpacing);
			}
		};
		if(this.isScenarioVariant && this.city.progress.ruleset == progress_Ruleset.KeyCity && this.city.progress.allCitiesInfo.betrayedHippies) {
			var materialsToPay = new Materials(0,0,1000001);
			var infoContainer = gui_UpgradeWindowParts.createActivatableButton(this.city.gui,false,function() {
				if(_gthis.city.materials.canAfford(materialsToPay)) {
					_gthis.city.materials.remove(materialsToPay);
					_gthis.city.progress.allCitiesInfo.betrayedHippies = false;
					_gthis.city.progress.unlocks.unlock(buildings_FestivalHQ);
					_gthis.city.progress.unlocks.unlock(cityUpgrades_SuperSpaciousLiving);
					_gthis.city.progress.unlocks.unlock(buildings_FarmByProductProcessor);
					_gthis.city.gui.reloadWindow();
				}
			},common_Localize.lo("hippies_bribe_betrayed"),common_Localize.lo("hippies_bribe_betrayed_explain"));
			var mcdContainer = new gui_GUIContainer(this.city.gui,this.city.gui.innerWindowStage,infoContainer.container);
			var mcd = new gui_MaterialsCostDisplay(this.city,materialsToPay,"");
			if(this.city.game.isMobile) {
				mcd.maxDisplayWidth = this.city.game.rect.width - 10;
			}
			var ch = mcdContainer.addChild(new gui_ContainerHolder(mcdContainer,this.city.gui.innerWindowStage,mcd,{ left : 0, right : 0, top : 0, bottom : 2}));
			infoContainer.container.addChild(mcdContainer);
			guiSpacing = this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(4,4)));
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
			return common_Localize.lo("peace_out");
		}
		if(this.workers.length != this.get_jobs()) {
			return common_Localize.lo("flower_buds");
		}
		return common_Localize.lo("hippie_mission_" + this.currentMission);
	}
	,checkMissionCompletions: function() {
		var missionComplete = false;
		while(true) {
			missionComplete = false;
			switch(this.currentMission) {
			case 0:
				var timesComplete = 0;
				var _g = 0;
				var _g1 = this.city.permanents;
				while(_g < _g1.length) {
					var bld = _g1[_g];
					++_g;
					if(bld.is(buildings_Teleporter)) {
						var bld1 = bld;
						if(bld1.leftBuilding != null && bld1.rightBuilding != null && bld1.topBuilding != null && bld1.bottomBuilding != null && bld1.leftBuilding.is(buildings_BotanicalGardens) && bld1.rightBuilding.is(buildings_BotanicalGardens) && bld1.bottomBuilding.is(buildings_BotanicalGardens) && bld1.topBuilding.is(buildings_BotanicalGardens)) {
							++timesComplete;
						}
					}
				}
				if(timesComplete >= 2) {
					missionComplete = true;
					this.city.progress.unlocks.unlock(buildings_BlossomRestaurant);
				}
				break;
			case 2:
				var _g2 = 0;
				var _g3 = this.city.permanents;
				while(_g2 < _g3.length) {
					var bld2 = _g3[_g2];
					++_g2;
					if(bld2.is(worldResources_Forest)) {
						var thisForest = bld2;
						if(thisForest.managementMode == worldResources_ForestManagementMode.Protect) {
							missionComplete = true;
							this.city.progress.unlocks.unlock(buildings_FarmHouse);
						}
					}
				}
				break;
			case 6:
				missionComplete = common_ArrayExtensions.any(this.city.upgrades.upgrades,function(cu) {
					return ((cu) instanceof cityUpgrades_SuperSpaciousLiving);
				});
				if(missionComplete) {
					this.city.progress.unlocks.unlock(buildings_FestivalHQ);
				}
				break;
			default:
			}
			if(this.timeToCheckBuildings <= 0 && this.currentMission != 0 && this.currentMission != 2 && this.currentMission != 6 && this.currentMission != 8) {
				var buildingsByType = this.city.getAmountOfPermanentsPerType();
				switch(this.currentMission) {
				case 1:
					missionComplete = buildingsByType.h["buildings.BlossomRestaurant"] >= 3;
					break;
				case 3:
					missionComplete = buildingsByType.h["buildings.FarmHouse"] >= 20;
					break;
				case 4:
					missionComplete = buildingsByType.h["buildings.EcoFarm"] >= 30;
					if(missionComplete) {
						this.city.progress.unlocks.unlock(buildings_FarmByProductProcessor);
					}
					break;
				case 5:
					missionComplete = buildingsByType.h["buildings.FarmByProductProcessor"] >= 9;
					if(missionComplete) {
						this.city.progress.unlocks.unlock(cityUpgrades_SuperSpaciousLiving);
					}
					break;
				case 7:
					missionComplete = buildingsByType.h["buildings.FestivalHQ"] >= 1;
					break;
				default:
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
		if(!this.isScenarioVariant) {
			this.checkMissionCompletions();
		}
		this.timeToCheckBuildings -= timeMod;
		this.canLeaveForBG -= timeMod;
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		var _gthis = this;
		if(citizen.inPermanent != null && citizen.inPermanent.is(buildings_BotanicalGardens) && citizen.inPermanent.isTree()) {
			if(this.eventPhase != 0) {
				citizen.setRelativeY(citizen.relativeY - 0.4 * timeMod);
				if(citizen.relativeY <= 0) {
					if((citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).bottomBuilding != null && (citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).bottomBuilding.is(buildings_BotanicalGardens)) {
						citizen.setRelativeY(citizen.relativeY + 20);
						citizen.inPermanent = (citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).bottomBuilding;
						return;
					} else {
						citizen.setRelativeY(0);
						this.doingEvent = -1;
					}
				} else {
					return;
				}
			} else {
				var spd = citizen.pathWalkSpeed * timeMod;
				Citizen.shouldUpdateDraw = true;
				var tmp;
				if(Math.abs(9 - citizen.relativeX) < spd) {
					citizen.relativeX = 9;
					tmp = true;
				} else {
					var num = 9 - citizen.relativeX;
					citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
					tmp = false;
				}
				if(tmp) {
					citizen.setRelativeY(citizen.relativeY + 0.4 * timeMod);
					if(citizen.relativeY >= 10) {
						if((citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).topBuilding != null && (citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).topBuilding.is(buildings_BotanicalGardens)) {
							citizen.setRelativeY(citizen.relativeY - 20);
							citizen.inPermanent = (citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).topBuilding;
						} else {
							this.eventPhase = 1;
						}
					}
				}
				return;
			}
		} else if(this.doingEvent != -1) {
			citizen.setRelativeY(0);
			if(this.eventBotanicalGardens == null) {
				this.eventBotanicalGardens = this.city.simulation.permanentFinder.query(this,function(pm) {
					if(pm.is(buildings_BotanicalGardens)) {
						var bg = pm;
						if(bg.bottomBuilding == null || !bg.bottomBuilding.is(buildings_BotanicalGardens)) {
							return bg.isTree();
						} else {
							return false;
						}
					}
					return false;
				});
			}
			if(this.eventBotanicalGardens != null) {
				if(this.canLeaveForBG <= 0) {
					citizen.simulation.pathfinder.findPath(citizen,this.eventBotanicalGardens);
					citizen.pathOnFail = function() {
						_gthis.doingEvent = -1;
						_gthis.eventBotanicalGardens = null;
					};
					this.canLeaveForBG = 20;
				}
				return;
			} else {
				this.doingEvent = -1;
			}
		}
		if(shouldStopWorking) {
			citizen.currentAction = 2;
			return;
		}
		if(citizen.inPermanent != this) {
			citizen.setRelativeY(0);
			citizen.simulation.pathfinder.findPath(citizen,this);
			citizen.pathOnFail = null;
			return;
		}
		this.doWalkAround(citizen);
		if(((this.city.simulation.time.timeSinceStart | 0) / 60 | 0) % 24 > 10) {
			if(1 + ((this.city.simulation.time.timeSinceStart | 0) / 1440 | 0) > this.lastEventDoneOnDay) {
				this.doingEvent = 1;
				this.eventPhase = 0;
				this.lastEventDoneOnDay = 1 + ((this.city.simulation.time.timeSinceStart | 0) / 1440 | 0);
			}
		}
	}
	,walkAround: function(citizen,stepsInBuilding) {
		this.doWalkAround(citizen);
	}
	,doWalkAround: function(citizen) {
		if(citizen.relativeX < 7 && random_Random.getFloat() < 0.3) {
			citizen.changeFloorAndWaitRandom(10,30);
		} else if(citizen.relativeY > 5 || random_Random.getFloat() > 0.5) {
			citizen.moveAndWait(random_Random.getInt(3,7),random_Random.getInt(60,180),null,false,false);
		} else {
			citizen.moveAndWait(random_Random.getInt(12,16),random_Random.getInt(60,180),null,false,false);
		}
	}
	,getGlobalGoal: function() {
		if(this.currentMission == 8) {
			return null;
		}
		if(this.isScenarioVariant) {
			return null;
		}
		return { category : common_Localize.lo("hippie_mission"), text : this.missionGetText()};
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_WorkWithHome.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_BlossomHippieHQ.saveDefinition);
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
	,__class__: buildings_BlossomHippieHQ
});
