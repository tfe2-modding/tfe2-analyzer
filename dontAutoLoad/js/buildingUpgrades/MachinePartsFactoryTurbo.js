var buildingUpgrades_MachinePartsFactoryTurbo = $hxClasses["buildingUpgrades.MachinePartsFactoryTurbo"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.buildingEnabled = true;
	building.efficiency += 2;
	building.materialsMadePerStepPerWorker += 0.0015;
};
buildingUpgrades_MachinePartsFactoryTurbo.__name__ = "buildingUpgrades.MachinePartsFactoryTurbo";
buildingUpgrades_MachinePartsFactoryTurbo.__super__ = BuildingUpgrade;
buildingUpgrades_MachinePartsFactoryTurbo.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		var mpf = this.building;
		mpf.efficiency -= 2;
		mpf.materialsMadePerStepPerWorker -= 0.0015;
	}
	,__class__: buildingUpgrades_MachinePartsFactoryTurbo
});
