var buildingUpgrades_ModernConveniences = $hxClasses["buildingUpgrades.ModernConveniences"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
};
buildingUpgrades_ModernConveniences.__name__ = "buildingUpgrades.ModernConveniences";
buildingUpgrades_ModernConveniences.__super__ = BuildingUpgrade;
buildingUpgrades_ModernConveniences.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_modernconveniences";
	}
	,get_bonusAttractiveness: function() {
		return 15;
	}
	,__class__: buildingUpgrades_ModernConveniences
});
