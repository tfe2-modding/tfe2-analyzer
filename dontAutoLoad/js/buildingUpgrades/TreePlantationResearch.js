var buildingUpgrades_TreePlantationResearch = $hxClasses["buildingUpgrades.TreePlantationResearch"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,stage,building);
	this.myEffect = { name : "increaseTreeGrowth", intensity : 0.2};
	building.adjecentBuildingEffects.push(this.myEffect);
};
buildingUpgrades_TreePlantationResearch.__name__ = "buildingUpgrades.TreePlantationResearch";
buildingUpgrades_TreePlantationResearch.__super__ = BuildingUpgrade;
buildingUpgrades_TreePlantationResearch.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_treegrowthboost";
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		HxOverrides.remove(this.building.adjecentBuildingEffects,this.myEffect);
	}
	,__class__: buildingUpgrades_TreePlantationResearch
});
