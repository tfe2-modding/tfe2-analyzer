var buildings_CuttingEdgeHome = $hxClasses["buildings.CuttingEdgeHome"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_CuttingEdgeHome.__name__ = "buildings.CuttingEdgeHome";
buildings_CuttingEdgeHome.__super__ = buildings_House;
buildings_CuttingEdgeHome.prototype = $extend(buildings_House.prototype,{
	get_possibleUpgrades: function() {
		return [buildingUpgrades_BiggerTV,buildingUpgrades_ModernHomePlant,buildingUpgrades_SmartChairs];
	}
	,walkAround: function(citizen,stepsInBuilding) {
		var r = random_Random.getInt(3);
		if(r == 0 && stepsInBuilding > 120) {
			citizen.changeFloorAndWaitRandom(30,60);
		} else if(r == 1) {
			if(citizen.relativeY < 5) {
				citizen.moveAndWait(random_Random.getInt(3,15),random_Random.getInt(30,60),null,false,false);
			} else {
				citizen.moveAndWait(random_Random.getInt(5,15),random_Random.getInt(30,60),null,false,false);
			}
		} else {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 8;
			arr[1] = random_Random.getInt(90,120);
			citizen.setPath(arr,0,2,true);
			citizen.pathEndFunction = null;
			citizen.pathOnlyRelatedTo = citizen.inPermanent;
		}
	}
	,__class__: buildings_CuttingEdgeHome
});
