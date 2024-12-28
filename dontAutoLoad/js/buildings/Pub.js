var buildings_Pub = $hxClasses["buildings.Pub"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.markingTexture = "";
	this.marking = null;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 20;
	this.endTime = 5.5;
	this.workTimePreferenceMod = 0.5;
	this.isEntertainment = true;
};
buildings_Pub.__name__ = "buildings.Pub";
buildings_Pub.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_Pub.__super__ = buildings_Work;
buildings_Pub.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		return this.workers.length * 50;
	}
	,get_isOpen: function() {
		var tmp;
		if(this.workers.length == 1 && this.workers[0].currentAction == 0) {
			var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
			var start = this.startTime - this.workTimePreferenceMod;
			tmp = start < 4.5 ? this1 >= start && this1 < 4.5 : this1 >= start || this1 < 4.5;
		} else {
			tmp = false;
		}
		if(tmp) {
			return this.marking == null;
		} else {
			return false;
		}
	}
	,get_entertainmentType: function() {
		return 0;
	}
	,get_secondaryEntertainmentTypes: function() {
		return null;
	}
	,get_minimumNormalTimeToSpend: function() {
		return 2;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 6;
	}
	,get_minimumEntertainmentGroupSatisfy: function() {
		return 1;
	}
	,get_maximumEntertainmentGroupSatisfy: function() {
		return 3;
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
		if(this.markingTexture != "") {
			this.setMarking(this.markingTexture);
		}
	}
	,destroy: function() {
		buildings_Work.prototype.destroy.call(this);
		if(this.marking != null) {
			this.marking.destroy();
		}
	}
	,positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
		if(this.marking != null) {
			this.marking.position.set(this.position.x + 2,this.position.y + 10);
		}
	}
	,createMainWindowPart: function() {
		var _gthis = this;
		buildings_Work.prototype.createMainWindowPart.call(this);
		if(this.marking == null) {
			var mission = this.city.progress.sideQuests.findSidequestWithType(progress_sidequests_CarrotJuiceBarMission);
			var buildingType = buildings_CarrotJuiceBar;
			var title = common_Localize.lo("buildinginfo.json/CarrotJuiceBar.name");
			var description = common_Localize.lo("build_CarrotJuiceBar");
			if(mission != null) {
				gui_windowParts_CreateBuildingTransformButton.create(this.city,this,buildingType,title,description,function() {
					_gthis.city.progress.sideQuests.completeSidequest(mission);
				});
			} else {
				var mission2 = this.city.progress.sideQuests.findCompletedSidequestWithType(progress_sidequests_CarrotJuiceBarMission);
				if(mission2 != null && this.city.getAmountOfPermanentsPerType().h["buildings.CarrotJuiceBar"] == 0) {
					gui_windowParts_CreateBuildingTransformButton.create(this.city,this,buildingType,title,description,function() {
					});
				}
			}
		}
		if(this.markingTexture == "spr_pub_marking_key") {
			this.city.gui.windowAddInfoText(common_Localize.lo("pub_claimed_secret_society"));
		}
	}
	,setMarking: function(markingTexture) {
		this.markingTexture = markingTexture;
		if(this.marking == null) {
			this.marking = new PIXI.Sprite(Resources.getTexture(markingTexture));
		}
		this.marking.texture = Resources.getTexture(markingTexture);
		this.marking.position.set(this.position.x + 2,this.position.y + 10);
		this.stage.addChild(this.marking);
	}
	,beEntertained: function(citizen,timeMod) {
		var moveFunction = function() {
			var moveToX = random_Random.getInt(7,16);
			var citizen1 = citizen;
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 4;
			arr[1] = moveToX;
			citizen1.setPath(arr,0,2,true);
			citizen.pathEndFunction = null;
			citizen.pathOnlyRelatedTo = citizen.inPermanent;
		};
		if(citizen.relativeY < 5) {
			citizen.changeFloor(moveFunction);
		} else {
			var citizen1 = citizen;
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 8;
			arr[1] = random_Random.getInt(120,180);
			citizen1.setPath(arr,0,2,true);
			citizen.pathEndFunction = moveFunction;
			citizen.pathOnlyRelatedTo = citizen.inPermanent;
		}
		if(!citizen.hasBuildingInited) {
			citizen.wantsNightEntertainmentIn = random_Random.getInt(1,5);
			citizen.hasBuildingInited = true;
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking && this.city.simulation.time.timeSinceStart / 60 % 24 > 4.5) {
			citizen.currentAction = 2;
		} else if(citizen.relativeY < 5) {
			citizen.changeFloor();
		} else {
			var spd = citizen.pathWalkSpeed * timeMod;
			Citizen.shouldUpdateDraw = true;
			if(Math.abs(3 - citizen.relativeX) < spd) {
				citizen.relativeX = 3;
			} else {
				var num = 3 - citizen.relativeX;
				citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
			}
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_Pub.saveDefinition);
		}
		queue.addString(this.markingTexture);
	}
	,load: function(queue,definition) {
		buildings_Work.prototype.load.call(this,queue);
		if(queue.version < 7) {
			return;
		}
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"markingTexture")) {
			this.markingTexture = loadMap.h["markingTexture"];
		}
		this.postLoad();
	}
	,__class__: buildings_Pub
});
