var buildings_BlossomRestaurant = $hxClasses["buildings.BlossomRestaurant"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.startTime = 16;
	this.endTime = 1;
	this.workTimePreferenceMod = 0.5;
	this.isEntertainment = true;
	if(this.get_mergingDrawer().setForegroundTextures != null) {
		this.get_mergingDrawer().setForegroundTextures("spr_bloomrestaurant_foreground");
	}
};
buildings_BlossomRestaurant.__name__ = "buildings.BlossomRestaurant";
buildings_BlossomRestaurant.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_BlossomRestaurant.__super__ = buildings_Work;
buildings_BlossomRestaurant.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		var bec = 50;
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
		return 2;
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
		return buildings_buildingDrawers_AllDirMergingBuildingDrawer;
	}
	,get_mergingDrawer: function() {
		return this.drawer;
	}
	,beEntertained: function(citizen,timeMod) {
		if(!citizen.hasBuildingInited) {
			if(this.bottomBuilding == null || !this.bottomBuilding.is(buildings_BlossomRestaurant)) {
				var i = random_Random.getInt(6);
				switch(i) {
				case 0:
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 1;
					citizen.setPath(arr,0,2,true);
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
					break;
				case 1:
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 2;
					citizen.setPath(arr,0,2,true);
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
					break;
				case 2:
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 5;
					citizen.setPath(arr,0,2,true);
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
					break;
				case 3:
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 13;
					citizen.setPath(arr,0,2,true);
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
					break;
				case 4:
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 14;
					citizen.setPath(arr,0,2,true);
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
					break;
				case 5:
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 17;
					citizen.setPath(arr,0,2,true);
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
					break;
				}
			} else {
				var i = random_Random.getInt(4);
				switch(i) {
				case 0:
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 1;
					citizen.setPath(arr,0,2,true);
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
					break;
				case 1:
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 4;
					citizen.setPath(arr,0,2,true);
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
					break;
				case 2:
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 12;
					citizen.setPath(arr,0,2,true);
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
					break;
				case 3:
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 17;
					citizen.setPath(arr,0,2,true);
					citizen.pathEndFunction = null;
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
					break;
				}
			}
			citizen.hasBuildingInited = true;
		} else {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 8;
			arr[1] = random_Random.getInt(30,60);
			citizen.setPath(arr,0,2,true);
			citizen.pathEndFunction = null;
			citizen.pathOnlyRelatedTo = citizen.inPermanent;
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking && this.city.simulation.time.timeSinceStart / 60 % 24 > 0.5) {
			citizen.currentAction = 2;
		} else {
			var modifyWithHappiness = false;
			var slowMove = true;
			if(slowMove == null) {
				slowMove = false;
			}
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(3,18),random_Random.getInt(60,120),null,modifyWithHappiness,slowMove);
		}
	}
	,__class__: buildings_BlossomRestaurant
});
