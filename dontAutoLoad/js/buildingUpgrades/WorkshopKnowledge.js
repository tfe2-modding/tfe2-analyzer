var buildingUpgrades_WorkshopKnowledge = $hxClasses["buildingUpgrades.WorkshopKnowledge"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
	building.isProducingKnowledge = true;
};
buildingUpgrades_WorkshopKnowledge.__name__ = "buildingUpgrades.WorkshopKnowledge";
buildingUpgrades_WorkshopKnowledge.__super__ = BuildingUpgrade;
buildingUpgrades_WorkshopKnowledge.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_workshop_petprojects";
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
	}
	,__class__: buildingUpgrades_WorkshopKnowledge
});
