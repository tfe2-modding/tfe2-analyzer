var buildingUpgrades_MiniChristmasTree = $hxClasses["buildingUpgrades.MiniChristmasTree"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,midStage,building);
};
buildingUpgrades_MiniChristmasTree.__name__ = "buildingUpgrades.MiniChristmasTree";
buildingUpgrades_MiniChristmasTree.__super__ = BuildingUpgrade;
buildingUpgrades_MiniChristmasTree.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_upgrade_christmastree";
	}
	,get_bonusAttractiveness: function() {
		return 5;
	}
	,__class__: buildingUpgrades_MiniChristmasTree
});
