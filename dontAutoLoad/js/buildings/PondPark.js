var buildings_PondPark = $hxClasses["buildings.PondPark"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.borderSprite = null;
	buildings_Park.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_PondPark.__name__ = "buildings.PondPark";
buildings_PondPark.__super__ = buildings_Park;
buildings_PondPark.prototype = $extend(buildings_Park.prototype,{
	get_myParkTextures: function() {
		return "spr_pondpark";
	}
	,get_numberOfLockedParkTextures: function() {
		return 0;
	}
	,get_baseEntertainmentCapacity: function() {
		return 35;
	}
	,destroy: function() {
		buildings_Park.prototype.destroy.call(this);
		if(this.borderSprite != null) {
			this.borderSprite.destroy();
			this.borderSprite = null;
		}
	}
	,postLoad: function() {
		buildings_Park.prototype.postLoad.call(this);
	}
	,onCityChange: function() {
		buildings_Park.prototype.onCityChange.call(this);
		var image = -1;
		var left = this.leftBuilding != null && !this.leftBuilding.is(buildings_PondPark) && !this.leftBuilding.is(buildings_PondPod);
		var right = this.rightBuilding != null && !this.rightBuilding.is(buildings_PondPark) && !this.rightBuilding.is(buildings_PondPod);
		if(left && right) {
			image = 2;
		} else if(left) {
			image = 0;
		} else if(right) {
			image = 1;
		}
		if(image < 0 && this.borderSprite != null) {
			this.borderSprite.destroy();
			this.borderSprite = null;
		} else if(this.borderSprite == null && image >= 0) {
			this.borderSprite = new PIXI.Sprite();
			this.bgStage.addChild(this.borderSprite);
		}
		if(image >= 0) {
			this.borderSprite.position.set(this.position.x,this.position.y);
			var tmp = Resources.getTexturesByWidth("spr_pondpark_border",20);
			this.borderSprite.texture = tmp[image];
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Park.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_PondPark.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_Park.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		this.postLoad();
	}
	,__class__: buildings_PondPark
});
