var buildings_SportPark = $hxClasses["buildings.SportPark"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_Park.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_SportPark.__name__ = "buildings.SportPark";
buildings_SportPark.__super__ = buildings_Park;
buildings_SportPark.prototype = $extend(buildings_Park.prototype,{
	get_myParkTextures: function() {
		return "spr_parkgym";
	}
	,get_changePlantsText: function() {
		return common_Localize.lo("change_equipment");
	}
	,get_entertainmentType: function() {
		return 6;
	}
	,get_baseEntertainmentCapacity: function() {
		return 30;
	}
	,get_numberOfLockedParkTextures: function() {
		return 0;
	}
	,beEntertained: function(citizen,timeMod) {
		if(!citizen.hasBuildingInited) {
			citizen.dieAgeModifier += 0.025 * ((this.get_baseEntertainmentCapacity() + this.bonusEntertainmentCapacity) / 40);
			citizen.hasBuildingInited = true;
		}
		switch(this.currentTexture) {
		case 0:
			switch(random_Random.getInt(6)) {
			case 0:
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[8].length > 0 ? pool[8].splice(pool[8].length - 1,1)[0] : new Int32Array(8);
				arr[0] = 4;
				arr[1] = 1;
				arr[2] = 17;
				arr[3] = 4;
				arr[4] = 8;
				arr[5] = 60;
				arr[6] = 17;
				arr[7] = 0;
				citizen.setPath(arr,0,8,true);
				break;
			case 1:
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[8].length > 0 ? pool[8].splice(pool[8].length - 1,1)[0] : new Int32Array(8);
				arr[0] = 4;
				arr[1] = 4;
				arr[2] = 17;
				arr[3] = 6;
				arr[4] = 8;
				arr[5] = 60;
				arr[6] = 17;
				arr[7] = 0;
				citizen.setPath(arr,0,8,true);
				break;
			case 2:
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[8].length > 0 ? pool[8].splice(pool[8].length - 1,1)[0] : new Int32Array(8);
				arr[0] = 4;
				arr[1] = 9;
				arr[2] = 17;
				arr[3] = 9;
				arr[4] = 8;
				arr[5] = 90;
				arr[6] = 17;
				arr[7] = 0;
				citizen.setPath(arr,0,8,true);
				break;
			case 3:
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[8].length > 0 ? pool[8].splice(pool[8].length - 1,1)[0] : new Int32Array(8);
				arr[0] = 4;
				arr[1] = 10;
				arr[2] = 17;
				arr[3] = 9;
				arr[4] = 8;
				arr[5] = 90;
				arr[6] = 17;
				arr[7] = 0;
				citizen.setPath(arr,0,8,true);
				break;
			case 4:
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[10].length > 0 ? pool[10].splice(pool[10].length - 1,1)[0] : new Int32Array(10);
				arr[0] = 4;
				arr[1] = 14;
				arr[2] = 17;
				arr[3] = 4;
				arr[4] = 12;
				arr[5] = 25;
				arr[6] = 4;
				arr[7] = 18;
				arr[8] = 17;
				arr[9] = 0;
				citizen.setPath(arr,0,10,true);
				break;
			case 5:
				citizen.setPath(new Int32Array([4,4,17,7,8,5,17,4,8,5,17,7,8,5,17,4,8,5,17,0]),0,20);
				break;
			}
			break;
		case 1:
			switch(random_Random.getInt(5)) {
			case 0:
				citizen.setPath(new Int32Array([4,1,17,9,8,5,4,10,8,5,17,0]),0,12);
				break;
			case 1:
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[8].length > 0 ? pool[8].splice(pool[8].length - 1,1)[0] : new Int32Array(8);
				arr[0] = 4;
				arr[1] = 14;
				arr[2] = 17;
				arr[3] = 6;
				arr[4] = 8;
				arr[5] = 60;
				arr[6] = 17;
				arr[7] = 0;
				citizen.setPath(arr,0,8,true);
				break;
			case 2:
				citizen.setPath(new Int32Array([4,14,17,7,8,5,17,4,8,5,17,7,8,5,17,4,8,5,17,0]),0,20);
				break;
			case 3:
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[8].length > 0 ? pool[8].splice(pool[8].length - 1,1)[0] : new Int32Array(8);
				arr[0] = 4;
				arr[1] = 11;
				arr[2] = 17;
				arr[3] = 9;
				arr[4] = 8;
				arr[5] = 90;
				arr[6] = 17;
				arr[7] = 0;
				citizen.setPath(arr,0,8,true);
				break;
			case 4:
				citizen.setPath(new Int32Array([4,10,17,9,8,5,4,2,8,5,17,0]),0,12);
				break;
			}
			break;
		}
	}
	,onCityChange: function() {
		buildings_Park.prototype.onCityChange.call(this);
		this.bonusEntertainmentCapacity = 0;
		if(this.leftBuilding != null && this.drawer.currentTextureGroupName == this.leftBuilding.drawer.currentTextureGroupName) {
			this.bonusEntertainmentCapacity += 5;
		}
		if(this.rightBuilding != null && this.drawer.currentTextureGroupName == this.rightBuilding.drawer.currentTextureGroupName) {
			this.bonusEntertainmentCapacity += 5;
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Park.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_SportPark.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_Park.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_SportPark
});
