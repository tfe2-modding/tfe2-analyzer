var buildingUpgrades_FactoryDisabled = $hxClasses["buildingUpgrades.FactoryDisabled"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.buildingEnabled = false;
};
buildingUpgrades_FactoryDisabled.__name__ = "buildingUpgrades.FactoryDisabled";
buildingUpgrades_FactoryDisabled.__super__ = BuildingUpgrade;
buildingUpgrades_FactoryDisabled.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		this.building.buildingEnabled = true;
	}
	,__class__: buildingUpgrades_FactoryDisabled
});
