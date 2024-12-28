var cityUpgrades_EcoFarmUpgrade = $hxClasses["cityUpgrades.EcoFarmUpgrade"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_EcoFarmUpgrade.__name__ = "cityUpgrades.EcoFarmUpgrade";
cityUpgrades_EcoFarmUpgrade.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_EcoFarmUpgrade.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		this.city = city;
		city.upgrades.vars.extraEcoFarmFoodToPlot1 = 4;
		var _g = 0;
		var _g1 = city.permanents;
		while(_g < _g1.length) {
			var bld = _g1[_g];
			++_g;
			if(bld.is(buildings_EcoFarm)) {
				var ef = bld;
				ef.growthAreas[0].foodPerHarvest += 4;
				ef.growthAreas[1].foodPerHarvest += 3;
			}
		}
	}
	,__class__: cityUpgrades_EcoFarmUpgrade
});
