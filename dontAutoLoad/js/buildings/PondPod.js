var buildings_PondPod = $hxClasses["buildings.PondPod"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.borderSprite = null;
	buildings_ParkPod.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_PondPod.__name__ = "buildings.PondPod";
buildings_PondPod.__super__ = buildings_ParkPod;
buildings_PondPod.prototype = $extend(buildings_ParkPod.prototype,{
	get_parkTexturesStr: function() {
		return "spr_pondpod";
	}
	,destroy: function() {
		buildings_ParkPod.prototype.destroy.call(this);
		if(this.borderSprite != null) {
			this.borderSprite.destroy();
			this.borderSprite = null;
		}
	}
	,walkAround: function(citizen,stepsInBuilding) {
		if(citizen.relativeX == 9) {
			citizen.canViewSelfInBuilding = false;
			citizen.setRelativeY(6);
		} else {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 4;
			arr[1] = 9;
			citizen.setPath(arr,0,2,true);
			citizen.pathEndFunction = null;
			citizen.pathOnlyRelatedTo = citizen.inPermanent;
		}
	}
	,postLoad: function() {
		buildings_ParkPod.prototype.postLoad.call(this);
	}
	,onCityChange: function() {
		buildings_ParkPod.prototype.onCityChange.call(this);
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
		buildings_ParkPod.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_PondPod.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_ParkPod.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		this.postLoad();
	}
	,__class__: buildings_PondPod
});
