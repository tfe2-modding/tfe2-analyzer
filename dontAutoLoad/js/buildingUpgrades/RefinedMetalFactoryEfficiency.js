var buildingUpgrades_RefinedMetalFactoryEfficiency = $hxClasses["buildingUpgrades.RefinedMetalFactoryEfficiency"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.efficiencyNorm -= 1;
	building.materialsMadePerStepPerWorkerNorm += 0.00015;
	building.onCityChange();
};
buildingUpgrades_RefinedMetalFactoryEfficiency.__name__ = "buildingUpgrades.RefinedMetalFactoryEfficiency";
buildingUpgrades_RefinedMetalFactoryEfficiency.__super__ = BuildingUpgrade;
buildingUpgrades_RefinedMetalFactoryEfficiency.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		this.building.efficiencyNorm += 1;
		this.building.materialsMadePerStepPerWorkerNorm -= 0.00015;
		this.building.onCityChange();
	}
	,__class__: buildingUpgrades_RefinedMetalFactoryEfficiency
});
