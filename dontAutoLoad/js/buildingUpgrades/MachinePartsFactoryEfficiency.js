var buildingUpgrades_MachinePartsFactoryEfficiency = $hxClasses["buildingUpgrades.MachinePartsFactoryEfficiency"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.efficiency -= 1;
};
buildingUpgrades_MachinePartsFactoryEfficiency.__name__ = "buildingUpgrades.MachinePartsFactoryEfficiency";
buildingUpgrades_MachinePartsFactoryEfficiency.__super__ = BuildingUpgrade;
buildingUpgrades_MachinePartsFactoryEfficiency.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		this.building.efficiency += 1;
	}
	,__class__: buildingUpgrades_MachinePartsFactoryEfficiency
});
