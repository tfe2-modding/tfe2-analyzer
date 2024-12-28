var buildingUpgrades_BiggerTV = $hxClasses["buildingUpgrades.BiggerTV"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
	building.extraCapacity += 1;
};
buildingUpgrades_BiggerTV.__name__ = "buildingUpgrades.BiggerTV";
buildingUpgrades_BiggerTV.__super__ = BuildingUpgrade;
buildingUpgrades_BiggerTV.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_biggertv";
	}
	,get_bonusAttractiveness: function() {
		return 5;
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		this.building.extraCapacity -= 1;
	}
	,__class__: buildingUpgrades_BiggerTV
});
