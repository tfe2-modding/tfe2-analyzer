var buildingUpgrades_CulinaryHerbs = $hxClasses["buildingUpgrades.CulinaryHerbs"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.adjecentBuildingEffects.push({ name : "restaurantCapBoost", intensity : 10});
	building.drawer.changeMainTexture("spr_herbgarden");
	building.drawer.changeTextureGroup("spr_restaurant");
	building.changePlantsTexture(random_Random.getInt(building.herbTextures.length / 2 | 0) * 2);
};
buildingUpgrades_CulinaryHerbs.__name__ = "buildingUpgrades.CulinaryHerbs";
buildingUpgrades_CulinaryHerbs.__super__ = BuildingUpgrade;
buildingUpgrades_CulinaryHerbs.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		var rcb = Lambda.find(this.building.adjecentBuildingEffects,function(abe) {
			return abe.name == "restaurantCapBoost";
		});
		HxOverrides.remove(this.building.adjecentBuildingEffects,rcb);
	}
	,__class__: buildingUpgrades_CulinaryHerbs
});
