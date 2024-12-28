var cityActions_CityPickColor = $hxClasses["cityActions.CityPickColor"] = function(city,onConfirm) {
	cityActions_CitySpecialAction.call(this,city);
	this.onConfirm = onConfirm;
};
cityActions_CityPickColor.__name__ = "cityActions.CityPickColor";
cityActions_CityPickColor.__super__ = cityActions_CitySpecialAction;
cityActions_CityPickColor.prototype = $extend(cityActions_CitySpecialAction.prototype,{
	get_specialActionID: function() {
		return "CityPickColor";
	}
	,activate: function() {
		var _gthis = this;
		cityActions_CitySpecialAction.prototype.activate.call(this);
		this.gui.showSimpleWindow(common_Localize.lo("tap_in_city_to_pick_color"),null,true);
		this.gui.addWindowToStack($bind(this,this.activate));
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
				this.city.gui.goPreviousWindow();
				if(this.gui.window != null && this.gui.windowRelatedTo == "colorPicker") {
					this.city.gui.goPreviousWindow();
				}
			}
		}
		cityActions_CitySpecialAction.prototype.deactivate.call(this,permanently);
	}
	,handleMouse: function(mouse) {
		if(mouse.claimMouse("PickColor") == MouseState.Confirmed) {
			var renderer = this.city.game.application.renderer;
			var width = this.city.game.rect.width;
			var height = this.city.game.rect.height;
			var sc = this.city.game.scaling;
			var renderTexture = PIXI.RenderTexture.create({ width : width * sc, height : height * sc, scaleMode : 1});
			renderer.render(this.city.outerStage,{ renderTexture : renderTexture, clear : true, skipUpdateTransform : false});
			var pixels = renderer.plugins.extract.pixels(renderTexture);
			var i = Math.floor(4 * (sc * mouse.get_x() + sc * mouse.get_y() * renderTexture.width));
			var r = pixels[i];
			var g = pixels[i + 1];
			var b = pixels[i + 2];
			var a = pixels[i + 3];
			console.log("FloatingSpaceCities/cityActions/CityPickColor.hx:63:",mouse.get_x() + " " + width);
			var this1 = (r & 255) << 16 | (g & 255) << 8 | b & 255;
			this.onConfirm(common_ColorExtensions.toHexInt(this1));
			this.deactivate();
		}
	}
	,__class__: cityActions_CityPickColor
});
