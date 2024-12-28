var buildings_Restaurant = $hxClasses["buildings.Restaurant"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 16;
	this.endTime = 1;
	this.workTimePreferenceMod = 0.5;
	this.isEntertainment = true;
};
buildings_Restaurant.__name__ = "buildings.Restaurant";
buildings_Restaurant.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_Restaurant.__super__ = buildings_Work;
buildings_Restaurant.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		var bec = 45;
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
		return 1;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 3;
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
	,get_drawerType: function() {
		return buildings_buildingDrawers_AutoMergingBuildingDrawer;
	}
	,beEntertained: function(citizen,timeMod) {
		if(!citizen.hasBuildingInited) {
			var hasLeftRestaurant = this.leftBuilding != null && this.leftBuilding.is(buildings_Restaurant);
			var hasRightRestaurant = this.rightBuilding != null && this.rightBuilding.is(buildings_Restaurant);
			var getTopTable = function() {
				var i = random_Random.getInt(3 + (hasRightRestaurant ? 1 : 0));
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
					arr[1] = 7;
					citizen1.setPath(arr,0,2,true);
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
					break;
				case 2:
					var citizen1 = citizen;
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 14;
					citizen1.setPath(arr,0,2,true);
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
					break;
				case 3:
					var citizen1 = citizen;
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 17;
					citizen1.setPath(arr,0,2,true);
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
					break;
				}
			};
			citizen.wantsNightEntertainmentIn = random_Random.getInt(1,5);
			citizen.hasBuildingInited = true;
			if(citizen.relativeY <= 5) {
				if(random_Random.getInt(3) <= 1) {
					citizen.changeFloor(getTopTable);
				} else if(hasLeftRestaurant) {
					if(random_Random.getInt(2) == 0) {
						var citizen1 = citizen;
						var pool = pooling_Int32ArrayPool.pool;
						var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
						arr[0] = 4;
						arr[1] = 1;
						citizen1.setPath(arr,0,2,true);
						citizen.pathEndFunction = null;
						citizen.pathOnlyRelatedTo = citizen.inPermanent;
					} else {
						var citizen1 = citizen;
						var pool = pooling_Int32ArrayPool.pool;
						var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
						arr[0] = 4;
						arr[1] = 6;
						citizen1.setPath(arr,0,2,true);
						citizen.pathEndFunction = null;
						citizen.pathOnlyRelatedTo = citizen.inPermanent;
					}
				} else if(random_Random.getInt(2) == 0) {
					var citizen1 = citizen;
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 3;
					citizen1.setPath(arr,0,2,true);
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
				} else {
					var citizen1 = citizen;
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 6;
					citizen1.setPath(arr,0,2,true);
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
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
					var hasLeftRestaurant = this.leftBuilding != null && this.leftBuilding.is(buildings_Restaurant);
					var hasRightRestaurant = this.rightBuilding != null && this.rightBuilding.is(buildings_Restaurant);
					citizen.moveAndWait(random_Random.getInt(hasLeftRestaurant ? 0 : 3,hasRightRestaurant ? 19 : 16),random_Random.getInt(60,90),null,false,false);
				}
				break;
			}
		}
	}
	,__class__: buildings_Restaurant
});
