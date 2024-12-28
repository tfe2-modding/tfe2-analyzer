var buildingUpgrades_FactoryUsingFood = $hxClasses["buildingUpgrades.FactoryUsingFood"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.currentMaterialUsed = 0;
};
buildingUpgrades_FactoryUsingFood.__name__ = "buildingUpgrades.FactoryUsingFood";
buildingUpgrades_FactoryUsingFood.__super__ = BuildingUpgrade;
buildingUpgrades_FactoryUsingFood.prototype = $extend(BuildingUpgrade.prototype,{
	__class__: buildingUpgrades_FactoryUsingFood
});
