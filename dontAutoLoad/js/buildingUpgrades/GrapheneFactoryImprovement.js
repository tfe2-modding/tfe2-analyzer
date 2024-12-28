var buildingUpgrades_GrapheneFactoryImprovement = $hxClasses["buildingUpgrades.GrapheneFactoryImprovement"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,midStage,building);
	building.materialsMadePerStepPerWorker += 6.25e-005;
};
buildingUpgrades_GrapheneFactoryImprovement.__name__ = "buildingUpgrades.GrapheneFactoryImprovement";
buildingUpgrades_GrapheneFactoryImprovement.__super__ = BuildingUpgrade;
buildingUpgrades_GrapheneFactoryImprovement.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_dieshrink";
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		var ccf = this.building;
		ccf.materialsMadePerStepPerWorker -= 6.25e-005;
	}
	,__class__: buildingUpgrades_GrapheneFactoryImprovement
});
