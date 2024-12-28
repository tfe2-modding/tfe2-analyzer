var buildings_LibraryOfTheKey = $hxClasses["buildings.LibraryOfTheKey"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.lastDayReward = -1;
	buildings_Library.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 15;
	this.endTime = 5;
	this.workTimePreferenceMod = 0.5;
	this.isEntertainment = true;
	this.lastDayReward = 1 + ((city.simulation.time.timeSinceStart | 0) / 1440 | 0);
};
buildings_LibraryOfTheKey.__name__ = "buildings.LibraryOfTheKey";
buildings_LibraryOfTheKey.__super__ = buildings_Library;
buildings_LibraryOfTheKey.prototype = $extend(buildings_Library.prototype,{
	get_isOpen: function() {
		return false;
	}
	,get_drawerType: function() {
		return buildings_buildingDrawers_NormalBuildingDrawer;
	}
	,update: function(timeMod) {
		buildings_Library.prototype.update.call(this,timeMod);
		if(this.lastDayReward != 1 + ((this.city.simulation.time.timeSinceStart | 0) / 1440 | 0) && this.workers.length > 0) {
			this.city.simulation.bonuses.theMachineBoost += 0.001 / (this.city.simulation.bonuses.theMachineBoost * this.city.simulation.bonuses.theMachineBoost);
			this.lastDayReward = 1 + ((this.city.simulation.time.timeSinceStart | 0) / 1440 | 0);
		}
	}
	,positionSprites: function() {
		buildings_Library.prototype.positionSprites.call(this);
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Library.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("machine_resource_output_mult",[common_MathExtensions.floatFormat(Math,(_gthis.city.simulation.bonuses.theMachineBoost - 1) * 100,2)]);
		});
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
		} else {
			citizen.moveAndWait(random_Random.getInt(3,8),random_Random.getInt(100,120),null,false,false);
		}
	}
	,beEntertained: function(citizen,timeMod) {
		var moveFunction = function() {
			if(citizen.relativeY < 5) {
				citizen.moveAndWait(random_Random.getInt(3,7),random_Random.getInt(30,60),null,false,false);
			} else {
				citizen.moveAndWait(random_Random.getInt(3,16),random_Random.getInt(30,60),null,false,false);
			}
		};
		if(random_Random.getInt(2) == 1) {
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
			citizen.educationLevel = Math.max(Math.min(citizen.educationLevel + 0.025,1.75),citizen.educationLevel);
			citizen.hasBuildingInited = true;
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Library.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_LibraryOfTheKey.saveDefinition);
		}
		var value = this.lastDayReward;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue,definition) {
		buildings_Library.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"lastDayReward")) {
			this.lastDayReward = loadMap.h["lastDayReward"];
		}
	}
	,__class__: buildings_LibraryOfTheKey
});
