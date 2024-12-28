var buildingUpgrades_RefinedMetalsFactoryHack = $hxClasses["buildingUpgrades.RefinedMetalsFactoryHack"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.buildingEnabled = true;
	building.efficiencyNorm += 1;
	building.materialsMadePerStepPerWorkerNorm += 0.0005;
	building.onCityChange();
};
buildingUpgrades_RefinedMetalsFactoryHack.__name__ = "buildingUpgrades.RefinedMetalsFactoryHack";
buildingUpgrades_RefinedMetalsFactoryHack.__super__ = BuildingUpgrade;
buildingUpgrades_RefinedMetalsFactoryHack.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		var mpf = this.building;
		mpf.efficiencyNorm -= 1;
		mpf.materialsMadePerStepPerWorkerNorm -= 0.0005;
		this.building.onCityChange();
	}
	,__class__: buildingUpgrades_RefinedMetalsFactoryHack
});
