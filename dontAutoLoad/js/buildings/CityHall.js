var buildings_CityHall = $hxClasses["buildings.CityHall"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.totalKnowledgeGenerated = 0;
	this.bldMode = 0;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_CityHall.__name__ = "buildings.CityHall";
buildings_CityHall.sanitizeCityName = function(origName) {
	return HxOverrides.substr(origName,0,1000);
};
buildings_CityHall.__super__ = buildings_Work;
buildings_CityHall.prototype = $extend(buildings_Work.prototype,{
	get_possiblePolicies: function() {
		return [policies_FoodRationing,policies_SmallerClasses,policies_MandatoryOvertime,policies_HippieLifestyle];
	}
	,get_possibleBuildingModes: function() {
		return [buildingUpgrades_CensusData,buildingUpgrades_NightMayor];
	}
	,postCreate: function() {
		if(this.buildingMode == null && this.get_possibleBuildingModes().length > 0) {
			this.buildingMode = Type.createInstance(this.get_possibleBuildingModes()[0],[this.stage,this.city.cityMidStage,this.bgStage,this]);
		}
	}
	,destroy: function() {
		buildings_Work.prototype.destroy.call(this);
		this.city.upgrades.vars.nightClubEntertainmentQualityBonus = 0;
	}
	,update: function(timeMod) {
		buildings_Work.prototype.update.call(this,timeMod);
		this.city.upgrades.vars.nightClubEntertainmentQualityBonus = 0;
		if(this.bldMode == 0) {
			var thisKnowledgeProd = this.workers.length * this.city.simulation.citizens.length * timeMod * 0.0000005;
			this.city.materials.knowledge += thisKnowledgeProd;
			this.city.simulation.stats.materialProduction[10][0] += thisKnowledgeProd;
			this.totalKnowledgeGenerated += thisKnowledgeProd;
		} else if(this.bldMode == 1) {
			this.city.upgrades.vars.nightClubEntertainmentQualityBonus = this.workers.length * 2;
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
		}
		var rnd = random_Random.getInt(7);
		if(citizen.relativeY < 5) {
			if(rnd < 3) {
				citizen.changeFloorAndWaitRandom(20,30);
			} else if(rnd < 5) {
				citizen.moveAndWait(random_Random.getInt(3,7),random_Random.getInt(90,180),null,false,false);
			} else {
				citizen.moveAndWait(random_Random.getInt(12,15),random_Random.getInt(90,180),null,false,false);
			}
		} else if(rnd < 1) {
			citizen.changeFloorAndWaitRandom(20,30);
		} else if(rnd < 3) {
			citizen.moveAndWait(random_Random.getInt(3,4),random_Random.getInt(90,180),null,false,false);
		} else if(rnd < 5) {
			citizen.moveAndWait(random_Random.getInt(9,10),random_Random.getInt(90,180),null,false,false);
		} else {
			citizen.moveAndWait(random_Random.getInt(15,16),random_Random.getInt(90,180),null,false,false);
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Work.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("knowledge_gathered",[_gthis.totalKnowledgeGenerated | 0]);
		});
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		gui_CheckboxButton.createSettingButton(this.city.gui,this.city.gui.innerWindowStage,this.city.gui.windowInner,function() {
			_gthis.city.simulation.happiness.ignoreUnhappyCitizens = !_gthis.city.simulation.happiness.ignoreUnhappyCitizens;
		},function() {
			return _gthis.city.simulation.happiness.ignoreUnhappyCitizens;
		},common_Localize.lo("ignore_unhappy_citizens"));
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,4)));
		gui_UpgradeWindowParts.createHeader(this.city.gui,common_Localize.lo("city_name"));
		this.city.gui.windowInner.addChild(new gui_TextElementAlt(this.city.gui.windowInner,this.city.gui.innerWindowStage,null,function() {
			if(_gthis.city.cityName == "") {
				return common_Localize.lo("unnamed_city");
			}
			return _gthis.city.cityName;
		},"Arial, sans-serif",null,300,null,15));
		var button = gui_windowParts_FullSizeTextButton.create(this.city.gui,function() {
			if(5 == 8 || _gthis.game.isMobile) {
				var inp = window.prompt(common_Localize.lo("give_city_name"),_gthis.city.cityName);
				if(inp != null) {
					_gthis.city.cityName = buildings_CityHall.sanitizeCityName(inp);
				}
			} else {
				gui_ChangeCityNameWindow.createWindow(_gthis.city);
			}
		},this.city.gui.windowInner,function() {
			return common_Localize.lo("change_city_name");
		},this.city.gui.innerWindowStage);
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,4)));
		buildings_Work.prototype.createWindowAddBottomButtons.call(this);
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_CityHall.saveDefinition);
		}
		var value = this.totalKnowledgeGenerated;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		buildings_Work.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalKnowledgeGenerated")) {
			this.totalKnowledgeGenerated = loadMap.h["totalKnowledgeGenerated"];
		}
	}
	,__class__: buildings_CityHall
});
