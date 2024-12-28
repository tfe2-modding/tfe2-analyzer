var buildingUpgrades_AutomaticWaterManagement = $hxClasses["buildingUpgrades.AutomaticWaterManagement"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.regrowSpeedBoost += 2;
};
buildingUpgrades_AutomaticWaterManagement.__name__ = "buildingUpgrades.AutomaticWaterManagement";
buildingUpgrades_AutomaticWaterManagement.__super__ = BuildingUpgrade;
buildingUpgrades_AutomaticWaterManagement.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		this.building.regrowSpeedBoost -= 2;
	}
	,__class__: buildingUpgrades_AutomaticWaterManagement
});
