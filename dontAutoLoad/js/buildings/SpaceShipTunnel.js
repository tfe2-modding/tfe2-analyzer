var buildings_SpaceShipTunnel = $hxClasses["buildings.SpaceShipTunnel"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_SpaceShipTunnel.__name__ = "buildings.SpaceShipTunnel";
buildings_SpaceShipTunnel.__super__ = Building;
buildings_SpaceShipTunnel.prototype = $extend(Building.prototype,{
	get_drawerType: function() {
		return buildings_buildingDrawers_AllDirMergingBuildingDrawer;
	}
	,get_walkThroughCanViewSelfInThisBuilding: function() {
		if(this.bottomBuilding != null) {
			if(!this.bottomBuilding.is(buildings_LandingSiteTunnel)) {
				return !this.bottomBuilding.is(buildings_SpaceShipTunnel);
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
	,__class__: buildings_SpaceShipTunnel
});
