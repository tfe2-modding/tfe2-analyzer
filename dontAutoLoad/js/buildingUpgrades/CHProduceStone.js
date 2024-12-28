var buildingUpgrades_CHProduceStone = $hxClasses["buildingUpgrades.CHProduceStone"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	var currentMatType = building.materialType;
	if(currentMatType != 0) {
		building.resetProgress();
	}
	building.setMaterialType(0);
};
buildingUpgrades_CHProduceStone.__name__ = "buildingUpgrades.CHProduceStone";
buildingUpgrades_CHProduceStone.__super__ = BuildingUpgrade;
buildingUpgrades_CHProduceStone.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
	}
	,__class__: buildingUpgrades_CHProduceStone
});
