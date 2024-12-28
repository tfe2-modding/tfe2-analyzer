var cityUpgrades_RocketMissionSupercomputerUpgrade = $hxClasses["cityUpgrades.RocketMissionSupercomputerUpgrade"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_RocketMissionSupercomputerUpgrade.__name__ = "cityUpgrades.RocketMissionSupercomputerUpgrade";
cityUpgrades_RocketMissionSupercomputerUpgrade.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_RocketMissionSupercomputerUpgrade.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		this.city = city;
		this.city.upgrades.vars.superComputerUpgrade = 0.1;
	}
	,__class__: cityUpgrades_RocketMissionSupercomputerUpgrade
});
