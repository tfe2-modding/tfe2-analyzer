var buildingUpgrades_WorkshopMachineParts = $hxClasses["buildingUpgrades.WorkshopMachineParts"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
	building.isProducingKnowledge = false;
};
buildingUpgrades_WorkshopMachineParts.__name__ = "buildingUpgrades.WorkshopMachineParts";
buildingUpgrades_WorkshopMachineParts.__super__ = BuildingUpgrade;
buildingUpgrades_WorkshopMachineParts.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_workshop_makemachineparts";
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
	}
	,__class__: buildingUpgrades_WorkshopMachineParts
});
