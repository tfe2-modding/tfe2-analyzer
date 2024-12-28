var buildingUpgrades_TheMachineUpgrade = $hxClasses["buildingUpgrades.TheMachineUpgrade"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.hasUpgrade = true;
};
buildingUpgrades_TheMachineUpgrade.__name__ = "buildingUpgrades.TheMachineUpgrade";
buildingUpgrades_TheMachineUpgrade.__super__ = BuildingUpgrade;
buildingUpgrades_TheMachineUpgrade.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		var theMachine = this.building;
		theMachine.hasUpgrade = false;
	}
	,__class__: buildingUpgrades_TheMachineUpgrade
});
