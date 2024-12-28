var buildingUpgrades_FossilScanner = $hxClasses["buildingUpgrades.FossilScanner"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
	building.city.upgrades.vars.stoneResearchCenterWithFossils = building;
};
buildingUpgrades_FossilScanner.__name__ = "buildingUpgrades.FossilScanner";
buildingUpgrades_FossilScanner.__super__ = BuildingUpgrade;
buildingUpgrades_FossilScanner.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_stoneresearchcentre_computer";
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		this.building.city.upgrades.vars.stoneResearchCenterWithFossils = null;
	}
	,__class__: buildingUpgrades_FossilScanner
});
