var buildings_CarrotJuiceBar = $hxClasses["buildings.CarrotJuiceBar"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 20;
	this.endTime = 5.5;
	this.workTimePreferenceMod = 0.5;
	this.isEntertainment = true;
};
buildings_CarrotJuiceBar.__name__ = "buildings.CarrotJuiceBar";
buildings_CarrotJuiceBar.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_CarrotJuiceBar.__super__ = buildings_Work;
buildings_CarrotJuiceBar.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		return this.workers.length * 50;
	}
	,get_isOpen: function() {
		if(this.workers.length == 1 && this.workers[0].currentAction == 0) {
			var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
			var start = this.startTime - this.workTimePreferenceMod;
			if(start < 4.5) {
				if(this1 >= start) {
					return this1 < 4.5;
				} else {
					return false;
				}
			} else if(!(this1 >= start)) {
				return this1 < 4.5;
			} else {
				return true;
			}
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
		} else {
			var ind = this.workers.indexOf(citizen);
			switch(ind) {
			case 0:
				if(citizen.relativeY < 5) {
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
				break;
			case 1:
				if(citizen.relativeY > 5) {
					citizen.changeFloor();
				} else {
					citizen.moveAndWait(random_Random.getInt(12,16),random_Random.getInt(30,60),null,false,false);
				}
				break;
			case 2:
				if(citizen.relativeY < 5) {
					citizen.changeFloor();
				} else {
					citizen.moveAndWait(random_Random.getInt(7,16),random_Random.getInt(90,120),null,false,false);
				}
				break;
			}
		}
	}
	,__class__: buildings_CarrotJuiceBar
});
