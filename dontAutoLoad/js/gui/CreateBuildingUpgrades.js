var gui_CreateBuildingUpgrades = $hxClasses["gui.CreateBuildingUpgrades"] = function() { };
gui_CreateBuildingUpgrades.__name__ = "gui.CreateBuildingUpgrades";
gui_CreateBuildingUpgrades.upgradeAll = function(city,building,upgrade,materialsToPay,onUpgrade) {
	var _g = 0;
	var _g1 = city.permanents;
	while(_g < _g1.length) {
		var permanent = _g1[_g];
		++_g;
		if(!permanent.isBuilding) {
			continue;
		}
		var buildingToUpgrade = permanent;
		if(js_Boot.getClass(buildingToUpgrade) == js_Boot.getClass(building)) {
			if(!common_ArrayExtensions.any(buildingToUpgrade.upgrades,function(bu) {
				return js_Boot.getClass(bu) == upgrade;
			}) && js_Boot.getClass(buildingToUpgrade.buildingMode) != upgrade && city.materials.canAfford(materialsToPay)) {
				city.materials.remove(materialsToPay);
				onUpgrade(buildingToUpgrade);
			}
		}
	}
};
gui_CreateBuildingUpgrades.getUpgradeAllNumberAndCanAfford = function(city,building,upgrade,materialsToPay) {
	var mats = city.materials.copy();
	var num = 0;
	var canAffordAll = true;
	var matsToPay = materialsToPay.copy();
	matsToPay.knowledge = 0;
	var _g = 0;
	var _g1 = city.permanents;
	while(_g < _g1.length) {
		var permanent = _g1[_g];
		++_g;
		if(!permanent.isBuilding) {
			continue;
		}
		var buildingToUpgrade = permanent;
		if(js_Boot.getClass(buildingToUpgrade) == js_Boot.getClass(building)) {
			if(!common_ArrayExtensions.any(buildingToUpgrade.upgrades,function(bu) {
				return js_Boot.getClass(bu) == upgrade;
			})) {
				if(mats.canAfford(matsToPay)) {
					mats.remove(matsToPay);
					++num;
				} else {
					canAffordAll = false;
				}
			}
		}
	}
	if(!canAffordAll && num == 0) {
		num = 1;
	}
	return { number : num, canAffordAll : canAffordAll};
};
gui_CreateBuildingUpgrades.setUpgradeAllDisplay = function(city,building,mcd,upgrade,materialsToPay,ch,notForParticularBuilding) {
	if(notForParticularBuilding == null) {
		notForParticularBuilding = false;
	}
	var numAndAfford = gui_CreateBuildingUpgrades.getUpgradeAllNumberAndCanAfford(city,building,upgrade,materialsToPay);
	var wdt = mcd.displayWidth;
	if(numAndAfford.number <= 1) {
		mcd.setBeforeKnowledgeText(numAndAfford.number == 0 ? common_Localize.lo("per_building") : notForParticularBuilding ? common_Localize.lo("for_one_building") : common_Localize.lo("for_this_building"));
		mcd.setCost(materialsToPay);
		if(wdt != mcd.displayWidth) {
			ch.updateSize();
		}
	} else {
		mcd.setBeforeKnowledgeText(numAndAfford.canAffordAll ? common_Localize.lo("for_all_buildings") : common_Localize.lo("for_n_buildings",[numAndAfford.number]));
		var mats = materialsToPay.copy();
		mats.multiply(numAndAfford.number);
		mats.knowledge = materialsToPay.knowledge;
		mcd.setCost(mats);
		if(wdt != mcd.displayWidth) {
			ch.updateSize();
		}
	}
};
gui_CreateBuildingUpgrades.addUpgradeButton = function(city,building,upgrade,onUpgrade,canRemoveUpgrade,onButtonClickSound,notForParticularBuilding,onlyIfHasNot) {
	if(onlyIfHasNot == null) {
		onlyIfHasNot = false;
	}
	if(notForParticularBuilding == null) {
		notForParticularBuilding = false;
	}
	var gui = city.gui;
	var this1 = Resources.buildingUpgradesInfo;
	var key = upgrade.__name__;
	var info = this1.h[key];
	var materialsToPay = Materials.fromBuildingUpgradesInfo(info);
	if(city.progress.unlocks.getUnlockState(upgrade) == progress_UnlockState.Researched) {
		materialsToPay.knowledge = 0;
	}
	var hasUpgrade = common_ArrayExtensions.any(building.upgrades,function(bu) {
		return js_Boot.getClass(bu) == upgrade;
	}) || building.buildingMode != null && js_Boot.getClass(building.buildingMode) == upgrade;
	var thisHasUpgrade = hasUpgrade;
	if(notForParticularBuilding) {
		var numAndAfford = gui_CreateBuildingUpgrades.getUpgradeAllNumberAndCanAfford(city,building,upgrade,materialsToPay);
		hasUpgrade = numAndAfford.number == 0;
	}
	if(hasUpgrade && onlyIfHasNot) {
		return;
	}
	var infoContainerInfo = gui_UpgradeWindowParts.createActivatableButton(gui,hasUpgrade,function() {
		if(city.materials.canAfford(materialsToPay)) {
			if(onButtonClickSound != null) {
				Audio.get().playSound(onButtonClickSound);
			}
			if(!thisHasUpgrade) {
				city.materials.remove(materialsToPay);
				onUpgrade(building);
			}
			city.simulation.houseAssigner.shouldUpdateHouses = true;
			city.progress.unlocks.research(upgrade);
			materialsToPay.knowledge = 0;
			if(gui_UpgradeWindowParts.hasMultiUpgradeModeOn) {
				gui_CreateBuildingUpgrades.upgradeAll(city,building,upgrade,materialsToPay,onUpgrade);
			}
			city.gui.reloadWindow();
		}
	},info.name,info.description);
	if(infoContainerInfo.button != null && onButtonClickSound != null) {
		infoContainerInfo.button.buttonSound = null;
	}
	var infoContainer = infoContainerInfo.container;
	if(infoContainerInfo.button != null) {
		var this1 = gui.currentUpgradeButtons;
		var k = upgrade.__name__;
		var v = infoContainerInfo.button;
		this1.h[k] = v;
	}
	if(!hasUpgrade) {
		if(materialsToPay.any()) {
			var mcdContainer = new gui_GUIContainer(gui,gui.innerWindowStage,infoContainer);
			var mcd = new gui_MaterialsCostDisplay(city,materialsToPay,gui_UpgradeWindowParts.hasMultiUpgradeModeOn ? common_Localize.lo("per_building") : "");
			if(city.game.isMobile) {
				mcd.maxDisplayWidth = city.game.rect.width - 10;
			}
			var ch = mcdContainer.addChild(new gui_ContainerHolder(mcdContainer,gui.innerWindowStage,mcd,{ left : 0, right : 0, top : 0, bottom : gui_UpgradeWindowParts.hasMultiUpgradeModeOn ? materialsToPay.knowledge == 0 ? 0 : 1 : 2},$bind(mcd,mcd.updateCostDisplay)));
			if(gui_UpgradeWindowParts.hasMultiUpgradeModeOn) {
				gui_CreateBuildingUpgrades.setUpgradeAllDisplay(city,building,mcd,upgrade,materialsToPay,ch,notForParticularBuilding);
				var city1 = city;
				var building1 = building;
				var mcd1 = mcd;
				var upgrade1 = upgrade;
				var materialsToPay1 = materialsToPay;
				var ch1 = ch;
				var notForParticularBuilding1 = notForParticularBuilding;
				mcdContainer.onUpdate = function() {
					gui_CreateBuildingUpgrades.setUpgradeAllDisplay(city1,building1,mcd1,upgrade1,materialsToPay1,ch1,notForParticularBuilding1);
				};
			}
			infoContainer.addChild(mcdContainer);
		}
	} else if(!notForParticularBuilding) {
		var thisBuildingUpgrade = Lambda.find(building.upgrades,function(bu) {
			return js_Boot.getClass(bu) == upgrade;
		});
		if(thisBuildingUpgrade == null) {
			thisBuildingUpgrade = building.buildingMode;
		}
		if(canRemoveUpgrade || thisBuildingUpgrade.textures.length > 1) {
			var extraButtons = new gui_GUIContainer(gui,gui.innerWindowStage,infoContainer);
			if(canRemoveUpgrade) {
				infoContainer.padding.bottom += 1;
				extraButtons.addChild(new gui_TextButton(gui,gui.innerWindowStage,infoContainer,function() {
					thisBuildingUpgrade.destroy();
					HxOverrides.remove(building.upgrades,thisBuildingUpgrade);
					city.simulation.houseAssigner.shouldUpdateHouses = true;
					city.gui.reloadWindow();
				},common_Localize.lo("remove")));
				extraButtons.addChild(new gui_GUISpacing(infoContainer,new common_Point(2,1)));
			}
			if(thisBuildingUpgrade.textures.length > 1) {
				var changeAppearanceButton = null;
				changeAppearanceButton = new gui_TextButton(gui,gui.innerWindowStage,infoContainer,function() {
					thisBuildingUpgrade.changeAppearance();
				},common_Localize.lo("change_variant"),null,function() {
					gui.tooltip.setText(changeAppearanceButton,common_Localize.lo("change_appearance_upgrade"));
				});
				extraButtons.addChild(changeAppearanceButton);
			}
			infoContainer.addChild(extraButtons);
			infoContainer.addChild(new gui_GUISpacing(infoContainer,new common_Point(1,2)));
		}
	}
};
gui_CreateBuildingUpgrades.addUpgradesOrBuildingModes = function(city,building,thesePossibleUpgrades,categoryName,onUpgrade,canRemoveUpgrades,upgradeOneText,upgradeAllText,upgradeAllTextNoCost,onAllButtonSelect,onButtonClickSound,notForParticularBuilding,onlyIfHasNot) {
	if(onlyIfHasNot == null) {
		onlyIfHasNot = false;
	}
	if(notForParticularBuilding == null) {
		notForParticularBuilding = false;
	}
	var gui = city.gui;
	if(!common_ArrayExtensions.any(thesePossibleUpgrades,function(pu) {
		return city.progress.unlocks.getUnlockState(pu) != progress_UnlockState.Locked;
	})) {
		return;
	}
	var upgradesTitleContainer = null;
	if(categoryName != null) {
		upgradesTitleContainer = gui_UpgradeWindowParts.createHeader(gui,categoryName);
	}
	var anyNewUpgrade = false;
	var anyUpgradeWithCost = false;
	var _g = 0;
	while(_g < thesePossibleUpgrades.length) {
		var upgrade = [thesePossibleUpgrades[_g]];
		++_g;
		if(city.progress.unlocks.getUnlockState(upgrade[0]) == progress_UnlockState.Locked) {
			continue;
		}
		var hasUpgrade = common_ArrayExtensions.any(building.upgrades,(function(upgrade) {
			return function(bu) {
				return js_Boot.getClass(bu) == upgrade[0];
			};
		})(upgrade)) || building.buildingMode != null && js_Boot.getClass(building.buildingMode) == upgrade[0];
		if(!hasUpgrade) {
			var this1 = Resources.buildingUpgradesInfo;
			var key = upgrade[0].__name__;
			var info = this1.h[key];
			var costWithoutKnowledge = Materials.fromBuildingUpgradesInfo(info);
			costWithoutKnowledge.knowledge = 0;
			if(costWithoutKnowledge.any()) {
				anyUpgradeWithCost = true;
			}
		}
		if(!hasUpgrade) {
			anyNewUpgrade = true;
		}
		gui_CreateBuildingUpgrades.addUpgradeButton(city,building,upgrade[0],(function(_g,a1) {
			return function(a2) {
				_g[0](a1[0],a2);
			};
		})([onUpgrade],[upgrade[0]]),canRemoveUpgrades,onButtonClickSound,notForParticularBuilding,onlyIfHasNot);
	}
	if(anyNewUpgrade && upgradesTitleContainer != null) {
		gui_UpgradeWindowParts.addOneAndMaxButtons(gui,upgradesTitleContainer,function() {
			gui_UpgradeWindowParts.hasMultiUpgradeModeOn = false;
			city.gui.reloadWindow();
		},function() {
			gui_UpgradeWindowParts.hasMultiUpgradeModeOn = true;
			if(onAllButtonSelect != null) {
				onAllButtonSelect();
			}
			city.gui.reloadWindow();
		},upgradeOneText,upgradeAllText,upgradeAllTextNoCost,anyUpgradeWithCost);
	}
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
};
gui_CreateBuildingUpgrades.addUpgradeParts = function(building,city,showTitle,notForParticularBuilding,onlyIfHasNot) {
	if(onlyIfHasNot == null) {
		onlyIfHasNot = false;
	}
	if(notForParticularBuilding == null) {
		notForParticularBuilding = false;
	}
	var type = js_Boot.getClass(building);
	gui_CreateBuildingUpgrades.addUpgradesOrBuildingModes(city,building,building.get_possibleUpgrades(),showTitle ? common_Localize.lo("upgrades") : null,function(upgrade,buildingToUpgrade) {
		buildingToUpgrade.upgrades.push(Type.createInstance(upgrade,[building.stage,city.cityMidStage,building.bgStage,buildingToUpgrade]));
	},false,common_Localize.lo("upgrade_only_this"),function() {
		return common_Localize.lo("upgrade_afford",[city.simulation.stats.amountOfBuildingsOfType(type)]);
	},function() {
		return common_Localize.lo("upgrade_all_explain",[city.simulation.stats.amountOfBuildingsOfType(type)]);
	},null,Audio.get().buildingUpgradeSound,notForParticularBuilding,onlyIfHasNot);
};
gui_CreateBuildingUpgrades.createMainWindowPart = function(building,city) {
	var gui = city.gui;
	gui.currentUpgradeButtons = new haxe_ds_StringMap();
	gui_CreateBuildingUpgrades.addUpgradeParts(building,city,true);
	var onBuildingMode = function(upgrade,buildingToUpgrade) {
		if(buildingToUpgrade.buildingMode != null) {
			buildingToUpgrade.buildingMode.destroy();
		}
		buildingToUpgrade.buildingMode = Type.createInstance(upgrade,[building.stage,city.cityMidStage,building.bgStage,buildingToUpgrade]);
	};
	var type = js_Boot.getClass(building);
	gui_CreateBuildingUpgrades.addUpgradesOrBuildingModes(city,building,building.get_possibleBuildingModes(),common_Localize.lo("building_modes"),onBuildingMode,false,common_Localize.lo("building_mode_only_this"),function() {
		return common_Localize.lo("building_mode_afford",[city.simulation.stats.amountOfBuildingsOfType(type)]);
	},function() {
		return common_Localize.lo("building_mode_all_explain",[city.simulation.stats.amountOfBuildingsOfType(type)]);
	},function() {
		var thisClass = js_Boot.getClass(building.buildingMode);
		var this1 = Resources.buildingUpgradesInfo;
		var key = thisClass.__name__;
		var info = this1.h[key];
		var materialsToPay = Materials.fromBuildingUpgradesInfo(info);
		materialsToPay.knowledge = 0;
		var _g = onBuildingMode;
		var a1 = thisClass;
		var tmp = function(a2) {
			_g(a1,a2);
		};
		gui_CreateBuildingUpgrades.upgradeAll(city,building,thisClass,materialsToPay,tmp);
	});
	gui_CreateCityUpgrades.create(building.get_possibleCityUpgrades(),city);
	gui_CreatePolicies.create(building.get_possiblePolicies(),city);
};
gui_CreateBuildingUpgrades.createBuildingUpgradesForType = function(building,city,onlyIfHasNot) {
	if(onlyIfHasNot == null) {
		onlyIfHasNot = false;
	}
	city.gui.windowInner.addChild(new gui_GUISpacing(city.gui.windowInner,new common_Point(2,4)));
	gui_UpgradeWindowParts.hasMultiUpgradeModeOn = true;
	gui_CreateBuildingUpgrades.addUpgradeParts(building,city,false,true,onlyIfHasNot);
	gui_CreateCityUpgrades.create(building.get_possibleCityUpgrades(),city,false,onlyIfHasNot);
	gui_CreatePolicies.create(building.get_possiblePolicies(),city,false);
};
