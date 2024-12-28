var buildingUpgrades_FreeThinkers = $hxClasses["buildingUpgrades.FreeThinkers"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.bldMode = 0;
};
buildingUpgrades_FreeThinkers.__name__ = "buildingUpgrades.FreeThinkers";
buildingUpgrades_FreeThinkers.__super__ = BuildingUpgrade;
buildingUpgrades_FreeThinkers.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
	}
	,__class__: buildingUpgrades_FreeThinkers
});
