var buildingUpgrades_MisdirectorAlways = $hxClasses["buildingUpgrades.MisdirectorAlways"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.mode = buildings_MisdirectorMode.Always;
};
buildingUpgrades_MisdirectorAlways.__name__ = "buildingUpgrades.MisdirectorAlways";
buildingUpgrades_MisdirectorAlways.__super__ = BuildingUpgrade;
buildingUpgrades_MisdirectorAlways.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		var misdirector = this.building;
		misdirector.mode = buildings_MisdirectorMode.Always;
	}
	,__class__: buildingUpgrades_MisdirectorAlways
});
