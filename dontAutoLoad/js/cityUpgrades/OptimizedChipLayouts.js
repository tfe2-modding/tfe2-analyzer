var cityUpgrades_OptimizedChipLayouts = $hxClasses["cityUpgrades.OptimizedChipLayouts"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_OptimizedChipLayouts.__name__ = "cityUpgrades.OptimizedChipLayouts";
cityUpgrades_OptimizedChipLayouts.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_OptimizedChipLayouts.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		this.city = city;
		city.upgrades.vars.computerChipFactorySpeed *= 1.33;
	}
	,__class__: cityUpgrades_OptimizedChipLayouts
});
