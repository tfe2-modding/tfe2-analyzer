var buildings_BoardGameStore = $hxClasses["buildings.BoardGameStore"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 11;
	this.endTime = 23.5;
	this.workTimePreferenceMod = 0.1;
	this.isEntertainment = true;
};
buildings_BoardGameStore.__name__ = "buildings.BoardGameStore";
buildings_BoardGameStore.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_BoardGameStore.__super__ = buildings_Work;
buildings_BoardGameStore.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		return this.workers.length * 90;
	}
	,get_isOpen: function() {
		if(this.workers.length == 1 && this.workers[0].currentAction == 0) {
			return this.city.simulation.time.timeSinceStart / 60 % 24 < 23;
		} else {
			return false;
		}
	}
	,get_entertainmentType: function() {
		return 4;
	}
	,get_secondaryEntertainmentTypes: function() {
		return null;
	}
	,get_minimumNormalTimeToSpend: function() {
		return 3;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 3.5;
	}
	,get_minimumEntertainmentGroupSatisfy: function() {
		return 4;
	}
	,get_maximumEntertainmentGroupSatisfy: function() {
		return 8;
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
	,beEntertained: function(citizen,timeMod) {
		var moveFunction = function() {
			var xx = citizen.relativeY < 5 ? random_Random.getInt(8,16) : random_Random.getInt(2) == 0 ? random_Random.fromArray(buildings_BoardGameStore.firstFloorChairs) : random_Random.getInt(3,14);
			var modifyWithHappiness = false;
			var slowMove = true;
			if(slowMove == null) {
				slowMove = false;
			}
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(xx,xx + 1),random_Random.getInt(100,120),null,modifyWithHappiness,slowMove);
		};
		if(random_Random.getInt(3 - citizen.relativeY < 10 ? 1 : 0) == 0) {
			citizen.changeFloor(moveFunction);
		} else {
			moveFunction();
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
		} else {
			var spd = citizen.pathWalkSpeed * timeMod;
			Citizen.shouldUpdateDraw = true;
			if(Math.abs(4 - citizen.relativeX) < spd) {
				citizen.relativeX = 4;
			} else {
				var num = 4 - citizen.relativeX;
				citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
			}
			citizen.setRelativeY(1);
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_BoardGameStore.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_Work.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_BoardGameStore
});
