var buildingUpgrades_StarDatabase = $hxClasses["buildingUpgrades.StarDatabase"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
	building.hasStarDatabase = true;
};
buildingUpgrades_StarDatabase.__name__ = "buildingUpgrades.StarDatabase";
buildingUpgrades_StarDatabase.__super__ = BuildingUpgrade;
buildingUpgrades_StarDatabase.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_computer_observatory";
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		var obs = this.building;
		obs.hasStarDatabase = false;
	}
	,__class__: buildingUpgrades_StarDatabase
});
