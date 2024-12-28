var buildings_Villa = $hxClasses["buildings.Villa"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.teleportX = 3;
	this.currentAdjBonus = 0;
	this.timesUsedTo = 0;
	this.timesUsed = 0;
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_Villa.__name__ = "buildings.Villa";
buildings_Villa.__super__ = buildings_House;
buildings_Villa.prototype = $extend(buildings_House.prototype,{
	get_hasPrivateTeleporter: function() {
		return true;
	}
	,get_possibleUpgrades: function() {
		return [];
	}
	,walkAround: function(citizen,stepsInBuilding) {
		var r = random_Random.getInt(3);
		if(r == 0 && stepsInBuilding > 120) {
			if(citizen.relativeX < 5) {
				var citizen1 = citizen;
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
				arr[0] = 4;
				arr[1] = 5;
				citizen1.setPath(arr,0,2,true);
				citizen.pathEndFunction = function() {
					citizen.changeFloorAndWaitRandom(30,60);
				};
				citizen.pathOnlyRelatedTo = citizen.inPermanent;
			} else {
				citizen.changeFloorAndWaitRandom(30,60);
			}
		} else if(r == 1 || stepsInBuilding <= 10 && citizen.relativeX < this.teleportX + 0.5) {
			if(citizen.relativeY < 5) {
				citizen.moveAndWait(random_Random.getInt(10,16),random_Random.getInt(30,60),null,false,false);
			} else if(random_Random.getInt(2) == 1) {
				citizen.moveAndWait(random_Random.getInt(5,8),random_Random.getInt(30,60),null,false,false);
			} else {
				citizen.moveAndWait(random_Random.getInt(13,16),random_Random.getInt(30,60),null,false,false);
			}
		} else {
			var citizen1 = citizen;
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 8;
			arr[1] = random_Random.getInt(90,120);
			citizen1.setPath(arr,0,2,true);
			citizen.pathEndFunction = null;
			citizen.pathOnlyRelatedTo = citizen.inPermanent;
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_House.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("teleported_from",[_gthis.timesUsed]);
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("teleported_to",[_gthis.timesUsedTo]);
		});
		buildings_Teleporter.createUpkeepInfo(this.city,this.city.gui);
	}
	,createTeleportParticle: function(rayTexture) {
		if(rayTexture == null) {
			rayTexture = "unused";
		}
		this.city.particles.addParticle(Resources.getTexturesByWidth("spr_smallteleporter_ray",3),new common_Point(this.position.x + 3,this.position.y + 12));
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_House.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_Villa.saveDefinition);
		}
		var value = this.timesUsed;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.timesUsedTo;
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
		if(queue.version < 6) {
			return;
		}
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timesUsed")) {
			this.timesUsed = loadMap.h["timesUsed"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timesUsedTo")) {
			this.timesUsedTo = loadMap.h["timesUsedTo"];
		}
	}
	,__class__: buildings_Villa
});
