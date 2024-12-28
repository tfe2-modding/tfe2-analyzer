var buildingUpgrades_RocketFuelFactoryEfficiency = $hxClasses["buildingUpgrades.RocketFuelFactoryEfficiency"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.efficiency -= 0.5;
	building.materialsMadePerStepPerWorker += 0.0005;
};
buildingUpgrades_RocketFuelFactoryEfficiency.__name__ = "buildingUpgrades.RocketFuelFactoryEfficiency";
buildingUpgrades_RocketFuelFactoryEfficiency.__super__ = BuildingUpgrade;
buildingUpgrades_RocketFuelFactoryEfficiency.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		this.building.efficiency += 0.5;
		this.building.materialsMadePerStepPerWorker += 0.0005;
	}
	,__class__: buildingUpgrades_RocketFuelFactoryEfficiency
});
