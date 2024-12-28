var buildingUpgrades_MisdirectorDisabled = $hxClasses["buildingUpgrades.MisdirectorDisabled"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.mode = buildings_MisdirectorMode.Disabled;
	common_Achievements.achieve("DISABLE_MISDIRECTOR");
};
buildingUpgrades_MisdirectorDisabled.__name__ = "buildingUpgrades.MisdirectorDisabled";
buildingUpgrades_MisdirectorDisabled.__super__ = BuildingUpgrade;
buildingUpgrades_MisdirectorDisabled.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		var misdirector = this.building;
		misdirector.mode = buildings_MisdirectorMode.Disabled;
	}
	,__class__: buildingUpgrades_MisdirectorDisabled
});
