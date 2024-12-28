var buildingUpgrades_CHProduceWood = $hxClasses["buildingUpgrades.CHProduceWood"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	var currentMatType = building.materialType;
	if(currentMatType != 1) {
		building.resetProgress();
	}
	building.setMaterialType(1);
};
buildingUpgrades_CHProduceWood.__name__ = "buildingUpgrades.CHProduceWood";
buildingUpgrades_CHProduceWood.__super__ = BuildingUpgrade;
buildingUpgrades_CHProduceWood.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
	}
	,__class__: buildingUpgrades_CHProduceWood
});
