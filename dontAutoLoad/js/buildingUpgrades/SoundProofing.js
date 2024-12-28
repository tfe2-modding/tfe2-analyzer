var buildingUpgrades_SoundProofing = $hxClasses["buildingUpgrades.SoundProofing"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
};
buildingUpgrades_SoundProofing.__name__ = "buildingUpgrades.SoundProofing";
buildingUpgrades_SoundProofing.__super__ = BuildingUpgrade;
buildingUpgrades_SoundProofing.prototype = $extend(BuildingUpgrade.prototype,{
	get_bonusAttractiveness: function() {
		return 12;
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
	}
	,__class__: buildingUpgrades_SoundProofing
});
