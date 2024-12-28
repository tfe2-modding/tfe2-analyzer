var cityActions_CheckTravelTimes = $hxClasses["cityActions.CheckTravelTimes"] = function(city,pmSelectFunc) {
	cityActions_CitySpecialAction.call(this,city);
	this.pmSelectFunc = pmSelectFunc;
};
cityActions_CheckTravelTimes.__name__ = "cityActions.CheckTravelTimes";
cityActions_CheckTravelTimes.__super__ = cityActions_CitySpecialAction;
cityActions_CheckTravelTimes.prototype = $extend(cityActions_CitySpecialAction.prototype,{
	get_specialActionID: function() {
		return "CheckTravelTimes";
	}
	,get_hasPermanentAction: function() {
		return true;
	}
	,get_canBeRestoredAfterDeactivation: function() {
		return true;
	}
	,activate: function() {
		cityActions_CitySpecialAction.prototype.activate.call(this);
	}
	,performPermanentAction: function(pm) {
		if(this.pmSelectFunc != null) {
			this.pmSelectFunc(pm);
		}
	}
	,__class__: cityActions_CheckTravelTimes
});
