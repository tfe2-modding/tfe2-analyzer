var buildingUpgrades_SmartChairs = $hxClasses["buildingUpgrades.SmartChairs"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
};
buildingUpgrades_SmartChairs.__name__ = "buildingUpgrades.SmartChairs";
buildingUpgrades_SmartChairs.__super__ = BuildingUpgrade;
buildingUpgrades_SmartChairs.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_smartchairs";
	}
	,get_bonusAttractiveness: function() {
		return 10;
	}
	,__class__: buildingUpgrades_SmartChairs
});
