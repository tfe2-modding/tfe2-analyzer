var buildingUpgrades_SmartLights = $hxClasses["buildingUpgrades.SmartLights"] = function(stage,midStage,bgStage,building) {
	this.lightColor = [{ color : 14680064, time : 0.0},{ color : 14680064, time : 4},{ color : 16777215, time : 6},{ color : 16777215, time : 19},{ color : 16766023, time : 21},{ color : 16766023, time : 23},{ color : 14680064, time : 24}];
	var _gthis = this;
	BuildingUpgrade.call(this,bgStage,building);
	this.set_onUpdate(function(timeMod) {
		_gthis.sprite.tint = building.city.simulation.time.getCurrentColor(_gthis.lightColor);
	});
};
buildingUpgrades_SmartLights.__name__ = "buildingUpgrades.SmartLights";
buildingUpgrades_SmartLights.__super__ = BuildingUpgrade;
buildingUpgrades_SmartLights.prototype = $extend(BuildingUpgrade.prototype,{
	get_textureName: function() {
		return "spr_smartlights";
	}
	,get_bonusAttractiveness: function() {
		return 15;
	}
	,get_canCacheSprite: function() {
		return false;
	}
	,__class__: buildingUpgrades_SmartLights
});
