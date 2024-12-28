var buildingUpgrades_EnhancedAudio = $hxClasses["buildingUpgrades.EnhancedAudio"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
	building.nightClubEntertainmentQuantity += 20;
};
buildingUpgrades_EnhancedAudio.__name__ = "buildingUpgrades.EnhancedAudio";
buildingUpgrades_EnhancedAudio.__super__ = BuildingUpgrade;
buildingUpgrades_EnhancedAudio.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_partyhouse_enhancedAudio";
	}
	,get_bonusAttractiveness: function() {
		return 15;
	}
	,__class__: buildingUpgrades_EnhancedAudio
});
