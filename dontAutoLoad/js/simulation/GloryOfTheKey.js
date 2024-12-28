var simulation_GloryOfTheKey = $hxClasses["simulation.GloryOfTheKey"] = function(city) {
	this.sculpturesHappiness = 0;
	this.expensiveRestaurantHappiness = 0;
	this.highEndHomeHappiness = 0;
	this.gloryOfTheKeyHappiness = 0;
	this.city = city;
};
simulation_GloryOfTheKey.__name__ = "simulation.GloryOfTheKey";
simulation_GloryOfTheKey.prototype = {
	get_simulation: function() {
		return this.city.simulation;
	}
	,updateHappiness: function() {
		var expensiveHouses = 0;
		var luxuryRestaurants = 0;
		var sculptures = 0;
		var _g = 0;
		var _g1 = this.city.permanents;
		while(_g < _g1.length) {
			var pm = _g1[_g];
			++_g;
			if(pm.is(buildings_Villa) || pm.is(buildings_FlowerPenthouse)) {
				++expensiveHouses;
			} else if(pm.is(buildings_LuxuryRestaurant)) {
				++luxuryRestaurants;
			} else if(pm.is(buildings_StatueGarden) || pm.is(buildings_StatueOfHappiness) || pm.is(buildings_StatueOfTheKey)) {
				++sculptures;
			}
		}
		var val = 16000 * expensiveHouses / (this.get_simulation().citizens.length + 1);
		this.highEndHomeHappiness = val < 0 ? 0 : val > 100 ? 100 : val;
		var val = 11000 * luxuryRestaurants / (this.get_simulation().citizens.length + 1);
		this.expensiveRestaurantHappiness = val < 0 ? 0 : val > 100 ? 100 : val;
		var val = 5000 * sculptures / (this.get_simulation().citizens.length + 1);
		this.sculpturesHappiness = val < 0 ? 0 : val > 100 ? 100 : val;
		var val = (this.highEndHomeHappiness + this.expensiveRestaurantHappiness + this.sculpturesHappiness) / 3 + 0.01;
		this.gloryOfTheKeyHappiness = val < 0 ? 0 : val > 100 ? 100 : val;
	}
	,__class__: simulation_GloryOfTheKey
};
