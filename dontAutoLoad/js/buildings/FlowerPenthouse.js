var buildings_FlowerPenthouse = $hxClasses["buildings.FlowerPenthouse"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.timesUsedTo = 0;
	this.timesUsed = 0;
	this.mirrored = false;
	this.teleportX = 15;
	this.topFlower = null;
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.doorX = 14;
	this.yearsToLiveLongerPerYearIfLivingHere = 0.05;
	this.updateTopFlower();
};
buildings_FlowerPenthouse.__name__ = "buildings.FlowerPenthouse";
buildings_FlowerPenthouse.__super__ = buildings_House;
buildings_FlowerPenthouse.prototype = $extend(buildings_House.prototype,{
	get_possibleUpgrades: function() {
		return [];
	}
	,get_baseAttractiveness: function() {
		return 100;
	}
	,get_hasPrivateTeleporter: function() {
		return true;
	}
	,postLoad: function() {
		if(this.mirrored) {
			this.mirror();
			this.mirrored = true;
		}
	}
	,mirror: function() {
		this.mirrored = !this.mirrored;
		this.updateTopFlower();
		this.teleportX = 19 - this.teleportX;
		this.drawer.mirror();
		if(this.mirrored) {
			this.doorX = 4;
		} else {
			this.doorX = 14;
		}
	}
	,updateTopFlower: function() {
		if(this.world.permanents[this.worldPosition.x].length == this.worldPosition.y + 1 || this.world.permanents[this.worldPosition.x][this.worldPosition.y + 1] == null) {
			if(this.topFlower == null) {
				this.topFlower = new PIXI.Sprite(Resources.getTexture("spr_flower_up"));
				this.stage.addChild(this.topFlower);
				this.topFlower.anchor.y = 1;
			}
			if(this.mirrored) {
				this.topFlower.position.set(this.position.x + 20,this.position.y);
				this.topFlower.scale.x = -1;
			} else {
				this.topFlower.position.set(this.position.x,this.position.y);
				this.topFlower.scale.x = 1;
			}
		} else if(this.topFlower != null) {
			this.topFlower.destroy();
			this.topFlower = null;
		}
	}
	,onCityChange: function() {
		buildings_House.prototype.onCityChange.call(this);
		this.updateTopFlower();
	}
	,destroy: function() {
		buildings_House.prototype.destroy.call(this);
		if(this.topFlower != null) {
			this.topFlower.destroy();
		}
	}
	,walkAround: function(citizen,stepsInBuilding) {
		if(this.mirrored) {
			if(citizen.relativeY < 5) {
				if(citizen.relativeX >= 5 || random_Random.getFloat() < 0.5) {
					citizen.moveAndWait(random_Random.getInt(3,16),random_Random.getInt(60,90),null,false,false);
				} else {
					citizen.changeFloorAndWait(60);
				}
			} else if(citizen.relativeX >= 5 || random_Random.getFloat() < 0.8) {
				var rnd = random_Random.getFloat();
				if(rnd < 0.5) {
					citizen.moveAndWait(random_Random.getInt(15,18),random_Random.getInt(40,60),null,false,false);
				} else if(rnd < 0.8) {
					citizen.moveAndWait(random_Random.getInt(10,12),random_Random.getInt(60,90),null,false,false);
				} else {
					citizen.moveAndWait(random_Random.getInt(3,5),random_Random.getInt(60,90),null,false,false);
				}
			} else {
				citizen.changeFloorAndWait(60);
			}
		} else if(citizen.relativeY < 5) {
			if(citizen.relativeX < 14 || random_Random.getFloat() < 0.5) {
				citizen.moveAndWait(random_Random.getInt(3,16),random_Random.getInt(60,90),null,false,false);
			} else {
				citizen.changeFloorAndWait(60);
			}
		} else if(citizen.relativeX < 14 || random_Random.getFloat() < 0.8) {
			var rnd = random_Random.getFloat();
			if(rnd < 0.5) {
				citizen.moveAndWait(random_Random.getInt(1,4),random_Random.getInt(40,60),null,false,false);
			} else if(rnd < 0.8) {
				citizen.moveAndWait(random_Random.getInt(7,9),random_Random.getInt(60,90),null,false,false);
			} else {
				citizen.moveAndWait(random_Random.getInt(14,16),random_Random.getInt(60,90),null,false,false);
			}
		} else {
			citizen.changeFloorAndWait(60);
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
	}
	,createWindowAddBottomButtons: function() {
		gui_windowParts_FullSizeTextButton.create(this.city.gui,$bind(this,this.mirror),this.city.gui.windowInner,function() {
			return common_Localize.lo("mirror");
		},this.city.gui.innerWindowStage);
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,6)));
		buildings_Teleporter.createUpkeepInfo(this.city,this.city.gui);
		buildings_House.prototype.createWindowAddBottomButtons.call(this);
	}
	,createTeleportParticle: function(rayTexture) {
		if(rayTexture == null) {
			rayTexture = "unused";
		}
		this.city.particles.addParticle(Resources.getTexturesByWidth(this.mirrored ? "spr_smallteleporter_ray_penthouse_mirror" : "spr_smallteleporter_ray_penthouse",3),new common_Point(this.position.x + (this.mirrored ? 3 : 14),this.position.y + 12));
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_House.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_FlowerPenthouse.saveDefinition);
		}
		var value = this.mirrored;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
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
		if(queue.version < 26) {
			return;
		}
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"mirrored")) {
			this.mirrored = loadMap.h["mirrored"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timesUsed")) {
			this.timesUsed = loadMap.h["timesUsed"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timesUsedTo")) {
			this.timesUsedTo = loadMap.h["timesUsedTo"];
		}
		this.postLoad();
	}
	,__class__: buildings_FlowerPenthouse
});
