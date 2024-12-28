var gui_CreateCityUpgrades = $hxClasses["gui.CreateCityUpgrades"] = function() { };
gui_CreateCityUpgrades.__name__ = "gui.CreateCityUpgrades";
gui_CreateCityUpgrades.create = function(upgrades,city,addHeader,onlyIfHasNot) {
	if(onlyIfHasNot == null) {
		onlyIfHasNot = false;
	}
	if(addHeader == null) {
		addHeader = true;
	}
	var gui = city.gui;
	var _g = [];
	var _g1 = 0;
	var _g2 = upgrades;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		if(city.progress.unlocks.getUnlockState(v) == progress_UnlockState.Unlocked) {
			_g.push(v);
		}
	}
	var unlockedUpgrades = _g;
	var cityUpgrades = city.upgrades;
	var cityUpgradesList = cityUpgrades.upgrades;
	if(unlockedUpgrades.length == 0) {
		return;
	}
	if(addHeader) {
		gui_UpgradeWindowParts.createHeader(gui,common_Localize.lo("city_upgrades"));
	}
	var buttonsContainer = new gui_GUIContainer(gui,gui.innerWindowStage,gui.windowInner);
	gui.windowInner.addChild(buttonsContainer);
	buttonsContainer.direction = gui_GUIContainerDirection.Vertical;
	buttonsContainer.fillSecondarySize = true;
	var recreateButtons = function() {
		buttonsContainer.clear();
		var _g = 0;
		while(_g < unlockedUpgrades.length) {
			var upgrade = [unlockedUpgrades[_g]];
			++_g;
			var hasUpgrade = common_ArrayExtensions.any(cityUpgradesList,(function(upgrade) {
				return function(bu) {
					return js_Boot.getClass(bu) == upgrade[0];
				};
			})(upgrade));
			if(hasUpgrade && onlyIfHasNot) {
				continue;
			}
			var upgradeName = [upgrade[0].__name__];
			var info = Resources.cityUpgradesInfo.h[upgradeName[0]];
			var currentName = info.name;
			var currentDescription = info.description;
			if(info.nextUpgrade != null && info.nextUpgrade != "") {
				var nextUpgrade = "cityUpgrades." + info.nextUpgrade;
				if(city.progress.unlocks.getUnlockState($hxClasses[nextUpgrade]) != progress_UnlockState.Locked) {
					continue;
				}
			} else if(hasUpgrade) {
				if(info.nameIfNotDone != null) {
					currentName = info.nameIfNotDone;
				}
				if(info.descriptionIfNotDone != null) {
					currentDescription = info.descriptionIfNotDone;
				}
			}
			var materialsToPay = [city.upgrades.getCurrentCost(info)];
			var infoContainerInfo = gui_UpgradeWindowParts.createActivatableButton(gui,hasUpgrade,(function(materialsToPay,upgradeName,upgrade) {
				return function() {
					if(city.materials.canAfford(materialsToPay[0])) {
						city.materials.remove(materialsToPay[0]);
						city.upgrades.addUpgrade(Type.createInstance(upgrade[0],[]));
						Analytics.sendEvent("research",upgradeName[0]);
						Analytics.sendEventFirebase("research","upgrade",upgradeName[0]);
						city.simulation.houseAssigner.shouldUpdateHouses = true;
						city.gui.reloadWindow();
						city.gui.refreshCategoryBuildingsShown();
						Audio.get().playSound(Audio.get().buildingUpgradeSound);
					}
				};
			})(materialsToPay,upgradeName,upgrade),currentName,currentDescription,buttonsContainer,null);
			if(infoContainerInfo.button != null) {
				infoContainerInfo.button.buttonSound = null;
			}
			if(infoContainerInfo.button != null) {
				var this1 = gui.currentUpgradeButtons;
				var k = upgrade[0].__name__;
				var v = infoContainerInfo.button;
				this1.h[k] = v;
			}
			if(!hasUpgrade) {
				if(materialsToPay[0].any()) {
					var mcdContainer = new gui_GUIContainer(gui,gui.innerWindowStage,infoContainerInfo.container);
					var mcd = new gui_MaterialsCostDisplay(city,materialsToPay[0],"");
					if(city.game.isMobile) {
						mcd.maxDisplayWidth = city.game.rect.width - 10;
					}
					mcdContainer.addChild(new gui_ContainerHolder(mcdContainer,gui.innerWindowStage,mcd,{ left : 0, right : 0, top : 0, bottom : 2},$bind(mcd,mcd.updateCostDisplay)));
					infoContainerInfo.container.addChild(mcdContainer);
				}
			}
		}
	};
	recreateButtons();
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
};
