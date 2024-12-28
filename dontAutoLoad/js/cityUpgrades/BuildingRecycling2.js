var cityUpgrades_BuildingRecycling2 = $hxClasses["cityUpgrades.BuildingRecycling2"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_BuildingRecycling2.__name__ = "cityUpgrades.BuildingRecycling2";
cityUpgrades_BuildingRecycling2.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_BuildingRecycling2.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		cityUpgrades_CityUpgrade.prototype.addToCity.call(this,city);
		city.upgrades.vars.recyclingAmount = Math.max(city.upgrades.vars.recyclingAmount,0.75);
		city.progress.unlocks.unlock(cityUpgrades_BuildingRecycling3);
	}
	,__class__: cityUpgrades_BuildingRecycling2
});
