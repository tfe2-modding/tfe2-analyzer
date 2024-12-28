var buildings_BotanicalGardens = $hxClasses["buildings.BotanicalGardens"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.justBuilt = false;
	this.hasBottomConnectedBuilding = false;
	this.festivalJobs = 2;
	this.currentTexture = 0;
	this.currentMainTexture = 0;
	this.gardenTextureSets = [2,3,2,4,2,2];
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.isEntertainment = true;
	this.currentTexture = 0;
	this.adjecentBuildingEffects.push({ name : "modernRusticHomeCommunityFeeling", intensity : 1});
};
buildings_BotanicalGardens.__name__ = "buildings.BotanicalGardens";
buildings_BotanicalGardens.__interfaces__ = [buildings_IBuildingWithFestivalSpecials,buildings_IEntertainmentBuilding];
buildings_BotanicalGardens.__super__ = Building;
buildings_BotanicalGardens.prototype = $extend(Building.prototype,{
	get_mainTextures: function() {
		return ["spr_botanicalgardens","spr_indoorpark","spr_indoorpark_alt1"];
	}
	,get_baseEntertainmentCapacity: function() {
		return 40;
	}
	,get_isOpen: function() {
		if(this.bottomBuilding == null || !this.buildingIsSimilar(this.bottomBuilding)) {
			var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
			if(this1 >= 6.0) {
				return this1 < 22;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	,get_entertainmentType: function() {
		return 1;
	}
	,get_secondaryEntertainmentTypes: function() {
		return null;
	}
	,get_minimumNormalTimeToSpend: function() {
		return 2.5;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 4;
	}
	,get_minimumEntertainmentGroupSatisfy: function() {
		return 1;
	}
	,get_maximumEntertainmentGroupSatisfy: function() {
		return 1.5;
	}
	,get_entertainmentQuality: function() {
		return 100;
	}
	,get_drawerType: function() {
		return buildings_buildingDrawers_AllDirMergingBuildingDrawer;
	}
	,get_mergingDrawer: function() {
		return this.drawer;
	}
	,get_walkThroughCanViewSelfInThisBuilding: function() {
		if(this.bottomBuilding != null) {
			return !this.buildingIsSimilar(this.bottomBuilding);
		} else {
			return true;
		}
	}
	,get_isOpenForExistingVisitors: function() {
		return this.get_isOpen();
	}
	,finishEntertainment: function(citizen,timeMod) {
		return true;
	}
	,get_myParkTextures: function() {
		return "spr_botanicalgardens_plants";
	}
	,postCreate: function() {
		Building.prototype.postCreate.call(this);
		this.updateGardenTexture();
		if(this.justBuilt) {
			var buildingToTakeTextureFrom = null;
			if(this.bottomBuilding != null && this.buildingIsSimilar(this.bottomBuilding)) {
				buildingToTakeTextureFrom = this.bottomBuilding;
			}
			if(this.topBuilding != null && this.buildingIsSimilar(this.topBuilding)) {
				buildingToTakeTextureFrom = this.topBuilding;
			}
			if(buildingToTakeTextureFrom != null) {
				this.get_mergingDrawer().setGroupOfSecondaryTextureForThisBuilding(this.get_mergingDrawer().getSecondaryTextureGroup(buildingToTakeTextureFrom.currentTexture));
			} else {
				this.currentTexture = random_Random.getInt(common_ArrayExtensions.isum(this.gardenTextureSets));
			}
			this.justBuilt = false;
			this.updateGardenTexture();
		}
		this.positionSprites();
	}
	,buildingIsSimilar: function(otherBuilding) {
		if(otherBuilding.is(buildings_OtherworldlyGardens)) {
			return false;
		}
		return otherBuilding.is(buildings_BotanicalGardens);
	}
	,postLoad: function() {
		this.updateGardenTexture();
		this.changeMainTexture(this.get_mainTextures()[this.currentMainTexture]);
	}
	,onBuild: function() {
		Building.prototype.onBuild.call(this);
		this.justBuilt = true;
	}
	,updateGardenTexture: function() {
		var _gthis = this;
		this.get_mergingDrawer().setSecondaryBackgroundImages(this.get_myParkTextures(),this.gardenTextureSets,this.currentTexture,function(n) {
			_gthis.currentTexture = n;
		});
	}
	,beEntertained: function(citizen,timeMod) {
		buildings_buildingBehaviours_ParkWalk.beEntertainedPark(this.leftBuilding,this.rightBuilding,citizen);
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		gui_windowParts_CycleValueButton.create(this.city.gui,function() {
			return _gthis.currentMainTexture;
		},function(t) {
			_gthis.currentMainTexture = t;
			_gthis.changeMainTexture(_gthis.get_mainTextures()[_gthis.currentMainTexture]);
		},function() {
			return _gthis.get_mainTextures().length;
		},common_Localize.lo("change_building_color"));
		gui_windowParts_CycleValueButton.create(this.city.gui,function() {
			return _gthis.get_mergingDrawer().getCurrentSecondaryTextureGroup();
		},($_=this.get_mergingDrawer(),$bind($_,$_.setGroupOfSecondaryTexture)),function() {
			return _gthis.gardenTextureSets.length;
		},common_Localize.lo("change_plants"));
		gui_windowParts_CycleValueButton.create(this.city.gui,function() {
			return _gthis.currentTexture - _gthis.get_mergingDrawer().getFirstSecondaryTextureOfGroup(_gthis.get_mergingDrawer().getCurrentSecondaryTextureGroup());
		},($_=this.get_mergingDrawer(),$bind($_,$_.setSecondaryTextureWithinGroup)),function() {
			return _gthis.gardenTextureSets[_gthis.get_mergingDrawer().getCurrentSecondaryTextureGroup()];
		},common_Localize.lo("change_plants_variant"));
		Building.prototype.createWindowAddBottomButtons.call(this);
	}
	,destroy: function() {
		Building.prototype.destroy.call(this);
		if(this.festivalEntertainment != null) {
			this.festivalEntertainment.destroy();
		}
	}
	,initFestival: function() {
		if(this.festivalEntertainment == null) {
			this.festivalEntertainment = new buildings_buildingBehaviours_ParkFestivalEntertainment(this,this.bgStage);
		}
	}
	,stopFestival: function() {
		if(this.festivalEntertainment != null) {
			this.festivalEntertainment.stop();
			this.festivalEntertainment.destroy();
			this.festivalEntertainment = null;
		}
	}
	,doFestivalWork: function(festival,citizen,timeMod,citizenID) {
		this.festivalEntertainment.doFestivalWork(festival,citizen,timeMod,0,citizenID);
	}
	,beEntertainedFestival: function(festival,citizen,timeMod) {
		this.festivalEntertainment.beEntertainedFestival(festival,citizen,timeMod);
	}
	,endFestivalWork: function(festival,citizen) {
		citizen.setRelativeY(0);
	}
	,isTree: function() {
		if(this.currentTexture >= 7) {
			return this.currentTexture <= 10;
		} else {
			return false;
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Building.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_BotanicalGardens.saveDefinition);
		}
		var value = this.currentMainTexture;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.currentTexture;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue,definition) {
		Building.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentMainTexture")) {
			this.currentMainTexture = loadMap.h["currentMainTexture"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentTexture")) {
			this.currentTexture = loadMap.h["currentTexture"];
		}
		this.postLoad();
	}
	,__class__: buildings_BotanicalGardens
});
