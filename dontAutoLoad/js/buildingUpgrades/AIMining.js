var buildingUpgrades_AIMining = $hxClasses["buildingUpgrades.AIMining"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
	building.stoneMinedPerActionBoost += 0.3;
};
buildingUpgrades_AIMining.__name__ = "buildingUpgrades.AIMining";
buildingUpgrades_AIMining.__super__ = BuildingUpgrade;
buildingUpgrades_AIMining.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_aiMining";
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		this.building.stoneMinedPerActionBoost -= 0.3;
	}
	,__class__: buildingUpgrades_AIMining
});
