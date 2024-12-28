var buildingUpgrades_MoodLighting = $hxClasses["buildingUpgrades.MoodLighting"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
};
buildingUpgrades_MoodLighting.__name__ = "buildingUpgrades.MoodLighting";
buildingUpgrades_MoodLighting.__super__ = BuildingUpgrade;
buildingUpgrades_MoodLighting.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_cozyhouse_moodlighting";
	}
	,get_bonusAttractiveness: function() {
		return 20;
	}
	,__class__: buildingUpgrades_MoodLighting
});
