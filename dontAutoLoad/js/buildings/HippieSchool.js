var buildings_HippieSchool = $hxClasses["buildings.HippieSchool"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.interiorSprite = null;
	this.currentTexture = 0;
	buildings_School.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.students = [];
	this.drawer.changeMainTexture("spr_herbgarden_medic");
	this.drawer.changeTextureGroup("spr_botanicalgardens");
	this.clockTextures = Resources.getTexturesByWidth("spr_hippieschool_clock",11);
	this.clockSprite = new PIXI.Sprite();
	this.clockSprite.texture = this.clockTextures[0];
	this.clockSprite.position.set(position.x + 9,position.y + 2);
	stage.cacheableChildren.push(this.clockSprite);
	stage.isInvalid = true;
	this.interiorTextures = Resources.getTexturesByWidth("spr_hippieschool_interior",20);
	this.currentTexture = random_Random.getInt(this.interiorTextures.length);
	this.interiorSprite = new PIXI.Sprite(this.interiorTextures[this.currentTexture]);
	this.interiorSprite.position.set(position.x,position.y);
	bgStage.cacheableChildren.push(this.interiorSprite);
	bgStage.isInvalid = true;
	this.isEntertainment = true;
};
buildings_HippieSchool.__name__ = "buildings.HippieSchool";
buildings_HippieSchool.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_HippieSchool.__super__ = buildings_School;
buildings_HippieSchool.prototype = $extend(buildings_School.prototype,{
	get_drawerType: function() {
		return buildings_buildingDrawers_AutoMergingBuildingDrawerDifferentForType;
	}
	,get_studentCapacity: function() {
		return Math.round(this.city.policies.vars.schoolClassSizeMod * 30);
	}
	,get_educationPerDay: function() {
		return 0.07 * this.city.policies.vars.schoolMaxEdu;
	}
	,get_educationCap: function() {
		return this.city.policies.vars.schoolMaxEdu;
	}
	,get_baseEntertainmentCapacity: function() {
		return 20;
	}
	,get_isOpen: function() {
		var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
		if(this1 >= 19.0) {
			return this1 < 23;
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
		return 1;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 2;
	}
	,get_minimumEntertainmentGroupSatisfy: function() {
		return 0.66;
	}
	,get_maximumEntertainmentGroupSatisfy: function() {
		return 1.5;
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
	,postLoad: function() {
		this.interiorSprite.texture = this.interiorTextures[this.currentTexture];
	}
	,onBuild: function() {
		buildings_School.prototype.onBuild.call(this);
		var mission = this.city.progress.sideQuests.findSidequestWithType(progress_sidequests_HackerSchoolMission);
		if(mission != null) {
			this.city.progress.sideQuests.completeSidequest(mission);
		}
	}
	,destroy: function() {
		buildings_School.prototype.destroy.call(this);
		if(this.clockSprite != null) {
			var _this = this.stage;
			var child = this.clockSprite;
			HxOverrides.remove(_this.cacheableChildren,child);
			_this.isInvalid = true;
			child.destroy({ children : true, texture : false});
			this.clockSprite = null;
		}
		if(this.interiorSprite != null) {
			var _this = this.bgStage;
			var child = this.interiorSprite;
			HxOverrides.remove(_this.cacheableChildren,child);
			_this.isInvalid = true;
			child.destroy({ children : true, texture : false});
			this.interiorSprite = null;
		}
	}
	,onCityChange: function() {
		buildings_School.prototype.onCityChange.call(this);
		this.clockSprite.position.set(this.position.x + 9,this.position.y + 2);
		var clockTexture = this.clockSprite.texture;
		if(this.rightBuilding != null && this.drawer.isConnectedBuilding(this.rightBuilding)) {
			this.clockSprite.texture = this.clockTextures[0];
		} else {
			this.clockSprite.texture = this.clockTextures[1];
		}
		if(clockTexture != this.clockSprite.texture) {
			this.stage.isInvalid = true;
		}
		if(this.interiorSprite != null) {
			this.interiorSprite.position.set(this.position.x,this.position.y);
			this.bgStage.isInvalid = true;
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
			return;
		}
		if(citizen.relativeY < 5) {
			citizen.changeFloor();
		}
		var spd = citizen.pathWalkSpeed * timeMod;
		Citizen.shouldUpdateDraw = true;
		if(Math.abs(0 - citizen.relativeX) < spd) {
			citizen.relativeX = 0;
		} else {
			var num = 0 - citizen.relativeX;
			citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
		}
	}
	,beAtSchool: function(citizen,timeMod) {
		var leftIsHippieSchool = this.leftBuilding != null && this.leftBuilding.is(buildings_HippieSchool);
		var rightIsHippieSchool = this.rightBuilding != null && this.rightBuilding.is(buildings_HippieSchool);
		if(!citizen.hasBuildingInited) {
			var i = this.students.indexOf(citizen);
			if(i % 4 == 1) {
				citizen.changeFloorAndMoveRandom(7,8);
			} else {
				citizen.moveAndWait(random_Random.getInt(leftIsHippieSchool ? 0 : 3,rightIsHippieSchool ? 19 : 16),random_Random.getInt(60,90),null,false,false);
			}
			var amount = this.get_educationPerDay();
			var cap = this.get_educationCap();
			citizen.educationLevel = Math.max(Math.min(citizen.educationLevel + amount,cap),citizen.educationLevel);
			citizen.hasBuildingInited = true;
		} else if(citizen.relativeY < 5) {
			citizen.moveAndWait(random_Random.getInt(leftIsHippieSchool ? 0 : 3,rightIsHippieSchool ? 19 : 16),random_Random.getInt(60,120),null,false,false);
		}
	}
	,beEntertained: function(citizen,timeMod) {
		buildings_buildingBehaviours_ParkWalk.beEntertainedFlowerSchool(this.leftBuilding,this.rightBuilding,citizen);
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		gui_windowParts_CycleValueButton.create(this.city.gui,function() {
			return _gthis.currentTexture;
		},function(t) {
			_gthis.currentTexture = t;
			_gthis.interiorSprite.texture = _gthis.interiorTextures[_gthis.currentTexture];
			_gthis.bgStage.isInvalid = true;
		},function() {
			return _gthis.interiorTextures.length;
		},common_Localize.lo("change_interior"));
		buildings_School.prototype.createWindowAddBottomButtons.call(this);
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_School.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_HippieSchool.saveDefinition);
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
		buildings_School.prototype.load.call(this,queue);
		if(queue.version < 68) {
			return;
		}
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentTexture")) {
			this.currentTexture = loadMap.h["currentTexture"];
		}
		this.postLoad();
	}
	,__class__: buildings_HippieSchool
});
