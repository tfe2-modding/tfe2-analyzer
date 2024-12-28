var buildings_UnderwaterHouse = $hxClasses["buildings.UnderwaterHouse"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.justBuilt = false;
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.adjecentBuildingEffects.push({ name : "modernRusticHomeCommunityFeeling", intensity : 1});
	this.leftIsWaterFilled = false;
	this.rightIsWaterFilled = false;
	this.topIsWaterFilled = false;
	this.bottomIsWaterFilled = false;
	this.houseSprite = new PIXI.Sprite(Resources.getTexture("spr_underwaterhouse"));
	this.houseSprite.position.set(position.x,position.y);
	city.cityMidStage.addChild(this.houseSprite);
};
buildings_UnderwaterHouse.__name__ = "buildings.UnderwaterHouse";
buildings_UnderwaterHouse.__interfaces__ = [buildings_IWaterFilled];
buildings_UnderwaterHouse.__super__ = buildings_House;
buildings_UnderwaterHouse.prototype = $extend(buildings_House.prototype,{
	get_drawerType: function() {
		return buildings_buildingDrawers_AutoMergingBuildingDrawer;
	}
	,get_mergingDrawer: function() {
		return this.drawer;
	}
	,get_walkThroughCanViewSelfInThisBuilding: function() {
		return false;
	}
	,postCreate: function() {
		buildings_House.prototype.postCreate.call(this);
		if(this.justBuilt) {
			this.justBuilt = false;
			this.city.simulation.fishes.fishes.push(new simulation_Fish(this.city,this.city.aboveCitizensInBuildingStage,this,10,11));
		}
		this.positionSprites();
	}
	,destroy: function() {
		buildings_House.prototype.destroy.call(this);
		var fishes = this.city.simulation.fishes.fishes;
		var i = fishes.length;
		while(--i >= 0) if(fishes[i].inPermanent == this) {
			fishes[i].destroy();
		}
		var _this = this.city.cityMidStage;
		var child = this.houseSprite;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
	}
	,onCityChange: function() {
		this.leftIsWaterFilled = this.leftBuilding != null && js_Boot.__implements(this.leftBuilding,buildings_IWaterFilled);
		this.rightIsWaterFilled = this.rightBuilding != null && js_Boot.__implements(this.rightBuilding,buildings_IWaterFilled);
		this.topIsWaterFilled = false;
		this.bottomIsWaterFilled = false;
		if(this.leftIsWaterFilled) {
			this.leftAsWaterFilled = this.leftBuilding;
		} else {
			this.leftAsWaterFilled = null;
		}
		if(this.rightIsWaterFilled) {
			this.rightAsWaterFilled = this.rightBuilding;
		} else {
			this.rightAsWaterFilled = null;
		}
		this.houseSprite.position.set(this.position.x,this.position.y);
	}
	,onBuild: function() {
		buildings_House.prototype.onBuild.call(this);
		this.justBuilt = true;
	}
	,walkAround: function(citizen,stepsInBuilding) {
		citizen.setRelativeY(6);
		citizen.canViewSelfInBuilding = true;
		if(citizen.relativeX < 7 || citizen.relativeX > 11) {
			var val = citizen.relativeX;
			citizen.setRelativeX(val < 7 ? 7 : val > 11 ? 11 : val);
		}
		citizen.moveAndWait(random_Random.getInt(7,11),random_Random.getInt(90,120),null,false,false);
	}
	,__class__: buildings_UnderwaterHouse
});
