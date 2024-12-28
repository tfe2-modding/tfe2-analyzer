var buildingUpgrades_MedicalEducation = $hxClasses["buildingUpgrades.MedicalEducation"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.medicalEducationPart = 1;
};
buildingUpgrades_MedicalEducation.__name__ = "buildingUpgrades.MedicalEducation";
buildingUpgrades_MedicalEducation.__super__ = BuildingUpgrade;
buildingUpgrades_MedicalEducation.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		var ccf = this.building;
		ccf.medicalEducationPart = 0;
	}
	,__class__: buildingUpgrades_MedicalEducation
});
