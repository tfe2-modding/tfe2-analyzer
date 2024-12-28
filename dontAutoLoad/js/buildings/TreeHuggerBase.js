var buildings_TreeHuggerBase = $hxClasses["buildings.TreeHuggerBase"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.parkSprite = null;
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.parkSprite = new PIXI.Sprite(Resources.getTexture("spr_treehuggerbase"));
	this.parkSprite.position.set(position.x,position.y);
	bgStage.addChild(this.parkSprite);
};
buildings_TreeHuggerBase.__name__ = "buildings.TreeHuggerBase";
buildings_TreeHuggerBase.__super__ = buildings_House;
buildings_TreeHuggerBase.prototype = $extend(buildings_House.prototype,{
	get_drawerType: function() {
		return buildings_buildingDrawers_AutoMergingBuildingDrawer;
	}
	,get_mergingDrawer: function() {
		return this.drawer;
	}
	,onBuild: function() {
		buildings_House.prototype.onBuild.call(this);
		common_Achievements.achieve("TREE_HUGGER");
	}
	,postCreate: function() {
		buildings_House.prototype.postCreate.call(this);
		this.positionSprites();
	}
	,positionSprites: function() {
		buildings_House.prototype.positionSprites.call(this);
		if(this.parkSprite != null) {
			this.parkSprite.position.set(this.position.x,this.position.y);
		}
	}
	,destroy: function() {
		buildings_House.prototype.destroy.call(this);
		this.parkSprite.destroy();
	}
	,walkAround: function(citizen,stepsInBuilding) {
		if(citizen.relativeX == 10) {
			citizen.canViewSelfInBuilding = false;
		} else {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 4;
			arr[1] = 10;
			citizen.setPath(arr,0,2,true);
			citizen.pathEndFunction = null;
			citizen.pathOnlyRelatedTo = citizen.inPermanent;
		}
	}
	,__class__: buildings_TreeHuggerBase
});
