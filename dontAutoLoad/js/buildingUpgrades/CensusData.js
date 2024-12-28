var buildingUpgrades_CensusData = $hxClasses["buildingUpgrades.CensusData"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.bldMode = 0;
};
buildingUpgrades_CensusData.__name__ = "buildingUpgrades.CensusData";
buildingUpgrades_CensusData.__super__ = BuildingUpgrade;
buildingUpgrades_CensusData.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
	}
	,__class__: buildingUpgrades_CensusData
});
