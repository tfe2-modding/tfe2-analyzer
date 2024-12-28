var buildingUpgrades_LabDisabled = $hxClasses["buildingUpgrades.LabDisabled"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.buildingEnabled = false;
};
buildingUpgrades_LabDisabled.__name__ = "buildingUpgrades.LabDisabled";
buildingUpgrades_LabDisabled.__super__ = BuildingUpgrade;
buildingUpgrades_LabDisabled.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		this.building.buildingEnabled = true;
	}
	,__class__: buildingUpgrades_LabDisabled
});
