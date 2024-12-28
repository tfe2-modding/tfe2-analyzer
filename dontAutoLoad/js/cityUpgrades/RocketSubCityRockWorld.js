var cityUpgrades_RocketSubCityRockWorld = $hxClasses["cityUpgrades.RocketSubCityRockWorld"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_RocketSubCityRockWorld.__name__ = "cityUpgrades.RocketSubCityRockWorld";
cityUpgrades_RocketSubCityRockWorld.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_RocketSubCityRockWorld.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		this.city = city;
		var thisScenario = "RocketExploreRockLand";
		if(city.subCities.length == 0 && city.possibleSubCities.length == 0) {
			city.gui.showTutorialArrowsSwitchCity();
		}
		if(city.subCities.indexOf(thisScenario) == -1 && city.possibleSubCities.indexOf(thisScenario) == -1) {
			city.possibleSubCities.push(thisScenario);
		}
		city.gui.refreshCityInfo();
	}
	,__class__: cityUpgrades_RocketSubCityRockWorld
});
