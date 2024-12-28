var buildings_Park = $hxClasses["buildings.Park"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.festivalJobs = 2;
	this.parkSprite = null;
	this.currentMainTexture = 0;
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.isEntertainment = true;
	this.parkTextures = Resources.getTexturesByWidth(this.get_myParkTextures(),20);
	this.currentTexture = random_Random.getInt(this.parkTextures.length - this.get_numberOfLockedParkTextures());
	this.parkSprite = new PIXI.Sprite(this.parkTextures[this.currentTexture]);
	this.parkSprite.position.set(position.x,position.y);
	bgStage.cacheableChildren.push(this.parkSprite);
	bgStage.isInvalid = true;
	this.adjecentBuildingEffects.push({ name : "modernRusticHomeCommunityFeeling", intensity : 1});
	this.festivalEntertainment = null;
};
buildings_Park.__name__ = "buildings.Park";
buildings_Park.__interfaces__ = [buildings_IBuildingWithFestivalSpecials,buildings_IEntertainmentBuilding];
buildings_Park.__super__ = Building;
buildings_Park.prototype = $extend(Building.prototype,{
	get_myParkTextures: function() {
		return "spr_park_plants";
	}
	,get_changePlantsText: function() {
		return common_Localize.lo("change_plants");
	}
	,get_baseEntertainmentCapacity: function() {
		return 30;
	}
	,get_isOpen: function() {
		var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
		if(this1 >= 6.0) {
			return this1 < 22;
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
		return 1.5;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 2.5;
	}
	,get_minimumEntertainmentGroupSatisfy: function() {
		return 1;
	}
	,get_maximumEntertainmentGroupSatisfy: function() {
		return 1.75;
	}
	,get_entertainmentQuality: function() {
		return 100;
	}
	,get_isOpenForExistingVisitors: function() {
		return this.get_isOpen();
	}
	,finishEntertainment: function(citizen,timeMod) {
		return true;
	}
	,get_drawerType: function() {
		return buildings_buildingDrawers_AutoMergingBuildingDrawer;
	}
	,get_numberOfLockedParkTextures: function() {
		if(Settings.hasSecretCode("orchid")) {
			return 0;
		} else {
			return 3;
		}
	}
	,get_canChangeBuildingColor: function() {
		return true;
	}
	,get_hiddenMainTexturesNum: function() {
		if(Config.isHalloweenThemed) {
			return 0;
		} else {
			return 1;
		}
	}
	,postLoad: function() {
		this.parkSprite.texture = this.parkTextures[this.currentTexture];
		this.bgStage.isInvalid = true;
		this.changeMainTexture(buildings_Park.mainTextures[this.currentMainTexture]);
	}
	,postCreate: function() {
		Building.prototype.postCreate.call(this);
		this.positionSprites();
	}
	,positionSprites: function() {
		Building.prototype.positionSprites.call(this);
		if(this.parkSprite != null) {
			this.parkSprite.position.set(this.position.x,this.position.y);
			this.bgStage.isInvalid = true;
		}
	}
	,beEntertained: function(citizen,timeMod) {
		buildings_buildingBehaviours_ParkWalk.beEntertainedPark(this.leftBuilding,this.rightBuilding,citizen);
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		if(this.get_canChangeBuildingColor()) {
			gui_windowParts_CycleValueButton.create(this.city.gui,function() {
				return _gthis.currentMainTexture;
			},function(t) {
				_gthis.currentMainTexture = t;
				_gthis.changeMainTexture(buildings_Park.mainTextures[_gthis.currentMainTexture]);
			},function() {
				return buildings_Park.mainTextures.length - _gthis.get_hiddenMainTexturesNum();
			},common_Localize.lo("change_building_color"));
		}
		if(this.get_changePlantsText() != "") {
			gui_windowParts_CycleValueButton.create(this.city.gui,function() {
				return _gthis.currentTexture;
			},function(t) {
				_gthis.currentTexture = t;
				_gthis.parkSprite.texture = _gthis.parkTextures[_gthis.currentTexture];
				_gthis.bgStage.isInvalid = true;
			},function() {
				return _gthis.parkTextures.length - _gthis.get_numberOfLockedParkTextures();
			},this.get_changePlantsText());
		}
		Building.prototype.createWindowAddBottomButtons.call(this);
	}
	,destroy: function() {
		Building.prototype.destroy.call(this);
		if(this.festivalEntertainment != null) {
			this.festivalEntertainment.destroy();
		}
		var _this = this.bgStage;
		var child = this.parkSprite;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
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
		this.festivalEntertainment.doFestivalWork(festival,citizen,timeMod,this.currentMainTexture,citizenID);
	}
	,beEntertainedFestival: function(festival,citizen,timeMod) {
		this.festivalEntertainment.beEntertainedFestival(festival,citizen,timeMod);
	}
	,endFestivalWork: function(festival,citizen) {
		citizen.setRelativeY(0);
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Building.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_Park.saveDefinition);
		}
		var value = this.currentTexture;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.currentMainTexture;
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentMainTexture")) {
			this.currentMainTexture = loadMap.h["currentMainTexture"];
		}
		this.postLoad();
	}
	,__class__: buildings_Park
});
