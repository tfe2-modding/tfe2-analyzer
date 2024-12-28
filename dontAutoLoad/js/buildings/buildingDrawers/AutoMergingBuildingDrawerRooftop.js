var buildings_buildingDrawers_AutoMergingBuildingDrawerRooftop = $hxClasses["buildings.buildingDrawers.AutoMergingBuildingDrawerRooftop"] = function(building,stage,bgStage,textureName) {
	buildings_buildingDrawers_AutoMergingBuildingDrawer.call(this,building,stage,bgStage,textureName);
};
buildings_buildingDrawers_AutoMergingBuildingDrawerRooftop.__name__ = "buildings.buildingDrawers.AutoMergingBuildingDrawerRooftop";
buildings_buildingDrawers_AutoMergingBuildingDrawerRooftop.__super__ = buildings_buildingDrawers_AutoMergingBuildingDrawer;
buildings_buildingDrawers_AutoMergingBuildingDrawerRooftop.prototype = $extend(buildings_buildingDrawers_AutoMergingBuildingDrawer.prototype,{
	getLeftBuilding: function(bld) {
		if(bld.bottomBuilding == null) {
			var pm = bld.city.getPermanentAtPos(bld.position.x - 20,bld.position.y);
			if(pm != null && pm.isBuilding) {
				return pm;
			}
			return null;
		}
		if(bld.bottomBuilding.leftBuilding == null) {
			return null;
		}
		return bld.bottomBuilding.leftBuilding.topBuilding;
	}
	,getRightBuilding: function(bld) {
		if(bld.bottomBuilding == null) {
			var pm = bld.city.getPermanentAtPos(bld.position.x + 20,bld.position.y);
			if(pm != null && pm.isBuilding) {
				return pm;
			}
			return null;
		}
		if(bld.bottomBuilding.rightBuilding == null) {
			return null;
		}
		return bld.bottomBuilding.rightBuilding.topBuilding;
	}
	,__class__: buildings_buildingDrawers_AutoMergingBuildingDrawerRooftop
});
