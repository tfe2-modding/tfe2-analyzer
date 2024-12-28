var buildingUpgrades_DieShrink = $hxClasses["buildingUpgrades.DieShrink"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,midStage,building);
	building.efficiency -= 2;
	building.materialsMadePerStepPerWorker += 0.00005;
};
buildingUpgrades_DieShrink.__name__ = "buildingUpgrades.DieShrink";
buildingUpgrades_DieShrink.__super__ = BuildingUpgrade;
buildingUpgrades_DieShrink.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_dieshrink";
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		var ccf = this.building;
		ccf.efficiency += 2;
		ccf.materialsMadePerStepPerWorker -= 0.00005;
	}
	,__class__: buildingUpgrades_DieShrink
});
