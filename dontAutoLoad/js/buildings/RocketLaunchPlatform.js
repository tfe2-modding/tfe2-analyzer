var buildings_RocketLaunchPlatform = $hxClasses["buildings.RocketLaunchPlatform"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.maxWorkers = 4;
	this.hasRocketType = -1;
	this.rocket = null;
	this.platformSprite = null;
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.platformSprite = new PIXI.Sprite(Resources.getTexture("spr_rocketlaunchplatform"));
	this.platformSprite.position.set(position.x,position.y - 80);
	stage.addChild(this.platformSprite);
	this.rocket = null;
};
buildings_RocketLaunchPlatform.__name__ = "buildings.RocketLaunchPlatform";
buildings_RocketLaunchPlatform.__super__ = Building;
buildings_RocketLaunchPlatform.prototype = $extend(Building.prototype,{
	get_possibleUpgrades: function() {
		return [];
	}
	,onBuild: function() {
		this.city.progress.unlocks.unlockMaterial("rocketFuel");
	}
	,postLoad: function() {
		this.updateRocket();
	}
	,updateRocket: function() {
		if(this.hasRocketType == 0 && this.rocket == null) {
			this.rocket = new simulation_Rocket(this.city.simulation.rockets,this,this.city.cityStage,this.city.getCityEdges().minY);
			this.city.simulation.rockets.addRocket(this.rocket);
			this.currentMission = new simulation_RocketMission(this.city,this);
		}
	}
	,destroy: function() {
		Building.prototype.destroy.call(this);
		if(this.platformSprite != null) {
			this.platformSprite.destroy();
		}
		if(this.rocket != null) {
			this.rocket.destroy();
		}
	}
	,createMainWindowPart: function() {
		var _gthis = this;
		var selectedTexture = Resources.getTexture("spr_selectedhuman");
		var selectedSpritePool = [];
		var hasInProgressWindow = false;
		this.city.gui.windowOnDestroy = function() {
			var _g = 0;
			while(_g < selectedSpritePool.length) {
				var spr = selectedSpritePool[_g];
				++_g;
				spr.destroy();
			}
		};
		this.city.gui.windowOnLateUpdate = function() {
			var citizens = [];
			if(_gthis.currentMission != null && _gthis.currentMission.crewMembers != null) {
				citizens = _gthis.currentMission.crewMembers;
			}
			if(_gthis.currentMission != null && _gthis.currentMission.citizensToSend != null && !_gthis.currentMission.startedMission) {
				citizens = citizens.concat(_gthis.currentMission.citizensToSend);
			}
			if(selectedSpritePool.length > citizens.length) {
				var _g = citizens.length;
				var _g1 = selectedSpritePool.length;
				while(_g < _g1) {
					var i = _g++;
					selectedSpritePool[i].destroy();
				}
				selectedSpritePool.splice(citizens.length,selectedSpritePool.length - citizens.length);
			}
			var _g = 0;
			var _g1 = citizens.length;
			while(_g < _g1) {
				var i = _g++;
				if(i >= selectedSpritePool.length) {
					var spr = new PIXI.Sprite(selectedTexture);
					selectedSpritePool.push(spr);
					_gthis.city.furtherForegroundStage.addChild(spr);
				}
				var citizen = citizens[i];
				var citizenPos = citizen.getCityPosition();
				selectedSpritePool[i].position.set(citizenPos.x - 1,citizenPos.y - 6);
			}
			if(hasInProgressWindow && _gthis.currentMission == null) {
				_gthis.reloadWindow();
			}
		};
		var gui = this.city.gui;
		if(this.rocket == null && this.currentMission == null) {
			if(this.city.progress.story.disableRocket) {
				gui.windowAddInfoText(common_Localize.lo("cant_build_rocket"));
			} else {
				var materialsToPay = new Materials(0,0,0,500,0,200,100,0,0,60);
				if(this.city.upgrades.vars.cheaperRockets) {
					materialsToPay = new Materials(0,0,0,375,0,150,75,0,0,45);
				}
				var rocketBuildButton = gui_UpgradeWindowParts.createActivatableButton(gui,false,function() {
					if(_gthis.city.materials.canAfford(materialsToPay)) {
						_gthis.rocket = new simulation_Rocket(_gthis.city.simulation.rockets,_gthis,_gthis.city.cityStage,_gthis.city.getCityEdges().minY);
						_gthis.hasRocketType = 0;
						_gthis.city.simulation.rockets.addRocket(_gthis.rocket);
						_gthis.currentMission = new simulation_RocketMission(_gthis.city,_gthis);
						_gthis.reloadWindow();
						_gthis.city.materials.remove(materialsToPay);
					}
				},common_Localize.lo("build_rocket"),common_Localize.lo("rocket_description"),this.city.gui.windowInner);
				var infoContainer = rocketBuildButton.container;
				var mcdContainer = new gui_GUIContainer(gui,gui.innerWindowStage,infoContainer);
				var mcd = new gui_MaterialsCostDisplay(this.city,materialsToPay,"");
				mcdContainer.addChild(new gui_ContainerHolder(mcdContainer,gui.innerWindowStage,mcd,{ left : 0, right : 0, top : 0, bottom : 2},$bind(mcd,mcd.updateCostDisplay)));
				mcd.setCost(materialsToPay);
				infoContainer.addChild(mcdContainer);
			}
		} else if(this.currentMission.executingMission) {
			gui.windowAddInfoText(null,function() {
				if(!_gthis.currentMission.startedMission) {
					if(_gthis.currentMission.currentCitizensToSend > 0) {
						return common_Localize.lo("mission_gathering_2");
					} else {
						return common_Localize.lo("mission_gathering");
					}
				} else {
					return common_Localize.lo("mission_in_progress");
				}
			});
			hasInProgressWindow = true;
		} else {
			gui.windowAddInfoText(common_Localize.lo("prepare_mission"));
			gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
			gui.windowAddInfoText(common_Localize.lo("choose_destination"),null,"Arial15");
			gui_UpgradeWindowParts.createActivatableButton(gui,this.currentMission.destination == 0,function() {
				_gthis.currentMission.destination = 0;
				_gthis.currentMission.missionDuration = 2.1;
				_gthis.reloadWindow();
			},common_Localize.lo("nearby_space"),common_Localize.lo("nearby_space_explain",[Math.floor(simulation_RocketMission.getDestinationFindPct(this.city,0) * 100)]),gui.windowInner);
			gui_UpgradeWindowParts.createActivatableButton(gui,this.currentMission.destination == 1,function() {
				_gthis.currentMission.destination = 1;
				_gthis.currentMission.missionDuration = 4.9;
				_gthis.reloadWindow();
			},common_Localize.lo("distant_space"),common_Localize.lo("distant_space_explain",[Math.floor(simulation_RocketMission.getDestinationFindPct(this.city,1) * 100)]),gui.windowInner);
			var fa = Lambda.find(this.city.permanents,function(pm) {
				return pm.is(buildings_FeatherAlliance);
			});
			if(fa != null && fa.currentMission == 5) {
				gui_UpgradeWindowParts.createActivatableButton(gui,this.currentMission.destination == 9,function() {
					_gthis.currentMission.destination = 9;
					_gthis.currentMission.missionDuration = 19.9;
					_gthis.reloadWindow();
				},common_Localize.lo("feather_mission"),common_Localize.lo("feather_mission_explain"),gui.windowInner);
			}
			var sq = this.city.progress.sideQuests.findSidequestWithType(progress_sidequests_HippieRocketMission);
			if(sq != null) {
				gui_UpgradeWindowParts.createActivatableButton(gui,this.currentMission.destination == 8,function() {
					_gthis.currentMission.destination = 8;
					_gthis.currentMission.missionDuration = 5.9;
					_gthis.reloadWindow();
				},common_Localize.lo("hippie_mission_rocket"),common_Localize.lo("hippie_mission_rocket_explain"),gui.windowInner);
			}
			var otherCities = this.city.subCities;
			if(this.city.cityMainFile != this.city.cityFile) {
				gui_UpgradeWindowParts.createActivatableButton(gui,this.currentMission.destination == 11,function() {
					_gthis.currentMission.destination = 11;
					_gthis.currentMission.missionDuration = 0.9;
					_gthis.reloadWindow();
				},this.city.progress.allCitiesInfo.subCityNames[0],common_Localize.lo("rocket_other_planet_explain"),gui.windowInner);
			}
			var i = 1;
			var _g = 0;
			while(_g < otherCities.length) {
				var otherCity = otherCities[_g];
				++_g;
				var iCurr = [i];
				if(iCurr[0] != this.city.progress.allCitiesInfo.get_thisCityIndex()) {
					gui_UpgradeWindowParts.createActivatableButton(gui,this.currentMission.destination == 11 + i,(function(iCurr) {
						return function() {
							_gthis.currentMission.destination = 11 + iCurr[0];
							_gthis.currentMission.missionDuration = 0.9;
							_gthis.reloadWindow();
						};
					})(iCurr),this.city.progress.allCitiesInfo.subCityNames[i],common_Localize.lo("rocket_other_planet_explain"),gui.windowInner);
				}
				++i;
			}
			gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
			if(this.currentMission.destination >= 11) {
				this.createMainWindowPartSendPeopleAndResources(gui);
			} else if(this.currentMission.destination == 9) {
				this.createMainWindowPartFeatherMission(gui);
			} else if(this.currentMission.destination == 8) {
				this.createMainWindowPartHippieMission(gui);
			} else {
				this.createMainWindowPartNormalMission(gui);
			}
		}
	}
	,createMainWindowPartFeatherMission: function(gui) {
		var _gthis = this;
		gui.windowAddInfoText(null,function() {
			return common_Localize.lo("fuel_cost",[_gthis.currentMission.fuelCost()]);
		});
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
		gui_windowParts_FullSizeTextButton.create(this.city.gui,function() {
			_gthis.currentMission.crewMembersBiologists = 0;
			_gthis.currentMission.crewMembersEngineers = 0;
			_gthis.currentMission.crewMembersNavigators = 0;
			_gthis.currentMission.crewMembersMiners = 0;
			_gthis.currentMission.crewMembersExplorers = 0;
			_gthis.currentMission.crewMembersFeather = 7;
			var missionResult = _gthis.currentMission.startIfPossible();
			if(missionResult != null) {
				_gthis.currentMission.crewMembersFeather = 0;
				var showWarningWindow = function() {
					_gthis.city.gui.showSimpleWindow(missionResult,null,true);
				};
				showWarningWindow();
				_gthis.city.gui.addWindowToStack(showWarningWindow);
			} else {
				_gthis.reloadWindow();
			}
		},this.city.gui.windowInner,function() {
			return common_Localize.lo("start_mission");
		},this.city.gui.innerWindowStage);
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
	}
	,createMainWindowPartHippieMission: function(gui) {
		var _gthis = this;
		gui.windowAddInfoText(null,function() {
			return common_Localize.lo("fuel_cost",[_gthis.currentMission.fuelCost()]);
		});
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
		gui_windowParts_FullSizeTextButton.create(this.city.gui,function() {
			_gthis.currentMission.crewMembersBiologists = 0;
			_gthis.currentMission.crewMembersEngineers = 0;
			_gthis.currentMission.crewMembersNavigators = 0;
			_gthis.currentMission.crewMembersMiners = 0;
			_gthis.currentMission.crewMembersExplorers = 0;
			_gthis.currentMission.crewMembersHippies = 6;
			var missionResult = _gthis.currentMission.startIfPossible();
			if(missionResult != null) {
				_gthis.currentMission.crewMembersHippies = 0;
				var showWarningWindow = function() {
					_gthis.city.gui.showSimpleWindow(missionResult,null,true);
				};
				showWarningWindow();
				_gthis.city.gui.addWindowToStack(showWarningWindow);
			} else {
				_gthis.reloadWindow();
			}
		},this.city.gui.windowInner,function() {
			return common_Localize.lo("start_mission");
		},this.city.gui.innerWindowStage);
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
	}
	,createMainWindowPartSendPeopleAndResources: function(gui) {
		var _gthis = this;
		gui.windowAddInfoText(common_Localize.lo("rocket_other_planet_ask"));
		var materialSelectContainer = new gui_GUIContainer(gui,this.stage,gui.windowInner,null,null,null,null,{ top : 0, bottom : 4, left : 0, right : 0});
		gui.windowInner.addChild(materialSelectContainer);
		var materialSelectContainerNum = 0;
		if(!this.city.progress.sandbox.unlimitedResources) {
			if(this.city.progress.unlocks.unlockedMaterial("food")) {
				if(this.currentMission.currentMaterialsToSend.h["food"] == null) {
					this.currentMission.currentMaterialsToSend.h["food"] = 0;
				}
				if(materialSelectContainerNum > 3 || this.game.isMobile && materialSelectContainerNum > 1) {
					materialSelectContainer = new gui_GUIContainer(gui,this.stage,gui.windowInner,null,null,null,null,{ left : 0, top : 0, right : 0, bottom : 4});
					gui.windowInner.addChild(materialSelectContainer);
					materialSelectContainerNum = 0;
				}
				var iconSprite = Resources.makeSprite("spr_resource_" + "food".toLowerCase());
				materialSelectContainer.addChild(new gui_ContainerHolder(materialSelectContainer,gui.innerWindowStage,iconSprite,{ top : 2, bottom : 0, left : 0, right : 0}));
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(2,0)));
				var numberSelectControl = new gui_NumberSelectControl(gui,gui.innerWindowStage,materialSelectContainer,null,function() {
					return 0;
				},function() {
					var val2 = Math.floor(_gthis.city.materials.food);
					if(val2 < 10000) {
						return val2;
					} else {
						return 10000;
					}
				},this.currentMission.currentMaterialsToSend.h["food"],function(n) {
					_gthis.currentMission.currentMaterialsToSend.h["food"] = n;
				},function() {
					_gthis.currentMission.currentMaterialsToSend.h["food"] = 0;
					return 0;
				},"",100,30);
				materialSelectContainer.addChild(numberSelectControl);
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(4,0)));
				++materialSelectContainerNum;
			}
			if(this.city.progress.unlocks.unlockedMaterial("wood")) {
				if(this.currentMission.currentMaterialsToSend.h["wood"] == null) {
					this.currentMission.currentMaterialsToSend.h["wood"] = 0;
				}
				if(materialSelectContainerNum > 3 || this.game.isMobile && materialSelectContainerNum > 1) {
					materialSelectContainer = new gui_GUIContainer(gui,this.stage,gui.windowInner,null,null,null,null,{ left : 0, top : 0, right : 0, bottom : 4});
					gui.windowInner.addChild(materialSelectContainer);
					materialSelectContainerNum = 0;
				}
				var iconSprite = Resources.makeSprite("spr_resource_" + "wood".toLowerCase());
				materialSelectContainer.addChild(new gui_ContainerHolder(materialSelectContainer,gui.innerWindowStage,iconSprite,{ top : 2, bottom : 0, left : 0, right : 0}));
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(2,0)));
				var numberSelectControl = new gui_NumberSelectControl(gui,gui.innerWindowStage,materialSelectContainer,null,function() {
					return 0;
				},function() {
					var val2 = Math.floor(_gthis.city.materials.wood);
					if(val2 < 10000) {
						return val2;
					} else {
						return 10000;
					}
				},this.currentMission.currentMaterialsToSend.h["wood"],function(n) {
					_gthis.currentMission.currentMaterialsToSend.h["wood"] = n;
				},function() {
					_gthis.currentMission.currentMaterialsToSend.h["wood"] = 0;
					return 0;
				},"",100,30);
				materialSelectContainer.addChild(numberSelectControl);
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(4,0)));
				++materialSelectContainerNum;
			}
			if(this.city.progress.unlocks.unlockedMaterial("stone")) {
				if(this.currentMission.currentMaterialsToSend.h["stone"] == null) {
					this.currentMission.currentMaterialsToSend.h["stone"] = 0;
				}
				if(materialSelectContainerNum > 3 || this.game.isMobile && materialSelectContainerNum > 1) {
					materialSelectContainer = new gui_GUIContainer(gui,this.stage,gui.windowInner,null,null,null,null,{ left : 0, top : 0, right : 0, bottom : 4});
					gui.windowInner.addChild(materialSelectContainer);
					materialSelectContainerNum = 0;
				}
				var iconSprite = Resources.makeSprite("spr_resource_" + "stone".toLowerCase());
				materialSelectContainer.addChild(new gui_ContainerHolder(materialSelectContainer,gui.innerWindowStage,iconSprite,{ top : 2, bottom : 0, left : 0, right : 0}));
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(2,0)));
				var numberSelectControl = new gui_NumberSelectControl(gui,gui.innerWindowStage,materialSelectContainer,null,function() {
					return 0;
				},function() {
					var val2 = Math.floor(_gthis.city.materials.stone);
					if(val2 < 10000) {
						return val2;
					} else {
						return 10000;
					}
				},this.currentMission.currentMaterialsToSend.h["stone"],function(n) {
					_gthis.currentMission.currentMaterialsToSend.h["stone"] = n;
				},function() {
					_gthis.currentMission.currentMaterialsToSend.h["stone"] = 0;
					return 0;
				},"",100,30);
				materialSelectContainer.addChild(numberSelectControl);
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(4,0)));
				++materialSelectContainerNum;
			}
			if(this.city.progress.unlocks.unlockedMaterial("machineParts")) {
				if(this.currentMission.currentMaterialsToSend.h["machineParts"] == null) {
					this.currentMission.currentMaterialsToSend.h["machineParts"] = 0;
				}
				if(materialSelectContainerNum > 3 || this.game.isMobile && materialSelectContainerNum > 1) {
					materialSelectContainer = new gui_GUIContainer(gui,this.stage,gui.windowInner,null,null,null,null,{ left : 0, top : 0, right : 0, bottom : 4});
					gui.windowInner.addChild(materialSelectContainer);
					materialSelectContainerNum = 0;
				}
				var iconSprite = Resources.makeSprite("spr_resource_" + "machineParts".toLowerCase());
				materialSelectContainer.addChild(new gui_ContainerHolder(materialSelectContainer,gui.innerWindowStage,iconSprite,{ top : 2, bottom : 0, left : 0, right : 0}));
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(2,0)));
				var numberSelectControl = new gui_NumberSelectControl(gui,gui.innerWindowStage,materialSelectContainer,null,function() {
					return 0;
				},function() {
					var val2 = Math.floor(_gthis.city.materials.machineParts);
					if(val2 < 10000) {
						return val2;
					} else {
						return 10000;
					}
				},this.currentMission.currentMaterialsToSend.h["machineParts"],function(n) {
					_gthis.currentMission.currentMaterialsToSend.h["machineParts"] = n;
				},function() {
					_gthis.currentMission.currentMaterialsToSend.h["machineParts"] = 0;
					return 0;
				},"",100,30);
				materialSelectContainer.addChild(numberSelectControl);
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(4,0)));
				++materialSelectContainerNum;
			}
			if(this.city.progress.unlocks.unlockedMaterial("refinedMetal")) {
				if(this.currentMission.currentMaterialsToSend.h["refinedMetal"] == null) {
					this.currentMission.currentMaterialsToSend.h["refinedMetal"] = 0;
				}
				if(materialSelectContainerNum > 3 || this.game.isMobile && materialSelectContainerNum > 1) {
					materialSelectContainer = new gui_GUIContainer(gui,this.stage,gui.windowInner,null,null,null,null,{ left : 0, top : 0, right : 0, bottom : 4});
					gui.windowInner.addChild(materialSelectContainer);
					materialSelectContainerNum = 0;
				}
				var iconSprite = Resources.makeSprite("spr_resource_" + "refinedMetal".toLowerCase());
				materialSelectContainer.addChild(new gui_ContainerHolder(materialSelectContainer,gui.innerWindowStage,iconSprite,{ top : 2, bottom : 0, left : 0, right : 0}));
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(2,0)));
				var numberSelectControl = new gui_NumberSelectControl(gui,gui.innerWindowStage,materialSelectContainer,null,function() {
					return 0;
				},function() {
					var val2 = Math.floor(_gthis.city.materials.refinedMetal);
					if(val2 < 10000) {
						return val2;
					} else {
						return 10000;
					}
				},this.currentMission.currentMaterialsToSend.h["refinedMetal"],function(n) {
					_gthis.currentMission.currentMaterialsToSend.h["refinedMetal"] = n;
				},function() {
					_gthis.currentMission.currentMaterialsToSend.h["refinedMetal"] = 0;
					return 0;
				},"",100,30);
				materialSelectContainer.addChild(numberSelectControl);
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(4,0)));
				++materialSelectContainerNum;
			}
			if(this.city.progress.unlocks.unlockedMaterial("computerChips")) {
				if(this.currentMission.currentMaterialsToSend.h["computerChips"] == null) {
					this.currentMission.currentMaterialsToSend.h["computerChips"] = 0;
				}
				if(materialSelectContainerNum > 3 || this.game.isMobile && materialSelectContainerNum > 1) {
					materialSelectContainer = new gui_GUIContainer(gui,this.stage,gui.windowInner,null,null,null,null,{ left : 0, top : 0, right : 0, bottom : 4});
					gui.windowInner.addChild(materialSelectContainer);
					materialSelectContainerNum = 0;
				}
				var iconSprite = Resources.makeSprite("spr_resource_" + "computerChips".toLowerCase());
				materialSelectContainer.addChild(new gui_ContainerHolder(materialSelectContainer,gui.innerWindowStage,iconSprite,{ top : 2, bottom : 0, left : 0, right : 0}));
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(2,0)));
				var numberSelectControl = new gui_NumberSelectControl(gui,gui.innerWindowStage,materialSelectContainer,null,function() {
					return 0;
				},function() {
					var val2 = Math.floor(_gthis.city.materials.computerChips);
					if(val2 < 10000) {
						return val2;
					} else {
						return 10000;
					}
				},this.currentMission.currentMaterialsToSend.h["computerChips"],function(n) {
					_gthis.currentMission.currentMaterialsToSend.h["computerChips"] = n;
				},function() {
					_gthis.currentMission.currentMaterialsToSend.h["computerChips"] = 0;
					return 0;
				},"",100,30);
				materialSelectContainer.addChild(numberSelectControl);
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(4,0)));
				++materialSelectContainerNum;
			}
			if(this.city.progress.unlocks.unlockedMaterial("cacao")) {
				if(this.currentMission.currentMaterialsToSend.h["cacao"] == null) {
					this.currentMission.currentMaterialsToSend.h["cacao"] = 0;
				}
				if(materialSelectContainerNum > 3 || this.game.isMobile && materialSelectContainerNum > 1) {
					materialSelectContainer = new gui_GUIContainer(gui,this.stage,gui.windowInner,null,null,null,null,{ left : 0, top : 0, right : 0, bottom : 4});
					gui.windowInner.addChild(materialSelectContainer);
					materialSelectContainerNum = 0;
				}
				var iconSprite = Resources.makeSprite("spr_resource_" + "cacao".toLowerCase());
				materialSelectContainer.addChild(new gui_ContainerHolder(materialSelectContainer,gui.innerWindowStage,iconSprite,{ top : 2, bottom : 0, left : 0, right : 0}));
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(2,0)));
				var numberSelectControl = new gui_NumberSelectControl(gui,gui.innerWindowStage,materialSelectContainer,null,function() {
					return 0;
				},function() {
					var val2 = Math.floor(_gthis.city.materials.cacao);
					if(val2 < 10000) {
						return val2;
					} else {
						return 10000;
					}
				},this.currentMission.currentMaterialsToSend.h["cacao"],function(n) {
					_gthis.currentMission.currentMaterialsToSend.h["cacao"] = n;
				},function() {
					_gthis.currentMission.currentMaterialsToSend.h["cacao"] = 0;
					return 0;
				},"",100,30);
				materialSelectContainer.addChild(numberSelectControl);
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(4,0)));
				++materialSelectContainerNum;
			}
			if(this.city.progress.unlocks.unlockedMaterial("chocolate")) {
				if(this.currentMission.currentMaterialsToSend.h["chocolate"] == null) {
					this.currentMission.currentMaterialsToSend.h["chocolate"] = 0;
				}
				if(materialSelectContainerNum > 3 || this.game.isMobile && materialSelectContainerNum > 1) {
					materialSelectContainer = new gui_GUIContainer(gui,this.stage,gui.windowInner,null,null,null,null,{ left : 0, top : 0, right : 0, bottom : 4});
					gui.windowInner.addChild(materialSelectContainer);
					materialSelectContainerNum = 0;
				}
				var iconSprite = Resources.makeSprite("spr_resource_" + "chocolate".toLowerCase());
				materialSelectContainer.addChild(new gui_ContainerHolder(materialSelectContainer,gui.innerWindowStage,iconSprite,{ top : 2, bottom : 0, left : 0, right : 0}));
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(2,0)));
				var numberSelectControl = new gui_NumberSelectControl(gui,gui.innerWindowStage,materialSelectContainer,null,function() {
					return 0;
				},function() {
					var val2 = Math.floor(_gthis.city.materials.chocolate);
					if(val2 < 10000) {
						return val2;
					} else {
						return 10000;
					}
				},this.currentMission.currentMaterialsToSend.h["chocolate"],function(n) {
					_gthis.currentMission.currentMaterialsToSend.h["chocolate"] = n;
				},function() {
					_gthis.currentMission.currentMaterialsToSend.h["chocolate"] = 0;
					return 0;
				},"",100,30);
				materialSelectContainer.addChild(numberSelectControl);
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(4,0)));
				++materialSelectContainerNum;
			}
			if(this.city.progress.unlocks.unlockedMaterial("graphene")) {
				if(this.currentMission.currentMaterialsToSend.h["graphene"] == null) {
					this.currentMission.currentMaterialsToSend.h["graphene"] = 0;
				}
				if(materialSelectContainerNum > 3 || this.game.isMobile && materialSelectContainerNum > 1) {
					materialSelectContainer = new gui_GUIContainer(gui,this.stage,gui.windowInner,null,null,null,null,{ left : 0, top : 0, right : 0, bottom : 4});
					gui.windowInner.addChild(materialSelectContainer);
					materialSelectContainerNum = 0;
				}
				var iconSprite = Resources.makeSprite("spr_resource_" + "graphene".toLowerCase());
				materialSelectContainer.addChild(new gui_ContainerHolder(materialSelectContainer,gui.innerWindowStage,iconSprite,{ top : 2, bottom : 0, left : 0, right : 0}));
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(2,0)));
				var numberSelectControl = new gui_NumberSelectControl(gui,gui.innerWindowStage,materialSelectContainer,null,function() {
					return 0;
				},function() {
					var val2 = Math.floor(_gthis.city.materials.graphene);
					if(val2 < 10000) {
						return val2;
					} else {
						return 10000;
					}
				},this.currentMission.currentMaterialsToSend.h["graphene"],function(n) {
					_gthis.currentMission.currentMaterialsToSend.h["graphene"] = n;
				},function() {
					_gthis.currentMission.currentMaterialsToSend.h["graphene"] = 0;
					return 0;
				},"",100,30);
				materialSelectContainer.addChild(numberSelectControl);
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(4,0)));
				++materialSelectContainerNum;
			}
			if(this.city.progress.unlocks.unlockedMaterial("rocketFuel")) {
				if(this.currentMission.currentMaterialsToSend.h["rocketFuel"] == null) {
					this.currentMission.currentMaterialsToSend.h["rocketFuel"] = 0;
				}
				if(materialSelectContainerNum > 3 || this.game.isMobile && materialSelectContainerNum > 1) {
					materialSelectContainer = new gui_GUIContainer(gui,this.stage,gui.windowInner,null,null,null,null,{ left : 0, top : 0, right : 0, bottom : 4});
					gui.windowInner.addChild(materialSelectContainer);
					materialSelectContainerNum = 0;
				}
				var iconSprite = Resources.makeSprite("spr_resource_" + "rocketFuel".toLowerCase());
				materialSelectContainer.addChild(new gui_ContainerHolder(materialSelectContainer,gui.innerWindowStage,iconSprite,{ top : 2, bottom : 0, left : 0, right : 0}));
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(2,0)));
				var numberSelectControl = new gui_NumberSelectControl(gui,gui.innerWindowStage,materialSelectContainer,null,function() {
					return 0;
				},function() {
					var val2 = Math.floor(_gthis.city.materials.rocketFuel);
					if(val2 < 10000) {
						return val2;
					} else {
						return 10000;
					}
				},this.currentMission.currentMaterialsToSend.h["rocketFuel"],function(n) {
					_gthis.currentMission.currentMaterialsToSend.h["rocketFuel"] = n;
				},function() {
					_gthis.currentMission.currentMaterialsToSend.h["rocketFuel"] = 0;
					return 0;
				},"",100,30);
				materialSelectContainer.addChild(numberSelectControl);
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(4,0)));
				++materialSelectContainerNum;
			}
			var _g = 0;
			var _g1 = MaterialsHelper.modMaterials;
			while(_g < _g1.length) {
				var modMaterial = _g1[_g];
				++_g;
				var currentMaterial = [modMaterial.variableName];
				if(this.city.progress.unlocks.unlockedMaterial(currentMaterial[0])) {
					if(this.currentMission.currentMaterialsToSend.h[currentMaterial[0]] == null) {
						this.currentMission.currentMaterialsToSend.h[currentMaterial[0]] = 0;
					}
					if(materialSelectContainerNum > 3 || this.game.isMobile && materialSelectContainerNum > 1) {
						materialSelectContainer = new gui_GUIContainer(gui,this.stage,gui.windowInner,null,null,null,null,{ left : 0, top : 0, right : 0, bottom : 4});
						gui.windowInner.addChild(materialSelectContainer);
						materialSelectContainerNum = 0;
					}
					var iconSprite = Resources.makeSprite("spr_resource_" + currentMaterial[0].toLowerCase());
					materialSelectContainer.addChild(new gui_ContainerHolder(materialSelectContainer,gui.innerWindowStage,iconSprite,{ top : 2, bottom : 0, left : 0, right : 0}));
					materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(2,0)));
					var numberSelectControl = new gui_NumberSelectControl(gui,gui.innerWindowStage,materialSelectContainer,null,(function() {
						return function() {
							return 0;
						};
					})(),(function(currentMaterial) {
						return function() {
							var val2 = Math.floor(_gthis.city.materials[currentMaterial[0]]);
							if(val2 < 10000) {
								return val2;
							} else {
								return 10000;
							}
						};
					})(currentMaterial),this.currentMission.currentMaterialsToSend.h[currentMaterial[0]],(function(currentMaterial) {
						return function(n) {
							_gthis.currentMission.currentMaterialsToSend.h[currentMaterial[0]] = n;
						};
					})(currentMaterial),(function(currentMaterial) {
						return function() {
							_gthis.currentMission.currentMaterialsToSend.h[currentMaterial[0]] = 0;
							return 0;
						};
					})(currentMaterial),"",100,30);
					materialSelectContainer.addChild(numberSelectControl);
					materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(4,0)));
					++materialSelectContainerNum;
				}
			}
			if(this.city.progress.unlocks.unlockedMaterial("knowledge")) {
				if(this.currentMission.currentMaterialsToSend.h["knowledge"] == null) {
					this.currentMission.currentMaterialsToSend.h["knowledge"] = 0;
				}
				if(materialSelectContainerNum > 3 || this.game.isMobile && materialSelectContainerNum > 1) {
					materialSelectContainer = new gui_GUIContainer(gui,this.stage,gui.windowInner,null,null,null,null,{ left : 0, top : 0, right : 0, bottom : 4});
					gui.windowInner.addChild(materialSelectContainer);
					materialSelectContainerNum = 0;
				}
				var iconSprite = Resources.makeSprite("spr_resource_" + "knowledge".toLowerCase());
				materialSelectContainer.addChild(new gui_ContainerHolder(materialSelectContainer,gui.innerWindowStage,iconSprite,{ top : 2, bottom : 0, left : 0, right : 0}));
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(2,0)));
				var numberSelectControl = new gui_NumberSelectControl(gui,gui.innerWindowStage,materialSelectContainer,null,function() {
					return 0;
				},function() {
					var val2 = Math.floor(_gthis.city.materials.knowledge);
					if(val2 < 10000) {
						return val2;
					} else {
						return 10000;
					}
				},this.currentMission.currentMaterialsToSend.h["knowledge"],function(n) {
					_gthis.currentMission.currentMaterialsToSend.h["knowledge"] = n;
				},function() {
					_gthis.currentMission.currentMaterialsToSend.h["knowledge"] = 0;
					return 0;
				},"",100,30);
				materialSelectContainer.addChild(numberSelectControl);
				materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(4,0)));
				++materialSelectContainerNum;
			}
		}
		if(this.currentMission.currentCitizensToSend == null) {
			this.currentMission.currentCitizensToSend = 0;
		}
		if(materialSelectContainerNum > 3) {
			materialSelectContainer = new gui_GUIContainer(gui,this.stage,gui.windowInner,null,null,null,null,{ left : 0, top : 0, right : 0, bottom : 4});
			gui.windowInner.addChild(materialSelectContainer);
			materialSelectContainerNum = 0;
		}
		var iconSprite = Resources.makeSprite("spr_population");
		materialSelectContainer.addChild(new gui_ContainerHolder(materialSelectContainer,gui.innerWindowStage,iconSprite,{ top : 2, bottom : 0, left : 0, right : 0}));
		materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(2,0)));
		var numberSelectControl = new gui_NumberSelectControl(gui,gui.innerWindowStage,materialSelectContainer,null,function() {
			return 0;
		},function() {
			var val2 = Math.floor(_gthis.city.simulation.citizens.length - 100);
			var val21 = val2 > 0 ? val2 : 0;
			if(val21 < 500) {
				return val21;
			} else {
				return 500;
			}
		},this.currentMission.currentCitizensToSend,function(n) {
			_gthis.currentMission.currentCitizensToSend = n;
		},function() {
			_gthis.currentMission.currentCitizensToSend = 0;
			return 0;
		},"",10,30);
		materialSelectContainer.addChild(numberSelectControl);
		materialSelectContainer.addChild(new gui_GUISpacing(materialSelectContainer,new common_Point(4,0)));
		++materialSelectContainerNum;
		gui.windowAddInfoText(common_Localize.lo("rocket_other_planet_explain_more",[Math.floor(this.currentMission.fuelCost())]));
		gui_windowParts_FullSizeTextButton.create(this.city.gui,function() {
			_gthis.currentMission.crewMembersBiologists = 0;
			_gthis.currentMission.crewMembersEngineers = 0;
			_gthis.currentMission.crewMembersNavigators = 0;
			_gthis.currentMission.crewMembersMiners = 0;
			_gthis.currentMission.crewMembersExplorers = 4;
			var missionResult = _gthis.currentMission.startIfPossible();
			if(missionResult != null) {
				var showWarningWindow = function() {
					_gthis.city.gui.showSimpleWindow(missionResult,null,true);
				};
				showWarningWindow();
				_gthis.city.gui.addWindowToStack(showWarningWindow);
			} else {
				_gthis.reloadWindow();
			}
		},this.city.gui.windowInner,function() {
			return common_Localize.lo("start_mission");
		},this.city.gui.innerWindowStage);
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
	}
	,createMainWindowPartNormalMission: function(gui) {
		var _gthis = this;
		gui.windowAddInfoText(common_Localize.lo("choose_crew"),null,"Arial15");
		gui.windowAddInfoText(common_Localize.lo("choose_crew_explain"));
		this.missionAddSpecificJob(gui,function() {
			return _gthis.currentMission.crewMembersExplorers;
		},function(b) {
			_gthis.currentMission.crewMembersExplorers = b;
		},common_Localize.lo("explorers") + (simulation_RocketMission.getDestinationFindPct(this.city,this.currentMission.destination,0) == 1 ? " " + common_Localize.lo("everything_found") : ""),common_Localize.lo("rocket_explorer_explain"),buildings_ExplorationCentre);
		this.missionAddSpecificJob(gui,function() {
			return _gthis.currentMission.crewMembersEngineers;
		},function(b) {
			_gthis.currentMission.crewMembersEngineers = b;
		},common_Localize.lo("engineers") + (simulation_RocketMission.getDestinationFindPct(this.city,this.currentMission.destination,1) == 1 ? " " + common_Localize.lo("everything_found") : ""),common_Localize.lo("rocket_engineer_explain"),buildings_ExperimentationLab);
		this.missionAddSpecificJob(gui,function() {
			return _gthis.currentMission.crewMembersBiologists;
		},function(b) {
			_gthis.currentMission.crewMembersBiologists = b;
		},common_Localize.lo("biologists") + (simulation_RocketMission.getDestinationFindPct(this.city,this.currentMission.destination,2) == 1 ? " " + common_Localize.lo("everything_found") : ""),common_Localize.lo("rocket_botanical_explain"),buildings_HerbGarden);
		this.missionAddSpecificJob(gui,function() {
			return _gthis.currentMission.crewMembersNavigators;
		},function(b) {
			_gthis.currentMission.crewMembersNavigators = b;
		},common_Localize.lo("navigators"),common_Localize.lo("rocket_navigator_explain"),buildings_Observatory,3);
		this.missionAddSpecificJob(gui,function() {
			return _gthis.currentMission.crewMembersMiners;
		},function(b) {
			_gthis.currentMission.crewMembersMiners = b;
		},common_Localize.lo("miners"),common_Localize.lo("rocket_miner_explain"),buildings_StoneMine);
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
		gui.windowAddInfoText(null,function() {
			return common_Localize.lo("fuel_cost",[_gthis.currentMission.fuelCost()]);
		});
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
		gui_windowParts_FullSizeTextButton.create(this.city.gui,function() {
			var missionResult = _gthis.currentMission.startIfPossible();
			if(missionResult != null) {
				var showWarningWindow = function() {
					_gthis.city.gui.showSimpleWindow(missionResult,null,true);
				};
				showWarningWindow();
				_gthis.city.gui.addWindowToStack(showWarningWindow);
			} else {
				_gthis.reloadWindow();
			}
		},this.city.gui.windowInner,function() {
			return common_Localize.lo("start_mission");
		},this.city.gui.innerWindowStage);
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
	}
	,missionAddSpecificJob: function(gui,getPrio,setPrio,text,description,permanent,absoluteMax) {
		if(absoluteMax == null) {
			absoluteMax = 4;
		}
		var _gthis = this;
		var stage = gui.innerWindowStage;
		var jobContainer = new gui_GUIContainer(gui,stage,gui.windowInner,null,null,null,null,{ left : 0, top : 2, bottom : 0, right : 0});
		jobContainer.addChild(gui_BuildingTypeImage.create(stage,this.city,permanent,jobContainer,gui));
		jobContainer.fillSecondarySize = true;
		var jobContainer2 = new gui_GUIContainer(gui,stage,jobContainer,null,null,null,null,{ left : 0, top : 0, bottom : 0, right : 0});
		jobContainer2.direction = gui_GUIContainerDirection.Vertical;
		jobContainer2.addChild(new gui_TextElement(jobContainer2,stage,text,null,null,{ left : 3, top : 0, bottom : 0, right : 0}));
		jobContainer2.addChild(new gui_TextElement(jobContainer2,stage,description,null,"Arial10",{ left : 3, top : 0, bottom : 0, right : 0}));
		jobContainer.addChild(jobContainer2);
		jobContainer.addChild(new gui_GUIFiller(jobContainer));
		var currentPrioNumber = getPrio();
		var numberSelectControl = new gui_NumberSelectControl(gui,stage,jobContainer,{ left : 0, top : 3, bottom : 0, right : 0},function() {
			return 0;
		},function() {
			var val2 = _gthis.maxWorkers + getPrio() - _gthis.currentMission.get_totalCrewMembers();
			if(val2 < absoluteMax) {
				return val2;
			} else {
				return absoluteMax;
			}
		},currentPrioNumber,function(n) {
			setPrio(n);
		},null,"Crew members");
		jobContainer.addChild(numberSelectControl);
		gui.windowInner.addChild(jobContainer);
	}
	,getJobsByBuilding: function(permanent) {
		return common_ArrayExtensions.sum(this.city.permanents,function(pm) {
			if(pm.is(permanent)) {
				return pm.workers.length;
			}
			return 0;
		});
	}
	,positionSprites: function() {
		Building.prototype.positionSprites.call(this);
		if(this.platformSprite != null) {
			this.platformSprite.position.set(this.position.x,this.position.y - 80);
		}
		if(this.rocket != null) {
			this.rocket.updatePosition();
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Building.prototype.save.call(this,queue,shouldSaveDefinition);
		this.saveBasics(queue,shouldSaveDefinition);
		var value = this.currentMission != null;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		if(this.currentMission != null) {
			this.currentMission.save(queue,true);
		}
	}
	,tryDestroy: function(warnIfNot) {
		if(warnIfNot == null) {
			warnIfNot = true;
		}
		if(this.currentMission != null && this.currentMission.executingMission) {
			if(warnIfNot) {
				this.city.gui.showSimpleWindow(common_Localize.lo("rocket_launch_cant_destroy_while_executing"),null,true,true);
			}
			return false;
		}
		return Building.prototype.tryDestroy.call(this,warnIfNot);
	}
	,load: function(queue,definition) {
		Building.prototype.load.call(this,queue,definition);
		this.loadBasics(queue,definition);
		if(queue.version >= 48) {
			var byteToRead = queue.bytes.b[queue.readStart];
			queue.readStart += 1;
			var hasMission = byteToRead > 0;
			if(hasMission) {
				this.currentMission = new simulation_RocketMission(this.city,this);
				this.currentMission.load(queue);
			}
		}
	}
	,saveBasics: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(buildings_RocketLaunchPlatform.saveDefinition);
		}
		var value = this.hasRocketType;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,loadBasics: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"hasRocketType")) {
			this.hasRocketType = loadMap.h["hasRocketType"];
		}
		this.postLoad();
	}
	,__class__: buildings_RocketLaunchPlatform
});
