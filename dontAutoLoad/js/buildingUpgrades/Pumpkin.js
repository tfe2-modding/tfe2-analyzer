var buildingUpgrades_Pumpkin = $hxClasses["buildingUpgrades.Pumpkin"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,midStage,building);
};
buildingUpgrades_Pumpkin.__name__ = "buildingUpgrades.Pumpkin";
buildingUpgrades_Pumpkin.__super__ = BuildingUpgrade;
buildingUpgrades_Pumpkin.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_upgrade_pumpkin";
	}
	,get_bonusAttractiveness: function() {
		return 5;
	}
	,__class__: buildingUpgrades_Pumpkin
});
