var cityUpgrades_UniverseMapping = $hxClasses["cityUpgrades.UniverseMapping"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_UniverseMapping.__name__ = "cityUpgrades.UniverseMapping";
cityUpgrades_UniverseMapping.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_UniverseMapping.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		this.city = city;
		city.upgrades.vars.stoneTeleporterChanceForRefinedMetals = 0.04;
		city.upgrades.vars.stoneTeleporterHasBigStones = true;
		city.upgrades.vars.starDatabaseIsMoreEffective = true;
	}
	,__class__: cityUpgrades_UniverseMapping
});
