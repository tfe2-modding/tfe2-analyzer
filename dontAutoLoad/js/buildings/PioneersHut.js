var buildings_PioneersHut = $hxClasses["buildings.PioneersHut"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.lastMeditationDay = 0;
	this.lastUpgradeTime = -1000;
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_PioneersHut.__name__ = "buildings.PioneersHut";
buildings_PioneersHut.allUpgradesDoPermanentEffects = function(city,upgrades) {
	var _g = 0;
	while(_g < upgrades.length) {
		var upgrade = upgrades[_g];
		++_g;
		buildings_PioneersHut.upgradeDoPermanentEffects(city,upgrade);
	}
};
buildings_PioneersHut.upgradeHasPermanentEffect = function(upgrade) {
	if(upgrade != "inspirationalMeeting" && upgrade != "motivationalMeeting" && upgrade != "inspirationalMeeting2" && upgrade != "motivationalMeeting2") {
		return upgrade != "overwork";
	} else {
		return false;
	}
};
buildings_PioneersHut.upgradeDoPermanentEffects = function(city,upgrade) {
	switch(upgrade) {
	case "comfortableHouses":
		city.progress.resources.buildingInfo.h["buildings.NormalHouse"].quality += 5;
		break;
	case "forestry":
		city.upgrades.vars.forestRegrowSpeedMod += 0.5;
		break;
	case "hippieSchoolRedesign":
		city.progress.resources.buildingInfo.h["buildings.HippieSchool"].wood -= 10;
		break;
	case "quicklyBuiltHouses":
		city.progress.resources.buildingInfo.h["buildings.NormalHouse"].wood -= 1;
		city.progress.resources.buildingInfo.h["buildings.NormalHouse"].stone -= 1;
		break;
	case "schoolRedesign":
		city.progress.resources.buildingInfo.h["buildings.School"].wood -= 10;
		break;
	}
};
buildings_PioneersHut.__super__ = buildings_House;
buildings_PioneersHut.prototype = $extend(buildings_House.prototype,{
	get_possibleUpgrades: function() {
		return [buildingUpgrades_PioneersHutUpgrade];
	}
	,onBuild: function() {
		buildings_House.prototype.onBuild.call(this);
		var nextUpgrades = this.getNextUpgrades();
		if(nextUpgrades.length > 0 && nextUpgrades[0] != "inspirationalMeeting") {
			this.lastUpgradeTime = this.city.simulation.time.timeSinceStart;
		}
	}
	,postCreate: function() {
		if(this.city.simulation.bonuses.chosenEarlyGameUpgrades.indexOf("partyCity") != -1) {
			this.city.progress.unlocks.unlock(buildings_PartyHouse);
		}
	}
	,destroy: function() {
		buildings_House.prototype.destroy.call(this);
		if(this.highlightSprite != null) {
			this.highlightSprite.destroy();
			this.highlightSprite = null;
		}
	}
	,update: function(timeMod) {
		buildings_House.prototype.update.call(this,timeMod);
		if(this.getNextUpgrades().length > 0 && this.canDoNextUpgrades()) {
			if(this.highlightSprite == null) {
				this.highlightSprite = new PIXI.Sprite(Resources.getTexture("spr_whiteoutline"));
				this.highlightSprite.position.set(this.position.x - 1,this.position.y - 1);
				this.city.farForegroundStage.addChild(this.highlightSprite);
				var this1 = [89,1,0.77];
				var tmp = thx_color_Hsv.toRgb(this1);
				this.highlightSprite.tint = common_ColorExtensions.toHexInt(tmp);
			}
			this.highlightSprite.alpha = (Math.sin(this.city.gui.guiTimer / 10) + 1) / 2;
		} else if(this.highlightSprite != null) {
			this.highlightSprite.destroy();
			this.highlightSprite = null;
		}
		if(1 + ((this.city.simulation.time.timeSinceStart | 0) / 1440 | 0) > this.lastMeditationDay && this.city.simulation.bonuses.chosenEarlyGameUpgrades.indexOf("meditation") != -1) {
			this.city.materials.knowledge += 1;
			this.city.simulation.stats.materialProduction[10][0] += 1;
			this.lastMeditationDay = 1 + ((this.city.simulation.time.timeSinceStart | 0) / 1440 | 0);
		}
		if(this.city.materials.wood < 20 && this.city.simulation.bonuses.chosenEarlyGameUpgrades.indexOf("collectBranches") != -1) {
			var productionAmount = 0.01 * timeMod;
			this.city.materials.wood += productionAmount;
			this.city.simulation.stats.materialProduction[1][0] += productionAmount;
		}
	}
	,createMainWindowPart: function() {
		var _gthis = this;
		buildings_House.prototype.createMainWindowPart.call(this);
		var gui = this.city.gui;
		var nextUpgrades = this.getNextUpgrades();
		if(nextUpgrades.length > 0) {
			gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
			gui.windowAddInfoText(common_Localize.lo("bonuses"),null,"Arial15");
			if(this.canDoNextUpgrades()) {
				gui.windowAddInfoText(this.city.simulation.bonuses.chosenEarlyGameUpgrades.length == 8 ? common_Localize.lo("final_bonus") : common_Localize.lo("choose_bonus"));
				var _g = 0;
				while(_g < nextUpgrades.length) {
					var up = nextUpgrades[_g];
					++_g;
					var up2 = [up];
					this.windowAddBonus(gui,gui.windowInner,common_Localize.lo("pioneershut_" + up2[0] + ".name"),common_Localize.lo("pioneershut_" + up2[0] + ".description"),(function(up2) {
						return function() {
							_gthis.performUpgrade(up2[0]);
						};
					})(up2));
				}
			} else {
				gui.windowAddInfoText(common_Localize.lo("pioneershut_morebonuses"));
			}
		}
		var theseUpgrades = this.city.simulation.bonuses.chosenEarlyGameUpgrades;
		var _g = [];
		var _g1 = 0;
		var _g2 = theseUpgrades;
		while(_g1 < _g2.length) {
			var v = _g2[_g1];
			++_g1;
			if(buildings_PioneersHut.upgradeHasPermanentEffect(v)) {
				_g.push(v);
			}
		}
		var permanentEffects = _g;
		if(permanentEffects.length > 0) {
			gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
			gui.windowAddInfoText(common_Localize.lo("permanent_bonus_effects"),null,"Arial15");
			var _g = 0;
			while(_g < permanentEffects.length) {
				var up = permanentEffects[_g];
				++_g;
				gui.windowAddInfoText(common_Localize.lo("pioneershut_" + up + ".name") + ": " + common_Localize.lo("pioneershut_" + up + ".description"));
			}
		}
	}
	,performUpgrade: function(upgrade) {
		this.lastUpgradeTime = this.city.simulation.time.timeSinceStart;
		switch(upgrade) {
		case "inspirationalMeeting":
			this.city.materials.knowledge += 3;
			break;
		case "inspirationalMeeting2":
			this.city.materials.knowledge += 500;
			break;
		case "motivationalMeeting":
			this.city.simulation.happiness.addBoost(simulation_HappinessBoost.withDuration(this.city.simulation.time,1440,15,common_Localize.lo("movivational_meeting_bonus")));
			break;
		case "motivationalMeeting2":
			this.city.simulation.happiness.addBoost(simulation_HappinessBoost.withDuration(this.city.simulation.time,10080,20,common_Localize.lo("movivational_meeting_bonus")));
			break;
		case "naturalCity":
			this.city.progress.unlocks.unlock(buildings_PondPark);
			break;
		case "overwork":
			this.city.materials.stone += common_ArrayExtensions.sum(this.city.permanents,function(pm) {
				if(pm.is(buildings_StoneMine)) {
					return pm.workers.length;
				}
				return 0;
			});
			break;
		case "partyCity":
			this.city.progress.unlocks.unlock(buildings_PartyHouse);
			break;
		case "productiveCity":
			this.city.progress.unlocks.unlock(buildings_SuperheatedRefinery);
			break;
		case "sportyCity":
			this.city.progress.unlocks.unlock(buildings_SportPark);
			break;
		case "standardization":
			var _g = 0;
			var _g1 = this.city.permanents;
			while(_g < _g1.length) {
				var bld = _g1[_g];
				++_g;
				if(bld.is(buildings_StoneMine)) {
					var mine = bld;
					if(!common_ArrayExtensions.any(mine.upgrades,function(up) {
						return ((up) instanceof buildingUpgrades_BetterPickaxes);
					})) {
						mine.upgrades.push(Type.createInstance(buildingUpgrades_BetterPickaxes,[mine.stage,this.city.cityMidStage,mine.bgStage,mine]));
					}
				}
			}
			break;
		}
		buildings_PioneersHut.upgradeDoPermanentEffects(this.city,upgrade);
		this.city.simulation.bonuses.chosenEarlyGameUpgrades.push(upgrade);
		var otherUpgradeText = "";
		if(this.getNextUpgrades().length > 0) {
			otherUpgradeText = " " + common_Localize.lo("pioneers_upgrade_later");
		}
		this.city.gui.showSimpleWindow(common_Localize.lo("pioneers_upgrade_applied") + otherUpgradeText,null,true);
	}
	,canDoNextUpgrades: function() {
		if(this.city.simulation.time.timeSinceStart < this.lastUpgradeTime + 4320) {
			return false;
		}
		if(this.getNextUpgrades().length == 0) {
			return false;
		}
		if(this.getNextUpgrades()[0] == "knowledgeSharing" && (this.city.progress.unlocks.getUnlockState(buildings_ExperimentalFarm) == progress_UnlockState.Locked || this.city.progress.unlocks.getUnlockState(buildings_Workshop) == progress_UnlockState.Locked)) {
			return false;
		}
		var tmp = this.city.simulation.bonuses.chosenEarlyGameUpgrades.length == 8 && this.city.progress.unlocks.getUnlockState(buildings_RefinedMetalFactory) != progress_UnlockState.Researched;
		return true;
	}
	,getNextUpgrades: function() {
		switch(this.city.simulation.bonuses.chosenEarlyGameUpgrades.length) {
		case 0:
			return ["inspirationalMeeting","motivationalMeeting"];
		case 1:
			return ["quicklyBuiltHouses","comfortableHouses"];
		case 2:
			return ["efficientExploration","carefulExploration"];
		case 3:
			return ["emergencySupplies",this.city.progress.ruleset == progress_Ruleset.HippieCity ? "hippieSchoolRedesign" : "schoolRedesign"];
		case 4:
			return ["meditation","overwork"];
		case 5:
			return ["knowledgeSharing","recyclingDrive"];
		case 6:
			return ["shadowDay","collectBranches"];
		case 7:
			return [this.city.progress.ruleset == progress_Ruleset.HippieCity ? "communalHousing" : "forestry","standardization"];
		case 8:
			var upg = [];
			if(this.city.progress.unlocks.getUnlockState(buildings_SportPark) == progress_UnlockState.Locked) {
				upg.push("sportyCity");
			}
			if(this.city.progress.unlocks.getUnlockState(buildings_PondPark) == progress_UnlockState.Locked) {
				upg.push("naturalCity");
			}
			if(this.city.progress.unlocks.getUnlockState(buildings_SuperheatedRefinery) == progress_UnlockState.Locked) {
				upg.push("productiveCity");
			}
			if(this.city.progress.unlocks.getUnlockState(buildings_PartyHouse) == progress_UnlockState.Locked) {
				upg.push("partyCity");
			}
			if(upg.length == 0) {
				upg.push("inspirationalMeeting2");
				upg.push("motivationalMeeting2");
			}
			return upg;
		default:
			return [];
		}
	}
	,windowAddBonus: function(gui,addToContainer,name,description,onClick) {
		var containerButton = new gui_ContainerButton(gui,gui.innerWindowStage,addToContainer,onClick);
		var infoContainer = containerButton.container;
		addToContainer.addChild(containerButton);
		infoContainer.padding.top = 3;
		infoContainer.padding.left = 3;
		infoContainer.padding.right = 3;
		infoContainer.padding.bottom = 1;
		infoContainer.fillSecondarySize = true;
		infoContainer.direction = gui_GUIContainerDirection.Vertical;
		var nameElement = infoContainer.addChild(new gui_TextElement(infoContainer,gui.innerWindowStage,name));
		var descriptionElement = null;
		if(description != "") {
			descriptionElement = infoContainer.addChild(new gui_TextElement(infoContainer,gui.innerWindowStage,description,null,"Arial10"));
		}
		addToContainer.addChild(new gui_GUISpacing(addToContainer,new common_Point(2,2)));
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_House.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_PioneersHut.saveDefinition);
		}
		var value = this.lastUpgradeTime;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.lastMeditationDay;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue,definition) {
		buildings_House.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"lastUpgradeTime")) {
			this.lastUpgradeTime = loadMap.h["lastUpgradeTime"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"lastMeditationDay")) {
			this.lastMeditationDay = loadMap.h["lastMeditationDay"];
		}
	}
	,__class__: buildings_PioneersHut
});
