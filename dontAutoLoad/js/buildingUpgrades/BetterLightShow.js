var buildingUpgrades_BetterLightShow = $hxClasses["buildingUpgrades.BetterLightShow"] = function(stage,midStage,bgStage,building) {
	BuildingUpgrade.call(this,null,building);
	building.nightClubEntertainmentQuantity += 40;
	this.addedLasers = [];
	this.addedLasers.push({ start : new common_FPoint(7,4), end : new common_FPoint(6,18), hue : 90, speed : 0.5, targetLaserHue : -1, laserSprite : null});
	this.addedLasers.push({ start : new common_FPoint(12,4), end : new common_FPoint(6,18), hue : 270, speed : -0.5, targetLaserHue : -1, laserSprite : null});
	Lambda.iter(this.addedLasers,function(l) {
		building.lasers.push(l);
	});
};
buildingUpgrades_BetterLightShow.__name__ = "buildingUpgrades.BetterLightShow";
buildingUpgrades_BetterLightShow.__super__ = BuildingUpgrade;
buildingUpgrades_BetterLightShow.prototype = $extend(BuildingUpgrade.prototype,{
	destroy: function() {
		BuildingUpgrade.prototype.destroy.call(this);
		var nightClub = this.building;
		nightClub.nightClubEntertainmentQuantity -= 40;
		Lambda.iter(this.addedLasers,function(l) {
			HxOverrides.remove(nightClub.lasers,l);
		});
	}
	,__class__: buildingUpgrades_BetterLightShow
});
