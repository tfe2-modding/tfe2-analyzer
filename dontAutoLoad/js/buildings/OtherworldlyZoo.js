var buildings_OtherworldlyZoo = $hxClasses["buildings.OtherworldlyZoo"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.justBuilt = false;
	buildings_Park.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_OtherworldlyZoo.__name__ = "buildings.OtherworldlyZoo";
buildings_OtherworldlyZoo.__super__ = buildings_Park;
buildings_OtherworldlyZoo.prototype = $extend(buildings_Park.prototype,{
	get_myParkTextures: function() {
		return "spr_otherworld_plants";
	}
	,get_changePlantsText: function() {
		return common_Localize.lo("change_plants");
	}
	,get_entertainmentType: function() {
		return 1;
	}
	,get_baseEntertainmentCapacity: function() {
		return 35;
	}
	,get_numberOfLockedParkTextures: function() {
		return 0;
	}
	,onBuild: function() {
		buildings_Park.prototype.onBuild.call(this);
		this.justBuilt = true;
	}
	,postCreate: function() {
		buildings_Park.prototype.postCreate.call(this);
		if(this.justBuilt) {
			this.city.simulation.animals.animals.push(new simulation_Animal(this.city,this.city.aboveCitizensInBuildingStage,this,10,4));
			this.justBuilt = false;
		}
	}
	,createMainWindowPart: function() {
		var _gthis = this;
		buildings_Park.prototype.createMainWindowPart.call(this);
		var mission = this.city.progress.sideQuests.findSidequestWithType(progress_sidequests_HippieRarePlantsMission);
		var buildingType = buildings_RarePlantsPark;
		var title = common_Localize.lo("buildinginfo.json/RarePlantsPark.name");
		var description = common_Localize.lo("build_RarePlantsPark");
		if(mission != null) {
			gui_windowParts_CreateBuildingTransformButton.create(this.city,this,buildingType,title,description,function() {
				_gthis.city.progress.sideQuests.completeSidequest(mission);
			});
		} else {
			var mission2 = this.city.progress.sideQuests.findCompletedSidequestWithType(progress_sidequests_HippieRarePlantsMission);
			if(mission2 != null && this.city.getAmountOfPermanentsPerType().h["buildings.RarePlantsPark"] == 0) {
				gui_windowParts_CreateBuildingTransformButton.create(this.city,this,buildingType,title,description,function() {
				});
			}
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Park.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_OtherworldlyZoo.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_Park.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_OtherworldlyZoo
});
