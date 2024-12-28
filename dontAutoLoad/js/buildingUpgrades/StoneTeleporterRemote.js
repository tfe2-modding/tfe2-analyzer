var buildingUpgrades_StoneTeleporterRemote = $hxClasses["buildingUpgrades.StoneTeleporterRemote"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,bgStage,building);
	building.hasRemoteControl = true;
};
buildingUpgrades_StoneTeleporterRemote.__name__ = "buildingUpgrades.StoneTeleporterRemote";
buildingUpgrades_StoneTeleporterRemote.__super__ = BuildingUpgrade;
buildingUpgrades_StoneTeleporterRemote.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_stoneteleporter_remote";
	}
	,destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		var tp = this.building;
		tp.hasRemoteControl = false;
	}
	,__class__: buildingUpgrades_StoneTeleporterRemote
});
