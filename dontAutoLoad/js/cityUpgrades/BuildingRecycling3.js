var cityUpgrades_BuildingRecycling3 = $hxClasses["cityUpgrades.BuildingRecycling3"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_BuildingRecycling3.__name__ = "cityUpgrades.BuildingRecycling3";
cityUpgrades_BuildingRecycling3.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_BuildingRecycling3.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		cityUpgrades_CityUpgrade.prototype.addToCity.call(this,city);
		city.upgrades.vars.recyclingAmount = Math.max(city.upgrades.vars.recyclingAmount,0.9);
	}
	,__class__: cityUpgrades_BuildingRecycling3
});
