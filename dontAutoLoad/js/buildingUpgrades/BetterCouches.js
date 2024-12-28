var buildingUpgrades_BetterCouches = $hxClasses["buildingUpgrades.BetterCouches"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
};
buildingUpgrades_BetterCouches.__name__ = "buildingUpgrades.BetterCouches";
buildingUpgrades_BetterCouches.__super__ = BuildingUpgrade;
buildingUpgrades_BetterCouches.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_partyhouse_bettercouch";
	}
	,get_bonusAttractiveness: function() {
		return 20;
	}
	,__class__: buildingUpgrades_BetterCouches
});
