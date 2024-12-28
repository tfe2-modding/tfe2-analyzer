var buildings_ParkPod = $hxClasses["buildings.ParkPod"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.parkSprite = null;
	this.currentMainTexture = 0;
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.parkTextures = Resources.getTexturesByWidth(this.get_parkTexturesStr(),20);
	this.currentTexture = random_Random.getInt(this.parkTextures.length);
	this.parkSprite = new PIXI.Sprite(this.parkTextures[this.currentTexture]);
	this.parkSprite.position.set(position.x,position.y);
	bgStage.addChild(this.parkSprite);
	this.adjecentBuildingEffects.push({ name : "modernRusticHomeCommunityFeeling", intensity : 1});
};
buildings_ParkPod.__name__ = "buildings.ParkPod";
buildings_ParkPod.__super__ = buildings_House;
buildings_ParkPod.prototype = $extend(buildings_House.prototype,{
	get_drawerType: function() {
		return buildings_buildingDrawers_AutoMergingBuildingDrawer;
	}
	,get_parkTexturesStr: function() {
		return "spr_parkpod";
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
		this.changeMainTexture(buildings_ParkPod.mainTextures[this.currentMainTexture]);
	}
	,postCreate: function() {
		buildings_House.prototype.postCreate.call(this);
		this.positionSprites();
	}
	,positionSprites: function() {
		buildings_House.prototype.positionSprites.call(this);
		if(this.parkSprite != null) {
			this.parkSprite.position.set(this.position.x,this.position.y);
		}
	}
	,beEntertained: function(citizen,timeMod) {
		var leftPark = this.leftBuilding != null && this.leftBuilding.is(buildings_Park);
		var rightPark = this.rightBuilding != null && this.rightBuilding.is(buildings_Park);
		var goTo = random_Random.getInt(1 + (leftPark ? 1 : 0) + (rightPark ? 1 : 0));
		if(leftPark && goTo == 0) {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[8].length > 0 ? pool[8].splice(pool[8].length - 1,1)[0] : new Int32Array(8);
			arr[0] = 12;
			arr[1] = 50;
			arr[2] = 2;
			arr[3] = 0;
			arr[4] = 4;
			arr[5] = random_Random.getInt(0,18);
			arr[6] = 8;
			arr[7] = random_Random.getInt(100,180);
			citizen.setPath(arr,0,8,true);
		} else if(rightPark && goTo == 1) {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[8].length > 0 ? pool[8].splice(pool[8].length - 1,1)[0] : new Int32Array(8);
			arr[0] = 12;
			arr[1] = 50;
			arr[2] = 3;
			arr[3] = 0;
			arr[4] = 4;
			arr[5] = random_Random.getInt(0,18);
			arr[6] = 8;
			arr[7] = random_Random.getInt(100,180);
			citizen.setPath(arr,0,8,true);
		} else {
			var modifyWithHappiness = false;
			var slowMove = true;
			if(slowMove == null) {
				slowMove = false;
			}
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(leftPark ? 0 : 3,rightPark ? 18 : 15),random_Random.getInt(100,180),null,modifyWithHappiness,slowMove);
		}
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		gui_windowParts_CycleValueButton.create(this.city.gui,function() {
			return _gthis.currentMainTexture;
		},function(t) {
			_gthis.currentMainTexture = t;
			_gthis.changeMainTexture(buildings_ParkPod.mainTextures[_gthis.currentMainTexture]);
		},function() {
			return buildings_ParkPod.mainTextures.length - _gthis.get_hiddenMainTexturesNum();
		},common_Localize.lo("change_building_color"));
		gui_windowParts_CycleValueButton.create(this.city.gui,function() {
			return _gthis.currentTexture;
		},function(t) {
			_gthis.currentTexture = t;
			_gthis.parkSprite.texture = _gthis.parkTextures[_gthis.currentTexture];
		},function() {
			return _gthis.parkTextures.length;
		},common_Localize.lo("change_variant"));
		buildings_House.prototype.createWindowAddBottomButtons.call(this);
	}
	,destroy: function() {
		buildings_House.prototype.destroy.call(this);
		this.parkSprite.destroy();
	}
	,walkAround: function(citizen,stepsInBuilding) {
		if(citizen.relativeX == 9) {
			citizen.canViewSelfInBuilding = false;
		} else {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 4;
			arr[1] = 9;
			citizen.setPath(arr,0,2,true);
			citizen.pathEndFunction = null;
			citizen.pathOnlyRelatedTo = citizen.inPermanent;
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_House.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_ParkPod.saveDefinition);
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
		buildings_House.prototype.load.call(this,queue);
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
	,__class__: buildings_ParkPod
});
