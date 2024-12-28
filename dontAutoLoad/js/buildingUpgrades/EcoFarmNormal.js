var buildingUpgrades_EcoFarmNormal = $hxClasses["buildingUpgrades.EcoFarmNormal"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.buildingIsPruning = false;
	if(building.growthAreas != null) {
		building.growthAreas[0].growSpeed = 0.595;
		building.growthAreas[0].passiveGrowSpeed = 0.0084;
		building.growthAreas[0].passiveGrowSpeedBadLight = 0.0042;
	}
};
buildingUpgrades_EcoFarmNormal.__name__ = "buildingUpgrades.EcoFarmNormal";
buildingUpgrades_EcoFarmNormal.__super__ = BuildingUpgrade;
buildingUpgrades_EcoFarmNormal.prototype = $extend(BuildingUpgrade.prototype,{
	__class__: buildingUpgrades_EcoFarmNormal
});
