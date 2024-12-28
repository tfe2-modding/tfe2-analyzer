var cityActions_ViewActions = $hxClasses["cityActions.ViewActions"] = function(city) {
	this.city = city;
	this.gui = city.gui;
};
cityActions_ViewActions.__name__ = "cityActions.ViewActions";
cityActions_ViewActions.prototype = {
	showFollow: function() {
		if(this.gui.get_keyboard().down[17] && this.city.simulation.citizens.length > 0) {
			random_Random.fromArray(this.city.simulation.citizens).onClick();
			if(this.city.specialAction != null) {
				this.city.specialAction.deactivate(true);
			}
		} else {
			this.city.activateSpecialCityAction(new cityActions_FollowCitizenAction(this.city));
		}
	}
	,isFollowOpen: function() {
		if(this.city.specialAction != null) {
			return this.city.specialAction.get_specialActionID() == "FollowCitizenAction";
		} else {
			return false;
		}
	}
	,__class__: cityActions_ViewActions
};
