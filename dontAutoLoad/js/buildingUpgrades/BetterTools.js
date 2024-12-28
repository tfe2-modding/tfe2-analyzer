var buildingUpgrades_BetterTools = $hxClasses["buildingUpgrades.BetterTools"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
};
buildingUpgrades_BetterTools.__name__ = "buildingUpgrades.BetterTools";
buildingUpgrades_BetterTools.__super__ = BuildingUpgrade;
buildingUpgrades_BetterTools.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_tinkerershouse_bettertools";
	}
	,get_bonusAttractiveness: function() {
		return 20;
	}
	,__class__: buildingUpgrades_BetterTools
});
