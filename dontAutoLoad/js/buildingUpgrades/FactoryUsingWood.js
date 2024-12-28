var buildingUpgrades_FactoryUsingWood = $hxClasses["buildingUpgrades.FactoryUsingWood"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.currentMaterialUsed = 1;
};
buildingUpgrades_FactoryUsingWood.__name__ = "buildingUpgrades.FactoryUsingWood";
buildingUpgrades_FactoryUsingWood.__super__ = BuildingUpgrade;
buildingUpgrades_FactoryUsingWood.prototype = $extend(BuildingUpgrade.prototype,{
	__class__: buildingUpgrades_FactoryUsingWood
});
