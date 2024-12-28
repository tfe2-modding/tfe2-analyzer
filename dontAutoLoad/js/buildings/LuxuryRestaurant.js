var buildings_LuxuryRestaurant = $hxClasses["buildings.LuxuryRestaurant"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 16;
	this.endTime = 1;
	this.workTimePreferenceMod = 0.5;
	this.isEntertainment = true;
};
buildings_LuxuryRestaurant.__name__ = "buildings.LuxuryRestaurant";
buildings_LuxuryRestaurant.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_LuxuryRestaurant.__super__ = buildings_Work;
buildings_LuxuryRestaurant.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		var bec = 25;
		bec += this.getEffectsOfAdjecentBuildingsLR("restaurantCapBoost");
		return this.workers.length * bec | 0;
	}
	,get_isOpen: function() {
		if(this.workers.length >= 1 && this.workers[0].currentAction == 0) {
			var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
			var start = this.startTime - this.workTimePreferenceMod;
			if(start < 0.5) {
				if(this1 >= start) {
					return this1 < 0.5;
				} else {
					return false;
				}
			} else if(!(this1 >= start)) {
				return this1 < 0.5;
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
	,beEntertained: function(citizen,timeMod) {
		if(!citizen.hasBuildingInited) {
			var hasLeftRestaurant = this.leftBuilding != null && this.leftBuilding.is(buildings_Restaurant);
			var hasRightRestaurant = this.rightBuilding != null && this.rightBuilding.is(buildings_Restaurant);
			var getTopTable = function() {
				var i = random_Random.getInt(2);
				switch(i) {
				case 0:
					var citizen1 = citizen;
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 4;
					citizen1.setPath(arr,0,2,true);
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
					break;
				case 1:
					var citizen1 = citizen;
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 14;
					citizen1.setPath(arr,0,2,true);
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
					break;
				}
			};
			citizen.wantsNightEntertainmentIn = random_Random.getInt(1,5);
			citizen.hasBuildingInited = true;
			if(citizen.relativeY <= 5) {
				if(random_Random.getInt(3) == 0) {
					var moveToX = random_Random.getInt(4,6);
					var citizen1 = citizen;
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = moveToX;
					citizen1.setPath(arr,0,2,true);
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
				} else {
					citizen.changeFloor(getTopTable);
				}
			} else {
				getTopTable();
			}
		} else {
			var citizen1 = citizen;
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 8;
			arr[1] = random_Random.getInt(30,60);
			citizen1.setPath(arr,0,2,true);
			citizen.pathEndFunction = null;
			citizen.pathOnlyRelatedTo = citizen.inPermanent;
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking && this.city.simulation.time.timeSinceStart / 60 % 24 > 0.5) {
			citizen.currentAction = 2;
		} else {
			switch(this.workers.indexOf(citizen)) {
			case 0:
				if(citizen.relativeY > 5) {
					citizen.changeFloor();
				} else {
					var spd = citizen.pathWalkSpeed * timeMod;
					Citizen.shouldUpdateDraw = true;
					if(Math.abs(12 - citizen.relativeX) < spd) {
						citizen.relativeX = 12;
					} else {
						var num = 12 - citizen.relativeX;
						citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
					}
				}
				break;
			case 1:
				if(citizen.relativeY < 5) {
					citizen.changeFloor();
				} else {
					var hasLeftRestaurant = false;
					var hasRightRestaurant = false;
					citizen.moveAndWait(random_Random.getInt(hasLeftRestaurant ? 0 : 3,hasRightRestaurant ? 19 : 16),random_Random.getInt(60,90),null,false,false);
				}
				break;
			}
		}
	}
	,__class__: buildings_LuxuryRestaurant
});
