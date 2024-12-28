var buildings_HouseOfTheKeyFriends = $hxClasses["buildings.HouseOfTheKeyFriends"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_HouseOfTheKeyFriends.__name__ = "buildings.HouseOfTheKeyFriends";
buildings_HouseOfTheKeyFriends.__super__ = buildings_House;
buildings_HouseOfTheKeyFriends.prototype = $extend(buildings_House.prototype,{
	walkAround: function(citizen,stepsInBuilding) {
		var r = random_Random.getInt(5);
		if(r == 0 && stepsInBuilding > 120) {
			citizen.changeFloorAndWaitRandom(30,60);
		} else if(r == 1 || r == 2 && citizen.relativeY < 5) {
			citizen.moveAndWait(random_Random.getInt(3,7),random_Random.getInt(30,60),null,false,false);
		} else if(r == 2) {
			citizen.moveAndWait(random_Random.getInt(12,16),random_Random.getInt(30,60),null,false,false);
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
	,__class__: buildings_HouseOfTheKeyFriends
});
