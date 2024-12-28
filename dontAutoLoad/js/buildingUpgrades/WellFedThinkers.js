var buildingUpgrades_WellFedThinkers = $hxClasses["buildingUpgrades.WellFedThinkers"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.bldMode = 1;
};
buildingUpgrades_WellFedThinkers.__name__ = "buildingUpgrades.WellFedThinkers";
buildingUpgrades_WellFedThinkers.__super__ = BuildingUpgrade;
buildingUpgrades_WellFedThinkers.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
	}
	,__class__: buildingUpgrades_WellFedThinkers
});
