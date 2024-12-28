var buildingUpgrades_MisdirectorNormal = $hxClasses["buildingUpgrades.MisdirectorNormal"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.mode = buildings_MisdirectorMode.Normal;
};
buildingUpgrades_MisdirectorNormal.__name__ = "buildingUpgrades.MisdirectorNormal";
buildingUpgrades_MisdirectorNormal.__super__ = BuildingUpgrade;
buildingUpgrades_MisdirectorNormal.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		var misdirector = this.building;
		misdirector.mode = buildings_MisdirectorMode.Normal;
	}
	,__class__: buildingUpgrades_MisdirectorNormal
});
