var buildingUpgrades_ComfortableCouch = $hxClasses["buildingUpgrades.ComfortableCouch"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
};
buildingUpgrades_ComfortableCouch.__name__ = "buildingUpgrades.ComfortableCouch";
buildingUpgrades_ComfortableCouch.__super__ = BuildingUpgrade;
buildingUpgrades_ComfortableCouch.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_comfortablecouch";
	}
	,get_bonusAttractiveness: function() {
		return 15;
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
	}
	,__class__: buildingUpgrades_ComfortableCouch
});
