var buildingUpgrades_ModernHomePlant = $hxClasses["buildingUpgrades.ModernHomePlant"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
	building.yearsToLiveLongerPerYearIfLivingHere += 0.05;
};
buildingUpgrades_ModernHomePlant.__name__ = "buildingUpgrades.ModernHomePlant";
buildingUpgrades_ModernHomePlant.__super__ = BuildingUpgrade;
buildingUpgrades_ModernHomePlant.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_modernhomeplant";
	}
	,get_bonusAttractiveness: function() {
		return 10;
	}
	,get_availableTextures: function() {
		return this.textures.length - (Settings.hasSecretCode("orchid") ? 0 : 3);
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		var ccf = this.building;
		ccf.yearsToLiveLongerPerYearIfLivingHere -= 0.05;
	}
	,__class__: buildingUpgrades_ModernHomePlant
});
