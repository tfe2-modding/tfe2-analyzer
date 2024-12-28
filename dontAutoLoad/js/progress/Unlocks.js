var progress_Unlocks = $hxClasses["progress.Unlocks"] = function(city) {
	this.unlockMost = false;
	this.checkBuildRelatedUnlocksIn = 0;
	this.unlockedCustomHouses = true;
	this.numberOfModernArtMuseumArtworksUnlocked = 4;
	this.unlockedManagementOptions = true;
	this.unlockedBuildingModeButton = true;
	this.unlockedDecorationTab = true;
	this.city = city;
	this.unlockState = new haxe_ds_StringMap();
	this.shouldNotifyForUnlock = new haxe_ds_StringMap();
	this.shouldNotifyForCategoryUnlock = new haxe_ds_StringMap();
	this.premiumBuildingsLimitedUnlocks = new haxe_ds_StringMap();
	this.explicityLocked = [];
	this.unlockedMaterials = [];
	var building = haxe_ds_StringMap.valueIterator(city.progress.resources.buildingInfo.h);
	while(building.hasNext()) {
		var building1 = building.next();
		var v = building1.unlockedByDefault && building1.knowledge == 0 ? progress_UnlockState.Researched : building1.unlockedByDefault ? progress_UnlockState.Unlocked : progress_UnlockState.Locked;
		this.unlockState.h["buildings." + building1.className] = v;
	}
	var buildingUpgrade = haxe_ds_StringMap.valueIterator(Resources.buildingUpgradesInfo.h);
	while(buildingUpgrade.hasNext()) {
		var buildingUpgrade1 = buildingUpgrade.next();
		var upgradeDefaultUnlocked = buildingUpgrade1.unlockedByDefault == null || buildingUpgrade1.unlockedByDefault;
		var v = upgradeDefaultUnlocked && buildingUpgrade1.knowledge == 0 ? progress_UnlockState.Researched : upgradeDefaultUnlocked ? progress_UnlockState.Unlocked : progress_UnlockState.Locked;
		this.unlockState.h["buildingUpgrades." + buildingUpgrade1.className] = v;
	}
	var cityUpgrade = haxe_ds_StringMap.valueIterator(Resources.cityUpgradesInfo.h);
	while(cityUpgrade.hasNext()) {
		var cityUpgrade1 = cityUpgrade.next();
		var upgradeDefaultUnlocked = cityUpgrade1.unlockedByDefault == null || cityUpgrade1.unlockedByDefault;
		var v = upgradeDefaultUnlocked ? progress_UnlockState.Unlocked : progress_UnlockState.Locked;
		this.unlockState.h["cityUpgrades." + cityUpgrade1.className] = v;
	}
	var policy = haxe_ds_StringMap.valueIterator(Resources.policiesInfo.h);
	while(policy.hasNext()) {
		var policy1 = policy.next();
		var upgradeDefaultUnlocked = policy1.unlockedByDefault == null || policy1.unlockedByDefault;
		var v = upgradeDefaultUnlocked ? progress_UnlockState.Unlocked : progress_UnlockState.Locked;
		this.unlockState.h["policies." + policy1.className] = v;
	}
	var _g = 0;
	var _g1 = Resources.worldResourcesInfo;
	while(_g < _g1.length) {
		var worldResourceInfo = _g1[_g];
		++_g;
		var upgradeDefaultUnlocked = worldResourceInfo.unlockedByDefault == null || worldResourceInfo.unlockedByDefault;
		var v = upgradeDefaultUnlocked ? progress_UnlockState.Unlocked : progress_UnlockState.Locked;
		this.unlockState.h["worldResources." + worldResourceInfo.className] = v;
	}
	var _g = 0;
	var _g1 = Resources.bridgesInfo;
	while(_g < _g1.length) {
		var bridge = _g1[_g];
		++_g;
		var v = progress_UnlockState.Locked;
		this.unlockState.h["miscCityElements." + bridge.className] = v;
	}
};
progress_Unlocks.__name__ = "progress.Unlocks";
progress_Unlocks.prototype = {
	saveForCitySwitch: function() {
		return { unlockState : this.unlockState, explicityLocked : this.explicityLocked, numberOfModernArtMuseumArtworksUnlocked : this.numberOfModernArtMuseumArtworksUnlocked, unlockedMaterials : this.unlockedMaterials};
	}
	,restoreFromCitySwitch: function(fromData) {
		this.unlockState = fromData.unlockState;
		this.explicityLocked = fromData.explicityLocked;
		this.numberOfModernArtMuseumArtworksUnlocked = fromData.numberOfModernArtMuseumArtworksUnlocked;
		this.unlockedMaterials = fromData.unlockedMaterials;
		this.city.gui.refreshCategoryBuildingsShown();
	}
	,postInitialCreate: function() {
		if(this.unlockMost) {
			var building = haxe_ds_StringMap.valueIterator(this.city.progress.resources.buildingInfo.h);
			while(building.hasNext()) {
				var building1 = building.next();
				var v = !building1.notUnlockedWithAll && building1.knowledge == 0 ? progress_UnlockState.Researched : !building1.notUnlockedWithAll ? progress_UnlockState.Createable : progress_UnlockState.Locked;
				this.unlockState.h["buildings." + building1.className] = v;
			}
			var buildingUpgrade = haxe_ds_StringMap.valueIterator(Resources.buildingUpgradesInfo.h);
			while(buildingUpgrade.hasNext()) {
				var buildingUpgrade1 = buildingUpgrade.next();
				var upgradeDefaultUnlocked = buildingUpgrade1.notUnlockedWithAll == null || !buildingUpgrade1.notUnlockedWithAll;
				var v = upgradeDefaultUnlocked && buildingUpgrade1.knowledge == 0 ? progress_UnlockState.Researched : upgradeDefaultUnlocked ? progress_UnlockState.Unlocked : progress_UnlockState.Locked;
				this.unlockState.h["buildingUpgrades." + buildingUpgrade1.className] = v;
			}
			var cityUpgrade = haxe_ds_StringMap.valueIterator(Resources.cityUpgradesInfo.h);
			while(cityUpgrade.hasNext()) {
				var cityUpgrade1 = cityUpgrade.next();
				var upgradeDefaultUnlocked = cityUpgrade1.notUnlockedWithAll == null || !cityUpgrade1.notUnlockedWithAll;
				var v = upgradeDefaultUnlocked ? progress_UnlockState.Unlocked : progress_UnlockState.Locked;
				this.unlockState.h["cityUpgrades." + cityUpgrade1.className] = v;
			}
			var policy = haxe_ds_StringMap.valueIterator(Resources.policiesInfo.h);
			while(policy.hasNext()) {
				var policy1 = policy.next();
				var upgradeDefaultUnlocked = policy1.notUnlockedWithAll == null || !policy1.notUnlockedWithAll;
				var v = upgradeDefaultUnlocked ? progress_UnlockState.Unlocked : progress_UnlockState.Locked;
				this.unlockState.h["policies." + policy1.className] = v;
			}
			var _g = 0;
			var _g1 = Resources.bridgesInfo;
			while(_g < _g1.length) {
				var bridge = _g1[_g];
				++_g;
				var v = progress_UnlockState.Createable;
				this.unlockState.h["miscCityElements." + bridge.className] = v;
			}
			this.unlockedMaterials.push("graphene");
			this.checkBuildRelatedUnlocks();
			this.city.gui.refreshCityInfo();
		}
	}
	,postLoad: function() {
		var building = haxe_ds_StringMap.valueIterator(this.city.progress.resources.buildingInfo.h);
		while(building.hasNext()) {
			var building1 = building.next();
			var key = "buildings." + building1.className;
			var needToUnlock = building1.unlockedByDefault && this.explicityLocked.indexOf(key) == -1;
			if(needToUnlock && building1.knowledge == 0) {
				var v = progress_UnlockState.Researched;
				this.unlockState.h[key] = v;
			} else if(needToUnlock && (this.unlockState.h[key] == null || this.unlockState.h[key] == progress_UnlockState.Locked)) {
				var v1 = progress_UnlockState.Unlocked;
				this.unlockState.h[key] = v1;
			} else if(this.unlockState.h[key] == null) {
				var v2 = progress_UnlockState.Locked;
				this.unlockState.h[key] = v2;
			}
		}
		var buildingUpgrade = haxe_ds_StringMap.valueIterator(Resources.buildingUpgradesInfo.h);
		while(buildingUpgrade.hasNext()) {
			var buildingUpgrade1 = buildingUpgrade.next();
			var key = "buildingUpgrades." + buildingUpgrade1.className;
			var upgradeDefaultUnlocked = (buildingUpgrade1.unlockedByDefault == null || buildingUpgrade1.unlockedByDefault) && this.explicityLocked.indexOf(key) == -1;
			if(upgradeDefaultUnlocked && buildingUpgrade1.knowledge == 0) {
				var v = progress_UnlockState.Researched;
				this.unlockState.h[key] = v;
			} else if(upgradeDefaultUnlocked && (this.unlockState.h[key] == null || this.unlockState.h[key] == progress_UnlockState.Locked)) {
				var v1 = progress_UnlockState.Unlocked;
				this.unlockState.h[key] = v1;
			} else if(this.unlockState.h[key] == null) {
				var v2 = progress_UnlockState.Locked;
				this.unlockState.h[key] = v2;
			}
		}
		var cityUpgrade = haxe_ds_StringMap.valueIterator(Resources.cityUpgradesInfo.h);
		while(cityUpgrade.hasNext()) {
			var cityUpgrade1 = cityUpgrade.next();
			var key = "cityUpgrades." + cityUpgrade1.className;
			var upgradeDefaultUnlocked = cityUpgrade1.unlockedByDefault == null || cityUpgrade1.unlockedByDefault;
			if(upgradeDefaultUnlocked && (this.unlockState.h[key] == null || this.unlockState.h[key] == progress_UnlockState.Locked)) {
				var v = progress_UnlockState.Unlocked;
				this.unlockState.h[key] = v;
			} else if(this.unlockState.h[key] == null) {
				var v1 = progress_UnlockState.Locked;
				this.unlockState.h[key] = v1;
			}
		}
		var policy = haxe_ds_StringMap.valueIterator(Resources.policiesInfo.h);
		while(policy.hasNext()) {
			var policy1 = policy.next();
			var key = "policies." + policy1.className;
			var upgradeDefaultUnlocked = policy1.unlockedByDefault == null || policy1.unlockedByDefault;
			if(upgradeDefaultUnlocked && (this.unlockState.h[key] == null || this.unlockState.h[key] == progress_UnlockState.Locked)) {
				var v = progress_UnlockState.Unlocked;
				this.unlockState.h[key] = v;
			} else if(this.unlockState.h[key] == null) {
				var v1 = progress_UnlockState.Locked;
				this.unlockState.h[key] = v1;
			}
		}
		var _g = 0;
		var _g1 = Resources.worldResourcesInfo;
		while(_g < _g1.length) {
			var worldResourceInfo = _g1[_g];
			++_g;
			if(this.unlockState.h["worldResources." + worldResourceInfo.className] == null) {
				var upgradeDefaultUnlocked = worldResourceInfo.unlockedByDefault == null || worldResourceInfo.unlockedByDefault;
				var v = upgradeDefaultUnlocked ? progress_UnlockState.Unlocked : progress_UnlockState.Locked;
				this.unlockState.h["worldResources." + worldResourceInfo.className] = v;
			}
		}
		if(this.unlockState.h["buildings.SpaceBallCourt"] != null) {
			var v = progress_UnlockState.Locked;
			this.unlockState.h["buildings.SpaceBallCourt"] = v;
		}
		if(this.unlockState.h["buildings.ClimbRock"] != null) {
			var v = progress_UnlockState.Locked;
			this.unlockState.h["buildings.ClimbRock"] = v;
		}
		this.lock(buildings_HauntedHovel);
		this.checkBuildRelatedUnlocks();
		this.city.gui.refreshCategoryBuildingsShown();
	}
	,lock: function(element) {
		var elementName = element.__name__;
		var v = progress_UnlockState.Locked;
		this.unlockState.h[elementName] = v;
		this.city.gui.refreshCategoryBuildingsShown();
		this.explicityLocked.push(elementName);
	}
	,unlock: function(element,dontReloadWindow,notifyIfNeeded) {
		if(notifyIfNeeded == null) {
			notifyIfNeeded = true;
		}
		if(dontReloadWindow == null) {
			dontReloadWindow = false;
		}
		var elementName = element.__name__;
		if(this.unlockState.h[elementName] == null || this.unlockState.h[elementName] == progress_UnlockState.Locked) {
			var elementInfo = this.city.progress.resources.buildingInfo.h[elementName];
			var elementIsBuilding = true;
			var elementIsBridge = false;
			if(elementInfo == null) {
				elementInfo = Resources.buildingUpgradesInfo.h[elementName];
				elementIsBuilding = false;
			}
			if(elementInfo == null) {
				elementInfo = Lambda.find(Resources.worldResourcesInfo,function(bi) {
					return "worldResources." + bi.className == elementName;
				});
				elementIsBuilding = false;
			}
			if(elementInfo == null) {
				elementInfo = Resources.cityUpgradesInfo.h[elementName];
			}
			if(elementInfo == null) {
				elementInfo = Lambda.find(Resources.bridgesInfo,function(bi) {
					return "miscCityElements." + bi.className == elementName;
				});
				elementIsBridge = true;
			}
			if(elementInfo == null) {
				elementInfo = Lambda.find(Resources.policiesInfo,function(po) {
					return "policies." + po.className == elementName;
				});
			}
			var v = elementInfo.knowledge == 0 && !elementIsBridge && (!elementIsBuilding || elementInfo.showUnlockHint == null && elementInfo.specialInfo.indexOf("premium") == -1) ? progress_UnlockState.Researched : progress_UnlockState.Unlocked;
			this.unlockState.h[elementName] = v;
			if(elementInfo.showUnlockHint == null && notifyIfNeeded) {
				this.notifyForUnlock(element);
			}
			this.city.gui.refreshCategoryBuildingsShown();
			if(!dontReloadWindow) {
				this.city.gui.reloadWindow();
			}
			this.checkBuildRelatedUnlocks();
			return true;
		}
		return false;
	}
	,removeUnlock: function(element) {
		var elementName = element.__name__;
		var v = progress_UnlockState.Locked;
		this.unlockState.h[elementName] = v;
	}
	,fullyUnlock: function(element) {
		var elementName = element.__name__;
		if(this.unlockState.h[elementName] == progress_UnlockState.Unlocked) {
			var v = progress_UnlockState.Createable;
			this.unlockState.h[elementName] = v;
			this.notifyForUnlock(element);
			this.city.gui.refreshCategoryBuildingsShown();
			this.city.gui.reloadWindow();
		}
	}
	,research: function(element,sendAnalytic) {
		if(sendAnalytic == null) {
			sendAnalytic = true;
		}
		var elementName = element.__name__;
		var originalState = this.unlockState.h[elementName];
		var v = progress_UnlockState.Researched;
		this.unlockState.h[elementName] = v;
		if(originalState == progress_UnlockState.Locked) {
			this.city.gui.refreshCategoryBuildingsShown();
		}
		if(sendAnalytic && originalState != progress_UnlockState.Researched) {
			Analytics.sendEvent("research",elementName);
			Analytics.sendEventFirebase("research","upgrade",elementName);
		}
	}
	,getUnlockState: function(element) {
		var elementName = element.__name__;
		return this.unlockState.h[elementName];
	}
	,getLimitedUnlockNumber: function(element) {
		if(Config.hasPremium()) {
			return null;
		}
		var elementName = element.__name__;
		return this.premiumBuildingsLimitedUnlocks.h[elementName];
	}
	,addLimitedUnlockNumber: function(element,numToAdd) {
		var elementName = element.__name__;
		if(this.premiumBuildingsLimitedUnlocks.h[elementName] == null) {
			this.premiumBuildingsLimitedUnlocks.h[elementName] = numToAdd;
		} else {
			var _g = elementName;
			var _g1 = this.premiumBuildingsLimitedUnlocks;
			var v = _g1.h[_g] + numToAdd;
			_g1.h[_g] = v;
		}
	}
	,getShouldNotifyForUnlock: function(element) {
		var elementName = element.__name__;
		var shouldNotifyForThis = this.shouldNotifyForUnlock.h[elementName];
		if(shouldNotifyForThis != null) {
			return shouldNotifyForThis;
		} else {
			return false;
		}
	}
	,notifyForUnlock: function(element) {
		var elementName = element.__name__;
		this.shouldNotifyForUnlock.h[elementName] = true;
		var elementInfo = this.city.progress.resources.buildingInfo.h[elementName];
		if(elementInfo != null) {
			if(elementInfo.specialInfo.indexOf("as_multi_decor") != -1) {
				this.shouldNotifyForUnlock.h[elementName] = false;
				return;
			}
			this.shouldNotifyForCategoryUnlock.h[elementInfo.category] = true;
		}
		var elementInfo = Lambda.find(Resources.bridgesInfo,function(bi) {
			return "miscCityElements." + bi.className == elementName;
		});
		if(elementInfo != null) {
			this.shouldNotifyForCategoryUnlock.h["Transportation"] = true;
		}
	}
	,stopNotifyForUnlock: function(element) {
		var elementName = element.__name__;
		this.shouldNotifyForUnlock.h[elementName] = false;
	}
	,stopAllNotifyForUnlock: function() {
		this.shouldNotifyForUnlock = new haxe_ds_StringMap();
		this.shouldNotifyForCategoryUnlock = new haxe_ds_StringMap();
	}
	,getShouldNotifyForCategoryUnlock: function(categoryName) {
		return this.shouldNotifyForCategoryUnlock.h[categoryName];
	}
	,stopNotifyCategoryUnlock: function(categoryName) {
		this.shouldNotifyForCategoryUnlock.h[categoryName] = false;
	}
	,getShouldNotifyForMiscUnlock: function(categoryName) {
		return this.shouldNotifyForUnlock.h[categoryName];
	}
	,stopNotifyMiscUnlock: function(categoryName) {
		this.shouldNotifyForUnlock.h[categoryName] = false;
	}
	,checkBuildRelatedUnlocksSoon: function() {
		this.checkBuildRelatedUnlocksIn = this.checkBuildRelatedUnlocksIn > 0 ? this.checkBuildRelatedUnlocksIn : 60;
	}
	,update: function(timeMod) {
		if(this.checkBuildRelatedUnlocksIn > 0) {
			this.checkBuildRelatedUnlocksIn -= timeMod;
			if(this.checkBuildRelatedUnlocksIn <= 0) {
				this.checkBuildRelatedUnlocks();
			}
		}
	}
	,checkBuildRelatedUnlocks: function() {
		var pmPerType = this.city.getAmountOfPermanentsPerType();
		var val1 = Object.prototype.hasOwnProperty.call(pmPerType.h,"buildings.SuperheatedRefinery") ? pmPerType.h["buildings.SuperheatedRefinery"] : 0;
		var val2 = Object.prototype.hasOwnProperty.call(pmPerType.h,"buildings.RefinedMetalFactory") ? pmPerType.h["buildings.RefinedMetalFactory"] : 0;
		var refinedMetalProductionBuildings = val2 > val1 ? val2 : val1;
		if(pmPerType.h["buildings.Park"] >= 5) {
			this.unlock(buildings_BotanicalGardens);
			if(pmPerType.h["buildings.Park"] >= 10 && pmPerType.h["buildings.Laboratory"] >= 5) {
				this.fullyUnlock(buildings_BotanicalGardens);
			}
		}
		if(pmPerType.h["buildings.ModernArtMuseum"] >= 3) {
			this.fullyUnlock(buildings_ArtColony);
		}
		if(this.unlockState.h["buildings.BotanicalGardens"] == progress_UnlockState.Researched || this.unlockState.h["buildings.BotanicalGardens"] == progress_UnlockState.Createable) {
			this.unlock(buildings_EcoFarm);
			if(pmPerType.h["buildings.BotanicalGardens"] >= 10 && pmPerType.h["buildings.ExperimentalFarm"] >= 1) {
				this.fullyUnlock(buildings_EcoFarm);
			}
			if(pmPerType.h["buildings.BotanicalGardens"] >= 50 && refinedMetalProductionBuildings >= 1) {
				this.unlock(buildings_BotanicalGardensDome);
			}
		}
		if(pmPerType.h["buildings.Laboratory"] >= 5 && refinedMetalProductionBuildings >= 1) {
			this.fullyUnlock(buildings_ComputerResearchCenter);
		}
		if(pmPerType.h["buildings.ComputerResearchCenter"] >= 1) {
			this.unlock(buildings_ComputerChipFactory);
		}
		if(pmPerType.h["buildings.MachinePartsFactory"] >= 3) {
			this.fullyUnlock(buildings_MechanicalHouse);
		}
		if(pmPerType.h["buildings.LivingResearchCenter"] >= 1) {
			this.fullyUnlock(buildings_CuttingEdgeHome);
			this.unlock(buildings_ParkPod);
			this.unlock(buildingUpgrades_ComfortableCouch);
			this.unlock(buildingUpgrades_SmartSpeaker);
		}
		if(pmPerType.h["buildings.ComputerChipFactory"] >= 1) {
			this.unlock(buildings_HackerHQ);
			if(pmPerType.h["buildings.Arcade"] >= 3) {
				this.fullyUnlock(buildings_HackerHQ);
			}
		}
		if(pmPerType.h["buildings.Pub"] >= 2) {
			this.unlock(buildings_Restaurant);
			if(pmPerType.h["buildings.Pub"] >= 5) {
				this.fullyUnlock(buildings_Restaurant);
				this.unlock(buildings_HerbGarden);
			}
		}
		if(pmPerType.h["buildings.Restaurant"] >= 2) {
			this.fullyUnlock(buildings_HerbGarden);
		}
		if(pmPerType.h["buildings.BlossomRestaurant"] >= 2) {
			this.unlock(buildings_BlossomHut);
			if(pmPerType.h["buildings.BlossomRestaurant"] >= 10) {
				this.fullyUnlock(buildings_BlossomHut);
			}
		}
		if(pmPerType.h["buildings.BlossomRestaurant"] + pmPerType.h["buildings.BlossomHut"] >= 15) {
			this.unlock(buildings_BlossomDome);
			if(pmPerType.h["buildings.BlossomRestaurant"] + pmPerType.h["buildings.BlossomHut"] >= 25) {
				this.fullyUnlock(buildings_BlossomDome);
			}
		}
		if(pmPerType.h["buildings.FarmByProductProcessor"] >= 10 && pmPerType.h["buildings.BotanicalGardens"] >= 200 && pmPerType.h["buildings.BlossomHut"] >= 50) {
			this.unlock(buildings_TreeHuggerBase);
		}
		if(refinedMetalProductionBuildings >= 1) {
			if(pmPerType.h["buildings.StoneMine"] >= 15 && pmPerType.h["buildings.StoneTeleporter"] >= 3) {
				this.fullyUnlock(buildings_StoneResearchCenter);
			}
		}
		if(pmPerType.h["buildings.MechanicalHouse"] >= 4 && refinedMetalProductionBuildings >= 3 && pmPerType.h["buildings.ComputerChipFactory"] >= 1 || pmPerType.h["buildings.RocketLaunchPlatform"] >= 1) {
			this.unlock(buildings_ExperimentationLab);
			if(pmPerType.h["buildings.MechanicalHouse"] >= 12 && refinedMetalProductionBuildings >= 10 && pmPerType.h["buildings.ComputerChipFactory"] >= 3 || pmPerType.h["buildings.RocketLaunchPlatform"] >= 1) {
				this.fullyUnlock(buildings_ExperimentationLab);
			}
		}
		if(pmPerType.h["buildings.TheMachine"] >= 1 && pmPerType.h["buildings.FestivalHQ"] >= 1) {
			this.unlock(buildings_FlowerPenthouse);
		}
		if(pmPerType.h["buildings.FarmHouse"] >= 20) {
			this.unlock(buildings_RedwoodTree);
			if(pmPerType.h["buildings.FarmHouse"] >= 40) {
				this.fullyUnlock(buildings_RedwoodTree);
			}
		}
		if(pmPerType.h["buildings.School"] >= 5 || pmPerType.h["buildings.HippieSchool"] >= 5) {
			this.unlock(buildings_Library);
		}
		if(pmPerType.h["buildings.StatueOfHappiness"] >= 1) {
			this.unlock(buildings_Beacon);
		}
		if(this.getUnlockState(buildings_BlossomHippieHQ) == progress_UnlockState.Unlocked) {
			if(pmPerType.h["buildings.BotanicalGardens"] >= 20) {
				var isOk = false;
				var _g = 0;
				var _g1 = this.city.permanents;
				while(_g < _g1.length) {
					var bld = _g1[_g];
					++_g;
					if(bld.is(buildings_BotanicalGardens)) {
						var grd = bld;
						if(grd.bottomBuilding == null || !grd.bottomBuilding.is(buildings_BotanicalGardens)) {
							var topBld = grd.topBuilding;
							var i = 1;
							while(topBld != null && topBld.is(buildings_BotanicalGardens)) {
								topBld = topBld.topBuilding;
								++i;
							}
							if(i >= 20) {
								isOk = true;
							}
						}
					}
				}
				if(isOk) {
					this.fullyUnlock(buildings_BlossomHippieHQ);
				}
			}
		}
		if(refinedMetalProductionBuildings >= 1) {
			if(Config.canHavePremium()) {
				this.unlock(buildings_LandingSiteTunnel);
				this.unlock(buildings_SpaceShipTunnel);
				this.unlock(miscCityElements_Bridge);
				if(Config.hasPremium()) {
					this.fullyUnlock(buildings_LandingSiteTunnel);
				}
				if(Config.hasPremium()) {
					this.fullyUnlock(buildings_SpaceShipTunnel);
				}
				if(Config.hasPremium()) {
					this.fullyUnlock(miscCityElements_Bridge);
				}
			}
		}
		if(pmPerType.h["buildings.ParkPod"] >= 2 && pmPerType.h["buildings.PondPark"] >= 20) {
			this.unlock(buildings_PondPod);
			if(Config.hasPremium()) {
				this.fullyUnlock(buildings_PondPod);
			}
		}
		if(pmPerType.h["buildings.ComputerChipFactory"] >= 1) {
			if(Config.canHavePremium()) {
				this.unlock(buildings_TrainStation);
				if(Config.hasPremium()) {
					this.fullyUnlock(buildings_TrainStation);
				}
			}
		}
		if(pmPerType.h["buildings.TrainStation"] >= 5) {
			if(Config.canHavePremium()) {
				this.unlock(buildings_TrainRail);
				if(Config.hasPremium() && pmPerType.h["buildings.TrainStation"] >= 10) {
					this.fullyUnlock(buildings_TrainRail);
				}
			}
		}
		if(pmPerType.h["buildings.HerbGarden"] >= 6 && refinedMetalProductionBuildings >= 1) {
			if(Config.canHavePremium()) {
				this.unlock(buildings_Aquarium);
				if(pmPerType.h["buildings.HerbGarden"] >= 12) {
					if(Config.hasPremium()) {
						this.fullyUnlock(buildings_Aquarium);
					}
				}
			}
		}
		if(pmPerType.h["buildings.EcoFarm"] >= 100) {
			if(Config.canHavePremium()) {
				this.unlock(buildings_TreePlantationDome);
				if(Config.hasPremium()) {
					this.fullyUnlock(buildings_TreePlantationDome);
				}
			}
		}
		if(pmPerType.h["buildings.ComputerChipFactory"] >= 5) {
			if(Config.canHavePremium()) {
				this.unlock(buildings_GrapheneLab);
				if(Config.hasPremium()) {
					this.fullyUnlock(buildings_GrapheneLab);
				}
			}
		}
		if(pmPerType.h["buildings.GrapheneLab"] >= 10) {
			if(Config.hasPremium()) {
				this.unlock(buildings_GrapheneFactory);
			}
		}
		if(pmPerType.h["buildings.GrapheneLab"] >= 1) {
			if(Config.canHavePremium()) {
				this.unlock(miscCityElements_ReinforcedBridge);
				this.unlock(buildings_RocketLaunchPlatform);
				this.unlock(buildings_SpecializedMedicalClinic);
				this.unlock(buildings_TechMuseum);
				this.unlock(buildings_FuturisticHome);
				if(pmPerType.h["buildings.BotanicalGardens"] >= 100) {
					this.unlock(miscCityElements_BotanicalBridge);
				}
				if(Config.hasPremium()) {
					this.fullyUnlock(buildings_FuturisticHome);
					this.fullyUnlock(miscCityElements_ReinforcedBridge);
					if(pmPerType.h["buildings.BotanicalGardens"] >= 100) {
						this.fullyUnlock(miscCityElements_BotanicalBridge);
					}
					this.fullyUnlock(buildings_SpecializedMedicalClinic);
					this.fullyUnlock(buildings_TechMuseum);
					this.fullyUnlock(buildings_RocketLaunchPlatform);
				}
			}
		}
		if(pmPerType.h["buildings.RocketLaunchPlatform"] >= 1) {
			if(Config.canHavePremium()) {
				this.unlock(buildings_RocketFuelFactory);
				if(Config.hasPremium()) {
					this.fullyUnlock(buildings_RocketFuelFactory);
				}
			}
		}
		if(pmPerType.h["buildings.RocketLaunchPlatform"] >= 1 && pmPerType.h["buildings.TheMachine"] >= 1 && pmPerType.h["buildings.FestivalHQ"] >= 1 && pmPerType.h["buildings.Misdirector"] >= 1) {
			if(Config.canHavePremium()) {
				this.unlock(buildings_FeatherAlliance);
				if(Config.hasPremium()) {
					this.fullyUnlock(buildings_FeatherAlliance);
				}
			}
		}
		if(pmPerType.h["buildings.LivingResearchCenter"] >= 1 && pmPerType.h["buildings.ArtColony"] >= 1 && pmPerType.h["buildings.ModernArtMuseum"] >= 10) {
			this.unlock(buildings_Loft);
		}
		if(pmPerType.h["buildings.OtherworldlyGardens"] >= 1) {
			this.unlock(buildings_OtherworldlyGardensDome);
		}
		if(Config.isSnowThemed) {
			if(pmPerType.h["buildings.Pub"] >= 3) {
				this.unlock(buildings_ChristmasMarket);
			}
			if(pmPerType.h["buildings.ChristmasMarket"] >= 1) {
				this.unlock(buildingUpgrades_MiniChristmasTree);
			}
			if(pmPerType.h["buildings.ChristmasMarket"] >= 3) {
				this.unlock(buildings_ChristmasTree);
			}
		} else if(this.city.progress.story.storyName != "snowWorld") {
			this.removeUnlock(buildings_ChristmasMarket);
			this.removeUnlock(buildingUpgrades_MiniChristmasTree);
			this.removeUnlock(buildings_ChristmasTree);
		}
		if(Config.isHalloweenThemed) {
			if(pmPerType.h["buildings.Arcade"] >= 3) {
				this.unlock(buildings_HorrorGameHall);
			}
			if(pmPerType.h["buildings.Park"] >= 2 || pmPerType.h["buildings.BotanicalGardens"] >= 2) {
				this.unlock(buildings_GhostlyPark);
			}
			if(pmPerType.h["buildings.GhostlyPark"] >= 1) {
				this.unlock(buildingUpgrades_Pumpkin);
			}
			if(pmPerType.h["buildings.GhostlyPark"] >= 5 && pmPerType.h["buildings.Laboratory"] >= 5 && pmPerType.h["buildings.ComputerChipFactory"] >= 1) {
				this.unlock(buildings_HauntedLaboratory);
			}
		} else {
			this.removeUnlock(buildings_HorrorGameHall);
			this.removeUnlock(buildingUpgrades_Pumpkin);
			this.removeUnlock(buildings_GhostlyPark);
			this.removeUnlock(buildings_HauntedLaboratory);
			this.removeUnlock(buildings_HauntedHovel);
		}
		if(!Game.isLoading) {
			if(pmPerType.h["buildings.Supercomputer"] >= 1 && pmPerType.h["buildings.Laboratory"] + pmPerType.h["buildings.ExperimentationLab"] >= 42) {
				common_Achievements.achieve("SUPERCOMPUTER_42");
			}
			if(pmPerType.h["buildings.Supercomputer"] >= 2) {
				common_Achievements.achieve("TWO_SUPERCOMPUTERS");
			}
		}
		modding_ModTools._checkBuildBasedUnlocks(this,pmPerType);
	}
	,unlockMaterial: function(matName) {
		if(this.unlockedMaterials.indexOf(matName) == -1) {
			this.unlockedMaterials.push(matName);
			this.city.gui.refreshCityInfo();
			if(matName == "graphene") {
				this.shouldNotifyForCategoryUnlock.h["Transportation"] = true;
				this.shouldNotifyForUnlock.h["FloatingPlatform"] = true;
			}
		}
	}
	,unlockedMaterial: function(matName) {
		if(matName == "wood" || matName == "stone" || matName == "knowledge" || matName == "machineParts" || matName == "refinedMetal" || matName == "computerChips" || matName == "food") {
			return true;
		}
		return this.unlockedMaterials.indexOf(matName) != -1;
	}
	,checkStatRelatedUnlocks: function() {
		if(this.city.simulation.stats.peopleWithHome >= 200) {
			this.fullyUnlock(buildings_LivingResearchCenter);
		}
		if(this.city.simulation.citizens.length >= 200) {
			this.fullyUnlock(buildings_HyperElevator);
		}
		if(this.city.simulation.happiness.happiness >= 99.99) {
			if(this.unlock(buildings_StatueOfHappiness)) {
				if(5 == 6) {
					PokiSDK.happyTime(1);
				}
			}
		}
		if(this.city.simulation.citizens.length >= 500 && this.city.teleporters.length > 1) {
			this.unlock(buildings_SecretSocietyHouse);
		}
		if(this.city.simulation.bonuses.fossilsCollected >= 5) {
			this.unlock(buildings_FossilMuseum);
		}
		if(this.city.simulation.citizens.length >= 750 && !this.city.progress.allCitiesInfo.betrayedHippies) {
			this.unlock(buildings_BlossomHippieHQ);
		}
		if(this.getUnlockState(buildings_Beacon) == progress_UnlockState.Unlocked) {
			if(this.city.simulation.happiness.fullHappinessTime >= 20160) {
				this.fullyUnlock(buildings_Beacon);
				console.log("FloatingSpaceCities/progress/Unlocks.hx:852:","beacon_unlocked");
			}
		}
		if(this.city.simulation.citizens.length >= 100 && this.city.workBuildings.length > 1) {
			this.unlock(buildings_CityHall);
		}
		if(this.getUnlockState(buildings_ChristmasTree) == progress_UnlockState.Unlocked) {
			if(this.city.simulation.happiness.happiness >= 59.99) {
				this.fullyUnlock(buildings_ChristmasTree);
			}
		}
		modding_ModTools._checkStatBasedUnlocks(this,this.city);
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(progress_Unlocks.saveDefinition);
		}
		queue.addString(haxe_Serializer.run(this.unlockState));
		queue.addString(haxe_Serializer.run(this.explicityLocked));
		var value = this.unlockedDecorationTab;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.unlockedBuildingModeButton;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.unlockedManagementOptions;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.numberOfModernArtMuseumArtworksUnlocked;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.unlockedCustomHouses;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		queue.addString(haxe_Serializer.run(this.unlockedMaterials));
		queue.addString(haxe_Serializer.run(this.premiumBuildingsLimitedUnlocks));
	}
	,load: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"unlockState")) {
			this.unlockState = loadMap.h["unlockState"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"explicityLocked")) {
			this.explicityLocked = loadMap.h["explicityLocked"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"unlockedDecorationTab")) {
			this.unlockedDecorationTab = loadMap.h["unlockedDecorationTab"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"unlockedBuildingModeButton")) {
			this.unlockedBuildingModeButton = loadMap.h["unlockedBuildingModeButton"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"unlockedManagementOptions")) {
			this.unlockedManagementOptions = loadMap.h["unlockedManagementOptions"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"numberOfModernArtMuseumArtworksUnlocked")) {
			this.numberOfModernArtMuseumArtworksUnlocked = loadMap.h["numberOfModernArtMuseumArtworksUnlocked"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"unlockedCustomHouses")) {
			this.unlockedCustomHouses = loadMap.h["unlockedCustomHouses"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"unlockedMaterials")) {
			this.unlockedMaterials = loadMap.h["unlockedMaterials"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"premiumBuildingsLimitedUnlocks")) {
			this.premiumBuildingsLimitedUnlocks = loadMap.h["premiumBuildingsLimitedUnlocks"];
		}
		this.postLoad();
	}
	,__class__: progress_Unlocks
};
