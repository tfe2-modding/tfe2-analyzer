var buildingUpgrades_FarmingResearch = $hxClasses["buildingUpgrades.FarmingResearch"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,midStage,building);
	this.myEffect = { name : "increaseCropNumber", intensity : 7.5};
	building.adjecentBuildingEffects.push(this.myEffect);
};
buildingUpgrades_FarmingResearch.__name__ = "buildingUpgrades.FarmingResearch";
buildingUpgrades_FarmingResearch.__super__ = BuildingUpgrade;
buildingUpgrades_FarmingResearch.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_upgrade_farmboost";
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		HxOverrides.remove(this.building.adjecentBuildingEffects,this.myEffect);
	}
	,__class__: buildingUpgrades_FarmingResearch
});
