var buildingUpgrades_Flowers = $hxClasses["buildingUpgrades.Flowers"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,midStage,building);
};
buildingUpgrades_Flowers.__name__ = "buildingUpgrades.Flowers";
buildingUpgrades_Flowers.__super__ = BuildingUpgrade;
buildingUpgrades_Flowers.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_upgrade_flowers";
	}
	,get_bonusAttractiveness: function() {
		return 5;
	}
	,__class__: buildingUpgrades_Flowers
});
