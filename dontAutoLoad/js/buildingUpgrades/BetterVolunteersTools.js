var buildingUpgrades_BetterVolunteersTools = $hxClasses["buildingUpgrades.BetterVolunteersTools"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
	building.stoneMinedPerActionBoost += 0.2;
	building.woodCutPerActionBoost += 0.2;
};
buildingUpgrades_BetterVolunteersTools.__name__ = "buildingUpgrades.BetterVolunteersTools";
buildingUpgrades_BetterVolunteersTools.__super__ = BuildingUpgrade;
buildingUpgrades_BetterVolunteersTools.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_volunteerscenter_bettertools";
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		this.building.stoneMinedPerActionBoost -= 0.2;
		this.building.woodCutPerActionBoost -= 0.2;
	}
	,__class__: buildingUpgrades_BetterVolunteersTools
});
