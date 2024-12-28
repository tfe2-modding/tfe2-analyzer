var buildingUpgrades_CozyFlowers = $hxClasses["buildingUpgrades.CozyFlowers"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,midStage,building);
};
buildingUpgrades_CozyFlowers.__name__ = "buildingUpgrades.CozyFlowers";
buildingUpgrades_CozyFlowers.__super__ = BuildingUpgrade;
buildingUpgrades_CozyFlowers.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_cozyhouse_flower";
	}
	,get_bonusAttractiveness: function() {
		return 10;
	}
	,__class__: buildingUpgrades_CozyFlowers
});
