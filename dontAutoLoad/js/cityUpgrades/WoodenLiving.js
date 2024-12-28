var cityUpgrades_WoodenLiving = $hxClasses["cityUpgrades.WoodenLiving"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_WoodenLiving.__name__ = "cityUpgrades.WoodenLiving";
cityUpgrades_WoodenLiving.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_WoodenLiving.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		cityUpgrades_CityUpgrade.prototype.addToCity.call(this,city);
		city.progress.resources.buildingInfo.h["buildings.ComfortableHouse"].quality += 10;
	}
	,__class__: cityUpgrades_WoodenLiving
});
