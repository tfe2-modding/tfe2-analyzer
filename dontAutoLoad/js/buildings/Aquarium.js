var buildings_Aquarium = $hxClasses["buildings.Aquarium"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.justBuilt = false;
	this.citizenDivingTextures = null;
	this.currentTexture = 0;
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.isEntertainment = true;
	this.currentTexture = 0;
	this.adjecentBuildingEffects.push({ name : "modernRusticHomeCommunityFeeling", intensity : 1});
	this.leftIsWaterFilled = false;
	this.rightIsWaterFilled = false;
	this.topIsWaterFilled = false;
	this.bottomIsWaterFilled = false;
};
buildings_Aquarium.__name__ = "buildings.Aquarium";
buildings_Aquarium.__interfaces__ = [buildings_IWaterFilled,buildings_IEntertainmentBuilding];
buildings_Aquarium.__super__ = Building;
buildings_Aquarium.prototype = $extend(Building.prototype,{
	get_baseEntertainmentCapacity: function() {
		return 50;
	}
	,get_isOpen: function() {
		return false;
	}
	,get_entertainmentType: function() {
		return 1;
	}
	,get_secondaryEntertainmentTypes: function() {
		return null;
	}
	,get_minimumNormalTimeToSpend: function() {
		return 3;
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
		return false;
	}
	,get_hasLeftAquarium: function() {
		if(this.leftBuilding != null) {
			return this.leftBuilding.is(buildings_Aquarium);
		} else {
			return false;
		}
	}
	,get_hasRightAquarium: function() {
		if(this.rightBuilding != null) {
			return this.rightBuilding.is(buildings_Aquarium);
		} else {
			return false;
		}
	}
	,get_hasTopAquarium: function() {
		if(this.topBuilding != null) {
			return this.topBuilding.is(buildings_Aquarium);
		} else {
			return false;
		}
	}
	,get_hasBottomAquarium: function() {
		if(this.bottomBuilding != null) {
			return this.bottomBuilding.is(buildings_Aquarium);
		} else {
			return false;
		}
	}
	,get_isOpenForExistingVisitors: function() {
		return this.get_isOpen();
	}
	,finishEntertainment: function(citizen,timeMod) {
		return true;
	}
	,postCreate: function() {
		Building.prototype.postCreate.call(this);
		this.updateGardenTexture();
		if(this.justBuilt) {
			var buildingToTakeTextureFrom = null;
			if(this.bottomBuilding != null && this.bottomBuilding.is(buildings_Aquarium)) {
				buildingToTakeTextureFrom = this.bottomBuilding;
			}
			if(this.topBuilding != null && this.topBuilding.is(buildings_Aquarium)) {
				buildingToTakeTextureFrom = this.topBuilding;
			}
			if(buildingToTakeTextureFrom != null) {
				this.get_mergingDrawer().setGroupOfSecondaryTextureForThisBuilding(this.get_mergingDrawer().getSecondaryTextureGroup(buildingToTakeTextureFrom.currentTexture));
			} else {
				this.currentTexture = random_Random.getInt(common_ArrayExtensions.isum(buildings_Aquarium.gardenTextureSets));
			}
			this.justBuilt = false;
			this.city.simulation.fishes.fishes.push(new simulation_Fish(this.city,this.city.aboveCitizensInBuildingStage,this,10,11));
			this.city.simulation.fishes.fishes.push(new simulation_Fish(this.city,this.city.aboveCitizensInBuildingStage,this,10,14));
			this.city.simulation.fishes.fishes.push(new simulation_Fish(this.city,this.city.aboveCitizensInBuildingStage,this,10,6));
			this.updateGardenTexture();
		}
		this.positionSprites();
	}
	,destroy: function() {
		Building.prototype.destroy.call(this);
		var fishes = this.city.simulation.fishes.fishes;
		var i = fishes.length;
		while(--i >= 0) if(fishes[i].inPermanent == this) {
			fishes[i].destroy();
		}
	}
	,onCityChange: function() {
		this.leftIsWaterFilled = this.leftBuilding != null && js_Boot.__implements(this.leftBuilding,buildings_IWaterFilled);
		this.rightIsWaterFilled = this.rightBuilding != null && js_Boot.__implements(this.rightBuilding,buildings_IWaterFilled);
		this.topIsWaterFilled = this.topBuilding != null && ((this.topBuilding) instanceof buildings_Aquarium);
		this.bottomIsWaterFilled = this.bottomBuilding != null && ((this.bottomBuilding) instanceof buildings_Aquarium);
		if(this.leftIsWaterFilled) {
			this.leftAsWaterFilled = this.leftBuilding;
		} else {
			this.leftAsWaterFilled = null;
		}
		if(this.rightIsWaterFilled) {
			this.rightAsWaterFilled = this.rightBuilding;
		} else {
			this.rightAsWaterFilled = null;
		}
		if(this.topIsWaterFilled) {
			this.topAsWaterFilled = this.topBuilding;
		} else {
			this.topAsWaterFilled = null;
		}
		if(this.bottomIsWaterFilled) {
			this.bottomAsWaterFilled = this.bottomBuilding;
		} else {
			this.bottomAsWaterFilled = null;
		}
	}
	,postLoad: function() {
		this.updateGardenTexture();
	}
	,onBuild: function() {
		Building.prototype.onBuild.call(this);
		this.justBuilt = true;
	}
	,updateGardenTexture: function() {
		var _gthis = this;
		this.get_mergingDrawer().setSecondaryBackgroundImages("spr_aquarium_plants",buildings_Aquarium.gardenTextureSets,this.currentTexture,function(n) {
			_gthis.currentTexture = n;
		});
	}
	,beEntertained: function(citizen,timeMod) {
		return;
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		gui_windowParts_CycleValueButton.create(this.city.gui,function() {
			return _gthis.get_mergingDrawer().getCurrentSecondaryTextureGroup();
		},($_=this.get_mergingDrawer(),$bind($_,$_.setGroupOfSecondaryTexture)),function() {
			return buildings_Aquarium.gardenTextureSets.length;
		},common_Localize.lo("change_plants"));
		gui_windowParts_CycleValueButton.create(this.city.gui,function() {
			return _gthis.currentTexture - _gthis.get_mergingDrawer().getFirstSecondaryTextureOfGroup(_gthis.get_mergingDrawer().getCurrentSecondaryTextureGroup());
		},($_=this.get_mergingDrawer(),$bind($_,$_.setSecondaryTextureWithinGroup)),function() {
			return buildings_Aquarium.gardenTextureSets[_gthis.get_mergingDrawer().getCurrentSecondaryTextureGroup()];
		},common_Localize.lo("change_plants_variant"));
		Building.prototype.createWindowAddBottomButtons.call(this);
	}
	,onCitizenLeave: function(citizen,newPermanent) {
		if(newPermanent == null || !newPermanent.is(buildings_Aquarium)) {
			citizen.dynamicUnsavedVars.buildingInited = null;
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Building.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_Aquarium.saveDefinition);
		}
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentTexture")) {
			this.currentTexture = loadMap.h["currentTexture"];
		}
		this.postLoad();
	}
	,__class__: buildings_Aquarium
});
