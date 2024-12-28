var cityUpgrades_RocketMissionRocketFuelFactoryUpgrade = $hxClasses["cityUpgrades.RocketMissionRocketFuelFactoryUpgrade"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_RocketMissionRocketFuelFactoryUpgrade.__name__ = "cityUpgrades.RocketMissionRocketFuelFactoryUpgrade";
cityUpgrades_RocketMissionRocketFuelFactoryUpgrade.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_RocketMissionRocketFuelFactoryUpgrade.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		this.city = city;
		city.upgrades.vars.fasterRocketFuelFactory = 0.1;
	}
	,__class__: cityUpgrades_RocketMissionRocketFuelFactoryUpgrade
});
