var buildings_BlossomDome = $hxClasses["buildings.BlossomDome"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_BlossomRestaurant.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.drawer.mergeClass = buildings_OtherworldlyGardens;
	this.drawer.changeTextureGroup("spr_bloomrestaurant");
};
buildings_BlossomDome.__name__ = "buildings.BlossomDome";
buildings_BlossomDome.__super__ = buildings_BlossomRestaurant;
buildings_BlossomDome.prototype = $extend(buildings_BlossomRestaurant.prototype,{
	get_drawerType: function() {
		return buildings_buildingDrawers_RooftopDownMergingDrawer;
	}
	,couldStandHere: function() {
		if(this.bottomBuilding != null) {
			if(!this.bottomBuilding.is(buildings_BlossomHut)) {
				return !this.bottomBuilding.is(buildings_BlossomRestaurant);
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
	,__class__: buildings_BlossomDome
});
