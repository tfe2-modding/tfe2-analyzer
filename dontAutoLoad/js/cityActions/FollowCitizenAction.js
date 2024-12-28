var cityActions_FollowCitizenAction = $hxClasses["cityActions.FollowCitizenAction"] = function(city) {
	cityActions_CitySpecialAction.call(this,city);
};
cityActions_FollowCitizenAction.__name__ = "cityActions.FollowCitizenAction";
cityActions_FollowCitizenAction.__super__ = cityActions_CitySpecialAction;
cityActions_FollowCitizenAction.prototype = $extend(cityActions_CitySpecialAction.prototype,{
	get_specialActionID: function() {
		return "FollowCitizenAction";
	}
	,activate: function() {
		var _gthis = this;
		cityActions_CitySpecialAction.prototype.activate.call(this);
		this.gui.showSimpleWindow(common_Localize.lo("tap_near_citizen_to_follow"),null,true);
		this.city.gui.setWindowPositioning(gui_WindowPosition.Top);
		this.gui.windowRelatedTo = this;
		this.gui.windowOnDestroy = function() {
			_gthis.isActive = false;
			_gthis.deactivate(true);
		};
	}
	,deactivate: function(permanently) {
		if(permanently == null) {
			permanently = false;
		}
		if(this.isActive) {
			if(this.gui.window != null && this.gui.windowRelatedTo == this) {
				this.gui.closeWindow();
			}
		}
		cityActions_CitySpecialAction.prototype.deactivate.call(this,permanently);
	}
	,__class__: cityActions_FollowCitizenAction
});
