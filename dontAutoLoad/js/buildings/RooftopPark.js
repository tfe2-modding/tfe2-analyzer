var buildings_RooftopPark = $hxClasses["buildings.RooftopPark"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.parkSprite = null;
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.isEntertainment = true;
	this.parkTextures = Resources.getTexturesByWidth(this.get_myParkTextures(),20);
	this.currentTexture = random_Random.getInt(this.parkTextures.length);
	this.parkSprite = new PIXI.Sprite(this.parkTextures[this.currentTexture]);
	this.parkSprite.position.set(position.x,position.y);
	bgStage.cacheableChildren.push(this.parkSprite);
	bgStage.isInvalid = true;
	this.adjecentBuildingEffects.push({ name : "modernRusticHomeCommunityFeeling", intensity : 1});
};
buildings_RooftopPark.__name__ = "buildings.RooftopPark";
buildings_RooftopPark.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_RooftopPark.__super__ = Building;
buildings_RooftopPark.prototype = $extend(Building.prototype,{
	get_myParkTextures: function() {
		return "spr_rooftoppark_plants";
	}
	,get_changePlantsText: function() {
		return common_Localize.lo("change_plants");
	}
	,get_baseEntertainmentCapacity: function() {
		return 35;
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
		return buildings_buildingDrawers_AutoMergingBuildingDrawerRooftop;
	}
	,get_drawerAsRooftopMerger: function() {
		return this.drawer;
	}
	,postLoad: function() {
		this.parkSprite.texture = this.parkTextures[this.currentTexture];
		this.bgStage.isInvalid = true;
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
		buildings_buildingBehaviours_ParkWalk.beEntertainedRooftopPark(this.get_drawerAsRooftopMerger().getLeftBuilding(this),this.get_drawerAsRooftopMerger().getRightBuilding(this),citizen);
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		if(this.get_changePlantsText() != "") {
			gui_windowParts_CycleValueButton.create(this.city.gui,function() {
				return _gthis.currentTexture;
			},function(t) {
				_gthis.currentTexture = t;
				_gthis.parkSprite.texture = _gthis.parkTextures[_gthis.currentTexture];
				_gthis.bgStage.isInvalid = true;
			},function() {
				return _gthis.parkTextures.length;
			},this.get_changePlantsText());
		}
		Building.prototype.createWindowAddBottomButtons.call(this);
	}
	,destroy: function() {
		Building.prototype.destroy.call(this);
		var _this = this.bgStage;
		var child = this.parkSprite;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Building.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_RooftopPark.saveDefinition);
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
	,__class__: buildings_RooftopPark
});
