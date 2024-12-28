var buildings_WorkWithHome = $hxClasses["buildings.WorkWithHome"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.yearsToLiveLongerPerYearIfLivingHere = 0.0;
	this.residents = [];
	this.extraCapacity = 0;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_WorkWithHome.__name__ = "buildings.WorkWithHome";
buildings_WorkWithHome.__interfaces__ = [buildings_IHousing];
buildings_WorkWithHome.__super__ = buildings_Work;
buildings_WorkWithHome.prototype = $extend(buildings_Work.prototype,{
	get_residentCapacity: function() {
		if(this.info.residents == null) {
			return 0;
		} else {
			return this.info.residents + this.extraCapacity;
		}
	}
	,get_baseAttractiveness: function() {
		return this.info.quality;
	}
	,get_possibleUpgrades: function() {
		return [];
	}
	,get_remainingCapacity: function() {
		return this.get_residentCapacity() - this.residents.length;
	}
	,get_fixedCapacityForWorkers: function() {
		var val1 = this.get_jobs();
		var val2 = this.get_residentCapacity();
		if(val2 < val1) {
			return val2;
		} else {
			return val1;
		}
	}
	,get_hasPrivateTeleporter: function() {
		return false;
	}
	,destroy: function() {
		buildings_Work.prototype.destroy.call(this);
		while(this.residents.length != 0) this.residents[this.residents.length - 1].evictFromHome();
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		var tmp = this.city.gui;
		var tmp1 = Resources.getTexture("spr_housing");
		var city = this.city;
		var citizens = this.residents;
		var topText = common_Localize.lo("residents_of",[this.get_name()]);
		var relatedBuilding = this;
		var nothingFoundText = common_Localize.lo("no_residents");
		tmp.windowAddSimpleButton(tmp1,function() {
			gui_MultiFollowWindow.createWindow(city,citizens,topText,relatedBuilding,nothingFoundText);
		},null,function() {
			return common_Localize.lo("residents",[_gthis.residents.length,_gthis.get_residentCapacity()]);
		});
		buildings_Work.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("quality",[_gthis.get_baseAttractiveness() + _gthis.bonusAttractiveness]);
		});
	}
	,walkAround: function(citizen,stepsInBuilding) {
		var r = random_Random.getInt(4);
		if(r == 0 && stepsInBuilding > 120) {
			citizen.changeFloorAndWaitRandom(30,60);
		} else if(r == 1) {
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
	,__class__: buildings_WorkWithHome
});
