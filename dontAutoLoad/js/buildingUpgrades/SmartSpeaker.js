var buildingUpgrades_SmartSpeaker = $hxClasses["buildingUpgrades.SmartSpeaker"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
};
buildingUpgrades_SmartSpeaker.__name__ = "buildingUpgrades.SmartSpeaker";
buildingUpgrades_SmartSpeaker.__super__ = BuildingUpgrade;
buildingUpgrades_SmartSpeaker.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_smartspeaker";
	}
	,get_bonusAttractiveness: function() {
		return 10;
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
	}
	,__class__: buildingUpgrades_SmartSpeaker
});
