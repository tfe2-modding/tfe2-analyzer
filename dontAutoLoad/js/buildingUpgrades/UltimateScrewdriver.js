var buildingUpgrades_UltimateScrewdriver = $hxClasses["buildingUpgrades.UltimateScrewdriver"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
	building.efficiency -= 0.058;
};
buildingUpgrades_UltimateScrewdriver.__name__ = "buildingUpgrades.UltimateScrewdriver";
buildingUpgrades_UltimateScrewdriver.__super__ = BuildingUpgrade;
buildingUpgrades_UltimateScrewdriver.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_experimentationlab_screwdriver";
	}
	,get_canCacheSprite: function() {
		return false;
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		var etl = this.building;
		etl.efficiency += 0.058;
	}
	,__class__: buildingUpgrades_UltimateScrewdriver
});
