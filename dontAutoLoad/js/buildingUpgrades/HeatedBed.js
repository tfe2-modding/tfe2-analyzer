var buildingUpgrades_HeatedBed = $hxClasses["buildingUpgrades.HeatedBed"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.hasHeatedBed = true;
	building.onCityChange();
};
buildingUpgrades_HeatedBed.__name__ = "buildingUpgrades.HeatedBed";
buildingUpgrades_HeatedBed.__super__ = BuildingUpgrade;
buildingUpgrades_HeatedBed.prototype = $extend(BuildingUpgrade.prototype,{
	get_bonusAttractiveness: function() {
		return 20;
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		this.building.hasHeatedBed = false;
	}
	,__class__: buildingUpgrades_HeatedBed
});
