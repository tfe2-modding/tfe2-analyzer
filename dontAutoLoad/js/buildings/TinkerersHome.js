var buildings_TinkerersHome = $hxClasses["buildings.TinkerersHome"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.backTextureUsed = 0;
	this.frontTextureUsed = 0;
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	if(buildings_TinkerersHome.frontTextures == null) {
		buildings_TinkerersHome.frontTextures = Resources.getTexturesByWidth("spr_tinkerershouse_front_alt",20);
		buildings_TinkerersHome.backTextures = Resources.getTexturesByWidth("spr_tinkerershouse_back_alt",20);
	}
	this.frontTextureUsed = random_Random.getInt(buildings_TinkerersHome.frontTextures.length);
	this.backTextureUsed = random_Random.getInt(buildings_TinkerersHome.backTextures.length);
	this.get_customizableDrawer().setCustomTextures(buildings_TinkerersHome.frontTextures[this.frontTextureUsed],null,buildings_TinkerersHome.backTextures[this.backTextureUsed]);
};
buildings_TinkerersHome.__name__ = "buildings.TinkerersHome";
buildings_TinkerersHome.__super__ = buildings_House;
buildings_TinkerersHome.prototype = $extend(buildings_House.prototype,{
	get_drawerType: function() {
		return buildings_buildingDrawers_CustomizableBuildingDrawer;
	}
	,get_customizableDrawer: function() {
		return this.drawer;
	}
	,get_possibleUpgrades: function() {
		return [buildingUpgrades_BetterTools];
	}
	,onBuild: function() {
		buildings_House.prototype.onBuild.call(this);
		this.city.progress.unlocks.unlock(cityUpgrades_MechanicalLiving);
	}
	,postLoad: function() {
		this.get_customizableDrawer().setCustomTextures(buildings_TinkerersHome.frontTextures[this.frontTextureUsed],null,buildings_TinkerersHome.backTextures[this.backTextureUsed]);
	}
	,walkAround: function(citizen,stepsInBuilding) {
		if(!citizen.hasBuildingInited) {
			citizen.educationLevel = Math.max(Math.min(citizen.educationLevel + 0.01,1.25),citizen.educationLevel);
			citizen.hasBuildingInited = true;
		}
		var r = random_Random.getInt(6);
		if(r < 2 && stepsInBuilding > 120) {
			citizen.changeFloorAndWaitRandom(30,60);
		} else if(r == 2 || r == 3 || stepsInBuilding < 10) {
			if(citizen.relativeY < 5) {
				if(r == 2) {
					citizen.moveAndWait(random_Random.getInt(3,6),random_Random.getInt(30,60),null,false,false);
				} else {
					citizen.moveAndWait(random_Random.getInt(15,16),random_Random.getInt(30,60),null,false,false);
				}
			} else if(r == 2) {
				citizen.moveAndWait(random_Random.getInt(3,6),random_Random.getInt(30,60),null,false,false);
			} else {
				citizen.moveAndWait(random_Random.getInt(12,16),random_Random.getInt(30,60),null,false,false);
			}
		} else {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 8;
			arr[1] = random_Random.getInt(90,120);
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
			queue.addString(buildings_TinkerersHome.saveDefinition);
		}
		var value = this.frontTextureUsed;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.backTextureUsed;
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"frontTextureUsed")) {
			this.frontTextureUsed = loadMap.h["frontTextureUsed"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"backTextureUsed")) {
			this.backTextureUsed = loadMap.h["backTextureUsed"];
		}
		this.postLoad();
	}
	,__class__: buildings_TinkerersHome
});
