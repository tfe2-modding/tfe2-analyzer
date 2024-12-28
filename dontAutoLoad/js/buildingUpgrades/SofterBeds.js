var buildingUpgrades_SofterBeds = $hxClasses["buildingUpgrades.SofterBeds"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
};
buildingUpgrades_SofterBeds.__name__ = "buildingUpgrades.SofterBeds";
buildingUpgrades_SofterBeds.__super__ = BuildingUpgrade;
buildingUpgrades_SofterBeds.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_softerbeds";
	}
	,get_bonusAttractiveness: function() {
		return 10;
	}
	,__class__: buildingUpgrades_SofterBeds
});
