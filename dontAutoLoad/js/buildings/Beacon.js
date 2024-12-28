var buildings_Beacon = $hxClasses["buildings.Beacon"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.lightSpr = new PIXI.Sprite(Resources.getTexture("spr_beacon_light"));
	stage.addChild(this.lightSpr);
	this.positionSprites();
};
buildings_Beacon.__name__ = "buildings.Beacon";
buildings_Beacon.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_Beacon.__super__ = Building;
buildings_Beacon.prototype = $extend(Building.prototype,{
	get_isOpen: function() {
		return true;
	}
	,get_entertainmentType: function() {
		return 3;
	}
	,get_secondaryEntertainmentTypes: function() {
		return null;
	}
	,get_minimumNormalTimeToSpend: function() {
		return 1.5;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 3;
	}
	,get_minimumEntertainmentGroupSatisfy: function() {
		return 2;
	}
	,get_maximumEntertainmentGroupSatisfy: function() {
		return 3;
	}
	,get_entertainmentQuality: function() {
		return 100;
	}
	,get_baseEntertainmentCapacity: function() {
		return 50;
	}
	,get_isOpenForExistingVisitors: function() {
		return true;
	}
	,finishEntertainment: function(citizen,timeMod) {
		return true;
	}
	,destroy: function() {
		Building.prototype.destroy.call(this);
		if(this.lightSpr != null) {
			this.lightSpr.destroy();
		}
	}
	,positionSprites: function() {
		Building.prototype.positionSprites.call(this);
		this.lightSpr.position.set(this.position.x + 8,this.position.y + 1);
		this.lightSpr.alpha = 0;
	}
	,update: function(timeMod) {
		Building.prototype.update.call(this,timeMod);
		if(((this.city.simulation.time.timeSinceStart | 0) / 60 | 0) % 24 < 6 || ((this.city.simulation.time.timeSinceStart | 0) / 60 | 0) % 24 > 20.5) {
			this.lightSpr.alpha = 1;
		} else if(((this.city.simulation.time.timeSinceStart | 0) / 60 | 0) % 24 < 6.5) {
			this.lightSpr.alpha = (6.5 - this.city.simulation.time.timeSinceStart / 60 % 24) * 2;
		} else if(((this.city.simulation.time.timeSinceStart | 0) / 60 | 0) % 24 > 20) {
			this.lightSpr.alpha = (this.city.simulation.time.timeSinceStart / 60 % 24 - 20) * 2;
		} else {
			this.lightSpr.alpha = 0;
		}
	}
	,beEntertained: function(citizen,timeMod) {
		if(random_Random.getFloat() < 0.5) {
			citizen.moveAndWait(random_Random.getInt(4,8),random_Random.getInt(60,90),null,false,false);
		} else {
			citizen.moveAndWait(random_Random.getInt(11,15),random_Random.getInt(60,90),null,false,false);
		}
	}
	,addWindowInfoLines: function() {
		Building.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(common_Localize.lo("beacon_credits"));
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Building.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_Beacon.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		Building.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_Beacon
});
