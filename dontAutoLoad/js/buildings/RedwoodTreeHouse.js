var buildings_RedwoodTreeHouse = $hxClasses["buildings.RedwoodTreeHouse"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.yearsToLiveLongerPerYearIfLivingHere = 0.0;
	this.residents = [];
	this.extraCapacity = 0;
	buildings_RedwoodTree.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_RedwoodTreeHouse.__name__ = "buildings.RedwoodTreeHouse";
buildings_RedwoodTreeHouse.__interfaces__ = [buildings_IHousing];
buildings_RedwoodTreeHouse.__super__ = buildings_RedwoodTree;
buildings_RedwoodTreeHouse.prototype = $extend(buildings_RedwoodTree.prototype,{
	get_drawerType: function() {
		return buildings_buildingDrawers_NormalBuildingDrawer;
	}
	,get_residentCapacity: function() {
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
	,get_hasPrivateTeleporter: function() {
		return false;
	}
	,get_fixedCapacityForWorkers: function() {
		return 0;
	}
	,destroy: function() {
		buildings_RedwoodTree.prototype.destroy.call(this);
		while(this.residents.length != 0) this.residents[this.residents.length - 1].evictFromHome();
	}
	,updateSprite: function() {
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
		buildings_RedwoodTree.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("quality",[_gthis.get_baseAttractiveness() + _gthis.bonusAttractiveness]);
		});
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,4)));
	}
	,walkAround: function(citizen,stepsInBuilding) {
		citizen.setRelativeY(5);
		citizen.moveAndWait(random_Random.getInt(2,17),random_Random.getInt(60,90),null,false,false);
	}
	,__class__: buildings_RedwoodTreeHouse
});
