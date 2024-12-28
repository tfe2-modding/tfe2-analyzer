var cityUpgrades_RocketMissionCheaperRockets = $hxClasses["cityUpgrades.RocketMissionCheaperRockets"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_RocketMissionCheaperRockets.__name__ = "cityUpgrades.RocketMissionCheaperRockets";
cityUpgrades_RocketMissionCheaperRockets.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_RocketMissionCheaperRockets.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		this.city = city;
		city.upgrades.vars.cheaperRockets = true;
	}
	,__class__: cityUpgrades_RocketMissionCheaperRockets
});
