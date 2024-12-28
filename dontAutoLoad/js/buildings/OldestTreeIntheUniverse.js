var buildings_OldestTreeIntheUniverse = $hxClasses["buildings.OldestTreeIntheUniverse"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.totalExtraYears = 0;
	buildings_Park.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.currentTexture = 0;
	this.parkSprite.texture = this.parkTextures[this.currentTexture];
	this.totalExtraYears = 0;
};
buildings_OldestTreeIntheUniverse.__name__ = "buildings.OldestTreeIntheUniverse";
buildings_OldestTreeIntheUniverse.__super__ = buildings_Park;
buildings_OldestTreeIntheUniverse.prototype = $extend(buildings_Park.prototype,{
	get_myParkTextures: function() {
		return "spr_oldesttreeintheuniverse";
	}
	,get_changePlantsText: function() {
		return "";
	}
	,get_entertainmentType: function() {
		return 1;
	}
	,get_baseEntertainmentCapacity: function() {
		return 100;
	}
	,get_numberOfLockedParkTextures: function() {
		return 0;
	}
	,onBuild: function() {
		buildings_Park.prototype.onBuild.call(this);
		common_Achievements.achieve("OLDEST_TREE_IN_THE_UNIVERSE");
	}
	,beEntertained: function(citizen,timeMod) {
		if(!citizen.hasBuildingInited) {
			citizen.hasBuildingInited = true;
			citizen.dieAgeModifier += 0.02;
			this.totalExtraYears += 0.02;
		}
		buildings_buildingBehaviours_ParkWalk.beEntertainedPark(this.leftBuilding,this.rightBuilding,citizen);
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Park.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("total_extra_years",[_gthis.totalExtraYears | 0]);
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Park.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_OldestTreeIntheUniverse.saveDefinition);
		}
		var value = this.totalExtraYears;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		buildings_Park.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalExtraYears")) {
			this.totalExtraYears = loadMap.h["totalExtraYears"];
		}
	}
	,__class__: buildings_OldestTreeIntheUniverse
});
