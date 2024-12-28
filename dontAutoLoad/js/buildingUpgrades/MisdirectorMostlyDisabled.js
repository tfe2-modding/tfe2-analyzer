var buildingUpgrades_MisdirectorMostlyDisabled = $hxClasses["buildingUpgrades.MisdirectorMostlyDisabled"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.mode = buildings_MisdirectorMode.MostlyDisabled;
};
buildingUpgrades_MisdirectorMostlyDisabled.__name__ = "buildingUpgrades.MisdirectorMostlyDisabled";
buildingUpgrades_MisdirectorMostlyDisabled.__super__ = BuildingUpgrade;
buildingUpgrades_MisdirectorMostlyDisabled.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		var misdirector = this.building;
		misdirector.mode = buildings_MisdirectorMode.Normal;
	}
	,__class__: buildingUpgrades_MisdirectorMostlyDisabled
});
