var buildings_TechMuseum = $hxClasses["buildings.TechMuseum"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.artSprite1Tex = 0;
	this.artSprite3 = null;
	this.artSprite2 = null;
	this.artSprite1 = null;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 10;
	this.endTime = 22;
	this.workTimePreferenceMod = 0.2;
	this.isEntertainment = true;
	var secondaryTextures = Resources.getTexturesByWidth("spr_techmuseum_minordisplay",9);
	this.mainTexture = random_Random.getInt(buildings_TechMuseum.mainTextureOptions.length);
	this.secondTexture = random_Random.getInt(secondaryTextures.length);
	while(true) {
		this.thirdTexture = random_Random.getInt(secondaryTextures.length);
		if(this.thirdTexture != this.secondTexture) {
			break;
		}
	}
	this.artTextures1 = Resources.getTexturesByWidth(buildings_TechMuseum.mainTextureOptions[this.mainTexture],5);
	this.artSprite1 = new PIXI.Sprite(this.artTextures1[0]);
	bgStage.addChild(this.artSprite1);
	this.artSprite1.position.set(position.x + 3,position.y + 3);
	this.artSprite2 = new PIXI.Sprite(secondaryTextures[this.secondTexture]);
	this.artSprite2.position.set(position.x + 8,position.y + 3);
	city.cityBgStageAbove.addChild(this.artSprite2);
	this.artSprite3 = new PIXI.Sprite(secondaryTextures[this.thirdTexture]);
	this.artSprite3.position.set(position.x + 8,position.y + 12);
	city.cityBgStageAbove.addChild(this.artSprite3);
};
buildings_TechMuseum.__name__ = "buildings.TechMuseum";
buildings_TechMuseum.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_TechMuseum.__super__ = buildings_Work;
buildings_TechMuseum.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		return this.workers.length * 60;
	}
	,get_isOpen: function() {
		if(this.workers.length >= 1 && (this.workers[0].currentAction == 0 || this.workers.length >= 2 && this.workers[1].currentAction == 0)) {
			var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
			var start = this.startTime - this.workTimePreferenceMod;
			if(start < 22) {
				if(this1 >= start) {
					return this1 < 22;
				} else {
					return false;
				}
			} else if(!(this1 >= start)) {
				return this1 < 22;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}
	,get_entertainmentType: function() {
		return 3;
	}
	,get_secondaryEntertainmentTypes: function() {
		return null;
	}
	,get_minimumNormalTimeToSpend: function() {
		return 2;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 4;
	}
	,get_minimumEntertainmentGroupSatisfy: function() {
		return 2;
	}
	,get_maximumEntertainmentGroupSatisfy: function() {
		return 4;
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
	,postLoad: function() {
		this.artTextures1 = Resources.getTexturesByWidth(buildings_TechMuseum.mainTextureOptions[this.mainTexture],5);
	}
	,onCityChange: function() {
		buildings_Work.prototype.onCityChange.call(this);
		if(this.rightBuilding != null && this.rightBuilding.is(buildings_TechMuseum)) {
			var secondaryTexturesExt = Resources.getTexturesByWidth("spr_techmuseum_minordisplay_ext",15);
			this.artSprite2.texture = secondaryTexturesExt[this.secondTexture];
			this.artSprite3.texture = secondaryTexturesExt[this.thirdTexture];
		} else {
			var secondaryTextures = Resources.getTexturesByWidth("spr_techmuseum_minordisplay",9);
			this.artSprite2.texture = secondaryTextures[this.secondTexture];
			this.artSprite3.texture = secondaryTextures[this.thirdTexture];
		}
	}
	,update: function(timeMod) {
		buildings_Work.prototype.update.call(this,timeMod);
		if(this.get_isOpen()) {
			this.artSprite1Tex += timeMod / 2;
			if(this.artSprite1Tex >= this.artTextures1.length) {
				this.artSprite1Tex = 0;
			}
			this.artSprite1.texture = this.artTextures1[Math.floor(this.artSprite1Tex)];
		} else {
			this.artSprite1.texture = this.artTextures1[0];
		}
	}
	,positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
		if(this.artSprite1 != null) {
			this.artSprite1.position.set(this.position.x + 3,this.position.y + 3);
		}
		if(this.artSprite2 != null) {
			this.artSprite2.position.set(this.position.x + 8,this.position.y + 3);
		}
		if(this.artSprite3 != null) {
			this.artSprite3.position.set(this.position.x + 8,this.position.y + 12);
		}
	}
	,destroy: function() {
		buildings_Work.prototype.destroy.call(this);
		this.artSprite1.destroy();
		this.artSprite2.destroy();
		this.artSprite3.destroy();
	}
	,beEntertained: function(citizen,timeMod) {
		var moveFunction = function() {
			if(citizen.relativeY < 5) {
				var modifyWithHappiness = false;
				var slowMove = true;
				if(slowMove == null) {
					slowMove = false;
				}
				if(modifyWithHappiness == null) {
					modifyWithHappiness = false;
				}
				citizen.moveAndWait(random_Random.getInt(3,16),random_Random.getInt(100,120),null,modifyWithHappiness,slowMove);
			} else {
				var modifyWithHappiness = false;
				var slowMove = true;
				if(slowMove == null) {
					slowMove = false;
				}
				if(modifyWithHappiness == null) {
					modifyWithHappiness = false;
				}
				citizen.moveAndWait(random_Random.getInt(8,16),random_Random.getInt(100,120),null,modifyWithHappiness,slowMove);
			}
		};
		if(citizen.relativeY < 5 && citizen.relativeX >= 8 && random_Random.getFloat() < 0.3) {
			citizen.changeFloor(moveFunction);
		} else {
			moveFunction();
		}
		if(!citizen.hasBuildingInited) {
			citizen.educationLevel = Math.max(Math.min(citizen.educationLevel + 0.025,1.55),citizen.educationLevel);
			citizen.hasBuildingInited = true;
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking && this.city.simulation.time.timeSinceStart / 60 % 24 > 22) {
			citizen.currentAction = 2;
		} else if(this.workers.indexOf(citizen) == 0) {
			var modifyWithHappiness = false;
			var slowMove = true;
			if(slowMove == null) {
				slowMove = false;
			}
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(3,16),random_Random.getInt(200,250),null,modifyWithHappiness,slowMove);
		} else if(citizen.relativeY < 5) {
			var tmp;
			if(!(citizen.relativeX >= 8)) {
				var spd = citizen.pathWalkSpeed * timeMod;
				Citizen.shouldUpdateDraw = true;
				if(Math.abs(8 - citizen.relativeX) < spd) {
					citizen.relativeX = 8;
					tmp = true;
				} else {
					var num = 8 - citizen.relativeX;
					citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
					tmp = false;
				}
			} else {
				tmp = true;
			}
			if(tmp) {
				citizen.changeFloor();
			}
		} else {
			var modifyWithHappiness = false;
			var slowMove = true;
			if(slowMove == null) {
				slowMove = false;
			}
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(8,16),random_Random.getInt(300,320),null,modifyWithHappiness,slowMove);
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_TechMuseum.saveDefinition);
		}
		var value = this.mainTexture;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.secondTexture;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.thirdTexture;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue,definition) {
		buildings_Work.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"mainTexture")) {
			this.mainTexture = loadMap.h["mainTexture"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"secondTexture")) {
			this.secondTexture = loadMap.h["secondTexture"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"thirdTexture")) {
			this.thirdTexture = loadMap.h["thirdTexture"];
		}
		this.postLoad();
	}
	,__class__: buildings_TechMuseum
});
