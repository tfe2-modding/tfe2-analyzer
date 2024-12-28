var buildingUpgrades_MedicalHerbs = $hxClasses["buildingUpgrades.MedicalHerbs"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.drawer.changeMainTexture("spr_herbgarden_medic");
	building.drawer.changeTextureGroup("spr_botanicalgardens");
	if(building.leftBuilding != null) {
		building.leftBuilding.onCityChange();
	}
	if(building.rightBuilding != null) {
		building.rightBuilding.onCityChange();
	}
	building.isMedical = true;
	building.changePlantsTexture(random_Random.getInt(building.herbTextures.length / 2 | 0) * 2 + 1);
};
buildingUpgrades_MedicalHerbs.__name__ = "buildingUpgrades.MedicalHerbs";
buildingUpgrades_MedicalHerbs.__super__ = BuildingUpgrade;
buildingUpgrades_MedicalHerbs.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		this.building.isMedical = false;
	}
	,__class__: buildingUpgrades_MedicalHerbs
});
