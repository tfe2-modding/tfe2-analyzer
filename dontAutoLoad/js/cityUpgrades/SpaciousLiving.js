var cityUpgrades_SpaciousLiving = $hxClasses["cityUpgrades.SpaciousLiving"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_SpaciousLiving.__name__ = "cityUpgrades.SpaciousLiving";
cityUpgrades_SpaciousLiving.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_SpaciousLiving.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		cityUpgrades_CityUpgrade.prototype.addToCity.call(this,city);
		city.progress.resources.buildingInfo.h["buildings.SpaciousHouse"].quality += 15;
	}
	,__class__: cityUpgrades_SpaciousLiving
});
