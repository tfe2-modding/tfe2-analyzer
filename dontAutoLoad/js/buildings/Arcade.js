var buildings_Arcade = $hxClasses["buildings.Arcade"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 12;
	this.endTime = 23.5;
	this.workTimePreferenceMod = 0.1;
	this.isEntertainment = true;
};
buildings_Arcade.__name__ = "buildings.Arcade";
buildings_Arcade.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_Arcade.__super__ = buildings_Work;
buildings_Arcade.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		return this.workers.length * 120;
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
		return 2.5;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 3;
	}
	,get_minimumEntertainmentGroupSatisfy: function() {
		return 4;
	}
	,get_maximumEntertainmentGroupSatisfy: function() {
		return 7;
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
			var xx = citizen.relativeY < 5 ? 5 + 4 * random_Random.getInt(3) : 5 + 8 * random_Random.getInt(2);
			citizen.moveAndWait(random_Random.getInt(xx,xx + 1),random_Random.getInt(100,120),null,false,false);
		};
		if(random_Random.getInt(3) == 1) {
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
			if(Math.abs(6 - citizen.relativeX) < spd) {
				citizen.relativeX = 6;
			} else {
				var num = 6 - citizen.relativeX;
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
			queue.addString(buildings_Arcade.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_Work.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_Arcade
});
