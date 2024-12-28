var buildingUpgrades_PickaxeTech = $hxClasses["buildingUpgrades.PickaxeTech"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
	building.hasPickaxeTech = true;
};
buildingUpgrades_PickaxeTech.__name__ = "buildingUpgrades.PickaxeTech";
buildingUpgrades_PickaxeTech.__super__ = BuildingUpgrade;
buildingUpgrades_PickaxeTech.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_stoneresearchcentre_pickaxetech";
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		this.building.hasPickaxeTech = false;
	}
	,__class__: buildingUpgrades_PickaxeTech
});
