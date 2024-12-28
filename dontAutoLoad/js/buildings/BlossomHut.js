var buildings_BlossomHut = $hxClasses["buildings.BlossomHut"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.get_mergingDrawer().setBackgroundTextures("spr_bloomhouse");
};
buildings_BlossomHut.__name__ = "buildings.BlossomHut";
buildings_BlossomHut.__super__ = buildings_House;
buildings_BlossomHut.prototype = $extend(buildings_House.prototype,{
	get_drawerType: function() {
		return buildings_buildingDrawers_AllDirMergingBuildingDrawer;
	}
	,get_mergingDrawer: function() {
		return this.drawer;
	}
	,postCreate: function() {
		buildings_House.prototype.postCreate.call(this);
		this.positionSprites();
	}
	,positionSprites: function() {
		buildings_House.prototype.positionSprites.call(this);
	}
	,walkAround: function(citizen,stepsInBuilding) {
		if(citizen.relativeX == 9) {
			citizen.canViewSelfInBuilding = false;
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
	,__class__: buildings_BlossomHut
});
