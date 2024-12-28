var buildings_FactoryPub = $hxClasses["buildings.FactoryPub"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_RefinedMetalFactory.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.materialsMadePerStepPerWorker = 0.00075;
	this.startTime = 16.5;
	this.endTime = 5.5;
	this.workTimePreferenceMod = 0.5;
	this.isEntertainment = true;
};
buildings_FactoryPub.__name__ = "buildings.FactoryPub";
buildings_FactoryPub.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_FactoryPub.__super__ = buildings_RefinedMetalFactory;
buildings_FactoryPub.prototype = $extend(buildings_RefinedMetalFactory.prototype,{
	get_baseEntertainmentCapacity: function() {
		return this.workers.length * 25;
	}
	,get_isOpen: function() {
		if(this.workers.length >= 1 && this.workers[0].currentAction == 0) {
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
		return 5;
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
	,get_animationFrames: function() {
		return "spr_refinedmetalfactorypub_frames";
	}
	,get_idleFrames: function() {
		return "spr_refinedmetalfactorypub_idle";
	}
	,get_drawerType: function() {
		return buildings_buildingDrawers_AutoMergingBuildingDrawer;
	}
	,destroy: function() {
		buildings_RefinedMetalFactory.prototype.destroy.call(this);
	}
	,positionSprites: function() {
		buildings_RefinedMetalFactory.prototype.positionSprites.call(this);
	}
	,beEntertained: function(citizen,timeMod) {
		var moveFunction = function() {
			var moveToX = random_Random.getInt(8,16);
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
			var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
			arr[0] = 4;
			arr[1] = random_Random.getInt(8,this.rightBuilding != null && this.rightBuilding.is(buildings_FactoryPub) ? 19 : 16);
			arr[2] = 8;
			arr[3] = random_Random.getInt(60,120);
			citizen1.setPath(arr,0,4,true);
		}
		if(!citizen.hasBuildingInited) {
			citizen.wantsNightEntertainmentIn = random_Random.getInt(1,5);
			citizen.hasBuildingInited = true;
		}
	}
	,workAnimation: function(citizen,timeMod) {
		if(citizen.relativeY != 10) {
			if(this.workers.indexOf(citizen) == 0) {
				citizen.setRelativePos(8,10);
			} else {
				citizen.setRelativePos(3,1);
			}
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_RefinedMetalFactory.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_FactoryPub.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_RefinedMetalFactory.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_FactoryPub
});
