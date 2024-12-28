var buildingUpgrades_FactoryWorking = $hxClasses["buildingUpgrades.FactoryWorking"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.buildingEnabled = true;
};
buildingUpgrades_FactoryWorking.__name__ = "buildingUpgrades.FactoryWorking";
buildingUpgrades_FactoryWorking.__super__ = BuildingUpgrade;
buildingUpgrades_FactoryWorking.prototype = $extend(BuildingUpgrade.prototype,{
	__class__: buildingUpgrades_FactoryWorking
});
