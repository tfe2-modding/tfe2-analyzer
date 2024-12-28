var buildingUpgrades_CHProduceFood = $hxClasses["buildingUpgrades.CHProduceFood"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	var currentMatType = building.materialType;
	if(currentMatType != 2) {
		building.resetProgress();
	}
	building.setMaterialType(2);
};
buildingUpgrades_CHProduceFood.__name__ = "buildingUpgrades.CHProduceFood";
buildingUpgrades_CHProduceFood.__super__ = BuildingUpgrade;
buildingUpgrades_CHProduceFood.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
	}
	,__class__: buildingUpgrades_CHProduceFood
});
