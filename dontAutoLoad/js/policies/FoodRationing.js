var policies_FoodRationing = $hxClasses["policies.FoodRationing"] = function() {
	policies_Policy.call(this);
};
policies_FoodRationing.__name__ = "policies.FoodRationing";
policies_FoodRationing.__super__ = policies_Policy;
policies_FoodRationing.prototype = $extend(policies_Policy.prototype,{
	addToCity: function(city) {
		this.city = city;
		this.city.simulation.eating.foodRationing = true;
	}
	,destroy: function() {
		this.city.simulation.eating.foodRationing = false;
	}
	,__class__: policies_FoodRationing
});
