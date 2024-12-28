var cityUpgrades_ChipBinning = $hxClasses["cityUpgrades.ChipBinning"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_ChipBinning.__name__ = "cityUpgrades.ChipBinning";
cityUpgrades_ChipBinning.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_ChipBinning.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		this.city = city;
		city.upgrades.vars.computerChipFactorySpeed *= 1.2;
	}
	,__class__: cityUpgrades_ChipBinning
});
