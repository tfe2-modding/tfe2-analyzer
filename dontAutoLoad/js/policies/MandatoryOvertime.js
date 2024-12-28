var policies_MandatoryOvertime = $hxClasses["policies.MandatoryOvertime"] = function() {
	policies_Policy.call(this);
};
policies_MandatoryOvertime.__name__ = "policies.MandatoryOvertime";
policies_MandatoryOvertime.__super__ = policies_Policy;
policies_MandatoryOvertime.prototype = $extend(policies_Policy.prototype,{
	addToCity: function(city) {
		this.city = city;
		city.policies.vars.workTimeChange = 2;
	}
	,destroy: function() {
		this.city.policies.vars.workTimeChange = 0;
	}
	,__class__: policies_MandatoryOvertime
});
