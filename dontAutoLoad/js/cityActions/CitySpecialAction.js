var cityActions_CitySpecialAction = $hxClasses["cityActions.CitySpecialAction"] = function(city) {
	this.isActive = false;
	this.city = city;
	this.gui = city.gui;
};
cityActions_CitySpecialAction.__name__ = "cityActions.CitySpecialAction";
cityActions_CitySpecialAction.prototype = {
	get_specialActionID: function() {
		return "";
	}
	,get_hasPermanentAction: function() {
		return false;
	}
	,get_canBeRestoredAfterDeactivation: function() {
		return false;
	}
	,activate: function() {
		this.isActive = true;
		this.city.specialActionOld = null;
		this.city.specialAction = this;
	}
	,deactivate: function(permanently) {
		if(permanently == null) {
			permanently = false;
		}
		this.isActive = false;
		this.city.specialAction = null;
		if(this.get_canBeRestoredAfterDeactivation() && !permanently) {
			this.city.specialActionOld = this;
		}
	}
	,__class__: cityActions_CitySpecialAction
};
