var policies_HippieLifestyle = $hxClasses["policies.HippieLifestyle"] = function() {
	policies_Policy.call(this);
};
policies_HippieLifestyle.__name__ = "policies.HippieLifestyle";
policies_HippieLifestyle.__super__ = policies_Policy;
policies_HippieLifestyle.prototype = $extend(policies_Policy.prototype,{
	addToCity: function(city) {
		this.city = city;
		this.city.simulation.happiness.hippieLifestyle = true;
		if(this.city.progress.ruleset != progress_Ruleset.HippieCity) {
			city.progress.unlocks.unlock(buildings_HippieSchool);
		}
	}
	,destroy: function() {
		this.city.simulation.happiness.hippieLifestyle = false;
	}
	,__class__: policies_HippieLifestyle
});
