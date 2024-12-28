var buildingUpgrades_AIAssistedDiagnosis = $hxClasses["buildingUpgrades.AIAssistedDiagnosis"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
	building.extraQuality += 25;
	building.extraCapacity += 50;
};
buildingUpgrades_AIAssistedDiagnosis.__name__ = "buildingUpgrades.AIAssistedDiagnosis";
buildingUpgrades_AIAssistedDiagnosis.__super__ = BuildingUpgrade;
buildingUpgrades_AIAssistedDiagnosis.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_smartdiagnose";
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		var ccf = this.building;
		ccf.extraQuality -= 25;
		ccf.extraCapacity -= 50;
	}
	,__class__: buildingUpgrades_AIAssistedDiagnosis
});
