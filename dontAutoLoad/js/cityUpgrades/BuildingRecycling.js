var cityUpgrades_BuildingRecycling = $hxClasses["cityUpgrades.BuildingRecycling"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_BuildingRecycling.__name__ = "cityUpgrades.BuildingRecycling";
cityUpgrades_BuildingRecycling.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_BuildingRecycling.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		cityUpgrades_CityUpgrade.prototype.addToCity.call(this,city);
		city.upgrades.vars.recyclingAmount = Math.max(city.upgrades.vars.recyclingAmount,0.5);
		city.progress.unlocks.unlock(cityUpgrades_BuildingRecycling2);
	}
	,__class__: cityUpgrades_BuildingRecycling
});
