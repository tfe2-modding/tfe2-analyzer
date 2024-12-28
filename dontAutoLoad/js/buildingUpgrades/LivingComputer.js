var buildingUpgrades_LivingComputer = $hxClasses["buildingUpgrades.LivingComputer"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
};
buildingUpgrades_LivingComputer.__name__ = "buildingUpgrades.LivingComputer";
buildingUpgrades_LivingComputer.__super__ = BuildingUpgrade;
buildingUpgrades_LivingComputer.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_alienhouse_livingcomputer";
	}
	,get_bonusAttractiveness: function() {
		return 20;
	}
	,__class__: buildingUpgrades_LivingComputer
});
