var gui_GlobalUpgradeWindow = $hxClasses["gui.GlobalUpgradeWindow"] = function() { };
gui_GlobalUpgradeWindow.__name__ = "gui.GlobalUpgradeWindow";
gui_GlobalUpgradeWindow.create = function(city,gui,stage,$window) {
	gui_GlobalUpgradeWindow.createWindow(city,gui,stage,$window);
};
gui_GlobalUpgradeWindow.createWindow = function(city,gui,stage,$window) {
	gui.windowAllowBanner();
	$window.clear();
	city.gui.windowAddTitleText(common_Localize.lo("upgrades_and_policies"));
	gui_CheckboxButton.createSettingButton(gui,gui.innerWindowStage,gui.windowInner,function() {
		gui_GlobalUpgradeWindow.onlyShowNew = !gui_GlobalUpgradeWindow.onlyShowNew;
		gui.reloadWindow();
	},function() {
		return gui_GlobalUpgradeWindow.onlyShowNew;
	},common_Localize.lo("only_show_unupgraded"));
	city.gui.windowInner.addChild(new gui_GUISpacing(city.gui.windowInner,new common_Point(2,6)));
	var buildingTypesWithUpgradeUnsorted = [];
	var buildingTypesWithUpgradeClassNames = [];
	var buildingTypesWithUpgradeClassIgnored = [];
	var _g = 0;
	var _g1 = city.permanents;
	while(_g < _g1.length) {
		var pm = _g1[_g];
		++_g;
		if(pm.isBuilding && (common_ArrayExtensions.any(pm.get_possibleUpgrades(),(function() {
			return function(u) {
				return city.progress.unlocks.getUnlockState(u) != progress_UnlockState.Locked;
			};
		})()) || common_ArrayExtensions.any(pm.get_possibleCityUpgrades(),(function() {
			return function(u) {
				return city.progress.unlocks.getUnlockState(u) != progress_UnlockState.Locked;
			};
		})()) || common_ArrayExtensions.any(pm.get_possiblePolicies(),(function() {
			return function(u) {
				return city.progress.unlocks.getUnlockState(u) != progress_UnlockState.Locked;
			};
		})()))) {
			var cls = js_Boot.getClass(pm);
			var i = buildingTypesWithUpgradeUnsorted.indexOf(cls);
			if(i == -1) {
				var ignoreThis = false;
				if(gui_GlobalUpgradeWindow.onlyShowNew) {
					ignoreThis = true;
					if(pm.get_possiblePolicies().length > 0 && common_ArrayExtensions.any(pm.get_possiblePolicies(),(function() {
						return function(u) {
							return city.progress.unlocks.getUnlockState(u) != progress_UnlockState.Locked;
						};
					})())) {
						ignoreThis = false;
					}
					if(ignoreThis) {
						var _g2 = 0;
						var _g3 = pm.get_possibleUpgrades();
						while(_g2 < _g3.length) {
							var up = _g3[_g2];
							++_g2;
							if(city.progress.unlocks.getUnlockState(up) != progress_UnlockState.Locked) {
								var numAndAfford = gui_CreateBuildingUpgrades.getUpgradeAllNumberAndCanAfford(city,pm,up,new Materials());
								if(numAndAfford.number > 0) {
									ignoreThis = false;
									break;
								}
							}
						}
					}
					if(ignoreThis) {
						var _g4 = 0;
						var _g5 = pm.get_possibleCityUpgrades();
						while(_g4 < _g5.length) {
							var up1 = [_g5[_g4]];
							++_g4;
							if(city.progress.unlocks.getUnlockState(up1[0]) != progress_UnlockState.Locked) {
								if(!common_ArrayExtensions.any(city.upgrades.upgrades,(function(up) {
									return function(bu) {
										return js_Boot.getClass(bu) == up[0];
									};
								})(up1))) {
									ignoreThis = false;
									break;
								}
							}
						}
					}
				}
				i = buildingTypesWithUpgradeUnsorted.length;
				buildingTypesWithUpgradeUnsorted.push(cls);
				var splitClassName = cls.__name__.split(".");
				buildingTypesWithUpgradeClassNames.push(splitClassName[splitClassName.length - 1]);
				buildingTypesWithUpgradeClassIgnored.push(ignoreThis);
			}
		}
	}
	var buildingTypesWithUpgrade = [];
	var _g = 0;
	var _g1 = city.progress.resources.buildingInfoArray;
	while(_g < _g1.length) {
		var bi = _g1[_g];
		++_g;
		var i = buildingTypesWithUpgradeClassNames.indexOf(bi.className);
		if(i != -1 && !buildingTypesWithUpgradeClassIgnored[i]) {
			buildingTypesWithUpgrade.push(buildingTypesWithUpgradeUnsorted[i]);
		}
	}
	var _g = 0;
	var _g1 = buildingTypesWithUpgrade.length;
	while(_g < _g1) {
		var i = _g++;
		var buildingType = buildingTypesWithUpgrade[i];
		var buildingTypeContainer = new gui_GUIContainer(gui,gui.innerWindowStage,gui.windowInner);
		var this1 = city.progress.resources.buildingInfo;
		var key = buildingType.__name__;
		var buildingInfo = this1.h[key];
		buildingTypeContainer.addChild(gui_BuildingTypeImage.create(stage,city,buildingType,buildingTypeContainer,gui));
		buildingTypeContainer.addChild(new gui_TextElement(buildingTypeContainer,gui.innerWindowStage,buildingInfo.name,null,"Arial16",{ top : 3, left : 3, right : 0, bottom : 0}));
		gui.windowInner.addChildWithoutSizeUpdate(buildingTypeContainer);
		var permanentClassID = [PermanentMetaHelper.getClassID(buildingType.__name__)];
		var anyPermanentOfThisType = Lambda.find(city.permanents,(function(permanentClassID) {
			return function(pm) {
				return pm.classID == permanentClassID[0];
			};
		})(permanentClassID));
		if(anyPermanentOfThisType != null) {
			gui_CreateBuildingUpgrades.createBuildingUpgradesForType(anyPermanentOfThisType,city,gui_GlobalUpgradeWindow.onlyShowNew);
		}
		if(buildingType == buildings_Laboratory) {
			gui_GlobalUpgradeWindow.addSmartUpgradeForLabs(city);
		}
	}
	gui.windowInner.updateSize();
	if(buildingTypesWithUpgrade.length == 0) {
		city.gui.windowInner.addChild(new gui_TextElement(city.gui.windowInner,city.gui.innerWindowStage,common_Localize.lo("no_upgrades")));
	}
	gui.windowAddBottomButtons();
	var city1 = city;
	var gui1 = gui;
	var stage1 = stage;
	var window1 = $window;
	var tmp = function() {
		gui_GlobalUpgradeWindow.createWindow(city1,gui1,stage1,window1);
	};
	city.gui.setWindowReload(tmp);
	var _g = ($_=city.gui,$bind($_,$_.reloadWindow));
	var city2 = city;
	var gui2 = gui;
	var stage2 = stage;
	var window2 = $window;
	var createWindowFunc = function() {
		gui_GlobalUpgradeWindow.createWindow(city2,gui2,stage2,window2);
	};
	var tmp = function() {
		_g(createWindowFunc);
	};
	city.windowRelatedOnBuildOrDestroy = tmp;
	$window.onDestroy = function() {
		city.windowRelatedOnBuildOrDestroy = null;
	};
};
gui_GlobalUpgradeWindow.addSmartUpgradeForLabs = function(city) {
	var upgradeCost = new Materials();
	var upgrade1 = buildingUpgrades_FarmingResearch;
	var upgrade2 = buildingUpgrades_TreePlantationResearch;
	var _g = [];
	var _g1 = 0;
	var _g2 = city.permanents;
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
	var _g2 = city.permanents;
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
	var doesNotHaveUpgrade = relevantLabs1.length > 0 || relevantLabs2.length > 0;
	var infoContainerInfo = gui_UpgradeWindowParts.createActivatableButton(city.gui,!doesNotHaveUpgrade,function() {
		if(city.materials.canAfford(upgradeCost)) {
			city.materials.remove(upgradeCost);
			var _g = 0;
			while(_g < relevantLabs1.length) {
				var building = relevantLabs1[_g];
				++_g;
				building.upgrades.push(Type.createInstance(upgrade1,[building.stage,city.cityMidStage,building.bgStage,building]));
			}
			var _g = 0;
			while(_g < relevantLabs2.length) {
				var building = relevantLabs2[_g];
				++_g;
				building.upgrades.push(Type.createInstance(upgrade2,[building.stage,city.cityMidStage,building.bgStage,building]));
			}
			Audio.get().playSound(Audio.get().buildingUpgradeSound);
			city.progress.unlocks.research(upgrade1);
			city.progress.unlocks.research(upgrade2);
			city.gui.reloadWindow();
		}
	},common_Localize.lo("auto_upgrade"),common_Localize.lo("upgrade_all_labs"),city.gui.windowInner,null);
	if(infoContainerInfo.button != null) {
		infoContainerInfo.button.buttonSound = null;
	}
	var this1 = Resources.buildingUpgradesInfo;
	var key = upgrade1.__name__;
	var origCost1 = Materials.fromBuildingUpgradesInfo(this1.h[key]);
	upgradeCost = origCost1.copy();
	upgradeCost.multiply(relevantLabs1.length);
	var this1 = Resources.buildingUpgradesInfo;
	var key = upgrade2.__name__;
	var origCost2 = Materials.fromBuildingUpgradesInfo(this1.h[key]);
	var upgradeCost2 = origCost2.copy();
	upgradeCost2.multiply(relevantLabs2.length);
	if(city.progress.unlocks.getUnlockState(upgrade1) == progress_UnlockState.Researched) {
		upgradeCost.knowledge = 0;
	} else {
		upgradeCost.knowledge = Math.min(upgradeCost.knowledge,origCost1.knowledge);
	}
	if(city.progress.unlocks.getUnlockState(upgrade2) == progress_UnlockState.Researched) {
		upgradeCost2.knowledge = 0;
	} else {
		upgradeCost2.knowledge = Math.min(upgradeCost2.knowledge,origCost2.knowledge);
	}
	upgradeCost.add(upgradeCost2);
	if(doesNotHaveUpgrade) {
		if(upgradeCost.any()) {
			var mcdContainer = new gui_GUIContainer(city.gui,city.gui.innerWindowStage,infoContainerInfo.container);
			var mcd = new gui_MaterialsCostDisplay(city,upgradeCost,"");
			if(city.game.isMobile) {
				mcd.maxDisplayWidth = city.game.rect.width - 10;
			}
			mcdContainer.addChild(new gui_ContainerHolder(mcdContainer,city.gui.innerWindowStage,mcd,{ left : 0, right : 0, top : 0, bottom : 2},$bind(mcd,mcd.updateCostDisplay)));
			infoContainerInfo.container.addChild(mcdContainer);
		}
	}
	city.gui.windowInner.addChild(new gui_GUISpacing(city.gui.windowInner,new common_Point(2,4)));
};
