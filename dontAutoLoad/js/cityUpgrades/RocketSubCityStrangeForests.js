var cityUpgrades_RocketSubCityStrangeForests = $hxClasses["cityUpgrades.RocketSubCityStrangeForests"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_RocketSubCityStrangeForests.__name__ = "cityUpgrades.RocketSubCityStrangeForests";
cityUpgrades_RocketSubCityStrangeForests.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_RocketSubCityStrangeForests.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		this.city = city;
		var thisScenario = "RocketExploreStrangeForests";
		if(city.subCities.length == 0 && city.possibleSubCities.length == 0) {
			city.gui.showTutorialArrowsSwitchCity();
		}
		if(city.subCities.indexOf(thisScenario) == -1 && city.possibleSubCities.indexOf(thisScenario) == -1) {
			city.possibleSubCities.push(thisScenario);
		}
		city.gui.refreshCityInfo();
	}
	,__class__: cityUpgrades_RocketSubCityStrangeForests
});
