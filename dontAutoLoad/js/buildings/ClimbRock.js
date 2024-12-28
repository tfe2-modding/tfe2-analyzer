var buildings_ClimbRock = $hxClasses["buildings.ClimbRock"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.rockSprite = new PIXI.Sprite();
	this.rockTextures = Resources.getTexturesByWidth("spr_climbingrock",20);
	this.rockSprite.texture = this.rockTextures[0];
	this.rockSprite.position.set(position.x,position.y + 3);
	bgStage.addChild(this.rockSprite);
	this.isEntertainment = true;
};
buildings_ClimbRock.__name__ = "buildings.ClimbRock";
buildings_ClimbRock.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_ClimbRock.__super__ = Building;
buildings_ClimbRock.prototype = $extend(Building.prototype,{
	get_baseEntertainmentCapacity: function() {
		return 20;
	}
	,get_isOpen: function() {
		var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
		if(this1 >= 6.0) {
			return this1 < 22;
		} else {
			return false;
		}
	}
	,get_entertainmentType: function() {
		return null;
	}
	,get_secondaryEntertainmentTypes: function() {
		return [1];
	}
	,get_minimumNormalTimeToSpend: function() {
		return 1.5;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 2.5;
	}
	,get_minimumEntertainmentGroupSatisfy: function() {
		return 1;
	}
	,get_maximumEntertainmentGroupSatisfy: function() {
		return 1.75;
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
	}
	,destroy: function() {
		Building.prototype.destroy.call(this);
		this.rockSprite.destroy();
		this.rockSprite = null;
	}
	,onCityChange: function() {
		Building.prototype.onCityChange.call(this);
		if(this.rockSprite != null) {
			this.rockSprite.position.set(this.position.x,this.position.y + 3);
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Building.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_ClimbRock.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		Building.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_ClimbRock
});
