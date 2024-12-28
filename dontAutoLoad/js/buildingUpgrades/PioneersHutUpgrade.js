var buildingUpgrades_PioneersHutUpgrade = $hxClasses["buildingUpgrades.PioneersHutUpgrade"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
};
buildingUpgrades_PioneersHutUpgrade.__name__ = "buildingUpgrades.PioneersHutUpgrade";
buildingUpgrades_PioneersHutUpgrade.__super__ = BuildingUpgrade;
buildingUpgrades_PioneersHutUpgrade.prototype = $extend(BuildingUpgrade.prototype,{
	get_bonusAttractiveness: function() {
		return 40;
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
	}
	,__class__: buildingUpgrades_PioneersHutUpgrade
});
