var buildingUpgrades_EcoFarmPruning = $hxClasses["buildingUpgrades.EcoFarmPruning"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.buildingIsPruning = true;
	building.growthAreas[0].growSpeed = 0.47599999999999992;
	building.growthAreas[0].passiveGrowSpeed = 0.0067199999999999994;
	building.growthAreas[0].passiveGrowSpeedBadLight = 0.0033599999999999997;
};
buildingUpgrades_EcoFarmPruning.__name__ = "buildingUpgrades.EcoFarmPruning";
buildingUpgrades_EcoFarmPruning.__super__ = BuildingUpgrade;
buildingUpgrades_EcoFarmPruning.prototype = $extend(BuildingUpgrade.prototype,{
	__class__: buildingUpgrades_EcoFarmPruning
});
