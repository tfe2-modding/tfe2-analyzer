var buildingUpgrades_BetterPickaxes = $hxClasses["buildingUpgrades.BetterPickaxes"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
	building.stoneMinedPerActionBoost += 0.2;
};
buildingUpgrades_BetterPickaxes.__name__ = "buildingUpgrades.BetterPickaxes";
buildingUpgrades_BetterPickaxes.__super__ = BuildingUpgrade;
buildingUpgrades_BetterPickaxes.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_improvedpickaxes";
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		this.building.stoneMinedPerActionBoost -= 0.2;
	}
	,__class__: buildingUpgrades_BetterPickaxes
});
