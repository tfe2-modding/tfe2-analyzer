var cityUpgrades_BirthControl = $hxClasses["cityUpgrades.BirthControl"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_BirthControl.__name__ = "cityUpgrades.BirthControl";
cityUpgrades_BirthControl.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_BirthControl.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		this.city = city;
		city.upgrades.vars.hasBirthControl = true;
	}
	,__class__: cityUpgrades_BirthControl
});
