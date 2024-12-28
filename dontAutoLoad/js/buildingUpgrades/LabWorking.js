var buildingUpgrades_LabWorking = $hxClasses["buildingUpgrades.LabWorking"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.buildingEnabled = true;
};
buildingUpgrades_LabWorking.__name__ = "buildingUpgrades.LabWorking";
buildingUpgrades_LabWorking.__super__ = BuildingUpgrade;
buildingUpgrades_LabWorking.prototype = $extend(BuildingUpgrade.prototype,{
	__class__: buildingUpgrades_LabWorking
});
