var cityUpgrades_SlimyLiving = $hxClasses["cityUpgrades.SlimyLiving"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_SlimyLiving.__name__ = "cityUpgrades.SlimyLiving";
cityUpgrades_SlimyLiving.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_SlimyLiving.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		cityUpgrades_CityUpgrade.prototype.addToCity.call(this,city);
		city.progress.resources.buildingInfo.h["buildings.AlienHouse"].quality += 25;
		city.progress.unlocks.unlock(buildingUpgrades_LivingComputer,true);
	}
	,__class__: cityUpgrades_SlimyLiving
});
