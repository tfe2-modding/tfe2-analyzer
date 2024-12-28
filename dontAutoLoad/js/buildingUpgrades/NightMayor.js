var buildingUpgrades_NightMayor = $hxClasses["buildingUpgrades.NightMayor"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.bldMode = 1;
};
buildingUpgrades_NightMayor.__name__ = "buildingUpgrades.NightMayor";
buildingUpgrades_NightMayor.__super__ = BuildingUpgrade;
buildingUpgrades_NightMayor.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
	}
	,__class__: buildingUpgrades_NightMayor
});
