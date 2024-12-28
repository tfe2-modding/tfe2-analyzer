var cityUpgrades_ConnectedMachines = $hxClasses["cityUpgrades.ConnectedMachines"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_ConnectedMachines.__name__ = "cityUpgrades.ConnectedMachines";
cityUpgrades_ConnectedMachines.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_ConnectedMachines.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		this.city = city;
		city.upgrades.vars.hasConnectedMachines = true;
	}
	,__class__: cityUpgrades_ConnectedMachines
});
