var buildingUpgrades_IndoorPond = $hxClasses["buildingUpgrades.IndoorPond"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
};
buildingUpgrades_IndoorPond.__name__ = "buildingUpgrades.IndoorPond";
buildingUpgrades_IndoorPond.__super__ = BuildingUpgrade;
buildingUpgrades_IndoorPond.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_communityhouse_indoorpond";
	}
	,get_bonusAttractiveness: function() {
		return 15;
	}
	,__class__: buildingUpgrades_IndoorPond
});
