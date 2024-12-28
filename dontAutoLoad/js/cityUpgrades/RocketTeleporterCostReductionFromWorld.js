var cityUpgrades_RocketTeleporterCostReductionFromWorld = $hxClasses["cityUpgrades.RocketTeleporterCostReductionFromWorld"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_RocketTeleporterCostReductionFromWorld.__name__ = "cityUpgrades.RocketTeleporterCostReductionFromWorld";
cityUpgrades_RocketTeleporterCostReductionFromWorld.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_RocketTeleporterCostReductionFromWorld.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		this.city = city;
		city.upgrades.vars.rocketTeleporterReward = 0.1;
	}
	,__class__: cityUpgrades_RocketTeleporterCostReductionFromWorld
});
