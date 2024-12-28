var cityUpgrades_LibraryAllowDuplicates = $hxClasses["cityUpgrades.LibraryAllowDuplicates"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_LibraryAllowDuplicates.__name__ = "cityUpgrades.LibraryAllowDuplicates";
cityUpgrades_LibraryAllowDuplicates.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_LibraryAllowDuplicates.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		this.city = city;
		city.upgrades.vars.hasGalacticLibrary = true;
	}
	,__class__: cityUpgrades_LibraryAllowDuplicates
});
